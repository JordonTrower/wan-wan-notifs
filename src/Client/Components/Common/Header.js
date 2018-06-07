import styled from 'styled-components';

export default styled.div `
	position: sticky;
	top: 0px;
	left: 0px;
	height: 75px;
	width: 100vw;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #232F3E;
	> a.button {
		border: 2px black solid;
		background: #37475A;
		text-decoration: none;
		color: white;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-radius: 7px;
		height: 50px;
		width: 100px;
		margin-right:25px;
		&:active {
			background: #131a22;
		}
	}
	> h2 {
		color: white;
		padding-left: 25px;
	}
`;