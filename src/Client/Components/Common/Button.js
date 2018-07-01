import styled from 'styled-components';
import _ from 'lodash';
import commonCSS from './CommonStyles';

export default styled.button `
	margin-right: 25px;

	margin-top: 15px;

	${props => {
		let cssToReturn = commonCSS.btn

		if (!_.isNil(props.color)) {
			cssToReturn += commonCSS[`btn${props.color}`];
		}else {
			cssToReturn += commonCSS.btnPrimary;
		}

		if (!_.isNil(props.large)) {
			cssToReturn += commonCSS.btnLarge;
		}

		return cssToReturn;
	}};
`;