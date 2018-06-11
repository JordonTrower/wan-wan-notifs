import express from 'express';
import passport from 'passport';
import _ from 'lodash';

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

export default router;