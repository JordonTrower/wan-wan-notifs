import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Header from './Common/Header';
import Button from './Common/Button';

const Body = styled.div`
	display: flex;
	justify-content: center;
	width: 100vw;
`;

const InfoBox = styled.div`
	width: 90vw;
	> div {
		padding-top: 15px;
	}
`;

const MainText = styled.p`
	color: #0b132b;
	font-size: 24px;
`;

const SubText = styled.p`
	padding-left: 10px;
	color: #282f44;
	font-size: 18px;
`;
console.log(process.env.REACT_APP_API_HOME);
const Home = () => (
	<div>
		<Header>
			<h2>Wan-Wan!</h2>

			<Button
				onClick={() => {
					window.location = `${process.env.REACT_APP_API_HOME}/login`;
				}}
				large
			>
				Login!
			</Button>

			{/* <a
				className="button"
				href={`${process.env.REACT_APP_API_HOME}login`}
			>
				Login!
			</a> */}
		</Header>

		<Body>
			<InfoBox>
				<div>
					<MainText>What is Wan-Wan?</MainText>
					<SubText>
						Wan Wan is a real life recreation of
						&quot;Wuphf.com&quot; from the the show &quot;The
						Office&quot;.
					</SubText>
				</div>
				<div>
					<MainText>What can Wan-Wan do?</MainText>
					<SubText>
						As of now, Wan-Wan can detect for new posts from
						subscribed Twitter accounts or subreddit posts, and send
						you, the user, notifications through a mention on
						Twitter or an email.
					</SubText>
				</div>
				<div>
					<MainText>Warning!</MainText>
					<SubText>
						If you use this service, you are subjecting yourself to
						frequent emails and/or twitter mentions.
					</SubText>
					<SubText>
						As of recent, the Wan-Wan twitter bot has lost access to
						posts, but no worries as it can still read.
					</SubText>
				</div>
				<div>
					<MainText>Github Repo:</MainText>
					<SubText>
						https://github.com/jospooky/wan-wan-notifs
					</SubText>
				</div>
			</InfoBox>
		</Body>
	</div>
);

function mapStateToProps(state) {
	return { user: state.user };
}

export default connect(mapStateToProps)(Home);
