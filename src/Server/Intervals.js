import nodemailer from 'nodemailer';
import moment from 'moment'
import axios from 'axios';
import cryptoJS from 'crypto-js';
import _ from 'lodash'
import 'dotenv/config'

import OauthConnection from './Classes/OAuth'

https: // www.ebay.com/itm/Gundam-Build-Fighters-Try-HGBF-056-Chinagguy-China-Kousaka-Mobile-Suit-Kit-/232453563297

	const Twitter = new OauthConnection(
		process.env.TWITTER_ACCESS,
		process.env.TWITTER_ACCESS_SECRET,
		process.env.TWITTER_OAUTH_ACCESS,
		process.env.TWITTER_OAUTH_ACCESS_SECRET,
		process.env.TWITTER_BEARER,
		'https://api.twitter.com/1.1/',
		'https://api.twitter.com/oauth/request_token',
		'https://api.twitter.com/oauth/access_token',
		process.env.CLIENT_HOME,
	);

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
		.orderBy('posts.updated_at', 'asc')
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

	const currentDate = moment.utc()

	db('posts').where('user_id', userId).andWhere({
		site
	}).select().first().then(dbSelect => {

		if (_.isEmpty(dbSelect)) {

			db('posts').insert({
				user_id: userId,
				posts: JSON.stringify(toUpload),
				site,
				updated_at: currentDate.format('MM-DD-YYYY HH:mm:ss'),
				created_at: currentDate.format('MM-DD-YYYY HH:mm:ss')
			}).then(() => {

			})
		} else {

			const trimmed = dbSelect.posts.filter(post => moment(new Date(post.posted_at)).unix() > currentDate.subtract(2, 'days').unix())

			const uniqUpload = _.chain(Object.assign([], toUpload, trimmed))
				.uniq('id')
				.sortBy('added_at');

			db('posts').where('user_id', userId).andWhere({
				site
			}).update({
				posts: JSON.stringify(uniqUpload),
				updated_at: currentDate.format('MM-DD-YYYY HH:mm:ss'),

			}).then(() => {

			})
		}
	})
}

function sendMail(promiseData, siteName, userNotifs, emailsSent) {

	const emailTo = userNotifs.filter(notif => notif.site === 'email').map(notif =>
		notif.url
	)

	if (!_.isEmpty(emailTo)) {

		let html = `<h1>Hey, You have new ${_.capitalize(siteName)} notifications!</h1>
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


		const message = {
			from: process.env.GMAIL_USER,
			to: emailTo.join(', '),
			subject: `Wan Wan! New ${siteName} Notifications`,
			html
		}

		if (emailsSent.emails + emailTo.length <= 95) {
			transporter.sendMail(message, (error) => {

				if (!_.isNil(error)) {
					return console.log(error);
				}

				emailsSent.emails += emailTo.count


				return emailsSent.count;
			});
		}
	}

}

function sendToTwitter(promiseData, siteName, userNotifs, requestsMade) {

	const tweetToArray = userNotifs.filter(notif => notif.site === 'twitter').map(notif =>
		notif.url
	)

	if (!_.isEmpty(tweetToArray)) {
		const recievers = `@${tweetToArray.join(' @')}`

		Twitter.post(
			'statuses/update', {
				status: `Hey ${recievers} you have new ${siteName} notifications ${moment().format('MM-DD-YYYY HH:mm:ss')}`
			}, (err) => {
				if (err) console.log(err);
			}, (err) => {
				if (err) console.log(err);
			}
		)
	}
}

function resolve(obj, path) {
	const splitPath = path.split('.');
	let current = obj;

	while (path.length) {

		if (typeof current !== 'object') return current

		current = current[splitPath.shift()]
	}
	return current
}

function getPromiseData(user, promises, limitHeader = null, dataToGet, site, requestsMade, db) {

	const promiseData = []

	axios.all(promises).then(results => {
		results.forEach((response) => {

			let responseData = null;
			dataToGet.info.split('.').forEach(info => {
				if (responseData) {
					responseData = responseData[info]
				} else {
					responseData = response[info]
				}
			})

			responseData.forEach(data => {

				let time = resolve(data, dataToGet.created_at);

				if (typeof time === 'number' && time.toString().length === 10) {
					time *= 1000;
				}

				const postDate = moment(new Date(time))

				if (limitHeader) {
					requestsMade[site] = response.headers[limitHeader];
				}

				const lastUpdated = moment(user.updated_at);

				if (_.isNil(user.updated_at) &&
					postDate.unix() >= moment().subtract(1, 'days').unix() ||
					postDate.unix() >= lastUpdated.unix()) {

					const pushData = {
						site,
						posted_at: postDate.format('MM-DD-YYYY HH:mm:ss'),
						added_at: moment().format('MM-DD-YYYY HH:mm:ss'),
					}


					Object.entries(dataToGet).forEach((values) => {

						const key = values[0];
						const value = values[1];

						if (key !== 'info') {
							if (typeof value === 'object') {

								const splitString = value.string.split('./'); // ./ is the designated splitter for the content string

								if (splitString.length === value.data.length) {
									pushData[key] = splitString.reduce((string, curValue, index) => {
										const toReturn = `${string}${curValue.replace('${}', resolve(data, value.data[index]))}`
										return toReturn;
									}, '')
								} else {
									pushData[key] = resolve(data, value.data[0])
								}

							} else {
								pushData[key] = resolve(data, value)
							}
						}
					})

					promiseData.push(
						pushData
					)
				}
			})
		})

		if (!_.isEmpty(promiseData)) {

			updatePosts(db, site, user.id, promiseData)

			sendMail(promiseData, site, user.notifications, requestsMade)

			sendToTwitter(promiseData, site, user.notifications, requestsMade)
		}
	})
}

function setPromises(query, site, Authorization, url, requestsMade, lastCheck, limitHeader, dataToGet, db, force) {
	query.then(users => {
		users.forEach(user => {

			user.subscriptions = _.flatMap(user.subscriptions.filter(sub => sub.site === site), (currentItem) => currentItem.info)

			const promises = [];

			const lastUpdated = moment(user.updated_at);

			if (_.isNil(user.updated_at) || lastUpdated.unix() <= lastCheck.unix() || force) {

				user.subscriptions.forEach(sub => {
					if (sub.site === site && requestsMade[site] >= 20) {

						promises.push(
							axios({
								method: 'get',
								url: url.replace('${}', sub.url),
								// url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${}&count=25?exclude_replies=true`,
								headers: {
									Accept: '*/*',
									Authorization,
									// Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
									Connection: 'close',
									'User-Agent': 'Wan-Wan-Notif /1.7.1'
								}
							})
						)
					}
				})
			}
			getPromiseData(user, promises, limitHeader, dataToGet, site, requestsMade, db)
		})
	})
}



export default {

	/**
	 * 
	 * @param {*} requestsMade amount of requests sent in a day
	 * made to reset the sent emails in a day back to zero 
	 * so no charges will be made to my account from sending too many
	 * called once every 24 hours
	 */
	resetEmails(requestsMade) {
		requestsMade.emails = 0
		return requestsMade;
	},

	/**
	 * 
	 * @param {*} requestsMade amount of requests sent in a day
	 * made to reset the sent twitter gets in a day back to zero 
	 * so no charges will be made to my account from sending too many
	 * called once every 24 hours
	 */
	resetTwitterPosts(requestsMade) {
		requestsMade.twitterGet = 2400;
		return requestsMade;
	},

	/**
	 * 
	 * @param {*} app express app, to get the knex connection
	 * @param {*} emailsSent total amount of emails sent for the day 
	 * goes through every user that has a twitter subscription
	 * and checks for new posts to users they are subscribed to
	 * then adds it to the posts db and sends them an email
	 */
	getTwitter(app, requestsMade) {
		const db = app.get('db');

		const lastCheck = moment.utc().subtract(15, 'minutes')

		const query = getTables(db, 'twitter');

		const auth = `Bearer ${process.env.TWITTER_BEARER}`;

		const url = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${}&count=25?exclude_replies=true';

		const rateLimit = 'x-rate-limit-remaining';

		const dataToGet = {
			info: 'data',
			from: 'user.screen_name',
			content: 'text',
			created_at: 'created_at',
			id: 'id'
		}

		setPromises(query, 'twitter', auth, url, requestsMade, lastCheck, rateLimit, dataToGet, db)

		// Old setup below

		// query.then(users => {

		// 	users.forEach(user => {

		// 		user.subscriptions = _.flatMap(user.subscriptions.filter(sub => sub.site === 'twitter'), (currentItem) => {
		// 			return currentItem.info;
		// 		})

		// 		const promises = [];

		// 		const lastUpdated = moment(user.updated_at);

		// 		if (_.isNil(user.updated_at) || lastUpdated.unix() <= lastCheck.unix()) {
		// 			user.subscriptions.forEach(sub => {
		// 				if (sub.site === 'twitter' && requestsMade[site] >= 250) {

		// 					promises.push(
		// 						axios({
		// 							method: 'get',
		// 							url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${sub.url}&count=25?exclude_replies=true`,
		// 							headers: {
		// 								Accept: '*/*',
		// 								Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
		// 								Connection: 'close',
		// 								'User-Agent': 'Wan-Wan-Notif /1.7.1'
		// 							}
		// 						})
		// 					)
		// 				}
		// 			})
		// 		}

		// 		axios.all(promises).then(results => {
		// 			results.forEach((response) => {
		// 				response.data.forEach(data => {

		// 					const postDate = moment(new Date(data.created_at))

		// 					requestsMade.twitterGet = response.headers['x-rate-limit-remaining'];

		// 					if (_.isNil(user.updated_at) &&
		// 						postDate.unix() >= moment().subtract(1, 'days').unix() ||
		// 						postDate.unix() >= lastUpdated.unix()) {
		// 						promiseData.push({
		// 							from: data.user.screen_name,
		// 							site: 'twitter',
		// 							content: data.text,
		// 							posted_at: postDate.format('MM-DD-YYYY HH:mm:ss'),
		// 							added_at: moment().format('MM-DD-YYYY HH:mm:ss'),
		// 							id: data.id
		// 						})
		// 					}
		// 				})
		// 			})

		// 			if (!_.isEmpty(promiseData)) {

		// 				updatePosts(db, 'twitter', user.id, promiseData)

		// 				sendMail(promiseData, 'twitter', user.notifications, requestsMade)

		// 				sendToTwitter(promiseData, 'twitter', user.notifications, requestsMade)
		// 			}
		// 		}).catch(err => {
		// 			console.log(err);
		// 		})
		// 	})
		// })
	},

	getReddit(app, requestsMade, force = false) {

		const query = getTables(app.get('db'), 'reddit');

		const lastCheck = moment.utc().subtract(1, 'minutes').subtract(15, 'seconds')

		const auth = '';

		const url = 'https://www.reddit.com/r/${}/new.json?sort=new';

		const rateLimit = 'x-rate-limit-remaining';

		const dataToGet = {
			info: 'data.data.children',
			from: 'data.author',
			content: {
				string: '${} ./ \n ${} ./ https://reddit.com${}',
				data: [
					'data.subreddit_name_prefixed',
					'data.title',
					'data.permalink',
				]
			},
			created_at: 'data.created',
			id: 'data.id'
		}

		setPromises(query, 'reddit', auth, url, requestsMade, lastCheck, rateLimit, dataToGet, app.get('db'), force)
	}
}