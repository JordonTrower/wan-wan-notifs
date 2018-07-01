import styled from 'styled-components';

export default styled.div `
	position: sticky;
	top: 0px;
	left: 0px;
	height: 75px;
	width: 100vw;
	display: flex;
	justify-content: space-between;

	background: #282F44;
	color: #e8f1f2;

	> h2 {
		padding-top: 20px;
		margin-top: 0px;
		font-size: 28px;
		padding-left: 25px;
	}

	> a {

		padding-left: 25px;
		color: #e8f1f2;
		text-decoration: none;
	}

	> a.pfp {
		margin-right: 25px
	} 


`;