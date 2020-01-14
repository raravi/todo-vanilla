(function(window) {
  "use strict";
  // ES6: All let/const variables

  /**
   * The main object to hold all data relevant to the Todo List
   */
  function TodosData() {
    this.todos = [];
    this.counter = 0;
    this.numberOfItemsLeft = 0;
    this.idOfStatusButton = 0;
    this.listItemInnerHTML =
      '<div class="todos__toggleitem" onclick="TodosData.setItemAsCompleted(this)"></div><div class="todos__deleteitem" onclick="TodosData.deleteItem(this)">x</div><input type="text" name="edititem" onkeyup="TodosData.itemEdited(event, this)" onblur="TodosData.lostFocus(this)" class="todos__edititem"></input>';
  }

  /**
   * The ListItem object represents an item in the Todo List
   */
  function ListItem(id, value, done = false) {
    // ES6: Default parameter
    this.id = id;
    this.value = value;
    this.done = done;
  }

  /**
   * This function updates the number of items left 'To Do' in the list.
   */
  TodosData.prototype._getNumberOfItemsLeft = function(total, value) {
    return value.done ? total : total + 1;
  };

  /**
   * This function gets the ID of list item as an Integer.
   */
  TodosData.prototype._getIdOfListItem = function(listItem) {
    return parseInt(listItem.getAttribute("data-id"), 10);
  };

  /**
   * This function updates the number of items left 'To Do' on
   * the left of status bar.
   */
  TodosData.prototype._updateStatusLeft = function() {
    const statusLeft = document.getElementsByClassName("todos__statusleft")[0];
    statusLeft.innerHTML = this.numberOfItemsLeft + " items left";
  };

  /**
   * This function hides/unhides the 'Clear Completed' link on
   * the right of status bar.
   */
  TodosData.prototype._updateStatusRight = function() {
    const statusRight = document.getElementsByClassName(
      "todos__statusright"
    )[0];
    if (this.numberOfItemsLeft === this.todos.length) {
      statusRight.setAttribute("class", "todos__statusright");
    } else {
      statusRight.setAttribute(
        "class",
        "todos__statusright todos__statusright--itemsselected"
      );
    }
  };

  /**
   * This function updates the 'Clear/Unclear All' items on
   * the new input box.
   */
  TodosData.prototype._updateClearItems = function() {
    const labelElement = document.getElementsByClassName(
      "newitem__clearitems"
    )[0];
    if (this.todos.length === 0) {
      labelElement.setAttribute("class", "newitem__clearitems");
    } else if (this.numberOfItemsLeft === 0) {
      labelElement.setAttribute(
        "class",
        "newitem__clearitems newitem__clearitems--hasitems newitem__clearitems--allitemsselected"
      );
    } else {
      labelElement.setAttribute(
        "class",
        "newitem__clearitems newitem__clearitems--hasitems"
      );
    }
  };

  /**
   * This function updates the Status Buttons to
   * match the value in 'idOfStatusButton'.
   */
  TodosData.prototype._updateStatusButtons = function() {
    let buttons = document.getElementsByClassName("todos_statusbutton");
    buttons = [...buttons]; // ES6: spread operator
    buttons.forEach(button => {
      // ES6: arraw function, this operator
      let idOfButton = this._getIdOfListItem(button);
      if (idOfButton === this.idOfStatusButton) {
        button.setAttribute(
          "class",
          "todos_statusbutton todos_statusbutton--selected"
        );
      } else {
        button.setAttribute("class", "todos_statusbutton");
      }
    });
  };

  /**
   * This function hides/unhides the Todo List Items.
   */
  TodosData.prototype._updateTodos = function() {
    let todosElement = document.getElementsByClassName("todos")[0];
    if (this.todos.length === 0) {
      todosElement.setAttribute("class", "todos");
    } else {
      todosElement.setAttribute("class", "todos todos--itemspresent");
    }
  };

  /**
   * This function creates a new item in 'todos' array.
   */
  TodosData.prototype._createTodoItem = function(item) {
    this.todos.push(item);
    this.numberOfItemsLeft = this.todos.reduce(this._getNumberOfItemsLeft, 0);
    this.counter++;
  };

  /**
   * This function creates a new List Item in the DOM.
   */
  TodosData.prototype._createListItem = function(item) {
    let listElement = document.createElement("li");
    if (item.done) {
      let classesListItem =
        this.idOfStatusButton === 1
          ? "todos__listitem todos__listitem--cleared todos__listitem--hidden"
          : "todos__listitem todos__listitem--cleared";
      listElement.setAttribute("class", classesListItem);
    } else {
      let classesListItem =
        this.idOfStatusButton === 2
          ? "todos__listitem todos__listitem--hidden"
          : "todos__listitem";
      listElement.setAttribute("class", classesListItem);
    }
    listElement.setAttribute("data-id", item.id);
    listElement.setAttribute("ondblclick", "TodosData.makeItemEditable(this)");
    listElement.innerHTML = item.value + this.listItemInnerHTML;
    let todoList = document.getElementsByClassName("todos__list")[0];
    todoList.appendChild(listElement);
  };

  /**
   * This function creates all new items in 'todos' array
   * from 'tempTodos' array.
   */
  TodosData.prototype._createAllTodoItems = function(tempTodos) {
    tempTodos.forEach(tempTodo => {
      // ES6: arrow function, this operator
      this.todos.push(new ListItem(tempTodo.id, tempTodo.value, tempTodo.done));
    });
    this.numberOfItemsLeft = this.todos.reduce(this._getNumberOfItemsLeft, 0);
    this.counter = this.todos[this.todos.length - 1].id + 1;
    this.idOfStatusButton = parseInt(
      localStorage.getItem("idOfStatusButton"),
      10
    );
    if (isNaN(this.idOfStatusButton)) {
      // Reset idOfStatusButton in case of error in
      // retrieval from localStorage
      this.idOfStatusButton = 0;
      localStorage.setItem("idOfStatusButton", this.idOfStatusButton);
    }
  };

  /**
   * This function creates all new List Items in the DOM
   * from 'todos' array.
   */
  TodosData.prototype._createAllListItems = function() {
    // ES6: arrow fn, this operator
    this.todos.forEach(todo => this._createListItem(todo));
  };

  /**
   * This function gets a 'todo' item from 'todos' array.
   */
  TodosData.prototype._getTodoItem = function(id) {
    for (let todo of this.todos) {
      // ES6: for..of loop
      if (todo.id === id) {
        return todo;
      }
    }
  };

  /**
   * This function updates a 'todo' item in 'todos' array.
   */
  TodosData.prototype._updateTodoItem = function(fieldToUpdate, id, newValue) {
    for (let todo of this.todos) {
      // ES6: for..of
      if (todo.id === id) {
        todo[fieldToUpdate] = newValue;
        if (fieldToUpdate === "done") {
          this.numberOfItemsLeft = this.todos.reduce(
            this._getNumberOfItemsLeft,
            0
          );
        }
        break;
      }
    }
  };

  /**
   * This function updates the list item in the DOM.
   */
  TodosData.prototype._updateListItem = function(listItem) {
    let idListItem = this._getIdOfListItem(listItem);
    let item = this._getTodoItem(idListItem);
    if (item.done) {
      let classesListItem =
        this.idOfStatusButton === 1
          ? "todos__listitem todos__listitem--cleared todos__listitem--hidden"
          : "todos__listitem todos__listitem--cleared";
      listItem.setAttribute("class", classesListItem);
    } else {
      let classesListItem =
        this.idOfStatusButton === 2
          ? "todos__listitem todos__listitem--hidden"
          : "todos__listitem";
      listItem.setAttribute("class", classesListItem);
    }
  };

  /**
   * This function updates all 'todo' items in 'todos' array.
   */
  TodosData.prototype._updateAllTodoItems = function(fieldToUpdate, newValue) {
    for (let todo of this.todos) {
      // ES6: for..of
      todo[fieldToUpdate] = newValue;
    }
    this.numberOfItemsLeft = this.todos.reduce(this._getNumberOfItemsLeft, 0);
  };

  /**
   * This function updates all list items in the DOM based on
   * the Status Button clicked.
   */
  TodosData.prototype._updateAllListItems = function() {
    let listItems = document.getElementsByClassName("todos__listitem");
    listItems = [...listItems]; // ES6: spread operator
    listItems.forEach(listItem => {
      // ES6: arrow fn, this operator
      this._updateListItem(listItem);
    });
  };

  /**
   * This function deletes a 'todo' item from 'todos' array.
   */
  TodosData.prototype._deleteTodoItem = function(id) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        this.todos.splice(i, 1);
        break;
      }
    }
    this.numberOfItemsLeft = this.todos.reduce(this._getNumberOfItemsLeft, 0);
  };

  /**
   * This function deletes all 'todo' items that are done
   * from 'todos' array.
   */
  TodosData.prototype._deleteAllDoneTodoItems = function() {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].done === true) {
        this.todos.splice(i, 1);
        i--;
      }
    }
    this.numberOfItemsLeft = this.todos.reduce(this._getNumberOfItemsLeft, 0);
  };

  /**
   * This function deletes all list items that are done
   * from the DOM.
   */
  TodosData.prototype._deleteAllDoneListItems = function() {
    let listItems = document.getElementsByClassName("todos__listitem");
    listItems = [...listItems]; // ES6: spread operator
    listItems
      .filter(listItem => { // ES6: arrow fn, this operator
        let listItemId = this._getIdOfListItem(listItem);
        for (let todo of this.todos) {
          if (todo.id === listItemId) {
            return false;
          }
        }
        return true;
      })
      .forEach(listItem => listItem.remove()); // ES6: arrow fn, this operator
  };

  /*----------------  Add New Item  --------------------*/
  TodosData.prototype.getInput = function(event) {
    const input = document.getElementsByClassName("newitem__input")[0];
    if (event.code === "Enter" && input.value !== "") {
      let tempItem = new ListItem(this.counter, input.value);

      // UPDATE state
      this._createTodoItem(tempItem);

      // UPDATE DOM elements
      this._createListItem(tempItem);
      this._updateStatusLeft();
      this._updateClearItems();
      this._updateTodos();
      input.value = "";

      // UPDATE Local Storage
      localStorage.setItem("todos", JSON.stringify(this.todos));
    }
  };

  /*--------  Mark All Items as Completed  -------------*/
  TodosData.prototype.markAllAsCompleted = function() {
    let labelElement = document.getElementsByClassName(
      "newitem__clearitems"
    )[0];
    let classesLabelElement = labelElement.getAttribute("class");
    // UPDATE state
    classesLabelElement.indexOf("newitem__clearitems--allitemsselected") === -1
      ? this._updateAllTodoItems("done", true)
      : this._updateAllTodoItems("done", false);

    // UPDATE DOM elements
    this._updateAllListItems();
    this._updateStatusLeft();
    this._updateStatusRight();
    this._updateClearItems();

    // UPDATE Local Storage
    localStorage.setItem("todos", JSON.stringify(this.todos));
  };

  /*------  Mark the selected Item as Completed  -------*/
  TodosData.prototype.setItemAsCompleted = function(node) {
    let listItem = node.parentNode;
    let classesListItem = listItem.getAttribute("class");
    let idListItem = this._getIdOfListItem(listItem);

    // UPDATE state
    classesListItem.indexOf("todos__listitem--cleared") === -1
      ? this._updateTodoItem("done", idListItem, true)
      : this._updateTodoItem("done", idListItem, false);

    // UPDATE DOM elements
    this._updateListItem(listItem);
    this._updateStatusLeft();
    this._updateStatusRight();
    this._updateClearItems();

    // UPDATE Local Storage
    localStorage.setItem("todos", JSON.stringify(this.todos));
  };

  /*--------  Double Click an Item to Edit  ------------*/
  TodosData.prototype.makeItemEditable = function(listItem) {
    // UPDATE DOM elements
    // 1. Update edit item
    let editItem = listItem.getElementsByClassName("todos__edititem")[0];
    let itemText = listItem.innerText;
    editItem.value = itemText.substr(0, itemText.length - 2);
    editItem.setAttribute("class", "todos__edititem todos__edititem--show");
    editItem.focus();
  };

  TodosData.prototype.itemEdited = function(event, editItem) {
    if (event.code === "Enter") {
      this.lostFocus(editItem);
    }
  };

  TodosData.prototype.lostFocus = function(editItem) {
    let idListItem = this._getIdOfListItem(editItem.parentNode);
    if (editItem.value !== "") {
      // UPDATE state: todos array
      this._updateTodoItem("value", idListItem, editItem.value);

      // UPDATE DOM elements
      editItem.parentNode.innerHTML = editItem.value + this.listItemInnerHTML;
    } else {
      // UPDATE state: Delete Item
      this._deleteTodoItem(idListItem);

      // UPDATE DOM
      editItem.onblur = null; // Remove triggers lostFocus() attached to onblur!!
      editItem.parentNode.remove();
      this._updateStatusLeft();
      this._updateStatusRight();
      this._updateClearItems();
      this._updateTodos();
    }

    // UPDATE Local Storage
    localStorage.setItem("todos", JSON.stringify(this.todos));
  };

  /*-----------  Delete the selected Item  -------------*/
  TodosData.prototype.deleteItem = function(node) {
    let listItem = node.parentNode;
    let idListItem = this._getIdOfListItem(listItem);

    // UPDATE state
    this._deleteTodoItem(idListItem);

    // UPDATE DOM
    listItem.remove();
    this._updateStatusLeft();
    this._updateStatusRight();
    this._updateClearItems();
    this._updateTodos();

    // UPDATE Local Storage
    localStorage.setItem("todos", JSON.stringify(this.todos));
  };

  /*-------   Handle Click for Status Buttons  ---------*/
  TodosData.prototype.onClickStatusButton = function(clickedButton) {
    if (
      clickedButton
        .getAttribute("class")
        .indexOf("todos_statusbutton--selected") !== -1
    ) {
      return;
    }

    // UPDATE state: idOfStatusButton
    this.idOfStatusButton = this._getIdOfListItem(clickedButton);

    // UPDATE DOM
    this._updateAllListItems();
    this._updateStatusButtons();

    // UPDATE Local Storage
    localStorage.setItem("idOfStatusButton", this.idOfStatusButton);
  };

  /*-----------  Clear Completed Items  ----------------*/
  TodosData.prototype.clearCompletedItems = function() {
    // UPDATE state
    this._deleteAllDoneTodoItems();

    // UPDATE DOM
    this._deleteAllDoneListItems();
    this._updateStatusLeft();
    this._updateStatusRight();
    this._updateClearItems();
    this._updateTodos();

    // UPDATE Local Storage
    localStorage.setItem("todos", JSON.stringify(this.todos));
  };

  TodosData.prototype.setTodosFromStorage = function() {
    let tempTodos = JSON.parse(localStorage.getItem("todos"));
    if (tempTodos.length !== 0) {
      // UPDATE state
      this._createAllTodoItems(tempTodos);

      // UPDATE DOM
      this._createAllListItems();
      this._updateStatusLeft();
      this._updateStatusRight();
      this._updateClearItems();
      this._updateStatusButtons();
      this._updateTodos();
    }
  };

  window.TodosData = new TodosData();
})(window);

if (window.addEventListener)
  window.addEventListener(
    "load",
    TodosData.setTodosFromStorage.bind(TodosData)
  );
else if (window.attachEvent)
  window.attachEvent("onload", TodosData.setTodosFromStorage.bind(TodosData));
else window.onload = TodosData.setTodosFromStorage.bind(TodosData);
