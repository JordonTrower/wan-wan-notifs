import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';
import _ from 'lodash';
import { connect } from 'react-redux';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Dashboard from './Dashboard';
import ModifyUser from './User/Modify';
import { getUserSites } from '../../Redux/reducer';

class Routes extends Component {
	constructor() {
		super();

		this.state = {
			checked: false
		};

		this.getSites = this.getSites.bind(this);
	}

	componentDidMount() {
		this.getSites();
	}

	componentDidUpdate() {
		this.getSites();
		if (!_.isEmpty(this.props.user)) {
			axios
				.get(
					`${process.env.REACT_APP_API_HOME}/user/${
						this.props.user.id
					}/check-user`
				)
				.catch(res => {
					if (res.toString().includes('401')) {
						window.location = res.response.data;
					}
				})
				.then(() => {
					// if (_.isEmpty(this.props.socket)) {
					// 	this.props.getSocketConnection(this.props.user.id);
					// }
				});
		}
	}

	getSites() {
		if (
			!_.isEmpty(this.props.user) &&
			_.isEmpty(this.props.sites) &&
			!this.state.checked
		) {
			this.props.getUserSites(this.props.user.id);

			this.setState({
				checked: true
			});
		}
	}

	render() {
		return (
			<div>
				<Header>
					<Link to={`${process.env.REACT_APP_NGINX_LOCATION}/notif/`}>
						<h2>Wan-Wan Notifications!</h2>
					</Link>

					<Link
						to={`${
							process.env.REACT_APP_NGINX_LOCATION
						}/notif/mod-user`}
						className="pfp"
					>
						<img
							width="75px"
							height="75px"
							src={this.props.user.picture}
							alt="Profile"
						/>
					</Link>
				</Header>

				<div style={{ display: 'flex', width: '99vw' }}>
					<Sidebar>
						<Link
							to={`${
								process.env.REACT_APP_NGINX_LOCATION
							}/notif/`}
						>
							<h1>All Sites</h1>
						</Link>

						{this.props.sites.map(site => (
							<Link
								key={site}
								to={`${
									process.env.REACT_APP_NGINX_LOCATION
								}/notif/get-${site}`}
							>
								<h1>{_.capitalize(site)}</h1>
							</Link>
						))}
					</Sidebar>

					<Switch>
						<Route
							exact
							path={`${
								process.env.REACT_APP_NGINX_LOCATION
							}/notif/`}
							component={Dashboard}
						/>
						<Route
							path={`${
								process.env.REACT_APP_NGINX_LOCATION
							}/notif/get-:site`}
							component={Dashboard}
						/>
						<Route
							path={`${
								process.env.REACT_APP_NGINX_LOCATION
							}/notif/mod-user`}
							component={ModifyUser}
						/>
					</Switch>
				</div>
			</div>
		);
	}
}

Routes.propTypes = {
	user: propTypes.shape({
		id: propTypes.number,
		picture: propTypes.string
	}).isRequired,
	sites: propTypes.arrayOf(propTypes.string).isRequired,
	getUserSites: propTypes.func.isRequired
};

function mapStateToProps(state) {
	return state;
}

export default connect(mapStateToProps, { getUserSites })(Routes);
