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
	successRedirect: '/login/complete',
	failureRedirect: '/login',
	connection: 'google-oauth2'

}))

router.get('/complete', (req, res) => {
	if (req.user) {
		res.redirect(`${CLIENT_HOME}${req.user}`)
	} else {
		res.redirect(`${process.env.API_HOME}login`);
	}
})

export default router;