import { Button, Card, makeStyles } from '@material-ui/core';
import React from 'react';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import { setTask, pushTaskId } from '../../database/firestoreFunctions';

const useStyles = makeStyles((theme) => ({
	task: {
		margin: '4px',
		border: `1px dashed ${theme.palette.grey.A100}`,
	},
	button: {
		height: '100%',
		width: '100%',
		color: theme.palette.text.secondary,
		fontSize: '0.7rem',
	},
}));

export const AddTask = ({ data, columnId }) => {
	const classes = useStyles();

	const addTask = () => {
		// Get task id numbers as an array
		const taskIds = Object.keys(data.tasks).map((id) => Number(id.split('-')[1]));
		// Get next index available
		const nextIndex = taskIds.length ? Math.max(...taskIds) + 1 : 1;
		// Create task id
		const taskId = `task-${nextIndex}`;

		setTask(taskId, { id: taskId, content: 'Click to edit' });
		pushTaskId(columnId, taskId);
	};

	return (
		<Card className={classes.task} variant='outlined'>
			<Button
				className={classes.button}
				onClick={addTask}
				startIcon={<AddBoxRoundedIcon fontSize='large' />}
			>
				Add Task
			</Button>
		</Card>
	);
};
