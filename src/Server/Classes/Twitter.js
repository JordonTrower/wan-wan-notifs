import {
	OAuth
} from 'oauth';
import 'dotenv/config';
import qs from 'qs';
import _ from 'lodash';



class TwitterConnection {

	constructor() {

		this.consumerPublic = process.env.TWITTER_ACCESS
		this.consumerSecret = process.env.TWITTER_ACCESS_SECRET
		this.accessToken = process.env.TWITTER_OAUTH_ACCESS
		this.accessTokenSecret = process.env.TWITTER_OAUTH_ACCESS_SECRET
		this.bearerToken = process.env.TWITTER_BEARER

		this.callBack = process.env.CLIENT_HOME
		this.baseUrl = 'https://api.twitter.com/1.1/'

		this.oauth = new OAuth(
			'https://api.twitter.com/oauth/request_token',
			'https://api.twitter.com/oauth/access_token',
			this.consumerPublic,
			this.consumerSecret,
			'1.0',
			this.callBack,
			'HMAC-SHA1'
		);

		this.buildQs = qs.stringify;
	}

	getOauthRequest(next) {
		this.oauth.getOAuthRequestToken((err, token, secret) => {
			if (err) {
				console.log(err);

				next();
			} else {
				const oauth = {};

				oauth.token = token;
				oauth.secret = secret;

				next(oauth);
			}
		})
	}

	getOauthAccess(oauth, next) {
		this.oauth.getOAuthAccessToken(oauth.token, oauth.secret, oauth.verifier,
			(err, token, secret) => {
				if (err) {
					console.log(err)

					next();
				} else {
					oauth.accessToken = token
					oauth.accessSecret = secret;

					next(oauth);
				}
			}
		)
	}

	post(url, body, error, success) {
		const encodedUrl = `${this.baseUrl}${url}.json`.replace(/!/g, "%21")
			.replace(/'/g, "%27")
			.replace(/\(/g, "%28")
			.replace(/\)/g, "%29")
			.replace(/\*/g, "%2A");

		this.oauth.post(encodedUrl, this.accessToken, this.accessTokenSecret, body, 'application/x-www-form-urlencoded', (err, resBody, res) => {

			if (!err && Number(res.status_code) === 200) {

				success(body);
			} else {
				error(err, res, body);
			}
		})
	}

	get(url, body, error, success) {
		const encodedUrl = `${this.baseUrl}${url}.json`.replace(/!/g, "%21")
			.replace(/'/g, "%27")
			.replace(/\(/g, "%28")
			.replace(/\)/g, "%29")
			.replace(/\*/g, "%2A");

		this.oauth.get(encodedUrl, this.bearerToken, (err, resBody, res) => {
			console.log(res.status);
			if (_.isNil(err) && Number(res.statusCode) === 200) {
				const limits = {
					"x-rate-limit-limit": res.headers['x-rate-limit-limit'],
					"x-rate-limit-remaining": Number(res.headers['x-rate-limit-remaining']),
					"x-rate-limit-reset": res.headers['x-rate-limit-reset'],
				}

				success(resBody, limits);
			} else {

				error(err, res, resBody)
			}
		})
	}

	buildQueryParams(params) {
		if (params && !_.isEmpty(params)) {
			return `?${this.buildQs(params)}`
		}
		return '';
	}
}





export default TwitterConnection;