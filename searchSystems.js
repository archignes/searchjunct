// searchSystems.js
var searchSystemsLive = [
    { name: 'Google', url: 'https://www.google.com/search?q=' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=' },
    { name: 'DuckDuckGo', url: 'https://www.duckduckgo.com/?q=' },
    { name: "Andi Search", url: "https://andisearch.com/" },
    { name: "Metaphor", url: "https://metaphor.systems/search?&q=" },
    { name: "Perplexity AI", url: "https://perplexity.ai/search/?q=" },
    { name: "Phind", url: "https://phind.com/search?q=" },
    { name: "You.com", url: "https://you.com/search?q=" },
    { name: "Kagi", url: "https://kagi.com/search?q=" },
    { name: "Swisscows", url: "https://swisscows.com/en/web?query="},
    { name: "Yandex", url: "https://yandex.com/search/?text=" },
    { name: "Brave Search", url: "https://search.brave.com/search?q=" },
    { name: "Yep", url: "https://yep.com/web?q=" },
    { name: "MetaGer", url: "https://metager.org/meta/meta.ger3?eingabe=" },
    { name: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?fulltext=1&search=" },
];
var searchSystemsDev = [
    { name: 'Google', url: '' },
    { name: 'Bing', url: '' },
    { name: 'DuckDuckGo', url: '' },
    { name: "Andi Search", url: '' },
    { name: "Metaphor", url: '' },
    { name: "Perplexity AI", url: '' },
    { name: "Phind", url: '' },
    { name: "You.com", url: '' },
    { name: "Kagi", url: '' },
];

var dev = false; // Set this to false for production
if (dev) {
    var searchSystems = searchSystemsDev;
} else {
    var searchSystems = searchSystemsLive;
}
