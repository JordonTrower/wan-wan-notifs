import express from 'express';
import usersController from './Controllers/UsersController'


const router = express.Router({
	mergeParams: true
});

router.get('/get', usersController.getUser)

router.get('/get-subs', usersController.getSubs)

router.get('/get-notifs', usersController.getNotifs)

router.get('/get-posts', usersController.getPosts)

router.get('/get-sites', usersController.getSites)

router.post('/save-subs', usersController.saveSubs)

router.post('/save-notifs', usersController.saveNotif)

router.delete('/delete-account', usersController.deleteAccount)

router.get('/check-user', (req, res) => {
	res.status(200).send('Correct');
})

export default router;