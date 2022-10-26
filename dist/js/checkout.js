/*! gmt-checkout v3.5.0 | (c) 2022 Chris Ferdinandi | MIT License | https://github.com/cferdinandi/gmt-checkout | Open Source: undefined */
(function () {
    'use strict';

    function keepShopping () {

        // Get ref URL
        let url = new URL(window.location.href);
        let ref = url.searchParams.get('ref') || sessionStorage.getItem('gmt-checkout-ref');
        if (!ref) return;

        // Save the ref
        sessionStorage.setItem('gmt-checkout-ref', ref);

        // Get link to update
        let link = document.querySelector('[href*="/resources/"]');
        if (!link) return;

        // Update link
        link.href = ref;

        // Update URL
        url.searchParams.delete('ref');
        history.pushState(history.state, '', url);

    }

    keepShopping();

}());
