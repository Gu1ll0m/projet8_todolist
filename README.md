# Projet 8 : [Reprenez et améliorez un projet existant](https://openclassrooms.com/projects/reprenez-et-ameliorez-un-projet-existant)


## _Etape 1 : Corrigez les bugs_

#### 1. bug 1 : faute de frappe dans [__controller.js__](./js/controller.js)

Controller.prototype.__addItem__ à la place de Controller.prototype.__adddItem__

#### 2. bug 2 : création des ID dans [__store.js__](./js/store.js)

Store.prototype.save

> La méthode [Date.now()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Date/now) est parfaitement adapté, ça retourne un chiffre unique correspondant au nombre de millisecondes écoulées depuis le 1er Janvier 1970 00:00:00. Il s' agot donc de notre __identifiant unique__.

    var newId = Date.now();
    
> Il convient de modifier également la boucle if suivante :

    if (id) {
          for (var i = 0; i < todos.length; i++) {
              if (todos[i].id === id) {
                for (var key in updateData) {
                  todos[i][key] = updateData[key];
                }
                break;
              }
          }

#### 3. amélioration : [__controller.js__](./js/controller.js)

Controller.prototype.removeItem => la boucle forEach dans est inadapté.

> Le console.log donne une mauvaise information, il convient de mettre le console.log après le render et pas avant et surrpimer la boucle forEach inutile.



## _Etape 2 : où sont les tests ?!_

tests unitaires avec le framework[ __Jasmine__](https://github.com/jasmine/)

Ouvrir dans votre navigateur le fichier [__SpecRunner.html__](./test/SpecRunner.html)

Pour voir plus en détails les tests aller dans le fichier [__ControllerSpec.js__](./test/ControllerSpec.js)

#### Récap des tests effectués :

> 1. #62 => test si on affiche bien model et setview : OK
> 2. #92 => test la view quand on affiche bien les todos de l'onglet active : OK
> 3. #114 => test la view quand on affiche bien les todos de l'onglet completed : OK
> 4. #179 => test la view si "All" est surligné quand on a l' onglet défaut : OK
> 5. #189 => test la view si "Active" est surligné quand on change pour l'onglet active : OK
> 6. #200 => test le model quand on bascule tous les états des todos vers terminé : OK
> 7. #215 => test la mise à jour de view : OK
> 8. #232=> test le model en cas d' ajout d'un todo : OK
> 9. #281 => test le model si on supprime un todo : OK

#### Tests suivants ajoutés

> 1. #103 => test le model quand on affiche les todos de l'onglet active : OK
> 2. #125 => test le model quand on affiche les todos de l'onglet completed : OK


## _Etape 3 : optimisez la performance du site [todolistme.net](http://todolistme.net/)_

Ouvrir dans votre navigateur le fichier [__audit.md__](./livrable/audit.md)


## _Etape 4 : améliorez le projet_




