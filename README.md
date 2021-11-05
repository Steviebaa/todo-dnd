# Drag and Drop Todo App

## Try it out
https://task-flip.vercel.app/

## Description

This guide will walk you through creating a drag-and-drop todo web-app. The App will use the following:

-   ReactJS
-   Firebase for user auth and data storage
-   The `react-beautiful-dnd` package
-   Material-UI

## Setup

Before starting, create a React project :`npx create-react-app PROJECT_NAME`.

Strip out any unwanted files from the template and thats it. Let's get going.

## Steps

### 1. Create `initial-data.js`

File: `initial-data.js`

```javascript
const initialData = {
	tasks: {
		'task-1': { id: 'task-1', content: 'Take out the garbage' },
		'task-2': { id: 'task-2', content: 'Watch climbing' },
		'task-3': { id: 'task-3', content: 'Charge phone' },
		'task-4': { id: 'task-4', content: 'Cook dinner' },
	},
	columns: {
		'column-1': {
			id: 'column-1',
			title: 'To do',
			taskIds: ['task-1', 'task-2', 'task-3'],
		},
		'column-2': {
			id: 'column-2',
			title: 'Doing',
			taskIds: ['task-4'],
		},
	},
	columnOrder: ['column-1', 'column-2'],
};

export default initialData;
```

---

### 2. Convert `App.js` to a class component

Provide contents of `initial-data.js` to state.

File: `App.js`

```javascript
class App extends Component {
	constructor() {
		super();
		this.state = initialData;
	}

	render() {
		return (
			<div className='App'>
				<h1>App</h1>
			</div>
		);
	}
}

export default App;
```

---

### 3. Create `Column.jsx` component

File: `Column.jsx`

```javascript
import React from 'react';

const Column = ({ column, tasks }) => {
	return <div>{column.title}</div>;
};

export default Column;
```

---

### 4. Create `Columns.jsx` component

File: `Columns.jsx`

Apply `display: flex` to make columns display across the page.

```javascript
import { Container, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	columns: {
		display: 'flex',
		overflow: 'auto',
	},
}));

export const Columns = ({ data, setData }) => {
	const classes = useStyles();

	return <Container className={classes.columns}>Columns will go here...</Container>;
};
```

---

### 5. Create array of column components

File: `Columns.jsx`

```javascript
// Create columns
const columns = this.state.columnOrder.map((columnId) => {
	const column = this.state.columns[columnId];
	const tasks = column.taskIds.map((taskId) => this.state.tasks[taskId]);

	return <Column key={column.id} column={column} tasks={tasks} />;
});
```

---

### 6. Render `columns` array as a child of `Columns` component

File: `Columns.jsx`

```javascript
return <Container className={classes.columns}>Columns will go here...</Container>;
```

---

### 7. Install `material-ui`

`npm i @material-ui/core`

---

### 8. Give the `Column` component some style

File: `Column.jsx`

```javascript
import { Card, Container, Divider, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	column: {
		display: 'flex',
		flexDirection: 'column',
		margin: '8px',
		minWidth: '200px',
		width: '200px',
	},
	title: {
		margin: '4px',
	},
	tasksContainer: {
		padding: 0,
	},
}));

const Column = ({ column, tasks }) => {
	const classes = useStyles();

	return (
		<Card className={classes.column} variant='outlined'>
			{/* COLUMN TITLE */}
			<Typography className={classes.title} variant='h5'>
				{column.title}
			</Typography>
			<Divider />
			{/* TASK LIST */}
			<Container className={classes.tasksContainer}>Tasks will go here...</Container>
		</Card>
	);
};

export default Column;
```

---

### 9. Make a `Task` component

File: `Task.jsx`

```javascript
import { Card, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	card: {
		margin: '4px',
		padding: '4px',
		flexGrow: 1,
	},
}));

export const Task = ({ task }) => {
	const classes = useStyles();

	return (
		<Card className={classes.card} variant='outlined'>
			{task.content}
		</Card>
	);
};
```

---

### 10. Update `Column` component

File: `Column.jsx`

Change the tasks container to render Task components.

```javascript
<Container>
	{tasks.map((task) => (
		<Task key={task.id} task={task} />
	))}
</Container>
```

---

### 11. Install `react-beautiful-dnd`

`npm i react-beautiful-dnd`

---

### 12. Wrap `Columns` component in `DragDropContext`

File: `Columns.jsx`

The component should now return the following.

```javascript
<DragDropContext>
	<Container className={classes.columns}>{columns}</Container>
</DragDropContext>
```

---

### 13. Add `onDragEnd` callback

File: `Columns.jsx`

Create a new function after the create columns map.

```javascript
onDragEnd = (result) => {};
```

Add method to `DragDropContext`

```javascript
<DragDropContext onDragEnd={this.onDragEnd}>...</DragDropContext>
```

---

### 14. Wrap Task List `Container` in a `Droppable` component

File: `Column.jsx`

```javascript
import { Droppable } from 'react-beautiful-dnd';
```

```javascript
{
	/* TASK LIST */
}
<Droppable droppableId={column.id}>
	{(provided) => (
		<Container
			className={classes.tasksContainer}
			innerRef={provided.innerRef}
			{...provided.droppableProps}
		>
			{tasks.map((task, i) => (
				<Task key={task.id} task={task} index={i} />
			))}
			{provided.placeholder}
		</Container>
	)}
</Droppable>;
```

A couple of things going on here:

-   We used the index argument and passed it down in the `map` method. We need a unique index for the Task in the next step.
-   `Droppable` has one required prop: `droppableId={column.id}` which must be unique.
-   `Droppable` expects it's child to be a function.
-   The first argument is called `provided` which has a few purposes:
    -   It has a property called `droppableProps` which need to be applied to the drop zone component. We can use the spread operator to do this with hardly any code `{...provided.droppableProps}`.
    -   It has a property called `innerRef`. A function used to supply the DOM node of the component to RBDND. A styled component has a callback prop called `innerRef` which returns the DOM node of the component. Assign this function to this prop.
    -   Add the `provided.placeholder`. It is a react element that increases the available space in a droppable, during a drag when needed. It should be a child of the drop zone component.

---

### 15. Wrap the `Task` component in a `Draggable` component

File: `Task.js`

```javascript
<Draggable draggableId={task.id} index={index}>
	{(provided) => (
		<Card
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			innerRef={provided.innerRef}
			className={classes.card}
			variant='outlined'
		>
			{task.content}
		</Card>
	)}
</Draggable>
```

More things going on here:

-   `Draggable` has two required props
    -   `draggableId={task.id}` which must be unique.
    -   `index={index}` which must be unique. We passed this down in the last step.
-   `Draggable` also expects it's child to be a function.
-   The first argument is called `provided` which has a few purposes:
    -   It has a property called `draggableProps` which need to be applied to the component that we want to move around. Use the spread operator again.
    -   and `dragHandleProps` apply this to a component that should be used to drag the draggable component, the entire component is good for us. Use the spread operator.
    -   Do the same with `innerRef` from the last step.
    -

---

### 16. We can now drag items

Except they don't stay where they should.

We can use the `onDragEnd` function to fix this.

The `result` parameter of `onDragEnd` looks something like this:

```json
{
	"draggableId": "task-1",
	"type": "DEFAULT",
	"source": {
		"index": 0,
		"droppableId": "column-1"
	},
	"reason": "DROP",
	"mode": "FLUID",
	"destination": {
		"droppableId": "column-1",
		"index": 1
	},
	"combine": null
}
```

If the user drops outside of a `Droppable` then the destination will be `null`.

---

### 17. Check whether the list should be rearranged

File: `Columns.jsx`

```javascript
const onDragEnd = (result) => {
	// Destructure properties
	const { destination, source, draggableId } = result;

	// Return if there is no destination
	if (!destination) {
		return;
	}

	// Return if dropped where it came from
	if (destination.droppableId === source.droppableId && destination.index === source.index) {
		return;
	}
};
```

---

### 18. Update state on change

After applying this, DND will only persist when dragging and dropping in the same column.

File: `Columns.jsx`

```javascript
const onDragEnd = (result) => {
	// Destructure properties
	const { destination, source, draggableId } = result;

	// Return if there is no destination
	if (!destination) {
		return;
	}

	// Return if dropped where it came from
	if (destination.droppableId === source.droppableId && destination.index === source.index) {
		return;
	}

	// Get start and end columns
	const startColumn = data.columns[source.droppableId];
	const endColumn = data.columns[destination.droppableId];

	// When dropping items in the same column
	if (startColumn === endColumn) {
		// Create a clone of the columns taskIds
		const newTaskIds = Array.from(startColumn.taskIds);
		// Move task ID from old index to new index
		// splice, from source.index, remove 1 element
		newTaskIds.splice(source.index, 1);
		// splice, from destination.index, remove no elements and insert draggableId
		newTaskIds.splice(destination.index, 0, draggableId);

		// Create new column
		const newColumn = {
			...startColumn,
			taskIds: newTaskIds,
		};

		// Create new state
		const newState = {
			...data,
			columns: {
				...data.columns,
				[newColumn.id]: newColumn,
			},
		};

		// Apply new state
		setData(newState);
	}
};
```

---

### 19. Add support for cross column

Using a similar method, add an `else` to the `if` in the last step and add the following logic.

File: `Columns.jsx`

```javascript
else {
	// Columns are different

	// Source column changes
	const startTaskIds = Array.from(startColumn.taskIds);
	startTaskIds.splice(source.index, 1);
	const newStartColumn = {
		...startColumn,
		taskIds: startTaskIds,
	};

	// Destination column changes
	const endTaskIds = Array.from(endColumn.taskIds);
	endTaskIds.splice(destination.index, 0, draggableId);
	const newEndColumn = {
		...endColumn,
		taskIds: endTaskIds,
	};

	// Create new state
	const newState = {
		...data,
		columns: {
			...data.columns,
			[newStartColumn.id]: newStartColumn,
			[newEndColumn.id]: newEndColumn,
		},
	};

	// Update state
	setData(newState);
}
```

---

### 20. Install `@material-ui-icons`

`npm i @material-ui-icons`

---

### 21. Create AddColumn component

File: `AddColumn.js`

```javascript
import { Button, Card, makeStyles } from '@material-ui/core';
import React from 'react';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';

const useStyles = makeStyles((theme) => ({
	column: {
		display: 'flex',
		flexDirection: 'column',
		margin: '8px',
		minWidth: '200px',
		width: '200px',
		border: `1px dashed ${theme.palette.grey.A100}`,
	},
	button: {
		color: theme.palette.text.secondary,
		height: '100%',
		fontSize: '2rem',
	},
}));

const AddColumn = () => {
	const classes = useStyles();

	return (
		<Card className={classes.column} variant='outlined'>
			<Button className={classes.button}>
				<AddBoxRoundedIcon fontSize='large' />
			</Button>
		</Card>
	);
};

export default AddColumn;
```

---

### 22. Push `AddColumn` component to columns

File: `Columns.js`

Just after the create columns map.

```javascript
// Add create new board
columns.push(<AddColumn key='add-column' />);
```

---

### 23. Create `addColumn` function

In `Columns.jsx` pass `data` and `setData` as params to `AddColumn`.

File: `AddColumn.jsx`

Destructure above props at the top of the file.

Add `onClick={addColumn}` to the `Button` component in the return.

Then create the addColumn function.

```javascript
const addColumn = () => {
	// Get current column id numbers as an array
	// i.e ["column-1", "column-2"] becomes [1, 2]
	const columnIds = Object.keys(data.columns).map((id) => Number(id.split('-')[1]));
	// Get next index available and create next key from that
	const nextIndex = Math.max(...columnIds) + 1;
	const nextKey = `column-${nextIndex}`;

	// Create new columns object
	const columns = {
		...data.columns,
		[nextKey]: {
			id: nextKey,
			title: 'New Column',
			taskIds: [],
		},
	};

	// Add to columns order
	const columnOrder = Array.from(data.columnOrder);
	columnOrder.push(nextKey);

	// Create and update next data in state
	const nextData = { ...data, columns, columnOrder };
	setData(nextData);
};
```

We still can't drag items to new columns... this is because the tasks container has no height. Add `height: '100%'` style to the taskContainer class.

---

### 24. Add capability for reordering of Columns

File: `Columns.jsx`

Turn the returned container into a `Droppable`

```javascript
return (
	<DragDropContext onDragEnd={onDragEnd}>
		<Droppable droppableId='all-columns' direction='horizontal' type='column'>
			{(provided) => (
				<Container
					className={classes.columns}
					{...provided.droppableProps}
					innerRef={provided.innerRef}
				>
					{columns}
					{provided.placeholder}
				</Container>;
			)}
		</Droppable>
	</DragDropContext>
);
```

---

### 25. Pass index down to `Column` component

File: `Columns.jsx`

```javascript
// Create columns
const columns = data.columnOrder.map((columnId, i) => {
	const column = data.columns[columnId];
	const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

	return <Column key={column.id} column={column} tasks={tasks} index={i} />;
});
```

---

### 26. Convert `Column` to a `Draggable`

File: `Column.jsx`

Add the `provider.dragHandleProps` to the column title.

Also add `type='task'` to the task `Droppable` to provide the `onDragEnd` function with more context.

```javascript
<Draggable draggableId={column.id} index={index}>
	{(provider) => (
		<Card
			className={classes.column}
			variant='outlined'
			{...provider.draggableProps}
			innerRef={provider.innerRef}
		>
			{/* COLUMN TITLE */}
			<Typography className={classes.title} variant='h5' {...provider.dragHandleProps}>
				{column.title}
			</Typography>
			<Divider />
			{/* TASK LIST */}
			<Droppable droppableId={column.id} type='task'>
				{(provided) => (
					<Container
						className={classes.tasksContainer}
						innerRef={provided.innerRef}
						{...provided.droppableProps}
					>
						{tasks.map((task, i) => (
							<Task key={task.id} task={task} index={i} />
						))}
						{provided.placeholder}
					</Container>
				)}
			</Droppable>
		</Card>
	)}
</Draggable>
```

---

### 27. Add the logic to handle the column reorder

File: `Columns.jsx`

Just after the checks to return in `onDragEnd()`

```javascript
// Handle column rearrange
if (type === 'column') {
	// Create new column order
	const newColumnOrder = Array.from(data.columnOrder);
	newColumnOrder.splice(source.index, 1);
	newColumnOrder.splice(destination.index, 0, draggableId);

	// Create and update new data object
	const newState = {
		...data,
		columnOrder: newColumnOrder,
	};
	setData(newState);
	return;
}

// Handle task rearrange:
// ...
```

---

### 28. Hide the `AddColumn` component when dragging

A good oportunity to use the `React.useState()` hook.

File: `Columns.jsx`

Just under the classes hook at the top, add some state.

```javascript
const [isDragging, setIsDragging] = React.useState(false);
```

Just inside the top of the `onDragEnd` function, set the state to `false`.

```javascript
setIsDragging(false);
```

Add the `onDragStart` property to the `DragDropContext`. Provide a function which when invoked, will set `isDragging` to `true`.

```javascript
onDragStart={() => setIsDragging(true)}
```

Now conditionally render the `AddColumn` component.

```javascript
if (!isDragging) {
	columns.push(<AddColumn key='add-column' data={data} setData={setData} />);
}
```

---

### 29. Change `Column` title to `TextField` on click

File: `Column.jsx`

Add some hooks just under the classes hook:

-   Use the `title`hook to track the current value of the `TextField`.
-   Use the `editTitleMode` hook to track whether editing mode.

```javascript
const [title, setTitle] = React.useState(column.title);
const [editTitleMode, setEditTitleMode] = React.useState(false);
```

Create two functions. One to handle when the title is clicked. The other to handle when the `TextField` loses focus.

```javascript
const onTitleClick = () => setEditTitleMode(true);
const textFieldLostFocus = () => setEditTitleMode(false);
```

-   Add `onClick={onTitleClick}` to the `Typography` title element.
-   Add a `TextField` which uses the `onBlur` event to call `textFieldLostFocus` - this is what `onBlur` means.
-   Set its `value`prop to the `title` hook.
-   Also, tap into the `inputProps` of the `TextField` to center the text if you like.
-   `classes.textField` provides the TextField with `margin: '4px'`.
-   Add `{...provider.dragHandleProps}` just to suppress errors. It won't actually work and we don't want it to in edit mode anyway.

```javascript
<TextField
	autoFocus
	className={classes.textField}
	onBlur={textFieldLostFocus}
	inputProps={{ style: { textAlign: 'center' } }}
	value={title}
	{...provider.dragHandleProps}
/>
```

Now conditionally render the `Typography` or the `TextField` component depending on the `editTitleMode` hook. Ternary operator is perfect for this.

```javascript
{
	/* COLUMN TITLE */
}
{
	editTitleMode ? (
		<TextField
			autoFocus
			className={classes.textField}
			onBlur={textFieldLostFocus}
			inputProps={{ style: { textAlign: 'center' } }}
			value={title}
			{...provider.dragHandleProps}
		/>
	) : (
		<Typography
			className={classes.title}
			onClick={onTitleClick}
			variant='h5'
			{...provider.dragHandleProps}
		>
			{column.title}
		</Typography>
	);
}
```

---

### 30. Add an `onInput` event to the `TextField`

File: `Column.jsx`

Add this with our other event handlers

```javascript
const onInput = (e) => setTitle(e.target.value);
```

Then provide it to TextField as a property.

```javascript
onInput = { onInput };
```

---

### 31. Fix `textFieldLostFocus` to persist changes

File: `Column.jsx`

Check if the value actually changed to avoid wasteful calls to the database later.

```javascript
const textFieldLostFocus = () => {
	setEditTitleMode(false);

	// Update data with new title
	if (title !== column.title) {
		const newState = { ...data };
		newState.columns[column.id].title = title;
		setData(newState);
	}
};
```

---

### 32. Make delete function for the `Column`

File: `Column.jsx`

Inside the `TextField`, let's add a delete button as an end adornment. Provide the following property to `TextField`. Import `IconButton` from `@material-ui/core`.

```javascript
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';

...

InputProps={{
	endAdornment: (
		<IconButton onClick={onDeleteClicked} aria-label='delete'>
			<DeleteRoundedIcon fontSize='small' />
		</IconButton>
	),
}}
```

Then create the `onDeleteClicked()` function.

```javascript
const onDeleteClicked = () => {
	if (window.confirm(`Deleting "${column.title}" will also remove all the Tasks inside of it.`)) {
		// Remove from columnOrder
		const columnOrder = Array.from(data.columnOrder);
		const index = columnOrder.indexOf(column.id);
		columnOrder.splice(index, 1);

		// Remove tasks
		const tasks = { ...data.tasks };
		data.columns[column.id].taskIds.forEach((taskId) => {
			delete tasks[taskId];
		});

		// Remove column
		const columns = { ...data.columns };
		delete columns[column.id];

		// Create and set new data object
		const newState = {
			columnOrder,
			tasks,
			columns,
		};
		setData(newState);
	}
};
```

---

### 33. Create an `AddTask` component

File: `AddTask.jsx`

This will be similar to `AddColumn` except it will sit below all tasks.

```javascript
import { Button, Card, makeStyles } from '@material-ui/core';
import React from 'react';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';

const useStyles = makeStyles((theme) => ({
	task: {
		margin: '4px',
		flexGrow: 1,
		border: `1px dashed ${theme.palette.grey.A100}`,
	},
	button: {
		color: theme.palette.text.secondary,
		height: '100%',
		fontSize: '0.7rem',
	},
}));

const AddTask = ({ data, setData }) => {
	const classes = useStyles();

	return (
		<Card className={classes.task} variant='outlined'>
			<Button
				size='small'
				startIcon={<AddBoxRoundedIcon fontSize='small' />}
				fullWidth
				className={classes.button}
			>
				Add Task
			</Button>
		</Card>
	);
};

export default AddTask;
```

---

### 34. Provide `AddTask` as a child to task list

File: `Column.jsx`

Create the list of `taskCards` outside of (just before) the return statement. Then provide `{taskCards}` inside of the task list container instead of mapping directly inline.

```javascript
const taskCards = tasks.map((task, i) => <Task key={task.id} task={task} index={i} />);
taskCards.push(<AddTask key='add-task' data={data} setData={setData} columnId={column.id} />);
```

---

### 35. Now provide the `onClick` functionality

File: `AddTask.jsx`

Add `onClick={addTask}` to the `Button` component.

Create the `addTask` function.

```javascript
const addTask = () => {
	// Get current task id numbers as an array
	// i.e ["task-1", "task-2"] becomes [1, 2]
	const taskIds = Object.keys(data.tasks).map((id) => Number(id.split('-')[1]));
	// Get next index available and create next key from that
	const nextIndex = Math.max(...taskIds) + 1;
	const taskId = `task-${nextIndex}`;

	// Create new tasks object
	const tasks = { ...data.tasks };
	tasks[taskId] = { id: taskId, content: 'Click to edit' };

	// Create new columns object
	const columns = { ...data.columns };
	columns[columnId].taskIds.push(taskId);

	// Create and set new state
	const newState = { ...data, columns, tasks };
	setData(newState);
};
```

---

### 36. Conditionally render the `AddTask` component

Similar to before, when dragging the tasks we sometimes get an overlapping issue. This will be a quick fix because we already have our `isDragging` state.

File: `Columns.jsx`

Pass `isDragging` down to the the column component.

```javascript
<Column
	key={column.id}
	column={column}
	tasks={tasks}
	index={i}
	data={data}
	setData={setData}
	isDragging={isDragging}
/>
```

File: `Column.jsx`

Destructure `isDragging` from the props at the top and conditionally render the `AddTask` component.

```javascript
if (!isDragging) {
	taskCards.push(<AddTask key='add-task' data={data} setData={setData} columnId={column.id} />);
}
```

---

### 37. Make task editable

Use the same method we used to change the `Column` title.

File: `Task.jsx`

Add some hooks and handler functions.

```javascript
const [content, setContent] = React.useState(task.content);
const [editContentMode, setEditContentMode] = React.useState(false);

const onContentClick = () => setEditContentMode(true);
const textFieldLostFocus = () => setEditContentMode(false);
```

Add `onClick={onContentClick}` to `Card`.

Change contents of card to conditionally render a `TextField`.

```javascript
{
	editContentMode ? (
		<TextField
			autoFocus
			multiline
			onBlur={textFieldLostFocus}
			inputProps={{ style: { textAlign: 'center' } }}
			value={content}
		/>
	) : (
		<Typography onClick={onContentClick}>{task.content}</Typography>
	);
}
```

We can now switch into edit mode by clicking.

Add `onInput` to the `TextField` to update the state.

```javascript
onInput={(e) => setContent(e.target.value)}
```

Go back to `Column.jsx` and pass `data={data}` and `setData={setData}` props down to the `Task` component.

Now in `Task`, update `textFieldLostFocus` to submit the changes.

```javascript
const textFieldLostFocus = () => {
	setEditContentMode(false);

	if (content !== task.content) {
		const newState = { ...data };
		newState.tasks[task.id].content = content;
		setData(newState);
	}
};
```

You can now edit the task data and see how the `multiline` attribute works on the `TextField`.

---

### 38. Highlight `TextField` contents when clicked (optional)

File: `Task.jsx`

Add this attribute and function to the `TextField` if you want the contents to be highlighted on select. Add it to the `Column` title `TextField` too if you like.

```javascript
onFocus={(e) => e.target.select()}
```

---

### 39. Add delete button to `Task`

File: `Task.jsx`

Change the `TextField` to include a `Button`.

```javascript
<React.Fragment>
	<TextField
		autoFocus
		multiline
		onBlur={textFieldLostFocus}
		inputProps={{ style: { textAlign: 'center' } }}
		value={content}
		onInput={(e) => setContent(e.target.value)}
		onFocus={(e) => e.target.select()}
	/>

	<Button
		onClick={deleteTaskClicked}
		variant='outlined'
		color='secondary'
		className={classes.button}
	>
		<DeleteRoundedIcon fontSize='inherit' />
	</Button>
</React.Fragment>
```

---

### 40. Add delete function to `Task`

File: `Column.jsx`

Pass `columnId` down to `Task` as a prop.

```javascript
columnId={column.id}
```

File: `Task.jsx`

```javascript
const deleteTaskClicked = () => {
	// Don't run if canceled.
	if (!window.confirm('Delete task?')) return;

	// Get new taskList for column
	const taskIds = data.columns[columnId].taskIds.filter((id) => id !== task.id);

	// Create new columns
	const columns = { ...data.columns };
	columns[columnId].taskIds = taskIds;

	// Create new tasks
	const tasks = { ...data.tasks };
	delete tasks[task.id];

	// Create and set new state
	const newState = { ...data, tasks, columns };
	setData(newState);
};
```

There seems to be a bit of a bug sometimes when clicking delete. This is a tricky one. The issue is that `onBlur` is firing before `onClick` of the delete button. Instead, attach the `textFieldLostFocus` function to the `Card`'s `onBlur`. Then we can check the event (`e`) to see if the clicked element (`relatedTarget`) is inside of the `Card` element (`currentTarget`). If it is, then don't close editing mode.

```javascript
const textFieldLostFocus = (e) => {
	if (!e.currentTarget.contains(e.relatedTarget)) {
		...
	}
};
```

The drag and drop should now be fully functional!

---

### 42. Set up some routes

Install `react-router-dom`

```
npm install react-router-dom
```

File: `App.js`

```javascript
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// ...

render() {
	return (
		<div className='App'>
			<Router>
				<Switch>
					<Route path='/signin'>
						<h1>Sign In</h1>
					</Route>
					<Route path='/signout'>
						<h1>Sign Out</h1>
					</Route>
					<Route path='/profile'>
						<h1>Profile</h1>
					</Route>
					<Route path='/'>
						<h1>Board</h1>
						<Columns
							data={this.state.data}
							setData={(data) => this.setState({ data })}
						/>
					</Route>
				</Switch>
			</Router>
		</div>
	);
}
```

---

### 43. Create `SignIn` view component

File: `SignIn.jsx`

Simulate a signin with a button.

```javascript
import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function SignIn() {
	const history = useHistory();

	const redirectToHome = () => {
		history.push('/');
	};

	return (
		<div>
			<h1>Sign In</h1>
			<Button onClick={redirectToHome} variant='contained' color='primary'>
				Sign In
			</Button>
		</div>
	);
}
```

Now add the component to the route.

File: `App.js`

```javascript
<Route path='/signin'>
	<SignIn />
</Route>
```

---

### 44. Create `SignOut` view component

File: `SignOut.jsx`

Simulate a signout with a timeout.

```javascript
import { Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function SignOut() {
	const history = useHistory();

	const redirectToSignIn = () => {
		history.push('/signin');
	};

	setTimeout(() => {
		redirectToSignIn();
	}, 3000);

	return (
		<div>
			<h1>Sign Out</h1>
			<Typography>Redirecting in 3 seconds...</Typography>
		</div>
	);
}
```

Now add the component to the route.

File: `App.js`

```javascript
<Route path='/signout'>
	<SignOut />
</Route>
```

---

### 45. Create a `Profile` view component

File: `Profile.jsx`

Provide a `Button` that will redirect to `/signout`

```javascript
import { Button, Card, Container, makeStyles } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';

export const Profile = () => {
	const history = useHistory();

	return (
		<Container maxWidth='sm'>
			<h1>Profile</h1>
			<br />
			<Card>Profile Info</Card>
			<br />
			<Button
				fullWidth
				onClick={() => history.push('/signout')}
				variant='outlined'
				color='secondary'
			>
				Sign Out
			</Button>
		</Container>
	);
};
```

Now add the component to the route.

File: `App.js`

```javascript
<Route path='/profile'>
	<Profile />
</Route>
```

---

### 46. Create a `Navbar` component

File: `Navbar.jsx`

It should get us between the Board and the Profile.

The following was taken from https://material-ui.com/components/app-bar/#app-bar-with-a-primary-search-field and simplified.

```javascript
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	logo: {
		width: '25px',
		marginRight: '12px',
	},
}));

export default function Navbar() {
	const classes = useStyles();
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<MenuItem>
				<IconButton color='inherit'>
					<DashboardRoundedIcon />
				</IconButton>
				<p>Board</p>
			</MenuItem>
			<MenuItem>
				<IconButton color='inherit'>
					<AccountCircle />
				</IconButton>
				<p>Profile</p>
			</MenuItem>
		</Menu>
	);

	return (
		<div className={classes.grow}>
			<AppBar position='static'>
				<Toolbar>
					<img
						alt='logo'
						className={classes.logo}
						src={process.env.PUBLIC_URL + '/logo192.png'}
					/>
					<Typography variant='h6' noWrap>
						TaskFlip
					</Typography>
					<div className={classes.grow} />
					<div className={classes.sectionDesktop}>
						<IconButton color='inherit'>
							<DashboardRoundedIcon />
						</IconButton>
						<IconButton edge='end' color='inherit'>
							<AccountCircle />
						</IconButton>
					</div>
					<div className={classes.sectionMobile}>
						<IconButton onClick={handleMobileMenuOpen} color='inherit'>
							<MoreIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			{renderMobileMenu}
		</div>
	);
}
```

---

### 47. Add Navbar to top of `/` and `/profile` routes

File: `App.js`

```javascript
<Switch>
	//...
	<Route path='/profile'>
		<Navbar />
		<Profile />
	</Route>
	<Route path='/'>
		<Navbar />
		<h1>Board</h1>
		<Columns data={this.state.data} setData={(data) => this.setState({ data })} />
	</Route>
</Switch>
```

---

### 48. Add `Link` components to `Navbar` `IconButton`

File: `Navbar.jsx`

```javascript
import { useHistory } from 'react-router-dom';

//...

const history = useHistory();

//...

const toProfile = () => history.push('/profile');
const toBoard = () => history.push('/');
```

Now add `onClick={toBoard}` (or `toProfile`) to each `IconButton`. Don't forget the ones for mobile view.

You should be able to completely get around the App now.

---

### 49. Add some dummy user data to the state

File: `App.js`

```javascript
this.state = {
	data: initialData,
	user: {
		firstName: 'Steve',
		lastName: 'Richardson',
		theme: 'light',
	},
};
```

Pass this down as a prop to `Profile`.

```javascript
<Profile user={this.state.user} />
```

---

### 50. Display user information in `Profile`

File: `Profile.jsx`

Create a style for `Card`.

```javascript
const useStyles = makeStyles(() => ({
	card: {
		display: 'flex',
		flexDirection: 'column',
		padding: '24px',
	},
}));
```

Change contents of `Card`.

```javascript
<Card className={classes.card}>
	<TextField label='First Name' />
	<br />
	<TextField label='Last Name' />
	<br />
	<FormControl>
		<InputLabel id='theme-select-label'>Theme</InputLabel>
		<Select labelId='theme-select-label'>
			<MenuItem value='light'>Light</MenuItem>
			<MenuItem value='dark'>Dark</MenuItem>
		</Select>
	</FormControl>
	<br />
	<Button fullWidth onClick={handleSave} variant='outlined' color='primary'>
		Save
	</Button>
</Card>
```

Create the `handleSave` function.

```javascript
const handleSave = () => {
	console.log('Save profile');
};
```

---

### 51. Create some hooks for user data

File: `Profile.jsx`

These hooks don't represent the actual values, only what is currently being displayed and edited in the `Profile` component.

```javascript
const [first, setFirst] = React.useState(user.firstName);
const [last, setLast] = React.useState(user.lastName);
const [theme, setTheme] = React.useState(user.theme);
```

Add the values to the fields.

```javascript
<TextField value={first} /*...*/ />;
<TextField value={last} /*...*/ />;
<Select value={theme} /*...*/ />;
```

Connect the update functions for the hooks.

```javascript
<TextField onInput={(e) => setFirst(e.target.value)} /*...*/ />;
<TextField onInput={(e) => setLast(e.target.value)} /*...*/ />;
<Select onChange={(e) => setTheme(e.target.value)} /*...*/ />;
```

If you recieve this error:

> Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Transition which is inside StrictMode. Instead, add a ref directly to the element you want to reference.

This is because of the Select component.

This should be fixed in Material-UI v5.

A workaround to surpress it is to remove the `<React.StrictMode>` wrapper around `App` in `index.js`

---

### 52. Create a Firebase DB and init Auth and Firestore

Install package: `npm i firebase`

In the firebase console:

1. Go to project settings
2. Click Add App and add a Web App
3. Copy config object it will look similar to this:

```json
{
	"apiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
	"authDomain": "react-project-xxxxx.firebaseapp.com",
	"projectId": "react-project-xxxxx",
	"storageBucket": "react-project-xxxxx.appspot.com",
	"messagingSenderId": "1081345203786",
	"appId": "1:1081769903786:web:a44e72ce498hf09989f32d3",
};
```

4. Paste it in a file src/config/firebase.config.json

File: `App.jsx`

```javascript
import firebase from 'firebase';
import firebaseConfig from './config/firebase.config.json';
// ...

// Init firebase
firebase.initializeApp(firebaseConfig);

// class App extends...
```

---

### 53. Add `react-firebaseui`

`npm i react-firebaseui`

---

### 54. Add `StyledFirebaseAuth` component to `SignIn`

File: `SignIn.jsx`

```javascript
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { makeStyles, Card } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	background: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundImage: 'url(https://source.unsplash.com/featured/?abstract)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		height: '100vh',
	},
}));

export default function SignIn() {
	const classes = useStyles();

	// Configure FirebaseUI.
	const uiConfig = {
		// Popup signin flow rather than redirect flow.
		signInFlow: 'popup',
		// Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
		signInSuccessUrl: '/',
		// We will display Google and Facebook as auth providers.
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
}
```

---

### 55. Add event listener in `App`

File: `App.js`

Add the `componentDidMount` method and write the logic of how to handle auth changing.

Go to the firebase console, in the Auth section turn on google auth and email auth. Then test the `console.log` is working as expected.

```javascript
firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		console.log('user signed in');
		// Get user profile from firestore

		// Set listener on user profile, if its empty, create it.

		// Set listener on board data, if none, init it.

		// Redirect to /
		if (window.location.pathname === '/signin') {
			window.location.href = '/';
		}
	} else {
		console.log('no user');

		// Redirect to Sign In page
		if (window.location.pathname !== '/signin') {
			window.location.href = '/signin';
		}
	}
});
```

---

### 56. Create a `watchProfile` function

File: `src/database/firestoreFunctions.js`

```javascript
export function watchProfile() {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();
	const users = db.collection('users');
	const user = users.doc(uid);

	const stopUserListener = user.onSnapshot((doc) => {
		if (doc.data()) {
			// User profile exists
			console.log('profile exists');
			console.log(doc.data());
		} else {
			// User profile doesn't exist
			console.log('profile does not exist');
		}
	});

	/* 
	stopUserListener is a function that will stop the listener if invoked.
	Return it incase you want to be able to stop the listener later.
	*/
	return stopUserListener;
}
```

Now in `App.js`, import the functions under a variable of your choice.

The following means import everything in this file under the variable `db`.

```javascript
import * as db from './database/firestoreFunctions';
```

Now below the comment "Set listener to user profile, ....", call the function `db.watchProfile();`

You should get `undefined` printed because the document doesn't exist.

---

### 57. Create a `setProfile` function

File: `firestoreFunctions.js`

```javascript
export function setProfile(data) {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();
	const users = db.collection('users');
	const user = users.doc(uid);

	// Return the promise
	return user.set(data, { merge: true });
}
```

Now in the `watchProfile` function, call `setProfile` to create user data if it doesn't exist.

Default to `displayName` provided by auth process and a `light` theme.

```javascript
// User profile doesn't exist
console.log('profile does not exist');
const displayName = firebase.auth().currentUser.displayName;
setProfile({
	firstName: displayName,
	lastName: '',
	theme: 'light',
});
```

Now refresh, you'll see user data returned in the console.

Refresh firebase to see the new collection in the console.

---

### 58. Create a `watchBoard` function

Let's have a boards collection where each board is a document with the same id as the users id.

It will have two (sub)collections, `tasks` and `columns`. Each document in them will represent a task or a column.

The board document itself will have one key, `columnOrder`.

File: `firestoreFunctions.js`

```javascript
export function watchBoard() {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();
	const boards = db.collection('boards');
	const board = boards.doc(uid);

	const stopBoardListener = board.onSnapshot((doc) => {
		if (doc.data()) {
			// Board exists
			console.log('board exists');
			console.log(doc.data());
		} else {
			// Board doesn't exist
			console.log('board does not exist');
		}
	});

	return stopBoardListener;
}
```

Now in `App.js`, call `db.watchBoard()` just after `db.watchProfile()`. We will receive `undefined`.

---

### 59. Create a `setBoard` function

File: `firestoreFunctions.js`

```javascript
export function setBoard(data) {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();
	const boards = db.collection('boards');
	const board = boards.doc(uid);

	return board.set(data, { merge: true });
}
```

Now call this function in `watchBoard` in the case where it doesn't exist.

```javascript
// Board doesn't exist
console.log('board does not exist');
setBoard({
	columnOrder: [],
});
```

Refresh app and firebase console to see an empty board created.

---

### 60. Update state with user data from firestore

File: `App.js`

Pass a function to `watchProfile` that receives user data and sets it to the state.

```javascript
db.watchProfile((data) => this.setState({ user: data }));
```

File: `firestoreFunctions.js`

Add `setData` as a second parameter for `watchProfile`. Then call `setData` when the data is received.

```javascript
// User profile exists
console.log('profile exists');
setUser(doc.data());
```

Now the profile page will show the data from firestore. We can change the initial user state.

```javascript
this.state = {
	data: initialData,
	user: {
		firstName: '',
		lastName: '',
		theme: 'light',
	},
};
```

You may notice no data showing if you refresh the profile page. We can fix this later. It is because we init our local profile state before the user data has come through.

---

### 61. Connect `Profile` save to database

In the `handleSave` function of `Profile` call the `setProfile function`.

File: `Profile.jsx`

```javascript
const handleSave = () => {
	db.setProfile({ firstName: first, lastName: last, theme });
};
```

Note how because theme has the same key as the variable we are assigning it, we don't have to write `theme: theme`.

Now we can change the profile details, refresh and the data persists!

---

### 62. Fixing the Profile state hook

File: `Profile.jsx`

To fix this, we need to detect when the `user` prop changes and then call our setState hook functions. To detect the change, we can use the `useEffect` function imported from the `react` package. The `[user]` at the end is telling the hook that the `user` prop is a dependency for it.

Add this below the hooks.

```javascript
useEffect(() => {
	setFirst(user.firstName);
	setLast(user.lastName);
	setTheme(user.theme);
}, [user]);
```

Profile should work now even when refreshed!

---

### 63. Add Sign Out functionality

While we are here, let's hook up the Sign Out `Button`.

Import firebase and replace the `onClick` prop with the following function.

File: `Profile.jsx`

```javascript
onClick={() => firebase.auth().signOut()}
```

Test it out, the `authStateChanged` should detect the change and redirect us to the `/signin` route.

Remove the useHistory hook and its import from `Profile` as we don't need it anymore.

---

### 64. Update board data on change

File: `App.js`

Pass a function to `watchBoard` to update the data in the state.

A little trickier this this, we are setting `data` to a clone of the existing data in state by using `{ ...this.state.data }`. Then we pass in the additional data to overwrite the cloned data with `...data`.

```javascript
db.watchBoard((data) => this.setState({ data: { ...this.state.data, data } }));
```

File: `firebaseFunctions.js`

Take `setData` as the second parameter in the `watchBoard` function and call it when data exists.

```javascript
// Board exists
setData(doc.data());
```

If you'd like to test this is working, add a test value to the columnOrder array in the database. Then in `App.js` change the watchBoard function to this.

```javascript
db.watchBoard((data) => {
	console.log({ data: { ...this.state.data, ...data } });
	this.setState({ data: { ...this.state.data, ...data } });
});
```

Now remove the test value from the array in the database to get rid of the crash.

---

### 65. Create a setColumn function

File: `firebaseFunctions.js`

This writes to a subcollection of the board doc... this might make more sense when you see it appear in the DB.

```javascript
export function setColumn(columnId, data) {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();
	const boards = db.collection('boards');
	const board = boards.doc(uid);
	const columns = board.collection('columns');
	const columnDoc = columns.doc(columnId);

	return columnDoc.set(data, { merge: true });
}
```

---

### 66. Add column to database when created

File: `AddColumn.jsx`

In the `addColumn` function, remove the `columns` and `nextData` constant and, the `setData` function call.

Instead import our firebase function to call `setColumn`

```javascript
import { setColumn } from '../../database/firestoreFunctions';

//...

setColumn(nextKey, {
	id: nextKey,
	title: 'New Column',
	taskIds: [],
});
```

Click create column and the database columns collection will have a document with the ID of `column--Infinity`.

This is because in our `addColumn` function `Math.max(...columnIds)` equates to `-Infinity` if columnIds is empty... so lets fix our `nextIndex` constant.

```javascript
const nextIndex = columnIds.length ? Math.max(...columnIds) + 1 : 1;
```

Now if `columnIds` is empty, nextIndex will be 1. Click it again and column-1 will appear in the DB.

Delete the `column--Infinity` document from the DB.

---

### 67. Create functions to manipulate `columnOrder` array

The `setBoard` will overwrite the array. Create a new firebase function to push to the array. The firestore library has a function for this.

File: `firestoreFunctions.js`

```javascript
export function pushToColumnOrder(value) {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();
	const boards = db.collection('boards');
	const board = boards.doc(uid);

	return board.update({
		columnOrder: firebase.firestore.FieldValue.arrayUnion(value),
	});
}
```

While we're here add a function to remove from this array.

```javascript
export function popFromColumnOrder(value) {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();
	const boards = db.collection('boards');
	const board = boards.doc(uid);

	return board.update({
		columnOrder: firebase.firestore.FieldValue.arrayRemove(value),
	});
}
```

---

### 68. Push to columnOrder

File: `AddColumn.jsx`

**After** adding the column, push its ID to the `columnOrder` array.

`setColumn` returns a promise. Use `.then` to push to `columnOrder` once it completes.

```javascript
setColumn(nextKey, {
	id: nextKey,
	title: 'New Column',
	taskIds: [],
}).then(() => {
	pushToColumnOrder(nextKey);
});
```

If we did `pushToColumnOrder` before adding the column data, the app would fail when looping `columnOrder` and trying to look up the column data... which wouldn't exist for another fraction of a second.

---

### 69. Add column data listener

File: `firestoreFunctions.js`

We are getting a crash now because we are not getting the column data from the DB. Create a function to watch the column collection.

But first, we are creating the `board` reference a lot. To save code, create a function that returns the board ref.

```javascript
function getBoardRef() {
	const uid = firebase.auth().currentUser.uid;
	const db = firebase.firestore();
	const boards = db.collection('boards');
	const board = boards.doc(uid);
	return board;
}
```

Now replace the same code in the other functions with something like this:

```javascript
const board = getBoardRef();
```

Now create a function to watch for changes to the `column` collection. We'll use a new trick to only read docs that have changed.

```javascript
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
```

> Be aware: this function can be optimized to only return docs that have changed. consider implementing this if you will have many columns. https://firebase.google.com/docs/firestore/query-data/listen#view_changes_between_snapshots

In `App.js`, invoke `watchColumns` after `watchBoards`.

```javascript
db.watchColumns((data) => this.setState({ data: { ...this.state.data, columns: { ...data } } }));
```

We are still getting the crash! It is because when we try to create the `columns` constant in `Columns.jsx`, sometimes the column data doesn't exist until the listener updates the state.

Simply return from the map if the `column` constant has no value.

```javascript
const column = data.columns[columnId];
if (!column) return null;
// ...
```

Map expects a returned value, so rather than just `return` we can `return null`.

Finally column 1 appears! We can add columns and they persist after refresh now too.

---

### 70. Create `deleteColumn` function

File: `firestoreFunctions.js`

```javascript
export function deleteColumn(columnId) {
	const board = getBoardRef();
	const columns = board.collection('columns');
	const column = columns.doc(columnId);

	return column.delete();
}
```

---

### 71. Create `deleteTasks` function

File: `firestoreFunctions.js`

Use a `batch` write for this. Because we might need to delete lots of tasks at once, it becomes seriously inefficient to make 50+ calls in a row to the database.

You pass the function an array of `taskIds`, it will stage them for deletion when the `batch` is submitted. The `batch` gets sent to firebase as one call, then firebase deletes all the tasks we added.

```javascript
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
```

---

### 72. Hook up delete column functionality

File: `Column.jsx`

Inside of `onDeleteClicked`, remove all of the code inside the `confirm` and replace it with the database functions.

```javascript
import { popFromColumnOrder, deleteColumn, deleteTasks } from '../../database/firestoreFunctions';

//...

deleteTasks(column.taskIds);
deleteColumn(column.id);
popFromColumnOrder(column.id);
```

---

### 73. Connect title edit to DB

File: `Column.jsx`

In the `textFieldLostFocus` function, swap out the three lines of "state setting" code to the following.

```javascript
if (title !== column.title) {
	setColumn(column.id, { title });
}
```

---

### 74. Create `setTask` function

File: `firestoreFunctions.js`

```javascript
export function setTask(taskId, data) {
	const board = getBoardRef();
	const tasks = board.collection('tasks');
	const taskDoc = tasks.doc(taskId);

	return taskDoc.set(data, { merge: true });
}
```

---

### 75. Create push and pop function for column `taskIds`

File: `firestoreFunctions.js`

```javascript
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
```

---

### 76. Connect add task functionality

File: `AddTask.jsx`

Inside the `addTask` function, replace everything below `const taskId = ...` with the below and import the database functions.

```javascript
// Create task
setTask(taskId, { id: taskId, content: 'Click to edit' });

// Push to column list
pushTaskId(columnId, taskId);
```

We now get the same `-Infinity` issue as before. We know how to fix this one.

```javascript
const nextIndex = taskIds.length ? Math.max(...taskIds) + 1 : 1;
```

Now delete the infinity doc from the tasks collection and from the column's `taskIds` array.

---

### 77. Create `watchTasks` listener

File: `firestoreFunctions.js`

```javascript
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
```

In `App.js` call it after the `watchColumns` call and pass a function to handle the data update.

```javascript
// Watch tasks
db.watchTasks((data) => this.setState({ data: { ...this.state.data, tasks: { ...data } } }));
```

Still a crash... In `Column.jsx` when creating `taskCards` sometimes the `tasks` array contains an `undefined` value. Adapt the map to `return null` if the task is `undefined`.

```javascript
const taskCards = tasks.map((task, i) => {
	if (!task) return null;

	return (
		<Task
			key={task.id}
			task={task}
			index={i}
			data={data}
			setData={setData}
			columnId={column.id}
		/>
	);
});
```

We can now add tasks!

---

### 78. Add delete task functionality

File: `Task.jsx`

After the `confirm` function of `deleteTaskClicked`, replace the contents with the following and import the database functions.

```javascript
popTaskId(columnId, task.id);
deleteTasks([task.id]);
```

---

### 79. Connect task content change to DB

File: `Task.jsx`

Replace the three lines of "state-updating" code with the following.

```javascript
setTask(task.id, { content });
```

Now we an add, remove and change the tasks.

---

### 80. Support column order changing with DB

File: `Columns.jsx`

Inside the `onDragEnd` function, inside the `if (type === 'column')` statement, comment out the "state-updating" code and add the following just above it. Don't forget to import the database function.

```javascript
setBoard({ columnOrder: newColumnOrder });
```

Notice a small flicker when we change the column order now? This is because the delay in making the change to the database then receiving the change from the listener.

Uncomment the setState code so that the changes are set to the state before the listener provides the new changes.

Looks good now!

---

### 81. Support task rearrange

File: `Columns.jsx`

In `onDragEnd` at the end of the `if (startColumn === endColumn)` block, add the following.

```javascript
setColumn(startColumn.id, { taskIds: newTaskIds });
```

This will overwrite the task order with the new order. Let's keep the `setData` function to help with the flicker.

Similarly, in the `else` block add the following at the end of the block to update both columns when the task gets moved across a column.

```javascript
setColumn(newStartColumn.id, { taskIds: startTaskIds });
setColumn(newEndColumn.id, { taskIds: endTaskIds });
```

The Kanban board is now fully functional and persists data!

---

### 82. Add dark theme

File: `App.js`

Import `ThemeProvider` and `createTheme` from material-ui. Then wrap the `Router` component in it and pass the theme property a theme created from the `createTheme` function

```javascript
<ThemeProvider theme={createTheme({ palette: { type: this.state.user.theme } })}>
	<Router>{/*...*/}</Router>
</ThemeProvider>
```

Notice the background is white. Change `<div className='App'></div>` to a Material UI component.

```javascript
<Paper className='App'>
	<ThemeProvider theme={createTheme({ palette: { type: this.state.user.theme } })}>
		<Router>{/*...*/}</Router>
	</ThemeProvider>
</Paper>
```

In `App.css` add `height: 100vh` as a style to `.App`.

```css
.App {
	text-align: center;
	height: 100vh;
}
```

---

### 83. Remove any unused imports and variables

React does a pretty good job of pointing these out in the warnings so remove the `initialData` import in `App.js` and delete the file too.

File: `.jsx`

```javascript

```

---

### 84. Done!

Great work making it to the end!

---
