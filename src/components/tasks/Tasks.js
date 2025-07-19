import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import React, { useState } from 'react';
import './tasks.css';

const initialData = {
    todo: [
        { id: '1', title: 'Contact Lead A' },
        { id: '2', title: 'Follow up with Client X' }
    ],
    inProgress: [
        { id: '3', title: 'Prepare Proposal for Client Y' }
    ],
    completed: [
        { id: '4', title: 'Closed Deal with Z Corp' }
    ]
};


const Tasks = () => {
    const [columns, setColumns] = useState(initialData);
    const [taskTitle, setTaskTitle] = useState('');
    const [selectedColumn, setSelectedColumn] = useState('todo');

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        const sourceColumn = [...columns[source.droppableId]];
        const destColumn = [...columns[destination.droppableId]];
        const [movedTask] = sourceColumn.splice(source.index, 1);
        destColumn.splice(destination.index, 0, movedTask);

        setColumns({
            ...columns,
            [source.droppableId]: sourceColumn,
            [destination.droppableId]: destColumn
        });
    };

    const addTask = () => {
        if (!taskTitle.trim()) return;

        const newTask = {
            id: Date.now().toString(), // Unique ID
            title: taskTitle.trim()
        };

        setColumns((prev) => ({
            ...prev,
            [selectedColumn]: [...prev[selectedColumn], newTask]
        }));

        setTaskTitle('');
    };

    return (
        <div>
            <div className="task-inputs">
                <input
                    type="text"
                    placeholder="Enter task title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                />
                <select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <button onClick={addTask}>Add Task</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board">
                    {Object.entries(columns).map(([columnId, tasks]) => (
                        <Droppable key={columnId} droppableId={columnId}>
                            {(provided) => (
                                <div
                                    className="kanban-column"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h3>{columnId.toUpperCase()}</h3>
                                    {tasks.map((task, index) => (
                                        <Draggable
                                            key={task.id}
                                            draggableId={task.id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    className="kanban-card"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {task.title}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Tasks;