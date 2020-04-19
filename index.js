// Randomly send users to one of two webpages

class ElementHandler {
    // Set elements for extra credit 1: Changing copy/URLs
    constructor(attribute) {
        this.attribute = attribute;
    }

    element(element) {
        element.setInnerContent(this.attribute);
        // Redirect users to my personal website
        if (element.tagName === 'a') {
            element.setAttribute('href', 'https://companion-cats.herokuapp.com/');
        }
    }
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    // Request the URLs from the API
    const url = 'https://cfw-takehome.developers.workers.dev/api/variants';
    const response = await fetch(url);
    const urls = (await response.json()).variants;

    // Extra credit 2: Persisting variants
    // Load cookie if the user has visited before so they always see
    // the same variant
    const cookie = request.headers.get('cookie');
    let chosenUrl;
    if (cookie && cookie.includes('variant=1')) {
        chosenUrl = urls[0];
    } else if (cookie && cookie.includes('variant=2')) {
        chosenUrl = urls[1];
    } else {
        // Distribute requests between variants
        chosenUrl = urls[Math.floor(Math.random() * urls.length)];
    }
    let chosenResponse = await fetch(chosenUrl);

    // Extra credit 1: Changing copy/URLs
    // Customize title, description, and link
    chosenResponse = new HTMLRewriter()
        .on('title', new ElementHandler("Brent's Title"))
        .transform(chosenResponse);
    chosenResponse = new HTMLRewriter()
        .on('h1#title', new ElementHandler("Brent's Variant " + chosenUrl.slice(-1)))
        .transform(chosenResponse);
    chosenResponse = new HTMLRewriter()
        .on('p#description', new ElementHandler("Brent's description for variant " + chosenUrl.slice(-1)))
        .transform(chosenResponse);
    chosenResponse = new HTMLRewriter()
        .on('a#url', new ElementHandler('Visit Companion Cats'))
        .transform(chosenResponse);

    // Persist the chosen URL in a cookie
    if (!cookie) {
        chosenResponse.headers.set('Set-Cookie', 'variant=' + chosenUrl.slice(-1));
    }
    return chosenResponse;
}