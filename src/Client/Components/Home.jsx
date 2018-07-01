import React from 'react';
import { connect } from 'react-redux';
import Header from './Common/Header';
import Button from './Common/Button';

const Home = () => (
	<div>
		<Header>
			<h2>Wan-Wan!</h2>

			<Button
				onClick={() => {
					window.location = `${process.env.REACT_APP_API_HOME}login`;
				}}
				large
			>
				Login!
			</Button>

			{/* <a
				className="button"
				href={`${process.env.REACT_APP_API_HOME}login`}
			>
				Login!
			</a> */}
		</Header>
	</div>
);

function mapStateToProps(state) {
	return { user: state.user };
}

export default connect(mapStateToProps)(Home);
