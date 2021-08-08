import firebase from 'firebase';
import React from 'react';

export const SignOut = () => {
	firebase.auth().signOut();

	return (
		<div>
			<h1>Sign Out</h1>
		</div>
	);
};
