;(function (window, document, undefined) {

	'use strict';

	// Feature test
	var supports = 'querySelector' in document;
	if ( !supports ) return;

	// Variables
	var label = document.querySelector('#edd-card-number-wrap .card-type');
	var active = 'unknown';
	if (!label) return;

	// Credit Cards
	var cards = {
		unknown: '',
		visa: '<svg style="height: 1em; width: 1.525em;" viewBox="0 0 61 40" xmlns="http://www.w3.org/2000/svg"><title>isa</title><g fill-rule="nonzero" fill="none"><path d="M60.75 35c0 2.75-2.25 5-5 5h-50c-2.75 0-5-2.25-5-5V5c0-2.75 2.25-5 5-5h50c2.75 0 5 2.25 5 5v30z" fill="#F3F4F4"/><path d="M1.75 10V5c0-2.75 2.25-5 5-5h48c2.75 0 5 2.25 5 5v5" fill="#5565AF"/><path d="M59.75 30v5c0 2.75-2.25 4-5 4h-48c-2.75 0-5-1.25-5-4v-5" fill="#E6A124"/><g fill="#5565AF"><path d="M18.137 23.379c.406-1.15.691-1.887.859-2.211l3.375-6.875h2.469l-5.844 11.422h-2.609l-.992-11.422H17.7l.398 6.875c.02.234.031.582.031 1.039a22.43 22.43 0 0 1-.047 1.172h.055zM23.809 25.715l2.438-11.422h2.383l-2.438 11.422zM35.934 22.34c0 1.09-.387 1.949-1.156 2.582-.771.633-1.816.949-3.133.949-1.152 0-2.078-.234-2.781-.703v-2.141c1.004.562 1.938.844 2.797.844.582 0 1.039-.109 1.367-.332.328-.221.492-.523.492-.91 0-.223-.035-.42-.105-.59a1.727 1.727 0 0 0-.301-.473c-.131-.146-.453-.41-.969-.797-.719-.517-1.225-1.025-1.516-1.532a3.197 3.197 0 0 1-.438-1.633c0-.672.16-1.271.484-1.801.322-.528.781-.939 1.379-1.234.596-.294 1.281-.441 2.059-.441 1.129 0 2.164.258 3.102.773l-.852 1.82c-.812-.385-1.562-.578-2.25-.578-.434 0-.787.117-1.062.352-.277.234-.414.545-.414.93 0 .318.086.596.258.832.172.237.557.551 1.156.941.629.417 1.102.877 1.414 1.379.312.505.469 1.091.469 1.763zM43.598 22.996h-3.695l-1.344 2.719h-2.5l5.984-11.469h2.914l1.148 11.469h-2.32l-.187-2.719zm-.118-2.031l-.203-2.734a25.514 25.514 0 0 1-.078-1.977v-.281c-.23.625-.514 1.287-.852 1.984l-1.469 3.008h2.602z"/></g><path d="M59.281 1.469A4.985 4.985 0 0 1 60.75 5v30a4.98 4.98 0 0 1-1.469 3.531A4.987 4.987 0 0 1 55.75 40h-50a4.98 4.98 0 0 1-3.531-1.469L59.281 1.469z" fill="#FFF" opacity=".04"/><path d="M55.75 1c2.206 0 4 1.794 4 4v30c0 2.206-1.794 4-4 4h-50c-2.206 0-4-1.794-4-4V5c0-2.206 1.794-4 4-4h50zm0-1h-50C3 0 .75 2.25.75 5v30c0 2.75 2.25 5 5 5h50c2.75 0 5-2.25 5-5V5c0-2.75-2.25-5-5-5z" fill="#F8F8F9"/></g></svg>',
		mastercard: '<svg style="height: 1em; width: 1.525em;" viewBox="0 0 61 40" xmlns="http://www.w3.org/2000/svg"><title>mastercard</title><g fill-rule="nonzero" fill="none"><path d="M60.75 35c0 2.75-2.25 5-5 5h-50c-2.75 0-5-2.25-5-5V5c0-2.75 2.25-5 5-5h50c2.75 0 5 2.25 5 5v30z" fill="#5565AF"/><path d="M59.281 1.469A4.985 4.985 0 0 1 60.75 5v30a4.98 4.98 0 0 1-1.469 3.531A4.987 4.987 0 0 1 55.75 40h-50a4.98 4.98 0 0 1-3.531-1.469L59.281 1.469z" fill="#FFF" opacity=".04"/><g fill="#EA564B"><path d="M30.75 13.4a9.97 9.97 0 0 0-7.5-3.4c-5.522 0-10 4.477-10 10 0 5.521 4.478 10 10 10 2.99 0 5.667-1.32 7.5-3.401A9.944 9.944 0 0 1 28.25 20c0-2.534.948-4.838 2.5-6.6z"/><path d="M30.75 13.4a9.948 9.948 0 0 0-2.5 6.6c0 2.533.948 4.837 2.5 6.599A9.944 9.944 0 0 0 33.25 20a9.946 9.946 0 0 0-2.5-6.6z"/></g><path d="M38.25 10a9.97 9.97 0 0 0-8.644 5h2.288c.364.625.647 1.299.871 2h-4.044a9.898 9.898 0 0 0-.419 2h4.879c.034.33.068.66.068 1 0 .338-.02.671-.053 1h-4.895c.069.691.216 1.357.419 2h4.056a10.017 10.017 0 0 1-.886 2h-2.285a9.968 9.968 0 0 0 8.644 5c5.522 0 10-4.479 10-10 .001-5.523-4.477-10-9.999-10z" fill="#E9D419"/><path d="M55.75 1c2.206 0 4 1.794 4 4v30c0 2.206-1.794 4-4 4h-50c-2.206 0-4-1.794-4-4V5c0-2.206 1.794-4 4-4h50zm0-1h-50C3 0 .75 2.25.75 5v30c0 2.75 2.25 5 5 5h50c2.75 0 5-2.25 5-5V5c0-2.75-2.25-5-5-5z" fill="#7684B7"/></g></svg>',
		amex: '<svg style="height: 1em; width: 1.525em;" viewBox="0 0 61 40" xmlns="http://www.w3.org/2000/svg"><title>amex</title><g fill-rule="nonzero" fill="none"><path d="M60.75 35c0 2.75-2.25 5-5 5h-50c-2.75 0-5-2.25-5-5V5c0-2.75 2.25-5 5-5h50c2.75 0 5 2.25 5 5v30z" fill="#5EC1EC"/><path d="M59.281 1.469A4.985 4.985 0 0 1 60.75 5v30a4.98 4.98 0 0 1-1.469 3.531A4.987 4.987 0 0 1 55.75 40h-50a4.98 4.98 0 0 1-3.531-1.469L59.281 1.469z" fill="#5BBBE6"/><g fill="#FFF"><path d="M18.305 24.922l-.457-1.74h-3.015l-.47 1.74h-2.755l3.028-9.318h3.345l3.065 9.318h-2.741zm-.977-3.797l-.4-1.523a53.047 53.047 0 0 1-.34-1.313 22.962 22.962 0 0 1-.264-1.155c-.037.216-.113.571-.225 1.066-.112.495-.361 1.471-.746 2.926l1.975-.001zM26.094 24.922l-1.898-6.685h-.057c.089 1.138.133 2.022.133 2.654v4.03h-2.221V15.64h3.338l1.937 6.59h.051l1.897-6.59h3.346v9.281h-2.305v-4.069c0-.211.004-.445.01-.704.006-.259.035-.891.086-1.898h-.057l-1.873 6.672h-2.387zM39.869 24.922h-5.51v-9.281h5.51v2.013h-3.004v1.46h2.781v2.012h-2.781v1.752h3.004zM49.854 24.922h-2.9l-1.811-2.9-1.789 2.9h-2.838l3.078-4.748-2.895-4.533h2.781l1.676 2.869 1.611-2.869h2.863l-2.939 4.729z"/></g><g fill="#FFF"><path d="M18.305 24.922l-.457-1.74h-3.015l-.47 1.74h-2.755l3.028-9.318h3.345l3.065 9.318h-2.741zm-.977-3.797l-.4-1.523a53.047 53.047 0 0 1-.34-1.313 22.962 22.962 0 0 1-.264-1.155c-.037.216-.113.571-.225 1.066-.112.495-.361 1.471-.746 2.926l1.975-.001zM26.094 24.922l-1.898-6.685h-.057c.089 1.138.133 2.022.133 2.654v4.03h-2.221V15.64h3.338l1.937 6.59h.051l1.897-6.59h3.346v9.281h-2.305v-4.069c0-.211.004-.445.01-.704.006-.259.035-.891.086-1.898h-.057l-1.873 6.672h-2.387zM39.869 24.922h-5.51v-9.281h5.51v2.013h-3.004v1.46h2.781v2.012h-2.781v1.752h3.004zM49.854 24.922h-2.9l-1.811-2.9-1.789 2.9h-2.838l3.078-4.748-2.895-4.533h2.781l1.676 2.869 1.611-2.869h2.863l-2.939 4.729z"/></g><path d="M55.75 1c2.206 0 4 1.794 4 4v30c0 2.206-1.794 4-4 4h-50c-2.206 0-4-1.794-4-4V5c0-2.206 1.794-4 4-4h50zm0-1h-50C3 0 .75 2.25.75 5v30c0 2.75 2.25 5 5 5h50c2.75 0 5-2.25 5-5V5c0-2.75-2.25-5-5-5z" fill="#9BCEE0"/></g></svg>',
		discover: '<svg style="height: 1em; width: 1.525em;" viewBox="0 0 61 40" xmlns="http://www.w3.org/2000/svg"><title>discover</title><g fill-rule="nonzero" fill="none"><path d="M60.75 35c0 2.75-2.25 5-5 5h-50c-2.75 0-5-2.25-5-5V5c0-2.75 2.25-5 5-5h50c2.75 0 5 2.25 5 5v30z" fill="#FFF9F0"/><g transform="translate(10 16)"><path d="M5.885 3.943c0 1.002-.285 1.769-.854 2.302-.571.532-1.395.799-2.472.799H.835V.959h1.91c.994 0 1.765.263 2.313.787.552.524.827 1.257.827 2.197zm-1.34.034c0-1.307-.578-1.96-1.73-1.96h-.688v3.961h.554c1.243.001 1.864-.667 1.864-2.001zM6.976 7.044V.959h1.29v6.085zM13.391 5.354c0 .551-.197.982-.594 1.299-.396.316-.945.476-1.65.476-.648 0-1.224-.123-1.724-.366V5.564a7.2 7.2 0 0 0 1.043.389c.284.074.545.111.781.111.282 0 .5-.055.651-.162.148-.107.227-.27.227-.482a.524.524 0 0 0-.101-.318 1.05 1.05 0 0 0-.294-.269 7.666 7.666 0 0 0-.788-.412c-.371-.175-.649-.344-.837-.504a1.845 1.845 0 0 1-.445-.562 1.613 1.613 0 0 1-.166-.75c0-.538.182-.961.547-1.269.366-.309.869-.462 1.514-.462.316 0 .618.037.905.112.287.074.588.181.901.316l-.416 1.003a5.915 5.915 0 0 0-.807-.279 2.638 2.638 0 0 0-.626-.079c-.245 0-.433.056-.562.171a.561.561 0 0 0-.196.445c0 .114.026.212.079.298a.87.87 0 0 0 .252.245c.115.079.389.221.818.427.568.272.958.545 1.17.818.212.271.318.606.318 1.003zM17.078 1.945c-.486 0-.861.184-1.128.547-.268.365-.399.875-.399 1.526 0 1.356.509 2.035 1.527 2.035.428 0 .943-.104 1.553-.32v1.082c-.5.209-1.058.312-1.674.312-.885 0-1.562-.27-2.031-.807-.469-.536-.703-1.307-.703-2.312 0-.633.116-1.187.347-1.662a2.48 2.48 0 0 1 .992-1.095C15.995.997 16.5.87 17.08.87c.591 0 1.186.143 1.781.429l-.416 1.049a7.07 7.07 0 0 0-.688-.283 2.04 2.04 0 0 0-.679-.12zM28.959.959h1.303l-2.067 6.085h-1.407L24.724.959h1.304l1.145 3.621a13.893 13.893 0 0 1 .325 1.34c.03-.255.134-.699.312-1.34L28.959.959zM34.532 7.044h-3.505V.959h3.505v1.058h-2.215v1.336h2.062V4.41h-2.062v1.568h2.215zM37.092 4.709v2.335h-1.29V.959h1.773c.827 0 1.438.15 1.836.452.396.301.595.757.595 1.371 0 .357-.099.677-.295.955a1.956 1.956 0 0 1-.836.656 240.782 240.782 0 0 0 1.789 2.65h-1.432l-1.453-2.335-.687.001zm0-1.049h.417c.407 0 .709-.068.903-.203.193-.137.291-.351.291-.642 0-.289-.1-.493-.298-.616-.198-.123-.505-.183-.921-.183h-.394l.002 1.644z" fill="#414042"/><circle fill="#E6A124" cx="21.816" cy="4.002" r="3.043"/></g><path d="M60.75 27.5V35c0 .688-.141 1.344-.395 1.941a5.061 5.061 0 0 1-2.664 2.664A4.958 4.958 0 0 1 55.75 40H10.836L60.75 27.5z" fill="#E6A124"/><path d="M59.281 1.469A4.985 4.985 0 0 1 60.75 5v30a4.98 4.98 0 0 1-1.469 3.531A4.987 4.987 0 0 1 55.75 40h-50a4.98 4.98 0 0 1-3.531-1.469L59.281 1.469z" fill="#FFF" opacity=".08"/><path d="M55.75 1c2.206 0 4 1.794 4 4v30c0 2.206-1.794 4-4 4h-50c-2.206 0-4-1.794-4-4V5c0-2.206 1.794-4 4-4h50zm0-1h-50C3 0 .75 2.25.75 5v30c0 2.75 2.25 5 5 5h50c2.75 0 5-2.25 5-5V5c0-2.75-2.25-5-5-5z" fill="#F7F5F2"/></g></svg>',
		jcb: '<svg style="height: 1em; width: 1.525em;" viewBox="0 0 61 40" xmlns="http://www.w3.org/2000/svg"><title>jcb</title><g fill-rule="nonzero" fill="none"><path d="M60.75 35c0 2.75-2.25 5-5 5h-50c-2.75 0-5-2.25-5-5V5c0-2.75 2.25-5 5-5h50c2.75 0 5 2.25 5 5v30z" fill="#F3F4F4"/><path d="M17.75 30h-8V15c0-2.762 3.238-5 6-5h6v15c0 2.762-1.238 5-4 5z" fill="#5565AF"/><path d="M31.75 30h-8V15c0-2.762 3.238-5 6-5h6v15c0 2.762-1.238 5-4 5z" fill="#EA564B"/><path d="M45.75 30h-8V15c0-2.762 3.238-5 6-5h6v15c0 2.762-1.238 5-4 5z" fill="#99CD76"/><path d="M59.281 1.469A4.985 4.985 0 0 1 60.75 5v30a4.98 4.98 0 0 1-1.469 3.531A4.987 4.987 0 0 1 55.75 40h-50a4.98 4.98 0 0 1-3.531-1.469L59.281 1.469z" fill="#FFF" opacity=".08"/><path d="M55.75 1c2.206 0 4 1.794 4 4v30c0 2.206-1.794 4-4 4h-50c-2.206 0-4-1.794-4-4V5c0-2.206 1.794-4 4-4h50zm0-1h-50C3 0 .75 2.25.75 5v30c0 2.75 2.25 5 5 5h50c2.75 0 5-2.25 5-5V5c0-2.75-2.25-5-5-5z" fill="#F8F8F9"/></g></svg>',
		diners: '<svg style="height: 1em; width: 1.525em;" viewBox="0 0 61 40" xmlns="http://www.w3.org/2000/svg"><title>diners</title><g fill-rule="nonzero" fill="none"><path d="M60.75 35c0 2.75-2.25 5-5 5h-50c-2.75 0-5-2.25-5-5V5c0-2.75 2.25-5 5-5h50c2.75 0 5 2.25 5 5v30z" fill="#F3F4F4"/><g transform="translate(17 10)"><circle fill="#009FDA" cx="10.584" cy="10" r="10"/><path d="M9.75 0c5 0 9.999 4.478 9.999 10 0 5.521-4.999 10-9.999 10V0z" fill="#009FDA"/><path d="M9.75 20V0h7.167c5 0 9.999 4.478 9.999 10 0 5.521-4.999 10-9.999 10H9.75z" fill="#009FDA"/><circle fill="#F3F4F4" cx="10.584" cy="10" r="9.438"/><path d="M15.188 10c0-2.727-2.438-5.008-4.438-5.609v11.218c2-.601 4.438-2.88 4.438-5.609zM3.312 10c0 2.727 2.438 5.008 4.438 5.609V4.39c-2 .602-4.438 2.882-4.438 5.61z" fill="#009FDA"/></g><path d="M59.281 1.469A4.985 4.985 0 0 1 60.75 5v30a4.98 4.98 0 0 1-1.469 3.531A4.987 4.987 0 0 1 55.75 40h-50a4.98 4.98 0 0 1-3.531-1.469L59.281 1.469z" fill="#FFF" opacity=".08"/><path d="M55.75 1c2.206 0 4 1.794 4 4v30c0 2.206-1.794 4-4 4h-50c-2.206 0-4-1.794-4-4V5c0-2.206 1.794-4 4-4h50zm0-1h-50C3 0 .75 2.25.75 5v30c0 2.75 2.25 5 5 5h50c2.75 0 5-2.25 5-5V5c0-2.75-2.25-5-5-5z" fill="#F8F8F9"/></g></svg>'
	};

	var updateCard = function (type) {
		if ( active === type ) return;
		var img = (type in cards) ? cards[type] : '';
		label.innerHTML = img;
		active = type;
	};

	var cleave = new Cleave('#card_number', {
		creditCard: true,
		onCreditCardTypeChanged: function (type) {
			updateCard( type );
		}
	});

	if (cleave) {
		var cardNumber = document.querySelector('#card_number');
		if (!cardNumber) return;
		cardNumber.setAttribute('pattern', cardNumber.getAttribute('pattern').replace('[0-9', '[0-9 ').replace('{13,16}', '{16,19}'));
	}

})(window, document);


/**
 * Script initializations
 */

;(function (window, document, undefined) {

	'use strict';

	var requiredFields = document.querySelectorAll('#edd_purchase_form .required');
	var eddCompletePurchase = document.querySelector('#edd-purchase-button');

	for (var i = 0; i < requiredFields.length; i++) {
		requiredFields[i].setAttribute('required', 'required');
		if (requiredFields[i].id === 'edd-email') {
			requiredFields[i].setAttribute('title', 'The domain portion of the email address is invalid (the portion after the @).');
			requiredFields[i].setAttribute('pattern', '^([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x22([^\\x0d\\x22\\x5c\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x22)(\\x2e([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x22([^\\x0d\\x22\\x5c\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x22))*\\x40([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x5b([^\\x0d\\x5b-\\x5d\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x5d)(\\x2e([^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+|\\x5b([^\\x0d\\x5b-\\x5d\\x80-\\xff]|\\x5c[\\x00-\\x7f])*\\x5d))*(\\.\\w{2,})+$');
			continue;
		}
		if (requiredFields[i].id === 'card_number') {
			requiredFields[i].setAttribute('title', 'Please use a valid credit card number.');
		}
		if (requiredFields[i].id === 'card_cvc') {
			requiredFields[i].setAttribute('title', 'Please enter a valid security code.');
		}
	}

	// Handle EDD "complete purchase" submissions
	var completePurchaseHandler = function (event) {

		// Get all of the form elements
		var fields = event.target.form.elements;

		// Validate each field
		// Store the first field with an error to a variable so we can bring it into focus later
		var hasErrors;
		for (var i = 0; i < fields.length; i++) {
			var error = validate.hasError(fields[i]);
			if (error) {
				validate.showError(fields[i], error);
				if (!hasErrors) {
					hasErrors = fields[i];
				}
			}
		}

		// Prevent form from submitting if there are errors or submission is disabled
		if (hasErrors) {
			event.preventDefault();
			event.stopPropagation();
		}

		// If there are errrors, focus on first element with error
		if (hasErrors) {
			hasErrors.focus();
			return;
		}

		// Otherwise, submit the form
		event.target.value = 'Processing...';
	};

	if (eddCompletePurchase) {
		eddCompletePurchase.addEventListener('click', completePurchaseHandler, false);
	}

})(window, document);

validate.init({
	selector: '#edd_purchase_form, .edd-self-service-form',
	fieldClass: 'error-field',
	onSubmit: function (form) {
		// Self-Service
		var ssSubmit = form.querySelector('.edd-self-service-button');
		if (ssSubmit) {
			ssSubmit.innerHTML = 'Resending Receipts...';
			ssSubmit.classList.add('disabled');
		}
	}
});