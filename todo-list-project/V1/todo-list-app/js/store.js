/*jshint eqeqeq:false */
(function (window) {
	'use strict';


	/**
	 * Crée un nouvel objet de stockage côté client et crée un espace vide aucun stockage existe.
	 * @param {string} (name) Le nom de notre DB que nous voulons utiliser
	 * @param {function} (callback) Notre fausse DB utilise des rappels car dans
	 * la vie réelle, vous feriez probablement des appels AJAX
	 */
	function Store(name, callback) {
		callback = callback || function () {};

		this._dbName = name; // _dbName est une méthode privé de l'objet name

		if (!localStorage[name]) {
			var data = {
				todos: []
			};

			localStorage[name] = JSON.stringify(data);
		}

		callback.call(this, JSON.parse(localStorage[name]));
	}


	/**
	 * Trouve les éléments basés sur une requête donnée en tant qu'objet JS
	 * @param {object} (query) La requête à comparer (c'est-à-dire {foo: 'bar'})
	 * @param {function} (callback) La fonction de rappel à déclencher lorsque l' exécution de
	 * la requête est terminée
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 données retournera tous les éléments qui ont foo: bar et
	 *	 hello: world dans leurs propriétés
	 * });
	 */
	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}

		var todos = JSON.parse(localStorage[this._dbName]).todos;

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
	 * Récupére toutes les données
	 * @param {function} (callback) La fonction de rappel lors de la récupération des données
	 */
	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};
		callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
	};


	/**
	 * Sauvegarde les données données dans la base de données. Si aucun élément n'existe, un nouveau élément
	 *  sera créé, sinon une mise à jour des propriétés de l' élément existant sera réalisé
	 * @param {object} (updateData) Les données à sauvegarder dans la base de données
	 * @param {function} (callback) La fonction de rappel après l'enregistrement
	 * @param {number} (id) Un paramètre facultatif pour entrer un ID d'un élément à mettre à jour
	 */
	Store.prototype.save = function (updateData, callback, id) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;

		callback = callback || function () {};

		// Génére un identifiant
	    var newId = "";
	    var charset = "0123456789";

        for (var i = 0; i < 19 ; i++) {
     		newId += charset.charAt(Math.floor(Math.random() * charset.length));
		}

		// Si un ID a été donné, trouve l'élément et met à jour les propriétés
		if (id) {
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					for (var key in updateData) {
						todos[i][key] = updateData[key];
					}
					break;
				}
			}

			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, todos);
		} else {

    		// Attribue un ID
			updateData.id = parseInt(newId);
			todos.push(updateData);
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, [updateData]);
		}
	};


	/**
	 * Retire un élément en fonction de son identifiant
	 * @param {number} (id) L'identifiant de l'objet que vous souhaitez supprimer
	 * @param {function} (callback) The callback après l'enregistrement
	 */
	Store.prototype.remove = function (id, callback) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;
		var todoId;

		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == id) {
				todoId = todos[i].id;
			}
		}

		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == todoId) {
				todos.splice(i, 1);
			}
		}

		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, todos);
	};

	/**
	 * Commence un nouveau stockage
	 * @param {function} (callback) La fonction de rappel après avoir déposé les données
	 */
	Store.prototype.drop = function (callback) {
		var data = {todos: []};
		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, data.todos);
	};


	// Exporte vers Window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);
