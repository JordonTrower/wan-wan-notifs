import React from 'react';
import { connect } from 'react-redux';
import Header from './Common/Header';

const Home = () => (
	<div>
		<Header>
			<h2>Wan-Wan!</h2>

			<a
				className="button"
				href={`${process.env.REACT_APP_API_HOME}login`}
			>
				Login!
			</a>
		</Header>
	</div>
);

function mapStateToProps(state) {
	return { user: state.user };
}

export default connect(mapStateToProps)(Home);
