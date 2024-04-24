"use strict";
exports.__esModule = true;
exports.puppeteerLaunchOptions = void 0;
exports.puppeteerLaunchOptions = {
    args: [
        '--no-sandbox',
        '--single-process',
        '--no-zygote',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--no-first-run',
        "--window-size=1280,800",
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-skip-list',
        '--disable-dev-shm-usage',
        // '--disable-accelerated-2d-canvas',
        // '--disable-gpu',
        '--hide-scrollbars',
        '--disable-notifications',
        '--disable-extensions',
        '--force-color-profile=srgb',
        '--mute-audio',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-component-extensions-with-background-pages',
        '--disable-features=TranslateUI,BlinkGenPropertyTrees,IsolateOrigins,site-per-process',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--disable-features=NetworkService,NetworkServiceInProcess'
    ],
    ignoreHTTPSErrors: true,
    headless: true
};
