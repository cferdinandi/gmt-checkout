/*! gmt-checkout v2.1.1 | (c) 2021 Chris Ferdinandi | MIT License | https://github.com/cferdinandi/gmt-checkout | Open Source: undefined */
(function () {
	'use strict';

	// Detect when font files are fully loaded before using them in the UI
	if ('fonts' in document) {
		Promise.all([
			document.fonts.load('1em PT Sans'),
			document.fonts.load('700 1em PT Sans'),
			document.fonts.load('italic 1em PT Sans'),
			document.fonts.load('italic 700 1em PT Sans'),
			document.fonts.load('700 1em PT Serif'),
			document.fonts.load('italic 700 1em PT Serif')
		]).then(function () {
			document.documentElement.classList.add('fonts-loaded');
		});
	}

}());
