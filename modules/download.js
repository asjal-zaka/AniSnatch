import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
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
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: [
        ...chrome.args,
        '--disable-web-security',
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--single-process'
      ],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.dowload'); 
    const links = await page.$$eval('.dowload a', anchors => {
      return anchors.map(anchor => anchor.href);
    });

    return links;
  } catch (error) {
    console.error('Error in Puppeteer:', error);
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
