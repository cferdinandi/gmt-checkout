// JavaScript enabled
document.documentElement.className += ' js-edd';

// Hide checkbox value
;(function (window, document, undefined) {
	var mailchimp = document.getElementById('edd_mailchimp_signup');
	if (!mailchimp) return;
	mailchimp.type = 'hidden';
})(window, document);