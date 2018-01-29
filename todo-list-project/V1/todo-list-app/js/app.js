/*global app, $on */
(function () {
	'use strict';


	/**
	 * Configure une toute nouvelle Todo list.
	 * @param {string} (name) Le nom de votre nouvelle TODO list.
	 */
	function Todo(name) {
		this.storage = new app.Store(name); // this.storage = new app.Store avec en paramètre un nom
		this.model = new app.Model(this.storage);
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.model, this.view);
	}

	var todo = new Todo('todos-vanillajs'); // dans View.js, View.prototype.bind() et View.prototype.render()

	/**
	 * [setView description]
	 */
	function setView() { // dans Controller.js, Controller.prototype.setView
		todo.controller.setView(document.location.hash);
	}


	$on(window, 'load', setView);
	$on(window, 'hashchange', setView);
})();
