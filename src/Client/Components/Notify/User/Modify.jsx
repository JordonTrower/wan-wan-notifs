import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import _ from 'lodash';
import InputGroup from '../../Common/InputGroup';
import Button from '../../Common/Button';

const Body = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;

	> div {
		@media (min-width: 1250px) {
			width: 90%;
		}
		width: 100%;

		> div {
			padding-left: 45px;

			> div.buttons {
				width: 100%;
				display: flex;
				justify-content: space-between;
			}
		}
		> div.subscriptions {
			border-bottom: 1px black solid;
			padding-bottom: 20px;
		}
	}
`;

class Modify extends Component {
	constructor() {
		super();

		this.state = {
			subscriptions: [],
			notifications: [],
			subId: 0,
			notifId: 0,
			checked: false
		};

		this.getInfo = this.getInfo.bind(this);

		this.addSubscription = this.addSubscription.bind(this);
		this.updateSubscriptionSite = this.updateSubscriptionSite.bind(this);
		this.updateSubscriptionUrl = this.updateSubscriptionUrl.bind(this);
		this.deleteSubscription = this.deleteSubscription.bind(this);
		this.saveSubscriptions = this.saveSubscriptions.bind(this);

		this.addNotification = this.addNotification.bind(this);
		this.updateNotificationSite = this.updateNotificationSite.bind(this);
		this.updateNotificationUrl = this.updateNotificationUrl.bind(this);
		this.deleteNotification = this.deleteNotification.bind(this);
		this.saveNotifications = this.saveNotifications.bind(this);

		this.deleteAccount = this.deleteAccount.bind(this);
		this.logOut = this.logOut.bind(this);
	}

	componentDidMount() {
		this.getInfo();
	}

	componentDidUpdate() {
		this.getInfo();
	}

	getInfo() {
		if (
			_.isEmpty(this.state.subscriptions) &&
			_.isEmpty(this.state.notifications) &&
			this.props.userId !== null &&
			!this.state.checked
		) {
			axios.get(`/api/user/${this.props.userId}/get-subs`).then(res => {
				console.log(res.data);
				this.setState({
					subscriptions: !_.isEmpty(res.data) ? res.data : [],
					subId: !_.isEmpty(res.data)
						? res.data[res.data.length - 1].id + 1
						: 0,
					checked: true
				});
			});

			axios.get(`/api/user/${this.props.userId}/get-notifs`).then(res => {
				this.setState({
					notifications:
						res.data !== '' ? res.data.notifications : [],
					notifId:
						res.data !== ''
							? res.data.notifications[
								res.data.notifications.length - 1
							  ].id + 1
							: 0,
					checked: true
				});
			});
		}
	}

	addSubscription() {
		const subs = Object.assign([], this.state.subscriptions);

		subs.push({
			id: this.state.subId,
			site: '',
			url: ''
		});

		this.setState({
			subscriptions: subs,
			subId: this.state.subId + 1
		});
	}

	deleteSubscription(e) {
		const subIndex = e.target.id.replace(/[^0-9]/g, '');
		const subs = Object.assign([], this.state.subscriptions);

		this.setState({
			subscriptions: subs.filter(sub => sub.id !== Number(subIndex))
		});
	}

	updateSubscriptionSite(e) {
		const subIndex = e.target.id.replace(/[^0-9]/g, '');

		const subs = Object.assign([], this.state.subscriptions);

		this.setState({
			subscriptions: subs.map(sub => {
				if (sub.id === Number(subIndex)) {
					sub.site = e.target.value;
				}

				return sub;
			})
		});
	}

	updateSubscriptionUrl(e) {
		const subIndex = e.target.id.replace(/[^0-9]/g, '');

		const subs = Object.assign([], this.state.subscriptions);

		this.setState({
			subscriptions: subs.map(sub => {
				if (sub.id === Number(subIndex)) {
					sub.url = e.target.value;
				}

				return sub;
			})
		});
	}

	saveSubscriptions() {
		axios
			.post(
				`/api/user/${this.props.userId}/save-subs`,
				this.state.subscriptions
			)
			.then(res => {
				console.log(res.data);
			});
	}

	addNotification() {
		const notifs = Object.assign([], this.state.notifications);

		notifs.push({
			id: this.state.notifId,
			site: '',
			url: ''
		});

		this.setState({
			notifications: notifs,
			notifId: this.state.notifId + 1
		});
	}

	deleteNotification(e) {
		const notifIndex = e.target.id.replace(/[^0-9]/g, '');
		const notifs = Object.assign([], this.state.notifications);

		this.setState({
			notifications: notifs.filter(
				notif => notif.id !== Number(notifIndex)
			)
		});
	}

	updateNotificationSite(e) {
		const notifIndex = e.target.id.replace(/[^0-9]/g, '');

		const notifs = Object.assign([], this.state.notifications);

		this.setState({
			notifications: notifs.map(notif => {
				if (notif.id === Number(notifIndex)) {
					notif.site = e.target.value;
				}

				return notif;
			})
		});
	}

	updateNotificationUrl(e) {
		const notifIndex = e.target.id.replace(/[^0-9]/g, '');

		const notifs = Object.assign([], this.state.notifications);

		this.setState({
			notifications: notifs.map(notif => {
				if (notif.id === Number(notifIndex)) {
					notif.url = e.target.value;
				}

				return notif;
			})
		});
	}

	saveNotifications() {
		axios
			.post(
				`/api/user/${this.props.userId}/save-notifs`,
				this.state.notifications
			)
			.then(res => {
				console.log(res.data);
			});
	}

	deleteAccount() {
		axios
			.delete(`/api/user/${this.props.userId}/delete-account`)
			.then(() => {
				this.props.history.push('/');
			});
	}

	logOut() {
		axios.post(`/api/user/${this.props.userId}/logout`).then(() => {
			this.props.history.push('/');
		});
	}

	render() {
		return (
			<Body>
				<div>
					<div className="subscriptions">
						<h1>Subscriptions</h1>
						{this.state.subscriptions
							.filter(subscription => _.isNil(subscription.type))
							.map(subscription => (
								<InputGroup
									key={`input-group-sub-${subscription.id}`}
								>
									<div className="inputGroupPrependContainer">
										<select
											name="subscription"
											id={`sub-select-${subscription.id}`}
											className="inputGroupPrepend"
											subid={subscription.id}
											value={subscription.site}
											onChange={
												this.updateSubscriptionSite
											}
										>
											<option value="">Site Name</option>
											<option value="twitter">
												Twitter
											</option>
											<option value="reddit">
												Reddit
											</option>
										</select>
									</div>

									<input
										type="text"
										id={`sub-text-${subscription.id}`}
										className="input searchBar"
										value={subscription.url}
										onChange={this.updateSubscriptionUrl}
									/>

									<div className="inputGroupAppendContainer">
										<button
											className="inputGroupAppend"
											id={`sub-delete-${subscription.id}`}
											onClick={this.deleteSubscription}
										>
											Delete
										</button>
									</div>
								</InputGroup>
							))}

						<div className="buttons">
							{/* <Button
								onClick={() => {
									console.log(
										`${
											process.env.API_URL
										}login/reddit/auth`
									);
									window.location = `${
										process.env.API_URL
									}login/reddit/auth`;
								}}
							>
								Add Reddit Account
							</Button> */}
							<Button onClick={this.addSubscription}>
								Add Subscription
							</Button>

							<Button
								color="Success"
								onClick={this.saveSubscriptions}
							>
								Save Subscriptions
							</Button>
						</div>
					</div>
					<div>
						<h1>Notifications</h1>
						{this.state.notifications.map(notif => (
							<InputGroup key={`input-group-notif-${notif.id}`}>
								<div className="inputGroupPrependContainer">
									<select
										name="notification"
										id={`notif-select-${notif.id}`}
										className="inputGroupPrepend"
										subid={notif.id}
										value={notif.site}
										onChange={this.updateNotificationSite}
									>
										<option value="">Site Name</option>
										<option value="email">Email</option>
										<option value="twitter">Twitter</option>
									</select>
								</div>

								<input
									type="text"
									id={`notif-text-${notif.id}`}
									className="input searchBar"
									value={notif.url}
									onChange={this.updateNotificationUrl}
								/>

								<div className="inputGroupAppendContainer">
									<button
										className="inputGroupAppend"
										id={`notif-delete-${notif.id}`}
										onClick={this.deleteNotification}
									>
										Delete
									</button>
								</div>
							</InputGroup>
						))}

						<div className="buttons">
							<Button onClick={this.addNotification}>
								Add Notification
							</Button>

							<Button
								color="Success"
								onClick={this.saveNotifications}
							>
								Save Notifications
							</Button>
						</div>

						<div className="bunttons">
							<Button color="Danger" onClick={this.deleteAccount}>
								Delete Account
							</Button>
							<Button color="Danger" onClick={this.logOut}>
								Log Out
							</Button>
						</div>
					</div>
				</div>
			</Body>
		);
	}
}

Modify.propTypes = {
	userId: propTypes.number,
	history: propTypes.shape({
		push: propTypes.func
	}).isRequired
};

Modify.defaultProps = {
	userId: null
};

function mapStateToProps(state) {
	return { userId: state.user.id };
}

export default connect(mapStateToProps)(Modify);
