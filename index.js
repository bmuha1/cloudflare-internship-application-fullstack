class ElementHandler {
    constructor(attribute) {
        this.attribute = attribute
    }
    element(element) {
        element.setInnerContent(this.attribute)
        if (element.tagName == 'a') {
            element.setAttribute('href', 'https://companion-cats.herokuapp.com/')
        }
    }
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
    const response = await fetch(url)
    const urls = (await response.json()).variants
    const chosenUrl = urls[Math.floor(Math.random() * urls.length)]
    let chosenResponse = await fetch(chosenUrl)
    chosenResponse = new HTMLRewriter()
        .on('title', new ElementHandler('Custom Title'))
        .transform(chosenResponse)
    chosenResponse = new HTMLRewriter()
        .on('h1#title', new ElementHandler('Custom Variant ' + chosenUrl.slice(-1)))
        .transform(chosenResponse)
    chosenResponse = new HTMLRewriter()
        .on('p#description', new ElementHandler('Custom description for variant ' + chosenUrl.slice(-1)))
        .transform(chosenResponse)
    chosenResponse = new HTMLRewriter()
        .on('a#url', new ElementHandler('Visit Companion Cats'))
        .transform(chosenResponse)
    return chosenResponse
}