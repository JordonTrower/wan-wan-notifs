import {
	css
} from 'styled-components'

export default {
	row: css `
	display: flex;
	padding: 5px 0;
	`,

	flexColumn: css `
	display:flex;
	flex-direction: column;
	height: 100%;
	padding: 5px 0;
	`,

	btn: css `
		border: 1px solid transparent;
		font-weight: 400;
		font-size: 1rem;
		line-height: 1.5;
		border-radius: 0.25rem;
	`,

	btnPrimary: css `
		color: #fff;
		background-color: #007bff;
		border-color: #007bff;
	`,

	btnDanger: css `
		color: #fff;
		background-color: #C82333;
		border-color: #C82333;
	`,

	btnSuccess: css `
		color: #fff;
		background-color: #218838;
		border-color: #218838;
	`,

	sm: css `
	@media (max-width: 599px) {
		display: none;
	}
	`,

	md: css `
	@media (max-width: 900px) {
		display: none !important;
	}
	`,

	lg: css `
	@media (max-width: 1200px) {
		display: none;
	}
	`,

	xl: css `
	@media (max-width: 1800px) {
		display: none;
	}
	`,

	col12: css `
	width: 100%;
	padding: 10px 5px;
	`,

	col11: css `
	width: 91%;
	padding: 10px 5px;
	`,

	col10: css `
	width: 83%;
	padding: 10px 5px;
	`,

	col9: css `
	width: 75%;
	padding: 10px 5px;
	`,

	col8: css `
	width: 66%;
	padding: 10px 5px;
	`,

	col7: css `
	width: 58%;
	padding: 10px 5px;
	`,

	col6: css `
	width: 50%;
	padding: 10px 5px;
	`,

	col5: css `
	width: 42%;
	padding: 10px 5px;
	`,

	col4: css `
	width: 33%;
	padding: 10px 5px;
	`,

	col3: css `
	width: 25%;
	padding: 10px 5px;
	`,

	col2: css `
	width: 16%;
	padding: 10px 5px;
	`,

	col1: css `
	width: 8%;
	padding: 10px 5px;
	`,
}