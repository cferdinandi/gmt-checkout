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