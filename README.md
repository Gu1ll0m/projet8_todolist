# Projet 8 : [Reprenez et améliorez un projet existant](https://openclassrooms.com/projects/reprenez-et-ameliorez-un-projet-existant)



### Etape 1 : Corrigez les bugs

1. bug 1 : faute de frappe dans controller.js => Controller.prototype.addItem à la place de Controller.prototype.adddItem

2. bug 2 : création des ID dans store.js => Store.prototype.save

La méthode Date.now() fonctionne, ça retourne le nombre de millisecondes écoulées depuis le 1er Janvier 1970 00:00:00 donc identifiant unique. Si énormément d' utilisateurs il faut un système de gestion de compte.

3. amélioration : boucle forEach inadapté => Controller.prototype.removeItem

Le console.log donne une mauvaise info, il convient de mettre le console.log après le render et pas avant et surrpimer la boucle forEach inutile.


### Etape 2 : où sont les tests ?!

test via Jasmine => OK

Ouvrir le fichier SpecRunner.html dans le dossier test.

Les tests sont dans le fichier ControllerSpec.js.

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


### Etape 3 : optimisez la performance



### Etape 4 : améliorez le projet


