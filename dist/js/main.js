/*!
 * gmt-checkout v1.3.3: Shopping cart for GoMakeThings.com
 * (c) 2018 Chris Ferdinandi
 * MIT License
 * https://github.com/cferdinandi/gmt-checkout
 * Open Source Credits: https://github.com/toddmotto/fluidvids, http://prismjs.com, https://github.com/filamentgroup/loadJS/, https://github.com/filamentgroup/loadCSS, https://github.com/bramstein/fontfaceobserver, https://github.com/muffinresearch/payment-icons, https://nosir.github.io/cleave.js/
 */

/*!
 * validate v1.0.4: A lightweight form validation script that augments native HTML5 form validation elements and attributes.
 * (c) 2017 Chris Ferdinandi
 * MIT License
 * http://github.com/cferdinandi/validate
 */

;(function (window, document, undefined) {

	'use strict';

	// Make sure that ValidityState is supported in full (all features)
	var supported = function () {
		var input = document.createElement('input');
		return ('validity' in input && 'badInput' in input.validity && 'patternMismatch' in input.validity && 'rangeOverflow' in input.validity && 'rangeUnderflow' in input.validity && 'stepMismatch' in input.validity && 'tooLong' in input.validity && 'tooShort' in input.validity && 'typeMismatch' in input.validity && 'valid' in input.validity && 'valueMissing' in input.validity);
	};

	/**
	 * Generate the field validity object
	 * @param  {Node]} field The field to validate
	 * @return {Object}      The validity object
	 */
	var getValidityState = function (field) {

		// Variables
		var type = field.getAttribute('type') || input.nodeName.toLowerCase();
		var isNum = type === 'number' || type === 'range';
		var length = field.value.length;
		var valid = true;

		// If radio group, get selected field
		if (field.type === 'radio' && field.name) {
			var group = document.getElementsByName(field.name);
			if (group.length > 0) {
				for (var i = 0; i < group.length; i++) {
					if (group[i].form === field.form && field.checked) {
						field = group[i];
						break;
					}
				}
			}
		}

		// Run validity checks
		var checkValidity = {
			badInput: (isNum && length > 0 && !/[-+]?[0-9]/.test(field.value)), // value of a number field is not a number
			patternMismatch: (field.hasAttribute('pattern') && length > 0 && new RegExp(field.getAttribute('pattern')).test(field.value) === false), // value does not conform to the pattern
			rangeOverflow: (field.hasAttribute('max') && isNum && field.value > 0 && Number(field.value) > Number(field.getAttribute('max'))), // value of a number field is higher than the max attribute
			rangeUnderflow: (field.hasAttribute('min') && isNum && field.value > 0 && Number(field.value) < Number(field.getAttribute('min'))), // value of a number field is lower than the min attribute
			stepMismatch: (isNum && ((field.hasAttribute('step') && field.getAttribute('step') !== 'any' && Number(field.value) % Number(field.getAttribute('step')) !== 0) || (!field.hasAttribute('step') && Number(field.value) % 1 !== 0))), // value of a number field does not conform to the stepattribute
			tooLong: (field.hasAttribute('maxLength') && field.getAttribute('maxLength') > 0 && length > parseInt(field.getAttribute('maxLength'), 10)), // the user has edited a too-long value in a field with maxlength
			tooShort: (field.hasAttribute('minLength') && field.getAttribute('minLength') > 0 && length > 0 && length < parseInt(field.getAttribute('minLength'), 10)), // the user has edited a too-short value in a field with minlength
			typeMismatch: (length > 0 && ((type === 'email' && !/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(field.value)) || (type === 'url' && !/^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:[\/?#]\S*)?$/.test(field.value)))), // value of a email or URL field is not an email address or URL
			valueMissing: (field.hasAttribute('required') && (((type === 'checkbox' || type === 'radio') && !field.checked) || (type === 'select' && field.options[field.selectedIndex].value < 1) || (type !=='checkbox' && type !== 'radio' && type !=='select' && length < 1))) // required field without a value
		};

		// Check if any errors
		for (var key in checkValidity) {
			if (checkValidity.hasOwnProperty(key)) {
				// If there's an error, change valid value
				if (checkValidity[key]) {
					valid = false;
					break;
				}
			}
		}

		// Add valid property to validity object
		checkValidity.valid = valid;

		// Return object
		return checkValidity;

	};

	// If the full set of ValidityState features aren't supported, polyfill
	// if (!supported()) {
		Object.defineProperty(HTMLInputElement.prototype, 'validity', {
			get: function ValidityState() {
				return getValidityState(this);
			},
			configurable: true,
		});
	// }

})(window, document);
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Cleave"] = factory();
	else
		root["Cleave"] = factory();
})(this, (function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/**
	 * Construct a new Cleave instance by passing the configuration object
	 *
	 * @param {String / HTMLElement} element
	 * @param {Object} opts
	 */
	var Cleave = function (element, opts) {
	    var owner = this;

	    if (typeof element === 'string') {
	        owner.element = document.querySelector(element);
	    } else {
	        owner.element = ((typeof element.length !== 'undefined') && element.length > 0) ? element[0] : element;
	    }

	    if (!owner.element) {
	        throw new Error('[cleave.js] Please check the element');
	    }

	    opts.initValue = owner.element.value;

	    owner.properties = Cleave.DefaultProperties.assign({}, opts);

	    owner.init();
	};

	Cleave.prototype = {
	    init: function () {
	        var owner = this, pps = owner.properties;

	        // no need to use this lib
	        if (!pps.numeral && !pps.phone && !pps.creditCard && !pps.date && (pps.blocksLength === 0 && !pps.prefix)) {
	            return;
	        }

	        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);

	        owner.onChangeListener = owner.onChange.bind(owner);
	        owner.onKeyDownListener = owner.onKeyDown.bind(owner);
	        owner.onCutListener = owner.onCut.bind(owner);
	        owner.onCopyListener = owner.onCopy.bind(owner);

	        owner.element.addEventListener('input', owner.onChangeListener);
	        owner.element.addEventListener('keydown', owner.onKeyDownListener);
	        owner.element.addEventListener('cut', owner.onCutListener);
	        owner.element.addEventListener('copy', owner.onCopyListener);


	        owner.initPhoneFormatter();
	        owner.initDateFormatter();
	        owner.initNumeralFormatter();

	        owner.onInput(pps.initValue);
	    },

	    initNumeralFormatter: function () {
	        var owner = this, pps = owner.properties;

	        if (!pps.numeral) {
	            return;
	        }

	        pps.numeralFormatter = new Cleave.NumeralFormatter(
	            pps.numeralDecimalMark,
	            pps.numeralDecimalScale,
	            pps.numeralThousandsGroupStyle,
	            pps.numeralPositiveOnly,
	            pps.delimiter
	        );
	    },

	    initDateFormatter: function () {
	        var owner = this, pps = owner.properties;

	        if (!pps.date) {
	            return;
	        }

	        pps.dateFormatter = new Cleave.DateFormatter(pps.datePattern);
	        pps.blocks = pps.dateFormatter.getBlocks();
	        pps.blocksLength = pps.blocks.length;
	        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
	    },

	    initPhoneFormatter: function () {
	        var owner = this, pps = owner.properties;

	        if (!pps.phone) {
	            return;
	        }

	        // Cleave.AsYouTypeFormatter should be provided by
	        // external google closure lib
	        try {
	            pps.phoneFormatter = new Cleave.PhoneFormatter(
	                new pps.root.Cleave.AsYouTypeFormatter(pps.phoneRegionCode),
	                pps.delimiter
	            );
	        } catch (ex) {
	            throw new Error('[cleave.js] Please include phone-type-formatter.{country}.js lib');
	        }
	    },

	    onKeyDown: function (event) {
	        var owner = this, pps = owner.properties,
	            charCode = event.which || event.keyCode;

	        // hit backspace when last character is delimiter
	        if (charCode === 8 && Cleave.Util.isDelimiter(owner.element.value.slice(-1), pps.delimiter, pps.delimiters)) {
	            pps.backspace = true;

	            return;
	        }

	        pps.backspace = false;
	    },

	    onChange: function () {
	        this.onInput(this.element.value);
	    },

	    onCut: function (e) {
	        this.copyClipboardData(e);
	        this.onInput('');
	    },

	    onCopy: function (e) {
	        this.copyClipboardData(e);
	    },

	    copyClipboardData: function (e) {
	        var owner = this,
	            pps = owner.properties,
	            Util = Cleave.Util,
	            inputValue = owner.element.value,
	            textToCopy = '';

	        if (!pps.copyDelimiter) {
	            textToCopy = Util.stripDelimiters(inputValue, pps.delimiter, pps.delimiters);
	        } else {
	            textToCopy = inputValue;
	        }

	        try {
	            if (e.clipboardData) {
	                e.clipboardData.setData('Text', textToCopy);
	            } else {
	                window.clipboardData.setData('Text', textToCopy);
	            }

	            e.preventDefault();
	        } catch (ex) {
	            //  empty
	        }
	    },

	    onInput: function (value) {
	        var owner = this, pps = owner.properties,
	            prev = value,
	            Util = Cleave.Util;

	        // case 1: delete one more character "4"
	        // 1234*| -> hit backspace -> 123|
	        // case 2: last character is not delimiter which is:
	        // 12|34* -> hit backspace -> 1|34*
	        // note: no need to apply this for numeral mode
	        if (!pps.numeral && pps.backspace && !Util.isDelimiter(value.slice(-1), pps.delimiter, pps.delimiters)) {
	            value = Util.headStr(value, value.length - 1);
	        }

	        // phone formatter
	        if (pps.phone) {
	            pps.result = pps.phoneFormatter.format(value);
	            owner.updateValueState();

	            return;
	        }

	        // numeral formatter
	        if (pps.numeral) {
	            pps.result = pps.prefix + pps.numeralFormatter.format(value);
	            owner.updateValueState();

	            return;
	        }

	        // date
	        if (pps.date) {
	            value = pps.dateFormatter.getValidatedDate(value);
	        }

	        // strip delimiters
	        value = Util.stripDelimiters(value, pps.delimiter, pps.delimiters);

	        // strip prefix
	        value = Util.getPrefixStrippedValue(value, pps.prefix, pps.prefixLength);

	        // strip non-numeric characters
	        value = pps.numericOnly ? Util.strip(value, /[^\d]/g) : value;

	        // convert case
	        value = pps.uppercase ? value.toUpperCase() : value;
	        value = pps.lowercase ? value.toLowerCase() : value;

	        // prefix
	        if (pps.prefix) {
	            value = pps.prefix + value;

	            // no blocks specified, no need to do formatting
	            if (pps.blocksLength === 0) {
	                pps.result = value;
	                owner.updateValueState();

	                return;
	            }
	        }

	        // update credit card props
	        if (pps.creditCard) {
	            owner.updateCreditCardPropsByValue(value);
	        }

	        // strip over length characters
	        value = Util.headStr(value, pps.maxLength);

	        // apply blocks
	        pps.result = Util.getFormattedValue(value, pps.blocks, pps.blocksLength, pps.delimiter, pps.delimiters);

	        // nothing changed
	        // prevent update value to avoid caret position change
	        if (prev === pps.result && prev !== pps.prefix) {
	            return;
	        }

	        owner.updateValueState();
	    },

	    updateCreditCardPropsByValue: function (value) {
	        var owner = this, pps = owner.properties,
	            Util = Cleave.Util,
	            creditCardInfo;

	        // At least one of the first 4 characters has changed
	        if (Util.headStr(pps.result, 4) === Util.headStr(value, 4)) {
	            return;
	        }

	        creditCardInfo = Cleave.CreditCardDetector.getInfo(value, pps.creditCardStrictMode);

	        pps.blocks = creditCardInfo.blocks;
	        pps.blocksLength = pps.blocks.length;
	        pps.maxLength = Util.getMaxLength(pps.blocks);

	        // credit card type changed
	        if (pps.creditCardType !== creditCardInfo.type) {
	            pps.creditCardType = creditCardInfo.type;

	            pps.onCreditCardTypeChanged.call(owner, pps.creditCardType);
	        }
	    },

	    updateValueState: function () {
	        var owner = this;

	        owner.element.value = owner.properties.result;
	    },

	    setPhoneRegionCode: function (phoneRegionCode) {
	        var owner = this, pps = owner.properties;

	        pps.phoneRegionCode = phoneRegionCode;
	        owner.initPhoneFormatter();
	        owner.onChange();
	    },

	    setRawValue: function (value) {
	        var owner = this, pps = owner.properties;

	        value = value !== undefined ? value.toString() : '';

	        if (pps.numeral) {
	            value = value.replace('.', pps.numeralDecimalMark);
	        }

	        owner.element.value = value;
	        owner.onInput(value);
	    },

	    getRawValue: function () {
	        var owner = this,
	            pps = owner.properties,
	            Util = Cleave.Util,
	            rawValue = owner.element.value;

	        if (pps.rawValueTrimPrefix) {
	            rawValue = Util.getPrefixStrippedValue(rawValue, pps.prefix, pps.prefixLength);
	        }

	        if (pps.numeral) {
	            rawValue = pps.numeralFormatter.getRawValue(rawValue);
	        } else {
	            rawValue = Util.stripDelimiters(rawValue, pps.delimiter, pps.delimiters);
	        }

	        return rawValue;
	    },

	    getFormattedValue: function () {
	        return this.element.value;
	    },

	    destroy: function () {
	        var owner = this;

	        owner.element.removeEventListener('input', owner.onChangeListener);
	        owner.element.removeEventListener('keydown', owner.onKeyDownListener);
	        owner.element.removeEventListener('cut', owner.onCutListener);
	        owner.element.removeEventListener('copy', owner.onCopyListener);
	    },

	    toString: function () {
	        return '[Cleave Object]';
	    }
	};

	Cleave.NumeralFormatter = __webpack_require__(1);
	Cleave.DateFormatter = __webpack_require__(2);
	Cleave.PhoneFormatter = __webpack_require__(3);
	Cleave.CreditCardDetector = __webpack_require__(4);
	Cleave.Util = __webpack_require__(5);
	Cleave.DefaultProperties = __webpack_require__(6);

	// for angular directive
	((typeof global === 'object' && global) ? global : window)['Cleave'] = Cleave;

	// CommonJS
	module.exports = Cleave;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	var NumeralFormatter = function (numeralDecimalMark,
	                                 numeralDecimalScale,
	                                 numeralThousandsGroupStyle,
	                                 numeralPositiveOnly,
	                                 delimiter) {
	    var owner = this;

	    owner.numeralDecimalMark = numeralDecimalMark || '.';
	    owner.numeralDecimalScale = numeralDecimalScale >= 0 ? numeralDecimalScale : 2;
	    owner.numeralThousandsGroupStyle = numeralThousandsGroupStyle || NumeralFormatter.groupStyle.thousand;
	    owner.numeralPositiveOnly = !!numeralPositiveOnly;
	    owner.delimiter = (delimiter || delimiter === '') ? delimiter : ',';
	    owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';
	};

	NumeralFormatter.groupStyle = {
	    thousand: 'thousand',
	    lakh:     'lakh',
	    wan:      'wan'
	};

	NumeralFormatter.prototype = {
	    getRawValue: function (value) {
	        return value.replace(this.delimiterRE, '').replace(this.numeralDecimalMark, '.');
	    },

	    format: function (value) {
	        var owner = this, parts, partInteger, partDecimal = '';

	        // strip alphabet letters
	        value = value.replace(/[A-Za-z]/g, '')
	            // replace the first decimal mark with reserved placeholder
	            .replace(owner.numeralDecimalMark, 'M')

	            // strip non numeric letters except minus and "M"
	            // this is to ensure prefix has been stripped
	            .replace(/[^\dM-]/g, '')

	            // replace the leading minus with reserved placeholder
	            .replace(/^\-/, 'N')

	            // strip the other minus sign (if present)
	            .replace(/\-/g, '')

	            // replace the minus sign (if present)
	            .replace('N', owner.numeralPositiveOnly ? '' : '-')

	            // replace decimal mark
	            .replace('M', owner.numeralDecimalMark)

	            // strip any leading zeros
	            .replace(/^(-)?0+(?=\d)/, '$1');

	        partInteger = value;

	        if (value.indexOf(owner.numeralDecimalMark) >= 0) {
	            parts = value.split(owner.numeralDecimalMark);
	            partInteger = parts[0];
	            partDecimal = owner.numeralDecimalMark + parts[1].slice(0, owner.numeralDecimalScale);
	        }

	        switch (owner.numeralThousandsGroupStyle) {
	        case NumeralFormatter.groupStyle.lakh:
	            partInteger = partInteger.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + owner.delimiter);

	            break;

	        case NumeralFormatter.groupStyle.wan:
	            partInteger = partInteger.replace(/(\d)(?=(\d{4})+$)/g, '$1' + owner.delimiter);

	            break;

	        default:
	            partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + owner.delimiter);
	        }

	        return partInteger.toString() + (owner.numeralDecimalScale > 0 ? partDecimal.toString() : '');
	    }
	};

	module.exports = NumeralFormatter;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	var DateFormatter = function (datePattern) {
	    var owner = this;

	    owner.blocks = [];
	    owner.datePattern = datePattern;
	    owner.initBlocks();
	};

	DateFormatter.prototype = {
	    initBlocks: function () {
	        var owner = this;
	        owner.datePattern.forEach((function (value) {
	            if (value === 'Y') {
	                owner.blocks.push(4);
	            } else {
	                owner.blocks.push(2);
	            }
	        }));
	    },

	    getBlocks: function () {
	        return this.blocks;
	    },

	    getValidatedDate: function (value) {
	        var owner = this, result = '';

	        value = value.replace(/[^\d]/g, '');

	        owner.blocks.forEach((function (length, index) {
	            if (value.length > 0) {
	                var sub = value.slice(0, length),
	                    sub0 = sub.slice(0, 1),
	                    rest = value.slice(length);

	                switch (owner.datePattern[index]) {
	                case 'd':
	                    if (sub === '00') {
	                        sub = '01';
	                    } else if (parseInt(sub0, 10) > 3) {
	                        sub = '0' + sub0;
	                    } else if (parseInt(sub, 10) > 31) {
	                        sub = '31';
	                    }

	                    break;

	                case 'm':
	                    if (sub === '00') {
	                        sub = '01';
	                    } else if (parseInt(sub0, 10) > 1) {
	                        sub = '0' + sub0;
	                    } else if (parseInt(sub, 10) > 12) {
	                        sub = '12';
	                    }

	                    break;
	                }

	                result += sub;

	                // update remaining string
	                value = rest;
	            }
	        }));

	        return result;
	    }
	};

	module.exports = DateFormatter;



/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	var PhoneFormatter = function (formatter, delimiter) {
	    var owner = this;

	    owner.delimiter = (delimiter || delimiter === '') ? delimiter : ' ';
	    owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';

	    owner.formatter = formatter;
	};

	PhoneFormatter.prototype = {
	    setFormatter: function (formatter) {
	        this.formatter = formatter;
	    },

	    format: function (phoneNumber) {
	        var owner = this;

	        owner.formatter.clear();

	        // only keep number and +
	        phoneNumber = phoneNumber.replace(/[^\d+]/g, '');

	        // strip delimiter
	        phoneNumber = phoneNumber.replace(owner.delimiterRE, '');

	        var result = '', current, validated = false;

	        for (var i = 0, iMax = phoneNumber.length; i < iMax; i++) {
	            current = owner.formatter.inputDigit(phoneNumber.charAt(i));

	            // has ()- or space inside
	            if (/[\s()-]/g.test(current)) {
	                result = current;

	                validated = true;
	            } else {
	                if (!validated) {
	                    result = current;
	                }
	                // else: over length input
	                // it turns to invalid number again
	            }
	        }

	        // strip ()
	        // e.g. US: 7161234567 returns (716) 123-4567
	        result = result.replace(/[()]/g, '');
	        // replace library delimiter with user customized delimiter
	        result = result.replace(/[\s-]/g, owner.delimiter);

	        return result;
	    }
	};

	module.exports = PhoneFormatter;



/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	var CreditCardDetector = {
	    blocks: {
	        uatp:          [4, 5, 6],
	        amex:          [4, 6, 5],
	        diners:        [4, 6, 4],
	        discover:      [4, 4, 4, 4],
	        mastercard:    [4, 4, 4, 4],
	        dankort:       [4, 4, 4, 4],
	        instapayment:  [4, 4, 4, 4],
	        jcb:           [4, 4, 4, 4],
	        maestro:       [4, 4, 4, 4],
	        visa:          [4, 4, 4, 4],
	        general:       [4, 4, 4, 4],
	        generalStrict: [4, 4, 4, 7]
	    },

	    re: {
	        // starts with 1; 15 digits, not starts with 1800 (jcb card)
	        uatp: /^(?!1800)1\d{0,14}/,

	        // starts with 34/37; 15 digits
	        amex: /^3[47]\d{0,13}/,

	        // starts with 6011/65/644-649; 16 digits
	        discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,

	        // starts with 300-305/309 or 36/38/39; 14 digits
	        diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,

	        // starts with 51-55/22-27; 16 digits
	        mastercard: /^(5[1-5]|2[2-7])\d{0,14}/,

	        // starts with 5019/4175/4571; 16 digits
	        dankort: /^(5019|4175|4571)\d{0,12}/,

	        // starts with 637-639; 16 digits
	        instapayment: /^63[7-9]\d{0,13}/,

	        // starts with 2131/1800/35; 16 digits
	        jcb: /^(?:2131|1800|35\d{0,2})\d{0,12}/,

	        // starts with 50/56-58/6304/67; 16 digits
	        maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,

	        // starts with 4; 16 digits
	        visa: /^4\d{0,15}/
	    },

	    getInfo: function (value, strictMode) {
	        var blocks = CreditCardDetector.blocks,
	            re = CreditCardDetector.re;

	        // In theory, visa credit card can have up to 19 digits number.
	        // Set strictMode to true will remove the 16 max-length restrain,
	        // however, I never found any website validate card number like
	        // this, hence probably you don't need to enable this option.
	        strictMode = !!strictMode;

	        if (re.amex.test(value)) {
	            return {
	                type:   'amex',
	                blocks: blocks.amex
	            };
	        } else if (re.uatp.test(value)) {
	            return {
	                type:   'uatp',
	                blocks: blocks.uatp
	            };
	        } else if (re.diners.test(value)) {
	            return {
	                type:   'diners',
	                blocks: blocks.diners
	            };
	        } else if (re.discover.test(value)) {
	            return {
	                type:   'discover',
	                blocks: blocks.discover
	            };
	        } else if (re.mastercard.test(value)) {
	            return {
	                type:   'mastercard',
	                blocks: blocks.mastercard
	            };
	        } else if (re.dankort.test(value)) {
	            return {
	                type:   'dankort',
	                blocks: blocks.dankort
	            };
	        } else if (re.instapayment.test(value)) {
	            return {
	                type:   'instapayment',
	                blocks: blocks.instapayment
	            };
	        } else if (re.jcb.test(value)) {
	            return {
	                type:   'jcb',
	                blocks: blocks.jcb
	            };
	        } else if (re.maestro.test(value)) {
	            return {
	                type:   'maestro',
	                blocks: blocks.maestro
	            };
	        } else if (re.visa.test(value)) {
	            return {
	                type:   'visa',
	                blocks: strictMode ? blocks.generalStrict : blocks.visa
	            };
	        } else {
	            return {
	                type:   'unknown',
	                blocks: blocks.general
	            };
	        }
	    }
	};

	module.exports = CreditCardDetector;



/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	var Util = {
	    noop: function () {
	    },

	    strip: function (value, re) {
	        return value.replace(re, '');
	    },

	    isDelimiter: function (letter, delimiter, delimiters) {
	        // single delimiter
	        if (delimiters.length === 0) {
	            return letter === delimiter;
	        }

	        // multiple delimiters
	        return delimiters.some((function (current) {
	            if (letter === current) {
	                return true;
	            }
	        }));
	    },

	    stripDelimiters: function (value, delimiter, delimiters) {
	        // single delimiter
	        if (delimiters.length === 0) {
	            var delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';

	            return value.replace(delimiterRE, '');
	        }

	        // multiple delimiters
	        delimiters.forEach((function (current) {
	            value = value.replace(new RegExp('\\' + current, 'g'), '');
	        }));

	        return value;
	    },

	    headStr: function (str, length) {
	        return str.slice(0, length);
	    },

	    getMaxLength: function (blocks) {
	        return blocks.reduce((function (previous, current) {
	            return previous + current;
	        }), 0);
	    },

	    // strip value by prefix length
	    // for prefix: PRE
	    // (PRE123, 3) -> 123
	    // (PR123, 3) -> 23 this happens when user hits backspace in front of "PRE"
	    getPrefixStrippedValue: function (value, prefix, prefixLength) {
	        if (value.slice(0, prefixLength) !== prefix) {
	            var diffIndex = this.getFirstDiffIndex(prefix, value.slice(0, prefixLength));

	            value = prefix + value.slice(diffIndex, diffIndex + 1) + value.slice(prefixLength + 1);
	        }

	        return value.slice(prefixLength);
	    },

	    getFirstDiffIndex: function (prev, current) {
	        var index = 0;

	        while (prev.charAt(index) === current.charAt(index))
	            if (prev.charAt(index++) === '')
	                return -1;

	        return index;
	    },

	    getFormattedValue: function (value, blocks, blocksLength, delimiter, delimiters) {
	        var result = '',
	            multipleDelimiters = delimiters.length > 0,
	            currentDelimiter;

	        // no options, normal input
	        if (blocksLength === 0) {
	            return value;
	        }

	        blocks.forEach((function (length, index) {
	            if (value.length > 0) {
	                var sub = value.slice(0, length),
	                    rest = value.slice(length);

	                result += sub;

	                currentDelimiter = multipleDelimiters ? (delimiters[index] || currentDelimiter) : delimiter;

	                if (sub.length === length && index < blocksLength - 1) {
	                    result += currentDelimiter;
	                }

	                // update remaining string
	                value = rest;
	            }
	        }));

	        return result;
	    }
	};

	module.exports = Util;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/**
	 * Props Assignment
	 *
	 * Separate this, so react module can share the usage
	 */
	var DefaultProperties = {
	    // Maybe change to object-assign
	    // for now just keep it as simple
	    assign: function (target, opts) {
	        target = target || {};
	        opts = opts || {};

	        // credit card
	        target.creditCard = !!opts.creditCard;
	        target.creditCardStrictMode = !!opts.creditCardStrictMode;
	        target.creditCardType = '';
	        target.onCreditCardTypeChanged = opts.onCreditCardTypeChanged || (function () {});

	        // phone
	        target.phone = !!opts.phone;
	        target.phoneRegionCode = opts.phoneRegionCode || 'AU';
	        target.phoneFormatter = {};

	        // date
	        target.date = !!opts.date;
	        target.datePattern = opts.datePattern || ['d', 'm', 'Y'];
	        target.dateFormatter = {};

	        // numeral
	        target.numeral = !!opts.numeral;
	        target.numeralDecimalScale = opts.numeralDecimalScale >= 0 ? opts.numeralDecimalScale : 2;
	        target.numeralDecimalMark = opts.numeralDecimalMark || '.';
	        target.numeralThousandsGroupStyle = opts.numeralThousandsGroupStyle || 'thousand';
	        target.numeralPositiveOnly = !!opts.numeralPositiveOnly;

	        // others
	        target.numericOnly = target.creditCard || target.date || !!opts.numericOnly;

	        target.uppercase = !!opts.uppercase;
	        target.lowercase = !!opts.lowercase;

	        target.prefix = (target.creditCard || target.phone || target.date) ? '' : (opts.prefix || '');
	        target.prefixLength = target.prefix.length;
	        target.rawValueTrimPrefix = !!opts.rawValueTrimPrefix;
	        target.copyDelimiter = !!opts.copyDelimiter;

	        target.initValue = opts.initValue === undefined ? '' : opts.initValue.toString();

	        target.delimiter =
	            (opts.delimiter || opts.delimiter === '') ? opts.delimiter :
	                (opts.date ? '/' :
	                    (opts.numeral ? ',' :
	                        (opts.phone ? ' ' :
	                            ' ')));
	        target.delimiters = opts.delimiters || [];

	        target.blocks = opts.blocks || [];
	        target.blocksLength = target.blocks.length;

	        target.root = (typeof global === 'object' && global) ? global : window;

	        target.maxLength = 0;

	        target.backspace = false;
	        target.result = '';

	        return target;
	    }
	};

	module.exports = DefaultProperties;


	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ })
/******/ ])
}));
;
// JavaScript enabled
document.documentElement.className += ' js-edd';

// Hide checkbox value
;(function (window, document, undefined) {
	var mailchimp = document.getElementById('edd_mailchimp_signup');
	if (!mailchimp) return;
	mailchimp.type = 'hidden';
})(window, document);
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
		xhr.open('GET', '/pricing-parity');
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
/*!
 * validate v1.0.4: A lightweight form validation script that augments native HTML5 form validation elements and attributes.
 * (c) 2017 Chris Ferdinandi
 * MIT License
 * http://github.com/cferdinandi/validate
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.validate = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

	'use strict';

	//
	// Variables
	//

	var validate = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root; // Feature test
	var settings;

	// Default settings
	var defaults = {

		// Classes and Selectors
		selector: '[data-validate]',
		fieldClass: 'error',
		errorClass: 'error-message',

		// Messages
		messageValueMissing: 'Please fill out this field.',
		messageTypeMismatchEmail: 'Please enter an email address.',
		messageTypeMismatchURL: 'Please enter a URL.',
		messageTooShort: 'Please lengthen this text to {minLength} characters or more. You are currently using {length} characters.',
		messageTooLong: 'Please shorten this text to no more than {maxLength} characters. You are currently using {length} characters.',
		messagePatternMismatch: 'Please match the requested format.',
		messageBadInput: 'Please enter a number.',
		messageStepMismatch: 'Please select a valid value.',
		messageRangeOverflow: 'Please select a value that is no more than {max}.',
		messageRangeUnderflow: 'Please select a value that is no less than {min}.',
		messageGeneric: 'The value you entered for this field is invalid.',

		// Form Submission
		disableSubmit: false,
		onSubmit: function () {},

		// Callbacks
		beforeShowError: function () {},
		afterShowError: function () {},
		beforeRemoveError: function () {},
		afterRemoveError: function () {},

	};


	//
	// Methods
	//

	// Element.matches() polyfill
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function(s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	/**
	 * Merge two or more objects. Returns a new object.
	 * @private
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Get the closest matching element up the DOM tree.
	 * @private
	 * @param  {Element} elem     Starting element
	 * @param  {String}  selector Selector to match against
	 * @return {Boolean|Element}  Returns null if not match found
	 */
	var getClosest = function ( elem, selector ) {
		for ( ; elem && elem !== document; elem = elem.parentNode ) {
			if ( elem.matches( selector ) ) return elem;
		}
		return null;
	};

	/**
	 * Validate a form field
	 * @public
	 * @param  {Node}    field   The field to validate
	 * @param  {Object}  options User options
	 * @return {String}          The error message
	 */
	validate.hasError = function (field, options) {

		// Merge user options with existing settings or defaults
		var localSettings = extend(settings || defaults, options || {});

		// Don't validate submits, buttons, file and reset inputs, and disabled fields
		if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

		// Get validity
		var validity = field.validity;

		// If valid, return null
		if (validity.valid) return;

		// If field is required and empty
		if (validity.valueMissing) return localSettings.messageValueMissing;

		// If not the right type
		if (validity.typeMismatch) {

			// Email
			if (field.type === 'email') return localSettings.messageTypeMismatchEmail;

			// URL
			if (field.type === 'url') return localSettings.messageTypeMismatchURL;

		}

		// If too short
		if (validity.tooShort) return localSettings.messageTooShort.replace('{minLength}', field.getAttribute('minLength')).replace('{length}', field.value.length);

		// If too long
		if (validity.tooLong) return localSettings.messageTooLong.replace('{minLength}', field.getAttribute('maxLength')).replace('{length}', field.value.length);

		// If number input isn't a number
		if (validity.badInput) return localSettings.messageBadInput;

		// If a number value doesn't match the step interval
		if (validity.stepMismatch) return localSettings.messageStepMismatch;

		// If a number field is over the max
		if (validity.rangeOverflow) return localSettings.messageRangeOverflow.replace('{max}', field.getAttribute('max'));

		// If a number field is below the min
		if (validity.rangeUnderflow) return localSettings.messageRangeUnderflow.replace('{min}', field.getAttribute('min'));

		// If pattern doesn't match
		if (validity.patternMismatch) {

			// If pattern info is included, return custom error
			if (field.hasAttribute('title')) return field.getAttribute('title');

			// Otherwise, generic error
			return localSettings.messagePatternMismatch;

		}

		// If all else fails, return a generic catchall error
		return localSettings.messageGeneric;

	};

	/**
	 * Show an error message on a field
	 * @public
	 * @param  {Node}   field   The field to show an error message for
	 * @param  {String} error   The error message to show
	 * @param  {Object} options User options
	 */
	validate.showError = function (field, error, options) {

		// Merge user options with existing settings or defaults
		var localSettings = extend(settings || defaults, options || {});

		// Before show error callback
		localSettings.beforeShowError(field, error);

		// Add error class to field
		field.classList.add(localSettings.fieldClass);

		// If the field is a radio button and part of a group, error all and get the last item in the group
		if (field.type === 'radio' && field.name) {
			var group = document.getElementsByName(field.name);
			if (group.length > 0) {
				for (var i = 0; i < group.length; i++) {
					if (group[i].form !== field.form) continue; // Only check fields in current form
					group[i].classList.add(localSettings.fieldClass);
				}
				field = group[group.length - 1];
			}
		}

		// Get field id or name
		var id = field.id || field.name;
		if (!id) return;

		// Check if error message field already exists
		// If not, create one
		var message = field.form.querySelector('.' + localSettings.errorClass + '#error-for-' + id );
		if (!message) {
			message = document.createElement('div');
			message.className = localSettings.errorClass;
			message.id = 'error-for-' + id;

			// If the field is a radio button or checkbox, insert error after the label
			var label;
			if (field.type === 'radio' || field.type ==='checkbox') {
				label = field.form.querySelector('label[for="' + id + '"]') || getClosest(field, 'label');
				if (label) {
					label.parentNode.insertBefore( message, label.nextSibling );
				}
			}

			// Otherwise, insert it after the field
			if (!label) {
				field.parentNode.insertBefore( message, field.nextSibling );
			}
		}

		// Add ARIA role to the field
		field.setAttribute('aria-describedby', 'error-for-' + id);

		// Update error message
		message.innerHTML = error;

		// Show error message
		message.style.display = 'block';
		message.style.visibility = 'visible';

		// After show error callback
		localSettings.afterShowError(field, error);

	};

	/**
	 * Remove an error message from a field
	 * @public
	 * @param  {Node}   field   The field to remove the error from
	 * @param  {Object} options User options
	 */
	validate.removeError = function (field, options) {

		// Merge user options with existing settings or defaults
		var localSettings = extend(settings || defaults, options || {});

		// Before remove error callback
		localSettings.beforeRemoveError(field);

		// Remove ARIA role from the field
		field.removeAttribute('aria-describedby');

		// Remove error class to field
		field.classList.remove(localSettings.fieldClass);

		// If the field is a radio button and part of a group, remove error from all and get the last item in the group
		if (field.type === 'radio' && field.name) {
			var group = document.getElementsByName(field.name);
			if (group.length > 0) {
				for (var i = 0; i < group.length; i++) {
					if (group[i].form !== field.form) continue; // Only check fields in current form
					group[i].classList.remove(localSettings.fieldClass);
				}
				field = group[group.length - 1];
			}
		}

		// Get field id or name
		var id = field.id || field.name;
		if (!id) return;

		// Check if an error message is in the DOM
		var message = field.form.querySelector('.' + localSettings.errorClass + '#error-for-' + id + '');
		if (!message) return;

		// If so, hide it
		message.innerHTML = '';
		message.style.display = 'none';
		message.style.visibility = 'hidden';

		// After remove error callback
		localSettings.afterRemoveError(field);

	};

	/**
	 * Add the `novalidate` attribute to all forms
	 * @private
	 * @param {Boolean} remove  If true, remove the `novalidate` attribute
	 */
	var addNoValidate = function (remove) {
		var forms = document.querySelectorAll(settings.selector);
		for (var i = 0; i < forms.length; i++) {
			if (remove) {
				forms[i].removeAttribute('novalidate');
				continue;
			}
			forms[i].setAttribute('novalidate', true);
		}
	};

	/**
	 * Check field validity when it loses focus
	 * @private
	 * @param  {Event} event The blur event
	 */
	var blurHandler = function (event) {

		// Only run if the field is in a form to be validated
		if (!event.target.form || !event.target.form.matches(settings.selector)) return;

		// Validate the field
		var error = validate.hasError(event.target);

		// If there's an error, show it
		if (error) {
			validate.showError(event.target, error);
			return;
		}

		// Otherwise, remove any errors that exist
		validate.removeError(event.target);

	};

	/**
	 * Check all fields on submit
	 * @private
	 * @param  {Event} event  The submit event
	 */
	var submitHandler = function (event) {

		// Only run on forms flagged for validation
		if (!event.target.matches(settings.selector)) return;

		// Get all of the form elements
		var fields = event.target.elements;

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
		if (hasErrors || settings.disableSubmit) {
			event.preventDefault();
		}

		// If there are errrors, focus on first element with error
		if (hasErrors) {
			hasErrors.focus();
			return;
		}

		// Otherwise, submit the form
		settings.onSubmit(event.target, fields);

	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	validate.destroy = function () {

		// If plugin isn't already initialized, stop
		if ( !settings ) return;

		// Remove event listeners
		document.removeEventListener('blur', blurHandler, false);
		document.removeEventListener('submit', submitHandler, false);

		// Remove all errors
		var fields = document.querySelectorAll(settings.errorClass);
		for (var i = 0; i < fields.length; i++) {
			validate.removeError(fields[i]);
		}

		// Remove `novalidate` from forms
		addNoValidate(true);

		// Reset variables
		settings = null;

	};

	/**
	 * Initialize Validate
	 * @public
	 * @param {Object} options User settings
	 */
	validate.init = function (options) {

		// feature test
		if (!supports) return;

		// Destroy any existing initializations
		validate.destroy();

		// Merge user options with defaults
		settings = extend(defaults, options || {});

		// Add the `novalidate` attribute to all forms
		addNoValidate();

		// Event listeners
		document.addEventListener('blur', blurHandler, true);
		document.addEventListener('submit', submitHandler, false);

	};


	//
	// Public APIs
	//

	return validate;

}));
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