import React from 'react';
import firebase from 'firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { Card, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	background: {
		backgroundImage: 'url(https://source.unsplash.com/featured/?abstract)',
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
}));

export const SignIn = () => {
	const classes = useStyles();

	// Configure firebaseui
	const uiConfig = {
		signInFlow: 'popup',
		signInSuccessUrl: '/',
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
		],
	};

	return (
		<div className={classes.background}>
			<Card>
				<h1>Sign In</h1>
				<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
			</Card>
		</div>
	);
};
