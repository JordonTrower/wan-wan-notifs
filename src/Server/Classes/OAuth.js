import {
	OAuth
} from 'oauth';
import 'dotenv/config';
import qs from 'qs';
import _ from 'lodash';



class TwitterConnection {

	constructor(consumer, consumerSecret, access, accessSecret, bearer, baseUrl, requestTokenUrl, accessTokenUrl, callback) {

		this.consumerPublic = consumer;
		this.consumerSecret = consumerSecret;
		this.accessToken = access;
		this.accessTokenSecret = accessSecret;
		this.bearerToken = bearer;

		this.callBack = callback;
		this.baseUrl = baseUrl;

		this.oauth = new OAuth(
			requestTokenUrl,
			accessTokenUrl,
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