import express from 'express';
import _ from 'lodash'


const router = express.Router({
	mergeParams: true
});

router.get('/get', (req, res) => {
	const db = req.app.get('db');
	db('users').select().first().where('id', req.params.userId).then(dbRes => {
		res.send(dbRes)

	}).catch(dbErr => {
		console.log(dbErr);
		res.send({});
	})
})

router.get('/check-user', (req, res) => {
	res.status(200).send('Correct');
})
export default router;