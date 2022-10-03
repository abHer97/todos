/*jshint eqeqeq:false */
(function (window) {
	'use strict';

	/**
	 * Creates a new client side storage object and will create an empty
	 * collection if no collection already exists.
	 *
	 * @param {string} name The name of our DB we want to use
	 * @param {function} callback Our fake DB uses callbacks because in
	 * real life you probably would be making AJAX calls
	 */
	function Store(name, callback) {
		callback = callback || function () {};

		this._dbName = name;

		if (!this[name]) {
			var data = {
				todos: []
			};

			this[name] = data;
		}

		callback.call(this, this[name]);
	}

	/**
	 * Finds items based on a query given as a JS object
	 *
	 * @param {object} query The query to match against (i.e. {foo: 'bar'})
	 * @param {function} callback	 The callback to fire when the query has
	 * completed running
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 // data will return any items that have foo: bar and
	 *	 // hello: world in their properties
	 * });
	 */
	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}

		var todos = this[this._dbName].todos;

		callback.call(this, todos.filter(function (todo) {
			for (var q in query) {
				if (query[q] !== todo[q]) {
					return false;
				}
			}
			return true;
		}));
	};

	/**
	 * Will retrieve all data from the collection
	 *
	 * @param {function} callback The callback to fire upon retrieving data
	 */
	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};
		callback.call(this, this[this._dbName].todos);
	};

	/**
	 * Will save the given data to the DB. If no item exists it will create a new
	 * item, otherwise it'll simply update an existing item's properties
	 *
	 * @param {object} updateData The data to save back into the DB
	 * @param {function} callback The callback to fire after saving
	 * @param {number} id An optional param to enter an ID of an item to update
	 */
	Store.prototype.save = function (updateData, callback, id) {
		var data = this[this._dbName];
		var todos = data.todos;

		callback = callback || function () {};

		// If an ID was actually given, find the item and update each property
		if (id) {
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					for (var key in updateData) {
						todos[i][key] = updateData[key];
					}
					break;
				}
			}

			this[this._dbName] = data;
			console.log(this[this._dbName].todos)
			callback.call(this, this[this._dbName].todos);
		} else {
			// Generate an ID
			updateData.id = new Date().getTime();

			todos.push(updateData);
			this[this._dbName] = data;
			callback.call(this, [updateData]);
		}
	};

	
	/**
	 * Will delete a specific element if provided id is found in database
	 * 
	 * @param {number} id ID of the element to be deleted 
	 * @param {function} callback The callback to fire after saving. Will receive updated todos as param
	 */
	Store.prototype.remove = function (id, callback) {
		var data = this[this._dbName];
		var todos = data.todos;
		var updated = []

		callback = callback || function () { };

		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id !== id) {
				updated.push(todos[i]);
			}
		}

		data.todos = updated;
		this[this._dbName] = data;
		callback.call(this, this[this._dbName].todos);
	}

	/**
	 * Will drop all storage and start fresh
	 *
	 * @param {function} callback The callback to fire after dropping the data
	 */
	Store.prototype.drop = function (callback) {
		this[this._dbName] = {todos: []};
		callback.call(this, this[this._dbName].todos);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);
