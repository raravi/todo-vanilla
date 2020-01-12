let todos = [];
let counter = 0;
let numberOfItemsLeft = 0;
let idOfStatusButton = 0;

function ListItem(id, value, done = false) {
  this.id = id;
  this.value = value;
  this.done = done;
}

function getNumberOfItemsLeft(total, value) {
  if (value.done)
    return total;
  else
    return total + 1;
}

function updateStatusLeft() {
  const statusLeft = document.getElementsByClassName("todos__statusleft")[0];
  statusLeft.innerHTML = numberOfItemsLeft + " items left";
}

function updateStatusRight() {
  const statusRight = document.getElementsByClassName("todos__statusright")[0];
  if (numberOfItemsLeft === todos.length) {
    statusRight.setAttribute("class", "todos__statusright");
  } else {
    statusRight.setAttribute("class", "todos__statusright todos__statusright--itemsselected");
  }
}

function updateClearItems() {
  const labelElement = document.getElementsByClassName("newitem__clearitems")[0];
  if (todos.length === 0) {
    labelElement.setAttribute("class", "newitem__clearitems");
  }
  else if (numberOfItemsLeft === 0) {
    labelElement.setAttribute("class", "newitem__clearitems newitem__clearitems--hasitems newitem__clearitems--allitemsselected");
  } else {
    labelElement.setAttribute("class", "newitem__clearitems newitem__clearitems--hasitems");
  }
}

function updateStatusButtons() {
  let buttons = document.getElementsByClassName("todos_statusbutton");
  [...buttons].forEach(button => {
    let idOfButton = parseInt(button.getAttribute("data-id"), 10);
    if (idOfButton === idOfStatusButton) {
      button.setAttribute("class", "todos_statusbutton todos_statusbutton--selected");
    } else {
      button.setAttribute("class", "todos_statusbutton");
    }
  });
}

function updateTodos() {
  let todosElement = document.getElementsByClassName("todos")[0];
  if (todos.length === 0 ) {
    todosElement.setAttribute("class", "todos");
  } else {
    todosElement.setAttribute("class", "todos todos--itemspresent");
  }
}

/*----------------  Add New Item  --------------------*/
function getInput(e) {
  const input = document.querySelector('input');
  if(e.code === "Enter" && input.value !== "") {
    // UPDATE state: todos array, numberOfItemsLeft
    let tempItem = new ListItem(counter, input.value);
    todos.push(tempItem);
    numberOfItemsLeft = todos.reduce(getNumberOfItemsLeft, 0);

    // UPDATE DOM elements
    // 1. Add List Item
    let listElement = document.createElement("li");
    if (idOfStatusButton === 2) {
      listElement.setAttribute("class", "todos__listitem todos__listitem--hidden");
    } else {
      listElement.setAttribute("class", "todos__listitem");
    }
    listElement.setAttribute("data-id", tempItem.id);
    //listElement.setAttribute("ondblclick", "makeItemEditable(this)");
    //listElement.setAttribute("onkeyup", "editAnItem(event, this)");
    listElement.innerHTML = tempItem.value + '<div class="todos__toggleitem" onclick="setItemAsCompleted(this)"></div><div class="todos__deleteitem" onclick="deleteItem(this)">x</div>';
    let todoList = document.getElementsByClassName("todos__list")[0];
    todoList.appendChild(listElement);

    // 2. Update "Status Left" text
    updateStatusLeft();

    // 3. Update the label "newitem__clearitems" to hasitems, if its not
    updateClearItems();

    // 4. Update "todos" section to visible, if its not
    updateTodos();

    // 5. Clear the "input" text
    input.value = "";

    // UPDATE variables
    counter++;

    // UPDATE Local Storage
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

/*--------  Mark All Items as Completed  -------------*/
function markAllAsCompleted() {
  let labelElement = document.getElementsByClassName("newitem__clearitems")[0];
  let classesLabelElement = labelElement.getAttribute("class");
  if (classesLabelElement.indexOf("newitem__clearitems--allitemsselected") === -1) {
    // UPDATE state: todos array, numberOfItemsLeft
    todos.forEach(listItem => listItem.done = true);
    numberOfItemsLeft = todos.reduce(getNumberOfItemsLeft, 0);

    // UPDATE DOM elements
    // 1. Update list items
    let listItems = document.getElementsByClassName("todos__listitem");
    for (let listItem of listItems) {
      if (idOfStatusButton === 1) {
        listItem.setAttribute("class", "todos__listitem todos__listitem--cleared todos__listitem--hidden");
      } else {
        listItem.setAttribute("class", "todos__listitem todos__listitem--cleared");
      }
    }
  } else {
    // UPDATE state: todos array, numberOfItemsLeft
    todos.forEach(listItem => listItem.done = false);
    numberOfItemsLeft = todos.reduce(getNumberOfItemsLeft, 0);

    // UPDATE DOM elements
    // 1. Update list items
    let listItems = document.getElementsByClassName("todos__listitem");
    for (let listItem of listItems) {
      if (idOfStatusButton === 2) {
        listItem.setAttribute("class", "todos__listitem todos__listitem--hidden");
      } else {
        listItem.setAttribute("class", "todos__listitem");
      }
    }
  }

  // 2. Update "Status Left" text
  updateStatusLeft();

  // 3. Set "Status Right" to remove itemsselected
  updateStatusRight();

  // 4. Update the label "newitem__clearitems" to remove allitemsselected
  updateClearItems();

  // UPDATE Local Storage
  localStorage.setItem('todos', JSON.stringify(todos));
}

/*------  Mark the selected Item as Completed  -------*/
function setItemAsCompleted(node) {
  let listItem = node.parentNode;
  let classesListItem = listItem.getAttribute("class");
  let idListItem = parseInt(listItem.getAttribute("data-id"), 10);
  if (classesListItem.indexOf("todos__listitem--cleared") === -1) {
    // UPDATE state: todos array, numberOfItemsLeft
    for (let todo of todos) {
      if (todo.id === idListItem) {
        todo.done = true;
        break;
      }
    }
    numberOfItemsLeft = todos.reduce(getNumberOfItemsLeft, 0);

    // UPDATE DOM elements
    // 1. Update list item
    if (idOfStatusButton === 1) {
      listItem.setAttribute("class", "todos__listitem todos__listitem--cleared todos__listitem--hidden");
    } else {
      listItem.setAttribute("class", "todos__listitem todos__listitem--cleared");
    }
  } else {
    // UPDATE state: todos array, numberOfItemsLeft
    for (let todo of todos) {
      if (todo.id === idListItem) {
        todo.done = false;
        break;
      }
    }
    numberOfItemsLeft = todos.reduce(getNumberOfItemsLeft, 0);

    // UPDATE DOM elements
    // 1. Update list item
    if (idOfStatusButton === 2) {
      listItem.setAttribute("class", "todos__listitem todos__listitem--hidden");
    } else {
      listItem.setAttribute("class", "todos__listitem");
    }
  }

  // 2. Update "Status Left" text
  updateStatusLeft();

  // 3. Set "Status Right" to remove itemsselected, if required
  updateStatusRight();

  // 4. Update the label "newitem__clearitems" to remove allitemsselected, if required
  updateClearItems();

  // UPDATE Local Storage
  localStorage.setItem('todos', JSON.stringify(todos));
}

/*--------  Double Click an Item to Edit  ------------*/
/*function makeItemEditable(listItem) {
  listItem.setAttribute("contenteditable", "true");
  listItem.focus();
}

function editAnItem(event, listItem) {
  listItem.setAttribute("contenteditable", "false");
  if(event.code === "Enter" && listItem.innerText !== "") {
    console.log(listItem.innerText);
    listItem.innerText = listItem.innerText.substr(0, listItem.innerText.length-3);
    console.log(listItem.innerText);
  }
}*/

/*-----------  Delete the selected Item  -------------*/
function deleteItem(node) {
  let listItem = node.parentNode;
  let classesListItem = listItem.getAttribute("class");
  let idListItem = parseInt(listItem.getAttribute("data-id"), 10);

  // UPDATE state: todos array, numberOfItemsLeft
  for (let i = 0 ; i < todos.length ; i++) {
    if (todos[i].id === idListItem) {
      todos.splice(i, 1);
      break;
    }
  }
  numberOfItemsLeft = todos.reduce(getNumberOfItemsLeft, 0);

  // UPDATE DOM
  // 1. Delete list item
  listItem.remove();

  // 2. Update "Status Left" text
  updateStatusLeft();

  // 3. Set "Status Right" to remove itemsselected, if required
  updateStatusRight();

  // 4. Update the label "newitem__clearitems" to remove allitemsselected, if required
  updateClearItems();

  // 5. Update "todos" section to invisible, if required
  updateTodos();

  // UPDATE Local Storage
  localStorage.setItem('todos', JSON.stringify(todos));
}

/*-------   Handle Click for Status Buttons  ---------*/
function onClickStatusButton(clickedButton) {
  if (clickedButton.getAttribute("class").indexOf("todos_statusbutton--selected") !== -1) {
    return;
  }

  // UPDATE state: idOfStatusButton
  idOfStatusButton = parseInt(clickedButton.getAttribute("data-id"), 10);

  // UPDATE DOM
  // 1. List Items
  let listItems = document.getElementsByClassName("todos__listitem");
  listItems = [...listItems];
  if (idOfStatusButton === 0) {
    listItems.forEach(listItem => {
      let classesListItem = listItem.getAttribute("class");
      if (classesListItem.indexOf("todos__listitem--hidden") !== -1) {
        listItem.setAttribute("class", classesListItem.replace(" todos__listitem--hidden",""));
      }
    });
  } else if (idOfStatusButton === 1) {
    listItems.forEach(listItem => {
      if (listItem.getAttribute("class").indexOf("todos__listitem--cleared") === -1) {
        listItem.setAttribute("class", "todos__listitem");
      } else {
        listItem.setAttribute("class", "todos__listitem todos__listitem--cleared todos__listitem--hidden");
      }
    });
  } else if (idOfStatusButton === 2) {
    listItems.forEach(listItem => {
      if (listItem.getAttribute("class").indexOf("todos__listitem--cleared") === -1) {
        listItem.setAttribute("class", "todos__listitem todos__listitem--hidden");
      } else {
        listItem.setAttribute("class", "todos__listitem todos__listitem--cleared");
      }
    });
  }

  // 2. Update the Status Buttons
  updateStatusButtons();

  // UPDATE Local Storage
  localStorage.setItem("idOfStatusButton", idOfStatusButton);
}

/*-----------  Clear Completed Items  ----------------*/
function clearCompletedItems() {
  console.log(idOfStatusButton);
  // UPDATE state: todos array, numberOfItemsLeft
  for (let i = 0 ; i < todos.length ; i++) {
    if (todos[i].done === true) {
      todos.splice(i, 1);
      i--;
    }
  }
  numberOfItemsLeft = todos.reduce(getNumberOfItemsLeft, 0);

  console.log(idOfStatusButton);

  // UPDATE DOM
  // 1. Delete completed list items
  let listItems = document.getElementsByClassName("todos__listitem");
  [...listItems].filter(listItem => {
    let listItemId = parseInt(listItem.getAttribute("data-id"), 10);
    for (let todo of todos) {
      if (todo.id === listItemId) {
        return false;
      }
    }
    return true;
  }).forEach(listItem => listItem.remove());

  // 2. Update "Status Left" text
  updateStatusLeft();

  // 3. Set "Status Right" to remove itemsselected, if required
  updateStatusRight();

  // 4. Update the label "newitem__clearitems" to remove allitemsselected, if required
  updateClearItems();

  // 5. Update "todos" section to invisible, if required
  updateTodos();

  // UPDATE Local Storage
  localStorage.setItem('todos', JSON.stringify(todos));
}

function setTodosFromStorage() {
  let tempTodos = JSON.parse(localStorage.getItem('todos'));
  console.log(tempTodos);
  if (tempTodos.length !== 0) { // We have todos in Local Storage
    // UPDATE state: todos array, numberOfItemsLeft
    todos = tempTodos;
    numberOfItemsLeft = todos.reduce(getNumberOfItemsLeft, 0);
    counter = todos[todos.length-1].id + 1;
    idOfStatusButton = parseInt(localStorage.getItem("idOfStatusButton"), 10);
    if(isNaN(idOfStatusButton)) {
      idOfStatusButton = 0;
      // UPDATE Local Storage
      localStorage.setItem("idOfStatusButton", idOfStatusButton);
    }

    // UPDATE DOM
    // 1. Update list items
    todos.forEach(todo => {
      // Add List Item
      let listElement = document.createElement("li");
      if (idOfStatusButton === 0) {
        if (todo.done) {
          listElement.setAttribute("class", "todos__listitem todos__listitem--cleared");
        } else {
          listElement.setAttribute("class", "todos__listitem");
        }
      } else if (idOfStatusButton === 1) {
        if (todo.done) {
          listElement.setAttribute("class", "todos__listitem todos__listitem--cleared todos__listitem--hidden");
        } else {
          listElement.setAttribute("class", "todos__listitem");
        }
      } else if (idOfStatusButton === 2) {
        if (todo.done) {
          listElement.setAttribute("class", "todos__listitem todos__listitem--cleared");
        } else {
          listElement.setAttribute("class", "todos__listitem todos__listitem--hidden");
        }
      }
      listElement.setAttribute("data-id", todo.id);
      //listElement.setAttribute("ondblclick", "makeItemEditable(this)");
      //listElement.setAttribute("onkeyup", "editAnItem(event, this)");
      listElement.innerHTML = todo.value + '<div class="todos__toggleitem" onclick="setItemAsCompleted(this)"></div><div class="todos__deleteitem" onclick="deleteItem(this)">x</div>';
      let todoList = document.getElementsByClassName("todos__list")[0];
      todoList.appendChild(listElement);
    });

    // 2. Update "Status Left" text
    updateStatusLeft();

    // 3. Set "Status Right" to remove itemsselected, if required
    updateStatusRight();

    // 4. Update the label "newitem__clearitems" to remove allitemsselected, if required
    updateClearItems();

    // 5. Update the status buttons
    updateStatusButtons();

    // 5. Update "todos" section to invisible, if required
    updateTodos();
  }
}

if (window.addEventListener) {
  window.addEventListener('load', setTodosFromStorage);
} else {
  window.attachEvent('onload', setTodosFromStorage);
}

/*function preventTextSelection(event) {
  if (event.detail > 1) {
    event.preventDefault();
    // of course, you still do not know what you prevent here...
    // You could also check event.ctrlKey/event.shiftKey/event.altKey
    // to not prevent something useful.
  }
}

if (document.addEventListener) {
  document.addEventListener('mousedown', preventTextSelection, false);
} else {
  document.attachEvent('mousedown', preventTextSelection, false);
}*/
