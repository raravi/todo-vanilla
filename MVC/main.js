/* Helpers */
(function(window) {
  "use strict";

  /**
   * Get element(s) by CSS selector
   */
  window.qs = function(selector, scope) {
    return (scope || document).querySelector(selector);
  };
  window.qsa = function(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };

  /**
   * addEventListener wrapper
   */
  window.$on = function(target, type, callback, useCapture) {
    target.addEventListener(type, callback, !!useCapture);
  };
})(window);

/* Storage */
(function(window) {
  "use strict";

  /**
   * The main object to hold all data relevant to the Todo List
   */
  function Store() {
    this.todos = [];
    this.counter = 0;
    this.numberOfItemsLeft = 0;
    this.idOfStatusButton = 0;
  }

  /**
   * The ListItem object represents an item in the Todo List
   */
  function ListItem(id, value) {
    var done =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    this.id = id;
    this.value = value;
    this.done = done;
  }

  /**
   * This function updates the number of items left 'To Do' in the list.
   */
  Store.prototype._getNumberOfItemsLeft = function(total, value) {
    return value.done ? total : total + 1;
  };

  /**
   * This function creates a new item in 'todos' array.
   */
  Store.prototype.createTodoItem = function(value, callback) {

    callback = callback || function() {};

    var item = new ListItem(this.counter, value);
    this.todos.push(item);
    this.numberOfItemsLeft = this.todos.reduce(this._getNumberOfItemsLeft, 0);
    this.counter++;

    localStorage.setItem("todos", JSON.stringify(this.todos));
    callback.call(this, {
      item: item,
      length: this.todos.length,
      numberOfItemsLeft: this.numberOfItemsLeft,
      idOfStatusButton: this.idOfStatusButton
    });
  };

  /**
   * This function creates all new items in 'todos' array
   * from 'tempTodos' array.
   */
  Store.prototype.createAllTodoItems = function(callback) {
    var _this = this;
    var tempTodos = JSON.parse(localStorage.getItem("todos"));
    if (!tempTodos || tempTodos.length === 0) {
      return;
    }
    tempTodos.forEach(function(tempTodo) {
      _this.todos.push(
        new ListItem(tempTodo.id, tempTodo.value, tempTodo.done)
      );
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

    callback.call(this, {
      todos: this.todos,
      length: this.todos.length,
      idOfStatusButton: this.idOfStatusButton,
      numberOfItemsLeft: this.numberOfItemsLeft
    });
  };

  /**
   * This function gets a 'todo' item from 'todos' array.
   */
  Store.prototype.getTodoItemValue = function(id, callback) {
    var item;
    for (var i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        item = this.todos[i];
      }
    }

    callback.call(this, {item: item});
  }

  /**
   * This function updates a 'todo' item in 'todos' array.
   */
  Store.prototype.updateTodoItem = function(fieldToUpdate, id, newValue, callback) {
    var item;
    for (var i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        if (fieldToUpdate === "done") {
          this.todos[i][fieldToUpdate] = !this.todos[i][fieldToUpdate];
          item = this.todos[i];
          this.numberOfItemsLeft = this.todos.reduce(
            this._getNumberOfItemsLeft,
            0
          );
        } else {
          this.todos[i][fieldToUpdate] = newValue;
          item = this.todos[i];
        }
        break;
      }
    }

    localStorage.setItem("todos", JSON.stringify(this.todos));

    callback.call(this, {
      item: item,
      length: this.todos.length,
      numberOfItemsLeft: this.numberOfItemsLeft,
      idOfStatusButton: this.idOfStatusButton
    });
  };

  /**
   * This function updates all 'todo' items in 'todos' array.
   */
  Store.prototype.updateAllTodoItems = function(fieldToUpdate, newValue, callback) {
    for (var i = 0; i < this.todos.length; i++) {
      this.todos[i][fieldToUpdate] = newValue;
    }
    this.numberOfItemsLeft = this.todos.reduce(this._getNumberOfItemsLeft, 0);

    localStorage.setItem("todos", JSON.stringify(this.todos));

    callback.call(this, {
      todos: this.todos,
      length: this.todos.length,
      numberOfItemsLeft: this.numberOfItemsLeft,
      idOfStatusButton: this.idOfStatusButton
    });
  };

  /**
   * This function deletes a 'todo' item from 'todos' array.
   */
  Store.prototype.deleteTodoItem = function(id, callback) {
    for (var i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        this.todos.splice(i, 1);
        break;
      }
    }
    this.numberOfItemsLeft = this.todos.reduce(this._getNumberOfItemsLeft, 0);

    localStorage.setItem("todos", JSON.stringify(this.todos));

    callback.call(this, {
      id: id,
      length: this.todos.length,
      numberOfItemsLeft: this.numberOfItemsLeft,
    });
  };

  /**
   * This function deletes all 'todo' items that are done
   * from 'todos' array.
   */
  Store.prototype.deleteAllDoneTodoItems = function(callback) {
    for (var i = 0; i < this.todos.length; i++) {
      if (this.todos[i].done) {
        this.todos.splice(i, 1);
        i--;
      }
    }
    this.numberOfItemsLeft = this.todos.reduce(this._getNumberOfItemsLeft, 0);

    localStorage.setItem("todos", JSON.stringify(this.todos));

    callback.call(this, {
      todos: this.todos,
      length: this.todos.length,
      numberOfItemsLeft: this.numberOfItemsLeft,
    });
  };

  /**
   * This function updates the Status Button to
   * All / Active / Completed.
   */
  Store.prototype.updateStatus = function(id, callback) {
    this.idOfStatusButton = id;

    localStorage.setItem("idOfStatusButton", this.idOfStatusButton);

    callback.call(this, {
      todos: this.todos,
      idOfStatusButton: this.idOfStatusButton
    });
  }

  /**
  * Export to window
  */
	window.app = window.app || {};
	window.app.Store = Store;
})(window);

/* Model */
(function(window) {
  "use strict";

  function Model(storage) {
    this.storage = storage;
  }

  /**
   * C of CRUD:
   * 1 of 2. Creates a New Todo Item in the Store.
   */
  Model.prototype.create = function(value, callback) {
    value = value || "";
    callback = callback || function() {};

    this.storage.createTodoItem(value.trim(), callback);
  };

  /**
   * C of CRUD:
   * 2 of 2. Creates all Todo Items (from localStorage)
   * in the Store.
   */
  Model.prototype.createAll = function(callback) {
    callback = callback || function() {};

    this.storage.createAllTodoItems(callback);
  };

  /**
   * R of CRUD:
   * 1 of 1. Reads the value of a Todo from Store.
   */
  Model.prototype.read = function(id, callback) {
    callback = callback || function() {};

    this.storage.getTodoItemValue(id, callback);
  };

  /**
   * U of CRUD:
   * 1 of 3. Updates a Todo Item in the Store.
   */
  Model.prototype.update = function(fieldToUpdate, id, newValue, callback) {
    callback = callback || function() {};

    this.storage.updateTodoItem(fieldToUpdate, id, newValue, callback);
  };

  /**
   * U of CRUD:
   * 2 of 3. Updates all Todo Items in the Store.
   */
  Model.prototype.updateAll = function(fieldToUpdate, newValue, callback) {
    callback = callback || function() {};

    this.storage.updateAllTodoItems(fieldToUpdate, newValue, callback);
  };

  /**
   * U of CRUD:
   * 3 of 3. Updates Status Button in the Store.
   */
  Model.prototype.updateStatus = function(idOfClickedStatusButton, callback) {
    callback = callback || function() {};

    this.storage.updateStatus(idOfClickedStatusButton, callback);
  }

  /**
   * D of CRUD:
   * 1 of 2. Deletes a Todo Item in the Store.
   */
  Model.prototype.delete = function(id, callback) {
    callback = callback || function() {};

    this.storage.deleteTodoItem(id, callback);
  };

  /**
   * D of CRUD:
   * 2 of 2. Deletes all done Todo Item in the Store.
   */
  Model.prototype.deleteAllDone = function(callback) {
    callback = callback || function() {};

    this.storage.deleteAllDoneTodoItems(callback);
  };

  /**
  * Export to window
  */
  window.app = window.app || {};
  window.app.Model = Model;
})(window);

/* View */
(function(window) {
  "use strict";

  function View() {
    this.$input = qs(".newitem__input");
    this.$clearItems = qs(".newitem__clearitems");
    this.$todoList = qs(".todos__list");
    this.$statusButtons = qs(".todos__statuscenter");
    this.$statusRight = qs(".todos__statusright");
    this.$itemDeletedAlready = false;
    this.$listItemInnerHTML = '<div class="todos__toggleitem"></div><div class="todos__deleteitem">x</div><input type="text" name="edititem" class="todos__edititem"></input>';
  }

  /**
   * This function gets the ID of list item as an Integer.
   */
  View.prototype._getIdOfListItem = function(listItem) {
    return parseInt(listItem.getAttribute("data-id"), 10);
  };

  /**
   * This function creates a new List Item in the DOM.
   */
  View.prototype._createListItem = function(item, idOfStatusButton) {
    var listElement = document.createElement("li");
    var classesListItem;
    if (item.done) {
      classesListItem =
        idOfStatusButton === 1
          ? "todos__listitem todos__listitem--cleared todos__listitem--hidden"
          : "todos__listitem todos__listitem--cleared";
      listElement.setAttribute("class", classesListItem);
    } else {
      classesListItem =
        idOfStatusButton === 2
          ? "todos__listitem todos__listitem--hidden"
          : "todos__listitem";
      listElement.setAttribute("class", classesListItem);
    }
    listElement.setAttribute("data-id", item.id);
    listElement.innerHTML = item.value + this.$listItemInnerHTML;
    var todoList = document.getElementsByClassName("todos__list")[0];
    todoList.appendChild(listElement);
  };

  /**
   * This function creates all new List Items in the DOM
   * from 'todos' array.
   */
  View.prototype._createAllListItems = function(todos, idOfStatusButton) {
    var _this = this;
    todos.forEach(function(todo) {
      _this._createListItem(todo, idOfStatusButton);
    });
  };

  /**
   * This function updates the list item in the DOM.
   */
  View.prototype._updateListItem = function(item, idOfStatusButton) {
    var listItems = document.getElementsByClassName("todos__listitem");
    var classesListItem;
    for (var i = 0; i < listItems.length; i++) {
      if (item.id === this._getIdOfListItem(listItems[i])) {
        if (item.done) {
          classesListItem =
            idOfStatusButton === 1
              ? "todos__listitem todos__listitem--cleared todos__listitem--hidden"
              : "todos__listitem todos__listitem--cleared";
          listItems[i].setAttribute("class", classesListItem);
        } else {
          classesListItem =
            idOfStatusButton === 2
              ? "todos__listitem todos__listitem--hidden"
              : "todos__listitem";
          listItems[i].setAttribute("class", classesListItem);
        }
        listItems[i].innerHTML = item.value + this.$listItemInnerHTML;
        break;
      }
    }
  };

  /**
   * This function updates all list items in the DOM
   * based on the Status Button clicked.
   */
  View.prototype._updateAllListItems = function(todos, idOfStatusButton) {
    var listItems = document.getElementsByClassName("todos__listitem");
    var classesListItem;
    for (var i = 0; i < listItems.length; i++) {
      var idOfListItem = this._getIdOfListItem(listItems[i]);
      for (var j = 0; j < todos.length; j++) {
        if (idOfListItem === todos[j].id) {
          if (todos[j].done) {
            classesListItem =
              idOfStatusButton === 1
                ? "todos__listitem todos__listitem--cleared todos__listitem--hidden"
                : "todos__listitem todos__listitem--cleared";
            listItems[i].setAttribute("class", classesListItem);
          } else {
            classesListItem =
              idOfStatusButton === 2
                ? "todos__listitem todos__listitem--hidden"
                : "todos__listitem";
            listItems[i].setAttribute("class", classesListItem);
          }
          break;
        }
      }
    }
  };

  /**
   * This function activates editing of the
   * list item in the DOM.
   */
  View.prototype._editListItem = function(item) {
    var listItem;
    var listItems = document.getElementsByClassName("todos__listitem");
    for (var i = 0; i < listItems.length; i++) {
      var idOfItem = this._getIdOfListItem(listItems[i]);
      if (idOfItem === item.id) {
        listItem = listItems[i];
        break;
      }
    }
    var editItem = listItem.getElementsByClassName("todos__edititem")[0];
    editItem.value = item.value;
    editItem.setAttribute("class", "todos__edititem todos__edititem--show");
    editItem.focus();
  };

  /**
   * This function deletes a list item from the DOM.
   */
  View.prototype._deleteListItem = function(id) {
    var listItems = document.getElementsByClassName("todos__listitem");
    for (var i = 0; i < listItems.length; i++) {
      var idOfItem = this._getIdOfListItem(listItems[i]);
      if (idOfItem === id) {
        listItems[i].remove();
        break;
      }
    }
  };

  /**
   * This function checks if the list item has
   * already been deleted from the DOM!
   * It's a hack, to prevent the side effect of
   * 'blur' event being called when a node is
   * 'remove'd from DOM.
   */
  View.prototype._deletedAlready = function(id) {
    this.$itemDeletedAlready = true;
  };

  /**
   * This function deletes all list items that are done
   * from the DOM.
   */
  View.prototype._deleteAllDoneListItems = function(todos) {
    var listItems = document.getElementsByClassName("todos__listitem");
    for (var i = 0; i < listItems.length; i++) {
      var listItemId = this._getIdOfListItem(listItems[i]);
      var deleted = true;
      for (var j = 0; j < todos.length; j++) {
        if (todos[j].id === listItemId) {
          deleted = false;
        }
      }
      if (deleted) {
        listItems[i].remove();
        i--;
      }
    }
  };

  /**
   * This function updates the number of items left
   * 'To Do' on the left of status bar.
   */
  View.prototype._updateStatusLeft = function(numberOfItemsLeft) {
    var statusLeft = document.getElementsByClassName("todos__statusleft")[0];
    statusLeft.innerHTML = numberOfItemsLeft + " items left";
  };

  /**
   * This function hides/unhides the 'Clear Completed'
   * link on the right of status bar.
   */
  View.prototype._updateStatusRight = function(length, numberOfItemsLeft) {
    var statusRight = document.getElementsByClassName("todos__statusright")[0];
    if (numberOfItemsLeft === length) {
      statusRight.setAttribute("class", "todos__statusright");
    } else {
      statusRight.setAttribute(
        "class",
        "todos__statusright todos__statusright--itemsselected"
      );
    }
  };

  /**
   * This function updates the 'Clear/Unclear All'
   * items on the new input box.
   */
  View.prototype._updateClearItems = function(length, numberOfItemsLeft) {
    var labelElement = document.getElementsByClassName(
      "newitem__clearitems"
    )[0];
    if (length === 0) {
      labelElement.setAttribute("class", "newitem__clearitems");
    } else if (numberOfItemsLeft === 0) {
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
  View.prototype._updateStatusButtons = function(idOfStatusButton) {
    var buttons = document.getElementsByClassName("todos__statusbutton");
    for (var i = 0; i < buttons.length; i++) {
      var idOfButton = this._getIdOfListItem(buttons[i]);
      if (idOfButton === idOfStatusButton) {
        buttons[i].setAttribute(
          "class",
          "todos__statusbutton todos__statusbutton--selected"
        );
      } else {
        buttons[i].setAttribute("class", "todos__statusbutton");
      }
    }
  };

  /**
   * This function hides/unhides the Todo List Items.
   */
  View.prototype._updateTodos = function(length) {
    var todosElement = document.getElementsByClassName("todos")[0];
    if (length === 0) {
      todosElement.setAttribute("class", "todos");
    } else {
      todosElement.setAttribute("class", "todos todos--itemspresent");
    }
  };

  /**
   * Renders the view, by calling the method
   * requested by the controller.
   */
  View.prototype.render = function(viewCmd, parameter) {
    var _this = this;
    var viewCommands = {
      createListItem: function() {
        _this._createListItem(parameter.item, parameter.idOfStatusButton);
      },
      createAllListItems: function() {
        _this._createAllListItems(parameter.todos, parameter.idOfStatusButton);
      },
      updateListItem: function() {
        _this._updateListItem(parameter.item, parameter.idOfStatusButton);
      },
      updateAllListItems: function() {
        _this._updateAllListItems(parameter.todos, parameter.idOfStatusButton);
      },
      editListItem: function() {
        _this._editListItem(parameter.item);
      },
      deleteListItem: function() {
        _this._deleteListItem(parameter.id);
      },
      deletedAlready: function() {
        _this._deletedAlready();
      },
      deleteAllDoneListItems: function() {
        _this._deleteAllDoneListItems(parameter.todos);
      },
      updateStatusLeft: function() {
        _this._updateStatusLeft(parameter.numberOfItemsLeft);
      },
      updateStatusRight: function() {
        _this._updateStatusRight(parameter.length, parameter.numberOfItemsLeft);
      },
      updateClearItems: function() {
        _this._updateClearItems(parameter.length, parameter.numberOfItemsLeft);
      },
      updateStatusButtons: function() {
        _this._updateStatusButtons(parameter.idOfStatusButton);
      },
      updateTodos: function() {
        _this._updateTodos(parameter.length);
      },
      clearInput: function() {
        _this.$input.value = "";
      }
    };

    viewCommands[viewCmd]();
  };

  /**
   * Binds the handler function defined in the Controller
   * to each of the user events.
   */
  View.prototype.bind = function(userEvent, handler) {
    var _this = this;
    if (userEvent === "newTodo") {
      $on(_this.$input, "keyup", function(event) {
        if (event.code === "Enter") {
          handler(_this.$input.value);
        }
      });
    } else if (userEvent === "markOrUnmarkTodo") {
      $on(_this.$todoList, "click", function(event) {
        if (event.target.getAttribute("class").indexOf("todos__toggleitem") !== -1) {
          var idListItem = _this._getIdOfListItem(event.target.parentNode);
          handler(idListItem);
        }
      });
    } else if (userEvent === "markOrUnmarkAllTodos") {
      $on(_this.$clearItems, "click", function() {
        var notAllSelected = _this.$clearItems.getAttribute("class").indexOf("newitem__clearitems--allitemsselected") === -1;
        handler(notAllSelected);
      });
    } else if (userEvent === "editTodo") {
      $on(_this.$todoList, "dblclick", function(event) {
        if (event.target.getAttribute("class").indexOf("todos__listitem") !== -1) {
          var idListItem = _this._getIdOfListItem(event.target);
          handler(idListItem);
        }
      });
    } else if (userEvent === "todoEdited") {
      $on(_this.$todoList, "keyup", function(event) {
        if (event.target.getAttribute("class").indexOf("todos__edititem") !== -1 && event.code === "Enter") {
          var idListItem = _this._getIdOfListItem(event.target.parentNode);
          var value = event.target.value;
          handler(idListItem, value);
        }
      });
      $on(_this.$todoList, "blur", function(event) {
        if (_this.$itemDeletedAlready) {
          _this.$itemDeletedAlready = false;
          return;
        }
        if (event.target.getAttribute("class").indexOf("todos__edititem") !== -1) {
          var idListItem = _this._getIdOfListItem(event.target.parentNode);
          var value = event.target.value;
          handler(idListItem, value);
        }
      }, true);
    } else if (userEvent === "deleteTodo") {
      $on(_this.$todoList, "click", function(event) {
        if (event.target.getAttribute("class").indexOf("todos__deleteitem") !== -1) {
          var idListItem = _this._getIdOfListItem(event.target.parentNode);
          handler(idListItem);
        }
      });
    } else if (userEvent === "statusButtonClicked") {
      $on(_this.$statusButtons, "click", function(event) {
        if (event.target.getAttribute("class").indexOf("todos__statusbutton") !== -1 && event.target.getAttribute("class")
        .indexOf("todos__statusbutton--selected") === -1) {
          var idOfClickedStatusButton = _this._getIdOfListItem(event.target);
          handler(idOfClickedStatusButton);
        }
      });
    } else if (userEvent === "clearCompletedTodos") {
      $on(_this.$statusRight, "click", function() {
        handler();
      });
    } else if (userEvent === "restoreTodos") {
      $on(window, "load", function() {
        handler();
      });
    }
  };

  /**
   * Export to window
   */
  window.app = window.app || {};
  window.app.View = View;
})(window);

/* Controller */
(function(window) {
  "use strict";

  function Controller(model, view) {
    var _this = this;
    this.model = model;
    this.view = view;

    /*
     * Pass the handler() function to be binded
     * by the View for each user event.
     */
    _this.view.bind("newTodo", function(value) {
      _this.getInput(value);
    });

    _this.view.bind("markOrUnmarkAllTodos", function(notAllSelected) {
      _this.markAllAsCompleted(notAllSelected);
    });

    _this.view.bind("markOrUnmarkTodo", function(idListItem) {
      _this.setItemAsCompleted(idListItem);
    });

    _this.view.bind("editTodo", function(idListItem) {
      _this.makeItemEditable(idListItem);
    });

    _this.view.bind("todoEdited", function(idListItem, value) {
      _this.lostFocus(idListItem, value);
    });

    _this.view.bind("deleteTodo", function(idListItem) {
      _this.deleteItem(idListItem);
    });

    _this.view.bind("statusButtonClicked", function(idOfClickedStatusButton) {
      _this.onClickStatusButton(idOfClickedStatusButton);
    });

    _this.view.bind("clearCompletedTodos", function() {
      _this.clearCompletedItems();
    });

    _this.view.bind("restoreTodos", function() {
      _this.setTodosFromStorage();
    });
  }

  /**
   * Add New Item
   */
  Controller.prototype.getInput = function(value) {
    var _this = this;
    if (value.trim() === "") {
      return;
    }

    _this.model.create(value, function(parameter) {
      _this.view.render("createListItem", parameter);
      _this.view.render("updateStatusLeft", parameter);
      _this.view.render("updateClearItems", parameter);
      _this.view.render("updateTodos", parameter);
      _this.view.render("clearInput");
    });
  };

  /**
   * Mark / Unmark All Items as Completed
   */
  Controller.prototype.markAllAsCompleted = function(notAllSelected) {
    var _this = this;
    if (notAllSelected === null) {
      return;
    }

    _this.model.updateAll("done", notAllSelected, function(parameter) {
      _this.view.render("updateAllListItems", parameter);
      _this.view.render("updateStatusLeft", parameter);
      _this.view.render("updateStatusRight", parameter);
      _this.view.render("updateClearItems", parameter);
    });
  };

  /**
   * Mark / Unmark Item As Completed
   */
  Controller.prototype.setItemAsCompleted = function(idListItem) {
    var _this = this;
    _this.model.update("done", idListItem, null,  function(parameter) {
      _this.view.render("updateListItem", parameter);
      _this.view.render("updateStatusLeft", parameter);
      _this.view.render("updateStatusRight", parameter);
      _this.view.render("updateClearItems", parameter);
    });
  }

  /**
   * Make an Item editable
   */
  Controller.prototype.makeItemEditable = function(idListItem) {
    var _this = this;
    _this.model.read(idListItem, function(parameter) {
      _this.view.render("editListItem", parameter);
    });
  }

  /**
   * Update an edited item
   */
  Controller.prototype.lostFocus = function(idListItem, value) {
    var _this = this;
    if (value) {
      _this.model.update("value", idListItem, value,  function(parameter) {
        _this.view.render("updateListItem", parameter);
      });
    } else {
      _this.model.delete(idListItem, function(parameter) {
        _this.view.render("deletedAlready", parameter);
        _this.view.render("deleteListItem", parameter);
        _this.view.render("updateStatusLeft", parameter);
        _this.view.render("updateStatusRight", parameter);
        _this.view.render("updateClearItems", parameter);
        _this.view.render("updateTodos", parameter);
      });
    }
  }

  /**
   * Delete an Item
   */
  Controller.prototype.deleteItem = function(idListItem) {
    var _this = this;
    _this.model.delete(idListItem, function(parameter) {
      _this.view.render("deleteListItem", parameter);
      _this.view.render("updateStatusLeft", parameter);
      _this.view.render("updateStatusRight", parameter);
      _this.view.render("updateClearItems", parameter);
      _this.view.render("updateTodos", parameter);
    });
  }

  /**
   * Handle the click on Status Buttons
   */
  Controller.prototype.onClickStatusButton = function(idOfClickedStatusButton) {
    var _this = this;
    _this.model.updateStatus(idOfClickedStatusButton, function(parameter) {
      _this.view.render("updateAllListItems", parameter);
      _this.view.render("updateStatusButtons", parameter);
    });
  }

  /**
   * Delete all Completed items
   */
  Controller.prototype.clearCompletedItems = function() {
    var _this = this;
    _this.model.deleteAllDone(function(parameter) {
      _this.view.render("deleteAllDoneListItems", parameter);
      _this.view.render("updateStatusLeft", parameter);
      _this.view.render("updateStatusRight", parameter);
      _this.view.render("updateClearItems", parameter);
      _this.view.render("updateTodos", parameter);
    });
  }

  /**
   * On Load, Initialize Todos from localStorage
   * if available
   */
  Controller.prototype.setTodosFromStorage = function() {
    var _this = this;

    _this.model.createAll(function(parameter) {
      _this.view.render("createAllListItems", parameter);
      _this.view.render("updateStatusLeft", parameter);
      _this.view.render("updateStatusRight", parameter);
      _this.view.render("updateClearItems", parameter);
      _this.view.render("updateStatusButtons", parameter);
      _this.view.render("updateTodos", parameter);
    });
  };

  /**
   * Export to window
   */
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);

/* Init */
(function() {
  "use strict";

  /**
   * Sets up a brand new Todo list.
   */
  function Todo() {
    this.storage = new app.Store();
    this.model = new app.Model(this.storage);
    this.view = new app.View();
    this.controller = new app.Controller(this.model, this.view);
  }

  var todo = new Todo();

})();
