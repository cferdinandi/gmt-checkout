/*! gmt-checkout v3.4.0 | (c) 2022 Chris Ferdinandi | MIT License | https://github.com/cferdinandi/gmt-checkout | Open Source: undefined */
(function () {
    'use strict';

    let products = document.querySelectorAll('.edd_purchase_receipt_product_name');
    for (let product of products) {
        product.textContent = product.textContent.replace(' — _', '');
    }

}());
