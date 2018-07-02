import styled from 'styled-components';

export default styled.div `
	@media(max-width: 1200px) {
		display: none;
	}
	position: sticky;
	width: 250px;
	height: calc(100vh - 76px);
	top: 75px;
	left: 0;
	background: #282F44;
	display: flex;
	flex-direction: column;
	border-top: solid 1px #4F396C;
	> a {
		padding-top: 35px;
		padding-left: 25px;
		text-decoration: underline;
		color: #E8F1F2;
	}

`