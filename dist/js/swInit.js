/*! gmt-checkout v3.7.0 | (c) 2023 Chris Ferdinandi | MIT License | https://github.com/cferdinandi/gmt-checkout | Open Source: undefined */
(function () {
	'use strict';

	// Initialize the service worker
	if (navigator && navigator.serviceWorker) {
		navigator.serviceWorker.register('/sw.js');
	}

	// Cleanup old cache on page load
	if (navigator.serviceWorker.controller) {
		window.addEventListener('load', function () {
			navigator.serviceWorker.controller.postMessage('cleanUp');
		});
	}

}());
