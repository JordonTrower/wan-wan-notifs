import React from 'react';
import styled from 'styled-components';
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

export default () => (
	<Body>
		<div>
			<Block />
			<Block />
			<Block />
			<Block />
			<Block />
			<Block />
			<Block />
			<Block />
		</div>
	</Body>
);
