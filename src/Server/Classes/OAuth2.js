import 'dotenv/config';
import qs from 'qs';
import _ from 'lodash';
import axios from 'axios';
import {
	OAuth2
} from 'oauth';

class OAuth2Container {

	constructor(consumer, consumerSecret, baseUrl, authorizePath, accessPath, callback, customHeaders) {

		this.consumerPublic = consumer;
		this.consumerSecret = consumerSecret;
		this.authorizePath = authorizePath;
		this.accessPath = accessPath;
		this.callBack = callback;
		this.baseUrl = baseUrl;
		this.customHeaders = customHeaders

		this.buildQs = qs.stringify;

		this.oauth = new OAuth2(
			process.env.REDDIT_CLIENT,
			process.env.REDDIT_CLIENT_SECRET,
			'https://www.reddit.com/api',
			'/v1/authorize',
			'/v1/access_token', {
				Authorization: `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}`
			}
		)
	}

	getAuthorizeUrl(params) {
		return this.oauth.getAuthorizeUrl(params);
	}

	getOauthAccess(code, params, callback) {
		this.oauth.getOAuthAccessToken(code, params, callback)
	}

	post(url, body, error, success) {
		const encodedUrl = `${this.baseUrl}${url}.json`.replace(/!/g, "%21")
			.replace(/'/g, "%27")
			.replace(/\(/g, "%28")
			.replace(/\)/g, "%29")
			.replace(/\*/g, "%2A");


		axios({
			method: 'post',
			url: encodedUrl,
		})

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


export default OAuth2Container;