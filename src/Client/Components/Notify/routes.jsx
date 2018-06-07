import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';
import _ from 'lodash';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Dashboard from './Dashboard';

class Routes extends Component {
	constructor() {
		super();

		this.state = {
			user: {}
		};

		this.validateUserExists = this.validateUserExists.bind(this);
	}

	componentDidMount() {
		axios
			.get(`/user/${this.props.match.params.id}/get`)
			.then(res => {
				this.setState({ user: res.data });
			})
			.catch(err => {
				if (err.toString().includes('401')) {
					window.location = err.response.data;
				}
			});
	}

	validateUserExists() {
		return !_.isEmpty(this.state.user);
	}

	render() {
		return (
			<div>
				<Header>
					<h2>Wan-Wan</h2>
					<div />
				</Header>
				<div style={{ display: 'flex', width: '100%' }}>
					<Sidebar />
					<Switch>
						<Route exact path="/notif/:id" component={Dashboard} />
					</Switch>
				</div>
			</div>
		);

		// this.validateUserExists() ? <div>aa</div> : <div>bbb</div>;
	}
}

Routes.propTypes = {
	match: propTypes.shape({
		params: propTypes.shape({ id: propTypes.string })
	}).isRequired
};

export default Routes;
