# Projet 8 : [Reprenez et améliorez un projet existant](https://openclassrooms.com/projects/reprenez-et-ameliorez-un-projet-existant)


## _Etape 1 : Corrigez les bugs_

#### 1. bug 1 : faute de frappe dans [__controller.js__](./js/controller.js)

Controller.prototype.__addItem__ à la place de Controller.prototype.__adddItem__ (#100)

	/**
	 * Evénement à déclencher lorsque vous souhaitez ajouter un élément. Il suffit de passer
	 * dans l'objet événement et il va gérer l'insertion DOM et la sauvegarde du nouvel élément.
	 * @param {string} (title) Le contenu du todo.
	 */
	Controller.prototype.addItem = function (title) {
		var self = this;

		if (title.trim() === '') {
			return;
		}

		self.model.create(title, function () {
			self.view.render('clearNewTodo');
			self._filter(true);
		});
	};

#### 2. bug 2 : création des ID dans [__store.js__](./js/store.js)

Store.prototype.save (#76)

> La méthode [Date.now()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Date/now) est parfaitement adapté. La fonction retourne un chiffre unique correspondant au nombre de millisecondes écoulées depuis le 1er Janvier 1970 00:00:00. Il s' agit donc de notre __identifiant unique__.

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

		/**
		 * Génére un identifiant unique : Renvoie le nombre de millisecondes écoulées
		 * depuis le 1er Janvier 1970 00:00:00 UTC.
		 * @example
		 * return {number} 1519326977765
		 */
		var newId = Date.now();

		/**
		 * Si un ID a été donné, trouve l'élément et met à jour les propriétés
		 * @param  {number} (id) L' ID de l' élément.
		 */
		if (id) {
			for (var i = 0; i < todos.length; i++) {
		  		if (todos[i].id === id) {
		    		for (var key in updateData) {
	      			todos[i][key] = updateData[key];
		    		}
		    		break;
		  		}
			}
			console.log('id : ' + id);
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, todos);
		} else {
		  	// Attribue un ID
			updateData.id = parseInt(newId);
			console.log('id : ' + newId + ' ok');
			todos.push(updateData);
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, [updateData]);
		}
    };

#### 3. amélioration : [__controller.js__](./js/controller.js)

Controller.prototype.removeItem => la boucle forEach est inadapté.

> Le console.log donne une mauvaise information, il convient de mettre le console.log après le render plutôt qu' avant et de surrpimer la boucle forEach inutile.

    /**
	 * Supprime un élément de la liste.
	 * @param {number} (id) L'ID de l'élément à retirer du DOM et du stockage.
	 */
	Controller.prototype.removeItem = function (id) {
		var self = this;
		var items;
		self.model.read(function(data) {
			items = data;
		});

		self.model.remove(id, function () {
			self.view.render('removeItem', id);
			console.log("Element with ID: " + id + " has been removed.");
		});

		self._filter();
	};



## _Etape 2 : où sont les tests ?!_

Tests unitaires avec le framework[ __Jasmine__](https://github.com/jasmine/)
Pré-requis : 
* installer NPM [NPM et NodeJs](https://www.npmjs.com/get-npm?utm_source=house&utm_medium=homepage&utm_campaign=free%20orgs&utm_term=Install%20npm)
* installer [ __Jasmine__](https://github.com/jasmine/jasmine/releases)

Télécharger [le dossier] (https://github.com/Gu1ll0m/projet8_todolist.git) puis ouvrir dans votre navigateur le fichier __SpecRunner.html__ que vous trouverez en suivant le chemin suivant `../P8/test/SpecRunner.html`

Pour voir plus en détails les tests aller dans le fichier [__ControllerSpec.js__](./test/ControllerSpec.js)

#### Récap des tests effectués :

> 1. #62 => test si on affiche bien model et view
> 2. #92 => test la view quand on affiche les todos de l'onglet active
> 3. #114 => test la view quand on affiche les todos de l'onglet completed
> 4. #179 => test la view si "All" est surligné quand on a l' onglet par défaut
> 5. #189 => test la view si "Active" est surligné quand on change pour l'onglet active
> 6. #200 => test le model quand on bascule tous les états des todos vers terminé
> 7. #215 => test la mise à jour de view
> 8. #232=> test le model en cas d' ajout d'un todo
> 9. #281 => test le model si on supprime un todo

#### Tests suivants ajoutés

> 1. #103 => test le model quand on affiche les todos de l'onglet active

	it('should show active entries to the model (NEW TEST)', function () {
		// TODO : new test
		// test le model
		var todo = {title: 'my todo', completed: false};
		setUpModel([todo]);

		subject.setView('#/active');

		expect(model.read).toHaveBeenCalledWith({completed: false}, jasmine.any(Function));
	});
> 2. #125 => test le model quand on affiche les todos de l'onglet completed
	
	it('should show completed entries to the model (NEW TEST)', function () {
		// TODO : new test
		// test le model
		var todo = {title: 'my todo', completed: true};
		setUpModel([todo]);

		subject.setView('#/completed');

		expect(model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
	})


## _Etape 3 : optimisez la performance du site [todolistme.net](http://todolistme.net/)_

Ouvrir l' _audit de performance_ dans votre navigateur : [__audit.md__](./livrable/audit.md)


## _Etape 4 : améliorez le projet_

Ouvrir la _documentation utilisateur_ dans votre navigateur : [__doc_utilisateur.md__](./livrable/doc_utilisateur.md)

Ouvrir la _documentation technique_ dans votre navigateur : 

