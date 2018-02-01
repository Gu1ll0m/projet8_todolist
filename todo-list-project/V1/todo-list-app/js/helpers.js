/*global NodeList */
(function (window) {
	'use strict';


	/**
	 * Récupére les éléments par le sélecteur CSS: qs = querySelector
	 */
	window.qs = function (selector, scope) {
		return (scope || document).querySelector(selector);
	};


	/**
	 * Récupére les éléments par le sélecteur CSS: qsa = querySelectorAll
	 */
	window.qsa = function (selector, scope) {
		return (scope || document).querySelectorAll(selector);
	};


	/**
	 * Encapsule l'addEventListener
	 */
	window.$on = function (target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	};


	/**
	 * Délègue un eventListener à un parent
	 * @param  {[type]} (target)  La cible
	 * @param  {[type]} (selector) Vérifie qu'il y a un match entre enfants et parents
	 * @param  {[type]} (handler)  callback exécuté si il y a une certaine condition
	 */
	window.$delegate = function (target, selector, type, handler) {
		function dispatchEvent(event) {
			var targetElement = event.target; // cible l' élément
			var potentialElements = window.qsa(selector, target); // qsa sur élément du même type
			var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0; // est-ce que dans potentialElements il y a targetElement , si >= o il y a un index et ça match

			if (hasMatch) {
				handler.call(targetElement, event); // si on a un élément hasMatch on appel le gestionnaire sur l' élément cible
			}
		}
		// https://developer.mozilla.org/en-US/docs/Web/Events/blur
		var useCapture = type === 'blur' || type === 'focus'; // useCapture peut être de type blur ou focus
		window.$on(target, type, dispatchEvent, useCapture); // $on ajoute un eventListener
	};


	/**
	 * Recherche le parent de l'élément avec le nom de tag : $parent(qs('a'), 'div');
	 */
	window.$parent = function (element, tagName) {
		if (!element.parentNode) {
			return; // si pas d' élément parent il ne se passe rien
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) { // si le tagname de l' élément parent en minuscule est strictement égale à notre tagname
			return element.parentNode; // on retourne notre élément parent
		}
		return window.$parent(element.parentNode, tagName);
	};


	/**
	 * Autorise les boucle sur les nœuds : qsa('.foo').forEach(function () {})
	 */
	NodeList.prototype.forEach = Array.prototype.forEach; // parcourir chaque noeuds revient à parcourir chaque tableau


})(window);
