import React from 'react';
import styled from 'styled-components';

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
	}
`;

export default () => (
	<Block>
		<div>Lorem</div>
	</Block>
);
