import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import _ from 'lodash';
import { getUserInfo } from '../Redux/reducer';
import Home from './Home';
import Routes from './Notify/routes';

class App extends Component {
	componentDidMount() {
		if (_.isEmpty(this.props.user) || this.props.user.id === 'not-logged')
			this.props.getUserInfo();
	}

	render() {
		return (
			<div>
				<BrowserRouter>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/notif" component={Routes} />
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { user: state.user };
}

export default connect(mapStateToProps, { getUserInfo })(App);

App.propTypes = {
	user: propTypes.shape({
		id: propTypes.number
	}).isRequired,
	getUserInfo: propTypes.func.isRequired
};
