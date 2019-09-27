/*!
 * gmt-checkout v1.6.0
 * The WordPress theme for GoMakeThings.com
 * (c) 2019 Chris Ferdinandi
 * MIT License
 * https://github.com/cferdinandi/gmt-checkout
 */

// JavaScript enabled
document.documentElement.className += ' js-edd';

// Hide checkbox value
;(function (window, document, undefined) {
	var field = document.getElementById('edd_mailchimp_signup');
	var label = document.querySelector('label[for="edd_mailchimp_signup"]');

	// Update the field
	if (field) {
		field.type = 'hidden';
		field.value = '1';
	}

	// Update the label
	if (label) {
		label.setAttribute('hidden', 'hidden');
	}

})(window, document);
;(function () {

	'use strict';

	/**
	 * Get the value of a query string from a URL
	 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
	 * @param  {String} field The field to get the value of
	 * @param  {String} url   The URL to get the value from [optional]
	 * @return {String}       The value
	 */
	var getQueryString = function (field, url) {
		var href = url ? url : window.location.href;
		var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
		var string = reg.exec(href);
		return string ? string[1] : null;
	};

	var updateKeepShopping = function () {
		var current = document.querySelector('#nav-menu [href*="/resources"]');
		if (!current) return;
		var ref = sessionStorage.getItem('ref');
		if (!ref) return;
		current.href = ref;
	};

	var saveRef = function () {
		var ref = getQueryString('ref');
		if (!ref) return;
		sessionStorage.setItem('ref', ref);
	};

	// Update URL
	saveRef();
	updateKeepShopping();

})();
/**
 * Load pricing parity message
 */
;(function (window, document, undefined) {

	'use strict';

	// Render the pricing parity message
	var renderPricingParity = function (data) {

		// Make sure we have data to render
		if (!data) return;

		// Only render on checkout
		if (!document.body.classList.contains('edd-checkout')) return;

		// Get the nav
		var nav = document.querySelector('header');
		if (!nav) return;

		// Create container
		var pricing = document.createElement('div');
		pricing.id = 'pricing-parity';
		pricing.className = 'bg-muted padding-top-small padding-bottom-small';
		pricing.innerHTML = data;

		// Insert into the DOM
		nav.parentNode.insertBefore(pricing, nav);

	};

	// Get the pricing parity message via Ajax
	var getPricingParity = function () {

		// Set up our HTTP request
		var xhr = new XMLHttpRequest();
		if (!('responseType' in xhr)) return;

		// Setup our listener to process compeleted requests
		xhr.onreadystatechange = function () {
			// Only run if the request is complete
			if ( xhr.readyState !== 4 ) return;

			// Process our return data
			if ( xhr.status === 200 ) {

				// Get the content and render it
				var pricing = xhr.response.querySelector('#pricing-parity-content');
				if (!pricing) return;
				renderPricingParity(pricing.innerHTML);

				// Save the content to sessionStorage
				sessionStorage.setItem('gmt-pricing-parity', pricing.innerHTML);

			}
		};

		// Create and send a GET request
		xhr.open('GET', '/checkout/pricing-parity');
		xhr.responseType = 'document';
		xhr.send();

	};

	// Don't run on the pricing parity page itself
	if (document.querySelector('#pricing-parity-content')) return;

	// Get and render pricing parity info
	var pricing = sessionStorage.getItem('gmt-pricing-parity');
	if (typeof pricing === 'string') {
		renderPricingParity(pricing);
	} else {
		getPricingParity();
	}

})(window, document);