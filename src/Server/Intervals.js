import nodemailer from 'nodemailer';
import moment from 'moment'
import axios from 'axios';
import _ from 'lodash'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS,
	}
});

/**
 * 
 * @param {*} db knex connection to db
 * @param {*} site what site to get posts from
 * 
 * set up the reused query for getting all the users and their related tables to check for new notifications
 */
function getTables(db, site) {
	return db('users')
		.join('userSubscriptions', 'userSubscriptions.user_id', 'users.id')
		.join('userNotifications', 'userNotifications.user_id', 'users.id')
		.leftJoin('posts', function getTwitPosts() {
			this.on('posts.user_id', 'users.id').andOn(
				'site', db.raw('?', [site])
			)
		})
		.select('users.name', 'users.id', 'userSubscriptions.subscriptions',
			'userNotifications.notifications', 'posts.updated_at')
}


/**
 * 
 * @param {*} db database
 * @param {*} site what site to look at
 * @param {*} userId what the current userId is to update
 * @param {*} toUpload entire list of new notifications
 * 
 * Updates the DB list of a users posts
 */
function updatePosts(db, site, userId, toUpload) {

	const currentDate = new Date();

	db('posts').where('user_id', userId).andWhere({
		site
	}).select().first().then(dbSelect => {

		if (_.isEmpty(dbSelect)) {

			db('posts').insert({
				user_id: userId,
				posts: JSON.stringify(toUpload),
				site,
				updated_at: currentDate.toISOString(),
				created_at: currentDate.toISOString()
			}).then(() => {

			})
		} else {

			const trimmed = dbSelect.posts.filter(post => moment(post.posted_at).unix() > moment(currentDate).subtract(2, 'days').unix())

			db('posts').where('user_id', userId).andWhere({
				site
			}).update({
				posts: JSON.stringify(Object.assign([], toUpload, trimmed)),
				updated_at: currentDate.toISOString(),

			}).then(() => {

			})
		}
	})
}

export default {

	/**
	 * 
	 * @param {*} app express app, to get the knex connection
	 * 
	 * goes through every user that has a twitter subscription
	 * and checks for new posts to users they are subscribed to
	 * then adds it to the posts db and sends them an email
	 */
	getTwitter(app) {

		const db = app.get('db');

		const lastCheck = moment().subtract(15, 'minutes')

		const promiseData = [];

		const query = getTables(db, 'twitter');

		query.then(users => {
			users.forEach(user => {

				const promises = [];

				const lastUpdated = moment(user.updated_at);

				if (_.isNil(user.updated_at) || lastUpdated.unix() <= lastCheck.unix()) {
					user.subscriptions.forEach(sub => {

						if (sub.site === 'twitter') {

							promises.push(
								axios({
									method: 'get',
									url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${sub.url}&count=25?exclude_replies=true`,
									headers: {
										Accept: '*/*',
										Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
										Connection: 'close',
										'User-Agent': 'node-twitter/1.7.1'
									}
								})
							)
						}
					})
				}

				axios.all(promises).then(results => {
					results.forEach((response) => {
						response.data.forEach(data => {

							const postDate = moment(new Date(data.created_at));

							if (postDate.unix() <= lastCheck.unix()) {
								promiseData.push({
									from: data.user.screen_name,
									site: 'twitter',
									content: data.text,
									posted_at: postDate.toISOString()
								})
							}
						})
					})

					if (!_.isEmpty(promiseData)) {

						let html = `<h1>Hey, You have new Twitter notifications!</h1>
							<table>
								<thead>
									<tr>
										<th>From</th>
										<th>Content</th>
									</tr>
								</thead>
								<tbody>	
						`

						promiseData.forEach(data => {

							html += `
								<tr>
									<td>
										${data.from}
									</td>
									<td>
										${data.content}
									</td>

								</tr>
								`

						})

						html += '</tbody></table>'

						updatePosts(db, 'twitter', user.id, promiseData)

						const message = {
							from: process.env.GMAIL_USER,
							to: user.notifications.filter(notif => notif.site === 'email').map(notif =>
								notif.url
							).join(', '),
							subject: 'Wan Wan! New Twitter Notifications',
							html
						}

						transporter.sendMail(message, (error) => {
							if (error) {
								return console.log(error);
							}
						});
					}
				})
			})
		})

	}
}