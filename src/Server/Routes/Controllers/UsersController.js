import _ from 'lodash'
import moment from 'moment'

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
			.then(dbRes => {

				// Flattens the subscriptions down to just info
				const result = _.flatMap(dbRes, ({
					subscriptions,
				}) => _.flatMap(subscriptions, sub =>
					sub.info
				))

				res.status(200).send(result);
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
			.then(dbRes => {

				const results = _.flatMap(dbRes, (currentItem) => {
					return currentItem.posts;
				})

				res.status(200).send(results);
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
		const currentTime = moment();
		const orderedData = _.chain(req.body)
			.groupBy('site')
			.toPairs()
			.map(currentItem =>
				Object.assign({}, _.zipObject(['site', 'info'], currentItem), {
					updated_at: currentTime.format('MM-DD-YYYY HH:mm:ss')
				})
			).value();


		db('userSubscriptions').where('user_id', req.user.userId)
			.first()
			.then(dbRes => {
				if (_.isEmpty(dbRes)) {

					db('userSubscriptions')
						.insert({
							user_id: req.user.userId,
							subscriptions: JSON.stringify(orderedData),
							updated_at: currentTime.format('MM-DD-YYYY HH:mm:ss'),
							created_at: currentTime.format('MM-DD-YYYY HH:mm:ss')
						})
						.returning()
						.then(InsertRes =>
							res.status(200).send((InsertRes))
						)
				} else {

					db('userSubscriptions').where('user_id', req.user.userId)
						.update({
							subscriptions: JSON.stringify(orderedData),
							updated_at: currentTime.format('MM-DD-YYYY HH:mm:ss'),
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
				const currentTime = moment();
				if (_.isEmpty(dbRes)) {

					db('userNotifications')
						.insert({
							user_id: req.user.userId,
							notifications: JSON.stringify(req.body),
							updated_at: currentTime.format('MM-DD-YYYY HH:mm:ss'),
							created_at: currentTime.format('MM-DD-YYYY HH:mm:ss')
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
							updated_at: currentTime.format('MM-DD-YYYY HH:mm:ss'),
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