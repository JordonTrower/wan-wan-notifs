import styled from 'styled-components';
import commonCSS from './CommonStyles';

export default styled.div `
	${commonCSS.col10};
	${commonCSS.row};
	height: 60%;
	align-items: center;
	
	> div > :not(img) {
		border: 0px;
		height: 35px;
		padding: 0;
		background: #E9ECEF;
		border: #CED4DA solid 1px;
	}

	> .logo {
		height: 50%;
		float: left;
		padding: 0 25px 0 3%;
	}

	> .input {
		
		@media (min-width: 1250px) {
			${commonCSS.col6};
		}

		@media (max-width: 1250px) {
			${commonCSS.col10};

		}
		
		${commonCSS.row};
		font-size: 18px;
		height: 13px;
		order: 1;
		border: #CED4DA solid 1px;
	}

	> div.inputGroupPrependContainer {
		order: 0;
		${commonCSS.col4};
		${commonCSS.row};
		justify-content: flex-end;

		> .inputGroupPrepend {
			border-radius: 7px 0 0 7px;
			background: #eee;
			color: #777;
			padding: 0 12px;
		}

		> .inputGroupPrepend ~ .inputGroupPrepend {
			border-radius: 0;
		}
	}

	> div.inputGroupAppendContainer {
		order: 2;
		${commonCSS.col2};
		${commonCSS.row};
		justify-content: flex-start;

		> .inputGroupAppend {
			background: #D73040;
			color: #fff;
			width: 50px;
		}

		.inputGroupAppend:nth-last-child(1) {
			border-radius: 0 7px 7px 0;
		}

		> button:hover {
			background: #f3a847;
		}
	}
`;