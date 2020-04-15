addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
    const response = await fetch(url)
    const urls = (await response.json()).variants
    const chosenUrl = urls[Math.floor(Math.random() * urls.length)]
    return Response.redirect(chosenUrl)
}