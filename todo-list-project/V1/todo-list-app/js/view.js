/*global qs, qsa, $on, $parent, $delegate */

(function (window) {
	'use strict';


	/**
	 * Définit les valeurs par défaut du template
	 * @constructor
	 */
	function View(template) {
		this.template = template;

		this.ENTER_KEY = 13;
		this.ESCAPE_KEY = 27;

		this.$todoList = qs('.todo-list');
		this.$todoItemCounter = qs('.todo-count');
		this.$clearCompleted = qs('.clear-completed');
		this.$main = qs('.main');
		this.$footer = qs('.footer');
		this.$toggleAll = qs('.toggle-all');
		this.$newTodo = qs('.new-todo');
	}


	/**
	 * Supprime la Todo en fonction de l’ id
	 * @param {number} (id) L' ID de l' élément à supprimer
	*/
	View.prototype._removeItem = function (id) {
		var elem = qs('[data-id="' + id + '"]');

		if (elem) {
			this.$todoList.removeChild(elem);
		}
	};


	/**
	 * Masque les éléments terminés
	 * @param  {number} (completedCount) Le nombre d' élément coché
	 * @param  {bolean} (visible) True si visible, false sinon
	 */
	View.prototype._clearCompletedButton = function (completedCount, visible) {
		this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
		this.$clearCompleted.style.display = visible ? 'block' : 'none';
	};


	/**
	 * Indique la page actuelle
	 * @param {string} (currentPage) La page actuelle '' || active || completed
	 */
	View.prototype._setFilter = function (currentPage) {
		qs('.filters .selected').className = '';
		qs('.filters [href="#/' + currentPage + '"]').className = 'selected';
	};


	/**
	 * Test si l' élément' est terminé ?
	 * @param  {number} (id) L'ID de l'élément à tester
	 * @param  {bolean} (completed) Le statut de l' élément
	 */
	View.prototype._elementComplete = function (id, completed) {
		var listItem = qs('[data-id="' + id + '"]');

		if (!listItem) {
			return;
		}

		listItem.className = completed ? 'completed' : '';

		// Valider un élément en cochant la case
		qs('input', listItem).checked = completed;
	};


	/**
	 * Permet l' édition d'un élément
	 * @param  {number} (id) L' ID de l' élément à éditer
	 * @param  {string} (title) Le contenu de la modification de l' élément
	 */
	View.prototype._editItem = function (id, title) {
		var listItem = qs('[data-id="' + id + '"]');

		if (!listItem) {
			return;
		}

		listItem.className = listItem.className + ' editing';

		var input = document.createElement('input');
		input.className = 'edit';

		listItem.appendChild(input);
		input.focus();
		input.value = title;
	};


	/**
	 * Remplace l' ancien élément par l' élément édité
	 * @param  {number} (id)    L' ID de l' élément à éditer
	 * @param  {string} (title) Le contenu de le la modification de l' élément
	 */
	View.prototype._editItemDone = function (id, title) {
		var listItem = qs('[data-id="' + id + '"]');

		if (!listItem) {
			return;
		}

		var input = qs('input.edit', listItem);
		listItem.removeChild(input);

		listItem.className = listItem.className.replace('editing', '');

		qsa('label', listItem).forEach(function (label) {
			label.textContent = title;
		});
		//console.log(`_editItemDone(), ID : ` + id);
	};


	/**
	 * [render description]
	 * @param  {string} viewCmd   La fonction active
	 * @param  {object} parameter Les paramètres actifs
	 */
	View.prototype.render = function (viewCmd, parameter) {
		var self = this;
		var viewCommands = {
			showEntries: function () {
				self.$todoList.innerHTML = self.template.show(parameter);
				//console.log('render.showEntries()');
			},
			removeItem: function () {
				self._removeItem(parameter);
				//console.log('render.removeItem()' + parameter);
			},
			updateElementCount: function () {
				self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
				//console.log('render.updateElementCount()');
			},
			clearCompletedButton: function () {
				self._clearCompletedButton(parameter.completed, parameter.visible);
				//console.log('render.clearCompletedButton()');
			},
			contentBlockVisibility: function () {
				self.$main.style.display = self.$footer.style.display = parameter.visible ? 'block' : 'none';
				//console.log('render.contentBlockVisibility()');
			},
			toggleAll: function () {
				self.$toggleAll.checked = parameter.checked;
				//console.log('render.toggleAll()');
			},
			setFilter: function () {
				self._setFilter(parameter);
				//console.log('render.setFilter()' + parameter);
			},
			clearNewTodo: function () {
				self.$newTodo.value = '';
				//console.log('render.clearNewTodo()');
			},
			elementComplete: function () {
				self._elementComplete(parameter.id, parameter.completed);
				//console.log('render.elementComplete()');
			},
			editItem: function () {
				self._editItem(parameter.id, parameter.title);
				//console.log('render.editItem()');
			},
			editItemDone: function () {
				self._editItemDone(parameter.id, parameter.title);
				//console.log('render.editItemDone()');
			}
		};

		viewCommands[viewCmd]();
	};


	/**
	 * Ajoute un ID à l' élément
	 * @param  {object} (element) L' élément actif
	 */
	View.prototype._itemId = function (element) {
		var li = $parent(element, 'li');
		return parseInt(li.dataset.id, 10);
	};


	/**
	 * EventListener sur la validation de l' édition d'un élément
	 * @param  {function} (handler) Un callback exécuté sous condition
	 */
	View.prototype._bindItemEditDone = function (handler) {
		var self = this;
		$delegate(self.$todoList, 'li .edit', 'blur', function () {
			if (!this.dataset.iscanceled) {
				handler({
					id: self._itemId(this),
					title: this.value
				});
			}
		});

		$delegate(self.$todoList, 'li .edit', 'keypress', function (event) {
			if (event.keyCode === self.ENTER_KEY) {
				// Retirez le curseur du bouton lorsque vous appuyez sur Entrée
				this.blur();
			}
		});
	};


	/**
	 * EventListener sur l' annulation de l' édition d'un élément
	 * @param  {function} (handler) Un callback exécuté sous condition
	 */
	View.prototype._bindItemEditCancel = function (handler) {
		var self = this;
		$delegate(self.$todoList, 'li .edit', 'keyup', function (event) {
			if (event.keyCode === self.ESCAPE_KEY) {
				this.dataset.iscanceled = true;
				this.blur();

				handler({id: self._itemId(this)});
			}
		});
	};


	/**
	 * Fait le lien entre les méthodes du controller (controller.js) et les éléments de view (view.js)
	 * @param  {function} (event)   L' évenement actif
	 * @param  {function} (handler) Un callback exécuté sous condition
	 */
	View.prototype.bind = function (event, handler) {
		var self = this;
		if (event === 'newTodo') {
			$on(self.$newTodo, 'change', function () { // ajoute eventListener
				handler(self.$newTodo.value); // passe self.$newTodo.value au handler (contenu de l'input)
			});

		} else if (event === 'removeCompleted') {
			$on(self.$clearCompleted, 'click', function () {
				handler();
			});

		} else if (event === 'toggleAll') {
			$on(self.$toggleAll, 'click', function () {
				handler({completed: this.checked});
			});

		} else if (event === 'itemEdit') {
			$delegate(self.$todoList, 'li label', 'dblclick', function () {
				handler({id: self._itemId(this)});
			});

		} else if (event === 'itemRemove') {
			$delegate(self.$todoList, '.destroy', 'click', function () {
				handler({id: self._itemId(this)});
			});

		} else if (event === 'itemToggle') {
			$delegate(self.$todoList, '.toggle', 'click', function () {
				handler({
					id: self._itemId(this),
					completed: this.checked
				});
			});

		} else if (event === 'itemEditDone') {
			self._bindItemEditDone(handler);

		} else if (event === 'itemEditCancel') {
			self._bindItemEditCancel(handler);
		}
		//console.log(`bind()` + event + handler);
	};


	// Exportez vers Window
	window.app = window.app || {};
	window.app.View = View;
}(window));
