addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
    const response = await fetch(url)
    urls = await response.json()
    return new Response(JSON.stringify(urls), {
        headers: { 'content-type': 'text/plain' },
    })
}