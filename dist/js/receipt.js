/*! gmt-checkout v3.6.1 | (c) 2023 Chris Ferdinandi | MIT License | https://github.com/cferdinandi/gmt-checkout | Open Source: undefined */
(function () {
    'use strict';

    let products = document.querySelectorAll('.edd_purchase_receipt_product_name');
    for (let product of products) {
        product.textContent = product.textContent.replace(' — _', '');
    }

}());
