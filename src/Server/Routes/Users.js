import express from 'express';
import _ from 'lodash'


const router = express.Router({
	mergeParams: true
});

router.get('/get', (req, res) => {
	const db = req.app.get('db');
	let user = {}
	db('users').select().where('id', req.params.userId).then(dbRes => {

		if (!_.isEmpty(dbRes)) {
			[user] = dbRes
		}

		res.send(user)

	}).catch(() => {
		res.send(user);
	})
})

export default router;