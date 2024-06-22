import { chromium } from 'playwright';

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
