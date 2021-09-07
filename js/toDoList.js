// Declaring variables to use
const TASKFORM = document.getElementById('add-task-form');
const IDFIELD = document.getElementById('id-field');
const NAMEFIELD = document.getElementById('name-field');
const ASSIGNEE = document.getElementById('assignee-select');
const STATUS = Array.from(document.getElementsByClassName('radio'));
const EDITSTATUS = Array.from(document.getElementsByClassName('radio-edit'));
const ADDTASKBTN = document.getElementById('create-task-button');
const TABLEBODY = document.getElementById('table-body');
const SEARCHFIELD = document.getElementById('search-field');
const FILTERFIELD = document.getElementById('filter-field');
const SORTBUTTON = document.getElementById('sort-button');
const FILTERSDIV = document.querySelector('.filters-div');
const EDITFORM = document.getElementById('edit-task-form');
const EDITIDFIELD = document.getElementById('edit-id-field');
const EDITNAMEFIELD = document.getElementById('edit-name-field');
const EDITASSIGNEEFIELD = document.getElementById('edit-assignee-field');

// Creating event listeners
TASKFORM.addEventListener('submit', submit);
TASKFORM.addEventListener('submit', refreshTable);
TABLEBODY.addEventListener('click', deleteTask);
TABLEBODY.addEventListener('click', showEditForm);
SEARCHFIELD.addEventListener('keyup', filterTasks);
FILTERFIELD.addEventListener('change', filterTasks);
SORTBUTTON.addEventListener('click', sortByDate);
EDITFORM.addEventListener('submit', editTask);
EDITFORM.addEventListener('submit', refreshTable);

// Removing the edit form
FILTERSDIV.removeChild(EDITFORM);

// Setting ID
if (localStorage.getItem('id') === null) {
    IDFIELD.value = 1;
} else {
    IDFIELD.value = localStorage.getItem('id');
}

// Displaying the table
if (localStorage.getItem('tasks') !== null) {
    const TASKS = JSON.parse(localStorage.getItem('tasks'));

    for (let task of TASKS) {
        addTaskToTable(task);
    }
}


// Creating the submit function to add a task in local storage
function submit(e) {
    e.preventDefault();

    const NEWTASK = {};
    const DATE = new Date();
    let tasks;

    // Name validation
    if (NAMEFIELD.value.length >= 100 || NAMEFIELD.value === '') {
        alert('You should enter a name less than 100 characters');
    } else {
        // Button disabled
        ADDTASKBTN.classList.toggle('bisabled-button');
        ADDTASKBTN.disabled = true;

        // Checking if the tasks array is already in local storage
        if (localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        // Creating the new task to add
        NEWTASK.id = IDFIELD.value;
        NEWTASK.name = NAMEFIELD.value;
        NEWTASK.assignee = ASSIGNEE.value;
        NEWTASK.creationDate = DATE.toLocaleString('en-US');

        // Checking the status
        for (let state of STATUS) {
            if (state.checked === true) {
                NEWTASK.status = state.nextElementSibling.innerText;
            }
        }

        // Adding the new task to the tasks array
        tasks.push(NEWTASK);

        // Adding the tasks array with the new tast to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Setting ID
        let NEWID = parseInt(IDFIELD.value) + 1;
        localStorage.setItem('id', NEWID);
        IDFIELD.value = NEWID;

        // Button enabled
        ADDTASKBTN.classList.toggle('bisabled-button');
        ADDTASKBTN.disabled = false;
    }
}

// Creating the function to refresh the table
function refreshTable() {
    const TASKS = JSON.parse(localStorage.getItem('tasks'));
    TABLEBODY.innerHTML = '';

    // Creating a new row for each tast in the tasks array in local storage
    for (let task of TASKS) {
        addTaskToTable(task);
    }
}

// Creating the function to delete a task
function deleteTask(e) {
    // Checking if the delete button was clicked
    if (e.target.classList.contains('delete-link')) {
        e.preventDefault();

        // Checking the ID of the task to delete
        const TRTODELETE = e.target.parentElement.parentElement;
        const IDTODELETE = TRTODELETE.children[0].innerText;
        const TASKS = JSON.parse(localStorage.getItem('tasks'));
        const UPDATEDTASKS = [];

        // Creating the new array without the task to delete
        for (let task of TASKS) {
            if (task.id !== IDTODELETE) {
                UPDATEDTASKS.push(task);
            }
        }

        // Updating the tasks array in local storage and removing the table row with the task deleted
        localStorage.setItem('tasks', JSON.stringify(UPDATEDTASKS));

        TRTODELETE.remove();
    }
}

// Function to filter tasks by name, status or date
function filterTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));

    TABLEBODY.innerHTML = '';

    // Checking the state of the sort by date button
    if (SORTBUTTON.children[0].classList.contains('bi-arrow-down-square')) {
        tasks = tasks.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
    } else {
        task = tasks.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }

    // Filter by status and searching by name
    for (let task of tasks) {
        // If search input is empty
        if (SEARCHFIELD.value === '') {
            // If status filter is empty
            if (FILTERFIELD.value === 'None') {
                addTaskToTable(task);
            } else {
                // If there is a status filter 
                if (task.status === FILTERFIELD.value) {
                    addTaskToTable(task);
                }
            }
            // If there is a name in search input
        } else {
            // If status filter is empty
            if (FILTERFIELD.value === 'None') {
                if (task.name === SEARCHFIELD.value) {
                    addTaskToTable(task);
                }
                // If there is a status filter
            } else {
                if (task.name === SEARCHFIELD.value && task.status === FILTERFIELD.value) {
                    addTaskToTable(task);
                }
            }
        }
    }
}

// Add each task to table to display
function addTaskToTable(task) {
    TABLEBODY.innerHTML += `
        <tr class="table-row">
            <th class="table-cell">${task.id}</th>
            <td class="table-cell">${task.name}</td>
            <td class="table-cell">${task.assignee}</td>
            <td class="table-cell">${task.status}</td>
            <td class="table-cell">${task.creationDate}</td>
            <td class="table-cell"><a class="delete-link" href="#">x</a><a href="#"><i class="bi bi-pencil-fill edit-link"></i></a></td>
        </tr>
    `;
}

// Sort by date
function sortByDate(e) {
    e.preventDefault();

    const TASKS = Array.from(TABLEBODY.children);

    TABLEBODY.innerHTML = '';

    // Changing the icon of the sort button
    if (SORTBUTTON.children[0].classList.contains('bi-arrow-down-square')) {
        SORTBUTTON.children[0].classList.remove('bi-arrow-down-square');
        SORTBUTTON.children[0].classList.add('bi-arrow-up-square');

        // Sorting by date the new array
        sortedTasks = TASKS.sort((a, b) => new Date(b.children[4].textContent).getTime() - new Date(a.children[4].textContent).getTime());
    } else {
        SORTBUTTON.children[0].classList.remove('bi-arrow-up-square');
        SORTBUTTON.children[0].classList.add('bi-arrow-down-square');

        // Sorting by date the new array
        sortedTasks = TASKS.sort((a, b) => new Date(a.children[4].textContent).getTime() - new Date(b.children[4].textContent).getTime());
    }

    // Adding to the table the new sorted array
    for (let task of sortedTasks) {
        TABLEBODY.innerHTML += `
            <tr class="table-row">
                <th class="table-cell">${task.children[0].textContent}</th>
                <td class="table-cell">${task.children[1].textContent}</td>
                <td class="table-cell">${task.children[2].textContent}</td>
                <td class="table-cell">${task.children[3].textContent}</td>
                <td class="table-cell">${task.children[4].textContent}</td>
                <td class="table-cell"><a class="delete-link" href="#">x</a><a href="#"><i class="bi bi-pencil-fill edit-link"></i></a></td>
            </tr>
        `;
    }
}

// Show the edit form
function showEditForm(e) {
    if (e.target.classList.contains('edit-link')) {
        e.preventDefault();

        // Getting the table row to edit
        const TRTOEDIT = e.target.parentElement.parentElement.parentElement.children;

        // Setting the values of the task in the edit input, for a better User Experience
        EDITIDFIELD.value = TRTOEDIT[0].innerText;
        EDITNAMEFIELD.value = TRTOEDIT[1].innerText;
        EDITASSIGNEEFIELD.value = TRTOEDIT[2].innerText;

        for (let state of EDITSTATUS) {
            if (state.nextElementSibling.innerText === TRTOEDIT[3].innerText) {
                state.checked = true;
            }
        }

        // Displaying the edit form
        FILTERSDIV.appendChild(EDITFORM);
    }
}

// Edit task
function editTask(e) {
    e.preventDefault();

    // Creating the task with the new values
    const edittedTask = {};
    const DATE = new Date();
    const TASKS = JSON.parse(localStorage.getItem('tasks'));

    edittedTask.id = EDITIDFIELD.value;
    edittedTask.name = EDITNAMEFIELD.value;
    edittedTask.assignee = EDITASSIGNEEFIELD.value;
    edittedTask.creationDate = DATE.toLocaleString('en-US');

    for (let state of EDITSTATUS) {
        if (state.checked === true) {
            edittedTask.status = state.nextElementSibling.innerText;
        }
    }

    // Replacing the task to edit with the new task in an array
    for (let i = 0; i < TASKS.length; i++) {
        if (TASKS[i].id === edittedTask.id) {
            TASKS[i] = edittedTask;
        }
    }

    // Updating the tasks array in local storage with the new array
    localStorage.setItem('tasks', JSON.stringify(TASKS));

    // Removing the edit form after reset it
    EDITFORM.reset();
    FILTERSDIV.removeChild(EDITFORM);
    FILTERFIELD.value = 'None';
}