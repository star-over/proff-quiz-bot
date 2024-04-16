import puppeteer from "puppeteer";
import { puppeteerLaunchOptions } from "./puppeteer.config.js";

export async function render(html: string) {

  const browser = await puppeteer.launch(puppeteerLaunchOptions);
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 650, height: 100, deviceScaleFactor: 3 });
    await page.setContent(html);
    await page.addScriptTag({ path: "./app/puppeteer/tailwind.js" }); // tailwind
    await page.addScriptTag({ path: "./tailwind.config.js" }); // tailwind

    const rootEl = await page.$("#root");
    if (rootEl) {
      return await rootEl.screenshot();
    }

    // fallback to whole page screenshort
    return await page.screenshot();

  } catch (error) {
    throw new Error((error as Error).message);
  }
  finally {
    await browser.close();
  }


}
