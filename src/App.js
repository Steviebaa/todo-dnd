import firebase from 'firebase';
import firebaseConfig from './config/firebase-config.json';
import { Component } from 'react';
import './App.css';
import { Columns } from './components/board/Columns';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { SignIn } from './components/views/SignIn';
import { SignOut } from './components/views/SignOut';
import { Profile } from './components/views/Profile';
import Navbar from './components/views/Navbar';
import * as db from './database/firestoreFunctions';
import { ThemeProvider, createTheme, Paper } from '@material-ui/core';

// INIT FIREBASE

firebase.initializeApp(firebaseConfig);

class App extends Component {
	constructor() {
		super();
		this.state = {
			data: {
				tasks: {},
				columns: {},
				columnOrder: [],
			},
			user: {
				firstName: '',
				lastName: '',
				theme: 'light',
			},
		};
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {

				db.watchProfile((data) => this.setState({ user: data }));
				db.watchBoard((data) => this.setState({ data: { ...this.state.data, ...data } }));
				db.watchColumns((data) =>
					this.setState({ data: { ...this.state.data, columns: { ...data } } })
				);
				db.watchTasks((data) =>
					this.setState({ data: { ...this.state.data, tasks: { ...data } } })
				);

				if (window.location.pathname === 'signin') {
					window.location.href = '/';
				}
			} else {
				if (window.location.pathname !== '/signin') {
					window.location.href = '/signin';
				}
			}
		});
	}

	render() {
		const theme = createTheme({ palette: { type: this.state.user.theme } });

		return (
			<ThemeProvider theme={theme}>
				<Paper className='App'>
					<Router>
						<Switch>
							<Route path='/signin'>
								<SignIn />
							</Route>
							<Route path='/signout'>
								<SignOut />
							</Route>
							<Route path='/profile'>
								<Navbar />
								<Profile user={this.state.user} />
							</Route>
							<Route path='/'>
								<Navbar />
								<h1>Board</h1>
								<Columns
									data={this.state.data}
									setData={(data) => this.setState({ data })}
								/>
							</Route>
						</Switch>
					</Router>
				</Paper>
			</ThemeProvider>
		);
	}
}

export default App;
