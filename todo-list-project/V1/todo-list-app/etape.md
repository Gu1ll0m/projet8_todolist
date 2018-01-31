##ETAPE 1
1. bug 1 : faute de frappe dans controller.js => Controller.prototype.addItem à la place de Controller.prototype.adddItem

2. bug 2 : création des ID dans store.js => Store.prototype.save

    for (var i = 0; i < 6; i++) {
        newId += charset.charAt(Math.floor(Math.random() * charset.length));
    }

Technique de création de l'ID ne vérifie pas si le nouvel ID existe déjà : risque d' avoir plusieurs éléments avec le même ID.

3. amélioration : boucle forEach inadapté => Controller.prototype.removeItem
Suppression de la boucle suivante :

    items.forEach(function(item) {
        if (item.id === id) {
            console.log("Element with ID: " + id + " has been removed.");
        }
    });

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
