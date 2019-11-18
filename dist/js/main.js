/*!
 * gmt-checkout v1.7.0
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