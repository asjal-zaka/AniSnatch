
import puppeteer from "puppeteer"
import axios from "axios";
import { load } from "cheerio";

import { getEpisodeList } from "./episodes.js";

const baseURL = "https://anitaku.to";

const id = "one-piece-dub"

export const getLinks = async (epID) => {
    const searchURL = await axios.get(`${baseURL}/${epID}`);
    const $ = load(await searchURL.data);
    const link = $('.dowloads').find('a').attr('href');
    return link;
}

export const getDownload = async (link) => {
    const browser = await puppeteer.launch( {headless: true} );
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.dowload');
    const links = await page.$$eval('.dowload a', anchors => {
      return anchors.map(anchor => anchor.href);
    });
    await browser.close();

    return links;
  };