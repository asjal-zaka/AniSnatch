import axios from "axios";
import { load } from "cheerio";
import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium";

const baseURL = "https://anitaku.to";

export const getLinks = async (epID) => {
 const searchURL = await axios.get(`${baseURL}/${epID}`);
const $ = load(await searchURL.data)
const link = $('.dowloads').find('a').attr('href');
return link;
}


export const getDownload = async (link) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto(link, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.dowload');
  const links = await page.$$eval('.dowload a', anchors => {
    return anchors.map(anchor => anchor.href);
  });
  await browser.close();
  return links;
};
