// This code is wrapped in an immediately-invoked function expression (IIFE) to create a private scope.
(function () {
  // Array to store todo items and a variable for the list name
  let todoArray = [];
  let listName = '';

  // Function to create and return an H2 element with the specified title
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.textContent = title;
    return appTitle;
  }

  // Function to create a form with input and button for adding new todo items
  function createTodoItemForm() {
    // Creating form elements
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    // Adding CSS classes and attributes to elements
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('disabled', 'disabled');
    button.style.cursor = 'pointer';
    button.textContent = 'Добавить дело';

    // Adding an input event listener to enable/disable the button based on input value
    input.addEventListener('input', handleInput);

    // Function to handle input changes and enable/disable the button accordingly
    function handleInput() {
      button.disabled = input.value.trim() === '';
    }

    // Appending elements to the form
    buttonWrapper.append(button);
    form.append(input, buttonWrapper);

    // Returning form, input, and button for external use
    return {
      form,
      input,
      button
    };
  }

  // Function to create an unordered list for todo items
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // Function to create a todo item with done and delete buttons
  function createTodoItem(obj) {
    // Creating elements
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // Adding CSS classes to elements
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // Adding a success class if the item is marked as done
    if (obj.done) {
      item.classList.add('list-group-item-success');
    }

    // Adding event listeners for done and delete buttons
    doneButton.addEventListener('click', () => handleDoneButtonClick(obj));
    deleteButton.addEventListener('click', () => handleDeleteButtonClick(obj));

    // Function to handle the done button click
    function handleDoneButtonClick(itemObj) {
      item.classList.toggle('list-group-item-success');
      itemObj.done = !itemObj.done;
      saveTodoList(todoArray, listName);
    }

    // Function to handle the delete button click
    function handleDeleteButtonClick(itemObj) {
      if (confirm('Вы уверены?')) {
        item.remove();
        let index = todoArray.findIndex(item => item.id === itemObj.id);
        if (index !== -1) {
          todoArray.splice(index, 1);
          saveTodoList(todoArray, listName);
        }
      }
    }

    // Appending buttons to the button group and the group to the item
    buttonGroup.append(doneButton, deleteButton);
    item.append(buttonGroup);

    // Returning item, doneButton, and deleteButton for external use
    return {
      item,
      doneButton,
      deleteButton
    };
  }

  // Function to get a new unique ID for a todo item
  function getNewId(arr) {
    return Math.max(...arr.map(item => item.id), 0) + 1;
  }

  // Function to save the todo list to localStorage
  function saveTodoList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  // Function to create the entire todo app with title, input form, and todo list
  function createTodoApp(container, title = 'Список дел', keyName) {
    // Setting the listName variable
    listName = keyName;

    // Creating elements for the todo app
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    // Appending elements to the container
    container.append(todoAppTitle, todoItemForm.form, todoList);

    // Retrieving todo items from localStorage
    let localData = localStorage.getItem(listName);

    // Parsing and adding existing todo items to the todoArray
    if (localData !== null && localData !== '') {
      todoArray = JSON.parse(localData);
    }

    // Adding existing todo items to the todoList
    todoArray.forEach(itemList => {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    });

    // Adding a submit event listener to the form
    todoItemForm.form.addEventListener('submit', handleFormSubmit);

    // Function to handle form submission
    function handleFormSubmit(e) {
      e.preventDefault();

      // Checking if the input is empty
      if (!todoItemForm.input.value.trim()) {
        return;
      }

      // Creating a new todo item object
      let newItem = {
        id: getNewId(todoArray),
        name: todoItemForm.input.value,
        done: false
      };

      // Creating a todo item and adding it to the todoArray
      let todoItem = createTodoItem(newItem);
      todoArray.push(newItem);

      // Saving the updated todoArray to localStorage
      saveTodoList(todoArray, listName);

      // Appending the new todo item to the todoList
      todoList.append(todoItem.item);

      // Clearing the input field and disabling the button
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    }
  }

  // Making the createTodoApp function accessible globally
  window.createTodoApp = createTodoApp;
})();
