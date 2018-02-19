##ETAPE 1
1. bug 1 : faute de frappe dans controller.js => Controller.prototype.addItem à la place de Controller.prototype.adddItem

2. bug 2 : création des ID dans store.js => Store.prototype.save

        Store.prototype.save = function (updateData, callback, id) {
          var data = JSON.parse(localStorage[this._dbName]);
          var todos = data.todos;

          callback = callback || function () {};

          // Générer un identifiant
            var newId = "";
            var charset = "0123456789";

              for (var i = 0; i < 6; i++) {
              newId += charset.charAt(Math.floor(Math.random() * charset.length));
              // si newId exist nouveau random
              // newId = Id +1
              console.log(newId);
          }

          // Si un ID a été donné, trouve l'élément et mets à jour chaque propriétés
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

              // Attribuer un ID
            updateData.id = parseInt(newId);
            todos.push(updateData);
            localStorage[this._dbName] = JSON.stringify(data);
            callback.call(this, [updateData]);
          }
        };

Technique de création de l'ID ne vérifie pas si le nouvel ID existe déjà : risque d' avoir plusieurs éléments avec le même ID.

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

En augmentant la longueur de notre id random on élimine statistiquement la possibilité d' avoir plusieurs items avec le même id. Méthode que l'on peut améliorer.

test avec :

        Store.prototype.save = function (updateData, callback, id) {
          var self = this;
          var data = JSON.parse(localStorage[this._dbName]);
          var todos = data.todos;

          callback = callback || function () {};

          // Si un ID a été donné, trouve l'élément et met à jour les propriétés
          if (id) {
            for (var i = 0; i < todos.length; i++) {
              if (todos[i].id === id) {
                for (var key in updateData) {
                  todos[i].key = updateData[key];
                }
                break;
              }
            }

            localStorage[this._dbName] = JSON.stringify(data);
            callback.call(this, todos);

          } else {

            function generateNewId () {
              // génère un nouvel id
              var newId = "";
                var charset = "0123456789";

                  for (var i = 0; i < 19 ; i++) {
                  newId += charset.charAt(Math.floor(Math.random() * charset.length));
              }
              return newId;
            }


            function checkIfIdAlReadyExist (id){

              var idAlReadyExist = false;

              // boucle pour vérifier si l'ID donné existe déjà dans la db
              for (var i = 0; i < todos.length; i++) {
                if (todos[i].id === id) {
                  idAlReadyExist = true;
                  break;
                }
              }
              if (idAlReadyExist === true) {
                id = generateNewId();
                console.log('id :' + id + 'existe');
                checkIfIdAlReadyExist(id);
              } else {
                // assigne un id
                updateData.id = parseInt(id);
                console.log('id :' + id + 'ok');
                todos.push(updateData);
                localStorage[self._dbName] = JSON.stringify(data);
                callback.call(self, todos);
              }
            }

            var newId = generateNewId();
            checkIfIdAlReadyExist(id);
          }
        };

mais ça me retourne des erreures.

Au final la méthode Date.now() fait le taff, ça retourne le nombre de millisecondes écoulées depuis le 1er Janvier 1970 00:00:00 donc identifiant unique. Si plusieurs utilisateurs il faut un système de gestion de compte.

        Store.prototype.save = function (updateData, callback, id) {
          var data = JSON.parse(localStorage[this._dbName]);
          var todos = data.todos;

          callback = callback || function () {};

          // Génére un identifiant
          // renvoie le nombre de millisecondes écoulées depuis le 1er Janvier 1970 00:00:00 UTC
          var newId = Date.now();

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

3. amélioration : boucle forEach inadapté => Controller.prototype.removeItem

        Controller.prototype.removeItem = function (id) {
          var self = this;
          var items;
          self.model.read(function(data) {
            items = data;
          });

          items.forEach(function(item) {
            if (item.id === id) {
              console.log("Element with ID: " + id + " has been removed.");
            }
          });

          self.model.remove(id, function () {
            self.view.render('removeItem', id);
          });

          self._filter();
        };

Le console.log donne une mauvaise info, il convient de mettre le console.log après le render et pas avant et surrpimer la boucle forEach inutile.
Notre fonction devient :

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


## ETAPE 2
test via Jasmine => OK
1. #62 => test si on affiche bien model et setview : OK
2. #92 => test la view quand on affiche bien les todos de l'onglet active : OK
3. #114 => test la view quand on affiche bien les todos de l'onglet completed : OK
4. #179 => test la view si "All" est surligné quand on a l' onglet défaut : OK
5. #189 => test la view si "Active" est surligné quand on change pour l'onglet active : OK
6. #200 => test le model quand on bascule tous les états des todos vers terminé : OK
7. #215 => test la mise à jour de view : OK
8. #232=> test le model en cas d' ajout d'un todo : OK
9. #281 => test le model si on supprime un todo : OK

rajout test =>
1. #103 => test le model quand on affiche les todos de l'onglet active : OK
2. #125 => test le model quand on affiche les todos de l'onglet completed : OK

## ETAPE 3
Audit site concurrent => OK
1. décrire la performance du site => OK
2. comparaison avec votre application => OK
3. comment optimiser la performance en vue d'un éventuel "scaling" de votre application => OK

## ETAPE 4
documenter les éléments suivants :
1. le projet lui-même (l'usage non technique) : doc utilisateur pdf + github => OK
2. comment il fonctionne techniquement : doc technique via docdash => OK js/out/index.html

#### TODO ETAPE 4 : vérifier docdash store.js

