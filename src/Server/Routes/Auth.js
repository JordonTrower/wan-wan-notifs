import express from 'express';
import passport from 'passport';
import _ from 'lodash';
import crypto from 'crypto';
import cryptoJs from 'crypto-js'
import moment from 'moment';

import middleware from '../Middleware';

const router = express();

const {
	CLIENT_HOME
} = process.env

router.get('/', passport.authenticate('auth0', {
	connection: 'google-oauth2'
}));

router.get('/callback', passport.authenticate('auth0', {
	successRedirect: CLIENT_HOME,
	failureRedirect: '/login',
	connection: 'google-oauth2'

}))

router.get('/is-logged-in', (req, res) => {
	console.log(req.session);
	if (!_.isEmpty(req.user) && req.user.userId !== 'not-logged') {

		const db = req.app.get('db')

		db('users').select().where('id', Number(req.user.userId)).first().then(dbRes => {

			res.send({
				res: 'success',
				user: dbRes
			})
		}).catch(dbErr => {

			res.send({
				res: 'db fail',
				failure: dbErr
			})
		})
	} else {

		res.send({
			res: 'not logged'
		})
	}
})

const redditState = {};

router.get('/reddit/auth', [middleware.wanAuthed, middleware.wanCheckUser], (req, res) => {
	const state = crypto.randomBytes(20).toString('hex')

	const redditAuth = req.app.get('redditAuth')

	redditState[req.user.userId] = state;

	const redditAuthParams = {
		client_id: process.env.REDDIT_CLIENT,
		response_type: 'code',
		state,
		redirect_uri: `${process.env.REACT_APP_API_HOME}login/reddit/callback`,
		duration: 'permanent',
		scope: 'mysubreddits'
	};

	res.redirect(redditAuth.getAuthorizeUrl(redditAuthParams))
})

router.get('/reddit/callback', [middleware.wanAuthed, middleware.wanCheckUser], (req, res) => {
	if (redditState[req.user.userId] === req.query.state && _.isNil(req.query.error)) {
		delete redditState[req.user.userId];

		const db = req.app.get('db')

		const redditAuth = req.app.get('redditAuth')


		const redditAuthParams = {
			response_type: 'code',
			redirect_uri: `${process.env.REACT_APP_API_HOME}login/reddit/callback`,
			grant_type: 'authorization_code'
		};

		redditAuth.getOAuthAccessToken(
			req.query.code,
			redditAuthParams,
			(err, access, refresh) => {

				if (!err) {
					db('userSubscriptions').select().where('user_id', req.user.userId).andWhere('site', 'reddit').first().then(userSubs => {
						const currentTime = moment();

						const userInfo = {
							site: 'reddit',
							type: 'account',
							bearer: cryptoJs.AES.encrypt(access, process.env.BEARER_TOKEN_SECRET).toString(),
							refresh: cryptoJs.AES.encrypt(refresh, process.env.BEARER_TOKEN_SECRET).toString(),
							updated_at: currentTime.format('MM-DD-YYYY HH:mm:ss')()
						}

						if (!_.isEmpty(userSubs)) {

							userInfo.id = userSubs.subscriptions[userSubs.subscriptions.length - 1].id + 1;

							const otherSubs = userSubs.subscriptions.filter(sub => sub.site !== 'reddit')

							otherSubs.push(userInfo);

							db('userAccounts').where('user_id', req.user.userId).update(userInfo).then(() =>
								res.redirect(process.env.CLIENT_HOME)
							)
						} else {

							userInfo.id = 0;

							db('userAccounts').insert(Object.assign({}, userInfo, {
								user_id: req.user.userId,
								created_at: currentTime.format('MM-DD-YYYY HH:mm:ss')
							})).then(() =>
								res.redirect(process.env.CLIENT_HOME)
							)
						}
					})
				}

			}
		)
	} else {
		delete redditState[req.user.userId];
		res.redirect('aa')
	}
})

export default router;