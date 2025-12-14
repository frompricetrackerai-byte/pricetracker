const { scrapeProduct } = require('./lib/scraping/playwright-scraper');

async function test() {
    // The Etsy URL we used
    const url = 'https://www.etsy.com/in-en/listing/1589680975/crochet-pattern-granny-square-poncho?ls=a&external=1&rec_type=ad&ref=landingpage_similar_listing_top-2&pro=1&sts=1&dd=1&plkey=LT7f069792c26ef3ecfd54caad6751dd2ee7279b0b%3A1589680975';

    console.log("Testing scraper on:", url);
    try {
        const data = await scrapeProduct(url);
        console.log("Result:", data);
    } catch (e) {
        console.error("Scraper Error:", e);
    }
}

test();
