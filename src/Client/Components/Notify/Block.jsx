import React from 'react';
import styled from 'styled-components';
import propTypes from 'prop-types';
import moment from 'moment';

const Block = styled.div`
	width: 350px;
	height: 350px;
	background: #0b132b;
	margin-top: 25px;
	margin-bottom: 25px;
	@media (min-width: 370px) {
		margin-right: 10px;
	}
	@media (min-width: 800px) {
		margin-right: 25px;
	}
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 10px;
	> div {
		width: 300px;
		height: 300px;
		background: #4f396c;
		border-radius: 10px;
		color: #E8F1F2;
		div.topInfo {
			display: flex;
			flex-direction: column;
			border-bottom: 1px solid white;
			> div {
				display: flex;
				justify-content: space-between;
				
				> a {
					text-align: center;
					display: flex;
					text-decoration: none;
					color: #E8F1F2
					flex-direction: column;
					justify-content: center;
				}
			}
		}

		> * {
			padding-right: 10px;
			padding-left: 10px;
		}
	}
`;

const addLink = content => {
	const split = content.split('https://');

	if (typeof split[1] === 'string') {
		const url = split[1].replace(/(\r\n|\n|\r)/gm, ' ').split(' ')[0];
		return <a href={`https://${url}`}>Post Link</a>;
	}
	return '';
};

const removeLink = content => {
	const split = content.split('https://');

	if (typeof split[1] === 'string') {
		return split[0];
	}
	return content;
};

const applyTimeOffset = postedAt => {
	const utc = moment.utc(postedAt, 'MMM-DD-YYYY HH:mm:ss Z');

	const local = moment(utc).local();

	return local.format('MM-DD-YYYY HH:mm:ss');
};

const BlockComp = props => (
	<Block>
		<div>
			<div className="topInfo">
				<div>
					<p>{props.post.site}</p>
					<p>{applyTimeOffset(props.post.posted_at)}</p>
				</div>
				<div>
					<p>{props.post.from}</p>
					{addLink(props.post.content)}
				</div>
			</div>
			<p>{removeLink(props.post.content)}</p>
		</div>
	</Block>
);

export default BlockComp;

BlockComp.propTypes = {
	post: propTypes.shape({
		site: propTypes.string,
		posted_at: propTypes.string,
		content: propTypes.string,
		from: propTypes.string
	}).isRequired
};
