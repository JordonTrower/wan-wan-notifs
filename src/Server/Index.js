import server from 'express';
import session from 'express-session';
import passport from 'passport';
import Auth0Strat from 'passport-auth0';
import knex from 'knex';
import bodyParser from 'body-parser';
import path from 'path';
import _ from 'lodash';
import {
	OAuth2
} from 'oauth';
import 'dotenv/config';

import middleware from './Middleware';
import authRoutes from './Routes/Auth';
import userRoutes from './Routes/Users';
import intervals from './Intervals';
import socketsController from './Sockets';
// import OAuth2 from './Classes/OAuth2';

require('dotenv').config();

const app = server();

const httpServer = require('http').createServer(app);

const socket = socketsController(httpServer);

app.set('socket', socket);

const {
	SERVER_PORT,
	SESSION_SECRET,
	AUTH0_CALLBACK,
	AUTH0_DOMAIN,
	AUTH0_CLIENT_ID,
	AUTH0_CLIENT_SECRET,
	DB_CONNECTION_STRING
} = process.env;

const connectedDb = knex({
	client: 'pg',
	connection: DB_CONNECTION_STRING
});

app.set('db', connectedDb);

app.use(bodyParser.json());

app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new Auth0Strat({
			domain: AUTH0_DOMAIN,
			clientID: AUTH0_CLIENT_ID,
			clientSecret: AUTH0_CLIENT_SECRET,
			callbackURL: AUTH0_CALLBACK,
			scope: 'openid email profile'
		},
		(accessToken, refreshToken, extraParams, user, done) => {
			const db = app.get('db');

			db('users')
				.select('id')
				.where('auth_id', user.user_id)
				.first()
				.then(dbRes => {
					if (_.isEmpty(dbRes)) {
						const currentTime = new Date();
						db('users')
							.insert({
								name: user.nickname,
								auth_id: user.user_id,
								email: user.emails ? user.emails[0].value : '',
								picture: user.picture || '',
								updated_at: currentTime.toISOString(),
								created_at: currentTime.toISOString()
							})
							.returning('id')
							.then(insertRes => {
								done(null, {
									userId: insertRes[0]
								});
							});
					} else {
						done(null, {
							userId: dbRes.id
						});
					}
				});
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

app.use('/api/login', authRoutes);

app.use(
	'/api/user/:userId', [middleware.wanAuthed, middleware.wanCheckUser],
	userRoutes
);

app.set(
	'redditAuth',
	new OAuth2(
		process.env.REDDIT_CLIENT,
		process.env.REDDIT_CLIENT_SECRET,
		'https://www.reddit.com/api',
		'/v1/authorize',
		'/v1/access_token', {
			Authorization: `Basic ${Buffer.from(
				`${process.env.REDDIT_CLIENT}:${
					process.env.REDDIT_CLIENT_SECRET
				}`
			).toString('base64')}`
		}
	)
);

app.use(server.static(path.join(__dirname, '../../build/Client')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../../build/Client/index.html'));
});

// app.get('*', (req, res) => {
// 	res.redirect(`${process.env.API_HOME}login`)
// })

httpServer.listen(SERVER_PORT);

const requestsMade = {
	emails: 0,
	twitter: 1500,
	reddit: 60
};

intervals.getTwitter(app, requestsMade);

intervals.getReddit(app, requestsMade, true);

setInterval(intervals.getTwitter, 5 * 60 * 1000, app, requestsMade); // run the get twitter every 5 minutes

setInterval(intervals.getReddit, 1.5 * 60 * 1000, app, requestsMade); // run the get twitter every 15 minutes

setInterval(intervals.resetEmails, 24 * 60 * 60 * 1000, requestsMade); // run the reset email every day

setInterval(intervals.resetTwitterPosts, 24 * 60 * 60 * 1000, requestsMade); // run the reset twitters every day