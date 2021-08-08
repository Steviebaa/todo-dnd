import firebase from 'firebase';

function getBoardRef() {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();
	const boards = db.collection('boards');
	const board = boards.doc(uid);

	return board;
}

export function watchProfile(setData) {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();
	const users = db.collection('users');
	const user = users.doc(uid);

	const stopUserListener = user.onSnapshot((doc) => {
		if (doc.data()) {
			// User profile exists
			setData(doc.data());
		} else {
			// User profile does NOT exist
			const displayName = firebase.auth().currentUser.displayName;
			setProfile({
				firstName: displayName,
				lastName: '',
				theme: 'light',
			});
		}
	});

	return stopUserListener;
}

export function setProfile(data) {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();
	const users = db.collection('users');
	const user = users.doc(uid);

	// Return the promise
	return user.set(data, { merge: true });
}

export function watchBoard(setData) {
	const board = getBoardRef();

	const stopBoardListener = board.onSnapshot((doc) => {
		if (doc.data()) {
			// Board exists
			setData(doc.data());
		} else {
			// Board does NOT exist
			setBoard({
				columnOrder: [],
			});
		}
	});

	return stopBoardListener;
}

export function setBoard(data) {
	const board = getBoardRef();

	// Return the promise
	return board.set(data, { merge: true });
}

export function setColumn(columnId, data) {
	const board = getBoardRef();
	const columns = board.collection('columns');
	const columnDoc = columns.doc(columnId);

	return columnDoc.set(data, { merge: true });
}

export function pushToColumnOrder(value) {
	const board = getBoardRef();

	return board.update({
		columnOrder: firebase.firestore.FieldValue.arrayUnion(value),
	});
}

export function popFromColumnOrder(value) {
	const board = getBoardRef();

	return board.update({
		columnOrder: firebase.firestore.FieldValue.arrayRemove(value),
	});
}

export function watchColumns(setData) {
	const board = getBoardRef();
	const columns = board.collection('columns');

	columns.onSnapshot((snapshot) => {
		const columnData = {};
		snapshot.forEach((doc) => {
			columnData[doc.id] = doc.data();
		});
		setData(columnData);
	});
}

export function deleteColumn(columnId) {
	const board = getBoardRef();
	const columns = board.collection('columns');
	const column = columns.doc(columnId);

	return column.delete();
}

export function deleteTasks(taskIds) {
	const board = getBoardRef();
	const tasks = board.collection('tasks');

	const db = firebase.firestore();
	const batch = db.batch();

	taskIds.forEach((taskId) => {
		const taskRef = tasks.doc(taskId);
		batch.delete(taskRef);
	});

	return batch.commit();
}

export function setTask(taskId, data) {
	const board = getBoardRef();
	const tasks = board.collection('tasks');
	const taskDoc = tasks.doc(taskId);

	return taskDoc.set(data, { merge: true });
}

export function pushTaskId(columnId, taskId) {
	const board = getBoardRef();
	const column = board.collection('columns').doc(columnId);

	return column.update({
		taskIds: firebase.firestore.FieldValue.arrayUnion(taskId),
	});
}

export function popTaskId(columnId, taskId) {
	const board = getBoardRef();
	const column = board.collection('columns').doc(columnId);

	return column.update({
		taskIds: firebase.firestore.FieldValue.arrayRemove(taskId),
	});
}

export function watchTasks(setData) {
	const board = getBoardRef();
	const tasks = board.collection('tasks');

	tasks.onSnapshot((snapshot) => {
		const taskData = {};
		snapshot.forEach((doc) => {
			taskData[doc.id] = doc.data();
		});
		setData(taskData);
	});
}
