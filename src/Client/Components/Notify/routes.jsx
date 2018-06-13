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

class Routes extends Component {
	componentDidUpdate() {
		if (!_.isEmpty(this.props.user)) {
			axios.get(`/user/${this.props.user.id}/check-user`).catch(res => {
				if (res.toString().includes('401')) {
					window.location = res.response.data;
				}
			});
		}
	}

	render() {
		return (
			<div>
				<Header>
					<Link to="/notif/">
						<h2>Wan-Wan Notifications!</h2>
					</Link>
					<Link to="/notif/mod-user" className="pfp">
						<img
							width="75px"
							height="75px"
							src={this.props.user.picture}
							alt="Profile"
						/>
					</Link>
				</Header>
				<div style={{ display: 'flex', width: '100vw' }}>
					<Sidebar />
					<Switch>
						<Route exact path="/notif/" component={Dashboard} />
						<Route
							exact
							path="/notif/mod-user"
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
	}).isRequired
};

function mapStateToProps(state) {
	return { user: state.user };
}

export default connect(mapStateToProps)(Routes);
