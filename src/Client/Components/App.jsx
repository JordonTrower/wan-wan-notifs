import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Routes from './Notify/routes';

const App = () => (
	<div>
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/notif/:id" component={Routes} />
			</Switch>
		</BrowserRouter>
	</div>
);

export default App;
