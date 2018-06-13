import 'dotenv/config';
import server from 'express';
import session from 'express-session';
import passport from 'passport';
import Auth0Strat from 'passport-auth0';
import knex from 'knex';
import bodyParser from 'body-parser';
import _ from 'lodash';

import middleware from './Middleware';
import authRoutes from './Routes/Auth';
import userRoutes from './Routes/Users';
import intervals from './Intervals';

const app = server();

const {
	SERVER_PORT,
	SESSION_SECRET,
	AUTH0_CALLBACK,
	AUTH0_DOMAIN,
	AUTH0_CLIENT_ID,
	AUTH0_CLIENT_SECRET,
	DB_CONNECTION_STRING
} = process.env

const connectedDb = knex({
	client: 'pg',
	connection: DB_CONNECTION_STRING
})

app.set('db', connectedDb)

app.use(bodyParser.json())

app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strat({
	domain: AUTH0_DOMAIN,
	clientID: AUTH0_CLIENT_ID,
	clientSecret: AUTH0_CLIENT_SECRET,
	callbackURL: AUTH0_CALLBACK,
	scope: 'openid email profile'
}, (accessToken, refreshToken, extraParams, user, done) => {

	const db = app.get('db');

	db('users').select('id').where('auth_id', user.user_id).first().then(dbRes => {
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
				.then((insertRes) => {

					done(null, {
						userId: insertRes[0]
					});
				})

		} else {
			done(null, {
				userId: dbRes.id
			});
		}
	})

}))

passport.serializeUser((user, done) => {
	done(null, user);
})

passport.deserializeUser((user, done) => {
	done(null, user)
})


app.use('/login', authRoutes)

app.use('/user/:userId', [middleware.wanAuthed, middleware.wanCheckUser], userRoutes)

app.listen(SERVER_PORT, () => {
	console.log(`Server listening on port ${SERVER_PORT}`);

	setInterval(intervals.getTwitter, 15 * 60 * 1000, app)
});