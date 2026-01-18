
import { scrapeProduct } from './lib/scraping/playwright-scraper';

const url = "https://www.flipkart.com/samsung-galaxy-s25-plus-5g-silver-shadow-256-gb/p/itm8d76a9b476932?pid=MOBH8K8UJTZZN7WZ&lid=LSTMOBH8K8UJTZZN7WZTHXXFT&marketplace=FLIPKART&fm=productRecommendation%2Fsimilar&iid=en_zL-cQc0NdB4m02NjTPCd9ya1u_D0FEFJx9sw2DZImMwnFELa0uDijeP1uy6yxmOoxPN7dMuDphmfntR4Ixj8uA%3D%3D&ppt=pp&ppn=pp&ssid=zmeidl64k00000001768700550788&otracker=pp_reco_Similar%2BProducts_3_37.productCard.PMU_HORIZONTAL_Samsung%2BGalaxy%2BS25%2BPlus%2B5G%2B%2528Silver%2BShadow%252C%2B256%2BGB%2529_-1_productRecommendation%2Fsimilar_2&otracker1=pp_reco_PINNED_productRecommendation%2Fsimilar_Similar%2BProducts_GRID_productCard_cc_3_NA_view-all&cid=-1";

async function run() {
    console.log("Testing scraping for URL:", url);
    try {
        const result = await scrapeProduct(url);
        console.log("Result:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Error during scraping:", error);
    }
}

run();
