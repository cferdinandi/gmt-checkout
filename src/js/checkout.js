function keepShopping () {

    // Get ref URL
    let url = new URL(window.location.href);
    let ref = url.searchParams.get('ref');
    if (!ref) return;

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