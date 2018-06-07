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

	db('users').select('id').where('auth_id', user.user_id).then(dbRes => {
		if (_.isEmpty(dbRes)) {
			db('users')
				.insert({
					name: user.nickname,
					auth_id: user.user_id,
					email: user.emails ? user.emails[0].value : ''
				})
				.returning('id')
				.then((insertRes) => {
					user.db_id = insertRes;

					done(null, insertRes);
				})

		} else {

			done(null, dbRes[0].id);
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


// app.get('/user/:userId', [middleware.wanAuthed, middleware.wanCheckUser], (req, res) => {
// 	const db = app.get('db');

// 	db('users').select().where('id', req.params.userId).then(dbRes => {
// 		let user = {}

// 		if (!_.isEmpty(dbRes)) {
// 			[user] = dbRes
// 		}

// 		res.send(user)
// 	})
// })

app.listen(SERVER_PORT, () => {
	console.log(`Server listening on port ${SERVER_PORT}`);
});