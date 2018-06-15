import _ from 'lodash'

export default {

	getUser(req, res) {
		const db = req.app.get('db');

		db('users').select()
			.first()
			.where('id', req.params.userId)
			.then(dbRes => {
				res.send(dbRes)

			})
			.catch(dbErr => {
				console.log(dbErr);
				res.send({});
			})
	},

	getSubs(req, res) {
		const db = req.app.get('db');

		db('userSubscriptions').where('user_id', req.user.userId)
			.select('subscriptions')
			.first()
			.then(dbRes => {
				res.status(200).send(dbRes);
			})
	},

	getNotifs(req, res) {
		const db = req.app.get('db');

		db('userNotifications').where('user_id', req.user.userId)
			.select('notifications')
			.first()
			.then(dbRes => {
				res.status(200).send(dbRes);
			})
	},

	getPosts(req, res) {
		const db = req.app.get('db');

		db('posts').where('user_id', req.user.userId)
			.andWhere('site', 'like', `%${req.query.site}`)
			.select('posts')
			.first()
			.then(dbRes => {
				res.status(200).send(dbRes);
			})
	},

	getSites(req, res) {
		const db = req.app.get('db');

		db('posts').where('user_id', req.user.userId)
			.select('site')
			.then(dbRes => {
				res.status(200).send({
					res: 'success',
					data: dbRes
				});
			}).catch(dbErr => {
				res.send({
					res: 'failure'
				})
				console.log(dbErr)
			})
	},

	saveSubs(req, res) {
		const db = req.app.get('db');

		db('userSubscriptions').where('user_id', req.user.userId)
			.first()
			.then(dbRes => {
				const currentTime = new Date();

				if (_.isEmpty(dbRes)) {

					db('userSubscriptions')
						.insert({
							user_id: req.user.userId,
							subscriptions: JSON.stringify(req.body),
							updated_at: currentTime.toISOString(),
							created_at: currentTime.toISOString()
						})
						.returning()
						.then(InsertRes =>
							res.status(200).send((InsertRes))
						)
				} else {

					db('userSubscriptions').where('user_id', req.user.userId)
						.update({
							subscriptions: JSON.stringify(req.body),
							updated_at: currentTime.toISOString(),
						})
						.then(() => {

							db('userSubscriptions').where('user_id', req.user.userId)
								.first()
								.then(updateRes =>
									res.status(200).send((updateRes))
								)
						})
				}
			})
	},

	saveNotif(req, res) {
		const db = req.app.get('db');

		db('userNotifications').where('user_id', req.user.userId)
			.first()
			.then(dbRes => {
				const currentTime = new Date();

				if (_.isEmpty(dbRes)) {

					db('userNotifications')
						.insert({
							user_id: req.user.userId,
							notifications: JSON.stringify(req.body),
							updated_at: currentTime.toISOString(),
							created_at: currentTime.toISOString()
						})
						.returning()
						.then(InsertRes => {
							res.status(200).send((InsertRes))
						})
				} else {

					db('userNotifications')
						.where('user_id', req.user.userId)
						.update({
							notifications: JSON.stringify(req.body),
							updated_at: currentTime.toISOString(),
						})
						.then(() => {

							db('userNotifications')
								.where('user_id', req.user.userId)
								.first()
								.then(updateRes => {
									res.status(200).send((updateRes));
								})
						})
				}
			})
	},

	deleteAccount(req, res) {
		const db = req.app.get('db');

		db('userSubscriptions').where('user_id', req.user.userId)
			.delete()
			.then(() =>

				db('userNotifications').where('user_id', req.user.userId).delete().then(() => {

					db('users').where('id', req.user.userId).delete().then(() => {
						req.session.destroy();

						return res.status(200).send({
							res: 'success',
							data: 'Deleted Account'
						})
					})
				})
			)
	}
}