import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';
import Block from './Block';

const Body = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	> div {
		@media (min-width: 1250px) {
			width: 90%;
		}
		justify-content: center
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}
`;

class Dashboard extends Component {
	constructor() {
		super();

		this.state = {
			posts: []
		};
	}

	componentDidMount() {
		this.getInfo();
	}

	componentDidUpdate() {
		this.getInfo();
	}

	getInfo() {
		if (
			_.isEmpty(this.state.posts) &&
			this.props.userId !== null &&
			!this.state.checked
		) {
			axios.get(`/user/${this.props.userId}/get-posts`).then(res => {
				this.setState({
					posts: res.data !== '' ? res.data.posts : [],
					checked: true
				});
			});
		}
	}

	render() {
		return (
			<Body>
				<div>
					{this.state.posts.map(post => (
						<Block key={post.id} post={post} />
					))}
				</div>
			</Body>
		);
	}
}

Dashboard.propTypes = {
	userId: propTypes.number
};

Dashboard.defaultProps = {
	userId: null
};

function mapStateToProps(state) {
	return { userId: state.user.id };
}

export default connect(mapStateToProps)(Dashboard);
