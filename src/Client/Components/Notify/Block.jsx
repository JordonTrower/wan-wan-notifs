import React from 'react';
import styled from 'styled-components';
import propTypes from 'prop-types';

const Block = styled.div`
	width: 350px;
	height: 350px;
	background: #131a22;
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
		background: #484848;
		border-radius: 10px;
		color: white;
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
		return <a href={`https://${split[1]}`}>Image Link </a>;
	}
	return '';
};

const BlockComp = props => (
	<Block>
		<div>
			<div className="topInfo">
				<div>
					<p>{props.post.site}</p>
					<p>{props.post.posted_at}</p>
				</div>
				<div>
					<p>{props.post.from}</p>
					{addLink(props.post.content)}
				</div>
			</div>
			<p>{props.post.content}</p>
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
