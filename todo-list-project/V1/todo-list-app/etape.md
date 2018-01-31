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

Le console.log donne une mauvaise info, il convient de mettre le console.log après le render et pas avant.
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
test via Jasmine => à faire

## ETAPE 3
Audit site concurrent => OK
1. décrire la performance du site => OK
2. comparaison avec votre application => OK
3. comment optimiser la performance en vue d'un éventuel "scaling" de votre application => OK

## ETAPE 4
documenter les éléments suivants :
1. le projet lui-même (l'usage non technique) => à faire
2. comment il fonctionne techniquement => à faire
3. votre audit => à faire
