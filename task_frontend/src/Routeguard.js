import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const Routeguard = (props) => {
	let authStatus = localStorage.getItem('authStatus');

	if (authStatus === "true") {
		return (
			<Route path={props.dPath} component={props.dComponent} />
		)
	}
	else {
		return <Redirect to="/login" />
	}
}

export default Routeguard;