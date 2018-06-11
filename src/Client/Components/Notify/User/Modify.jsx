import React, { Component } from 'react';
import styled from 'styled-components';
import InputGroup from '../../Common/InputGroup';
import commonCSS from '../../Common/CommonStyles';

const Body = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;

	> div {
		@media (min-width: 1250px) {
			width: 90%;
		}
		width: 100%;

		> div {
			padding-left: 45px;
			> div.button {
				width: 100%;
				display: flex;
				justify-content: flex-end;
				> button {
					margin-right: 25px;
					${commonCSS.btn};
					${commonCSS.btnPrimary};
				}
			}
		}
		> div.subscriptions {
			border-bottom: 1px black solid;
			padding-bottom: 20px;
		}
	}
`;

class Modify extends Component {
	constructor() {
		super();

		this.state = {
			subscriptions: [{ id: 0 }]
		};

		this.updateSubscription = this.updateSubscription.bind(this);
		this.addSubscription = this.addSubscription.bind(this);
	}

	addSubscription() {
		const subs = Object.assign([], this.state.subscriptions);

		subs.push({
			id: subs.length,
			site: '',
			url: ''
		});

		this.setState({
			subscriptions: subs
		});
	}

	updateSubscription(e) {
		const subIndex = e.target.id.replace(/[^0-9]/g, '');

		const subs = Object.assign([], this.state.subscriptions);

		subs[subIndex].site = e.target.value;

		this.setState({
			subscriptions: subs
		});
	}

	render() {
		return (
			<Body>
				<div>
					<div className="subscriptions">
						<h1>Subscriptions</h1>
						{this.state.subscriptions.map(subscription => (
							<InputGroup
								key={`input-group-sub-${subscription.id}`}
							>
								<div className="inputGroupPrependContainer">
									<select
										name="subscription"
										id={`sub-select-${subscription.id}`}
										className="inputGroupPrepend"
										subid={subscription.id}
										value={subscription.site}
										onChange={this.updateSubscription}
									>
										<option value="">Site Name</option>
										<option value="twitter">Twitter</option>
										<option value="aaa">aaa</option>
									</select>
								</div>

								<input
									type="text"
									className="input searchBar"
								/>
							</InputGroup>
						))}
						<div className="button">
							<button onClick={this.addSubscription}>
								Add subscription
							</button>
						</div>
					</div>
				</div>
			</Body>
		);
	}
}

export default Modify;
