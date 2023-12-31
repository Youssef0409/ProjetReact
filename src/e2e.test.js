const puppeteer = require('puppeteer');

describe('End-to-End Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('User Search Interaction', () => {
    let browser;
    let page;
  
    beforeAll(async () => {
      browser = await puppeteer.launch();
      page = await browser.newPage();
    });
  
    afterAll(async () => {
      await browser.close();
    });
  
    it('successfully performs a user search', async () => {
      // Navigate to the application
      await page.goto('http://localhost:3000'); 
  
      // Type the search query
      await page.type('input[placeholder="Donner le nom du Crypto"]', 'bitcoin');
  
      // Click the search button
      await page.click('button.search-button');
  
      // Wait for the search results to be displayed
      await page.waitForSelector('.search-results');
  
     
    });
  });
  
});
