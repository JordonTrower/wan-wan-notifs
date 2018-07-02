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
			posts: [],
			checked: false
		};
	}

	componentDidMount() {
		this.getInfo();
	}

	componentDidUpdate(prevProps) {
		if (
			(_.isNil(prevProps.match.params.site) &&
				!_.isNil(this.props.match.params.site)) ||
			prevProps.match.params.site !== this.props.match.params.site
		) {
			this.getInfo(true);
		} else {
			this.getInfo();
		}
	}

	getInfo(newRoute = false) {
		if (
			(_.isEmpty(this.state.posts) &&
				this.props.userId !== null &&
				!this.state.checked) ||
			newRoute
		) {
			axios
				.get(
					`/api/user/${this.props.userId}/get-posts?site=${this.props
						.match.params.site || ''}`
				)
				.then(res => {
					if (!_.isEmpty(res.data)) {
						this.setState({
							posts: _.orderBy(res.data, ['posted_at'], ['desc']),
							checked: true
						});
					} else {
						this.setState({
							posts: [],
							checked: true
						});
					}
				});
		}
	}

	render() {
		return (
			<Body>
				<div>
					{!_.isEmpty(this.state.posts) ? (
						this.state.posts.map(post => (
							<Block key={`${post.id}`} post={post} />
						))
					) : (
						<div>
							<p style={{ fontSize: '24px' }}>
								{' '}
								In order to get started, please click on your
								profile picture and add some notifications and
								subscriptions.
							</p>
							<p>
								YOU MUST HAVE AT LEAST ONE SUBSCRIPTION AND
								NOTIFICATION, and please allow up to 15 minutes
							</p>
						</div>
					)}
				</div>
			</Body>
		);
	}
}

Dashboard.propTypes = {
	userId: propTypes.number,
	match: propTypes.shape({
		params: propTypes.shape({
			site: propTypes.string
		})
	}).isRequired
};

Dashboard.defaultProps = {
	userId: null
};

function mapStateToProps(state) {
	return { userId: state.user.id };
}

export default connect(mapStateToProps)(Dashboard);
