import { chromium } from 'playwright';
import axios from "axios";
import { load } from "cheerio";

const baseURL = "https://anitaku.to"
export const getLinks = async (epID) => {
 const searchURL = await axios.get(`${baseURL}/${epID}`);
const $ = load(await searchURL.data)
const link = $('.dowloads').find('a').attr('href');
return link;
}

export const getDownload = async (link) => {
  let browser = null;
  try {
    browser = await chromium.launch({
      headless: true, // Adjust as needed
    });

    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'networkidle' });

    await page.waitForSelector('.dowload');
    const links = await page.$$eval('.dowload a', anchors => anchors.map(anchor => anchor.href));

    return links;
  } catch (error) {
    console.error('Error in Playwright:', error);
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
