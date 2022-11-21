const validUrl = require('valid-url');
const puppeteer = require('puppeteer');
const config = require('../config');
const prepareOutputFolder = require('./files').emptyFolder;
const drawChart = require('./chart').drawChart;
const getColFromTwoDimensionArray = require('./array').getColFromTwoDimensionArray;
const isNumericFromString = require('./number').isNumericFromString;

const captureTable = async (page) => {
  const elements = await page.$$('table')

  for (let i = 0; i < elements.length; i++) {
    try {
      await elements[i].screenshot({path: `${config.outputFolder}/${i}.png`})
    } catch(e) {
      throw new Error(`couldnt take screenshot of element with index: ${i}. cause: ${e.toString()}`);
    }
  }
}

const findChart = async (page) => {
  const tableSel = "table";
  const data = await page.$$eval(tableSel, els => 
    els.map(el => 
      [...el.querySelectorAll("tr")]
        .slice(1)
        .map(el => [...el.querySelectorAll("td")].map(e => e.textContent.trim())
    ))
  );

  let tempCol = [];
  for (let i = 0; i < data.length; i++) {
    /** Make sure all array in data's element have the same length */
    if (data[i].every((val, idx, arr) => val.length === arr[0].length)) {
      for (let j = 0; j < data[i].length; j++) {
        tempCol = getColFromTwoDimensionArray(data[i], j);
        if (tempCol.length === tempCol.filter(isNumericFromString).length) {
          await drawChart(tempCol, `Chart from column ${j} in table ${i}`)
        }
      }
    }
  } 
}

const captureURL = (url, main) => {
  prepareOutputFolder(config.outputFolder);
  puppeteer
    .launch({
      defaultViewport: {
        width: config.viewportWidth,
        height: config.viewportHeight,
      },
    })
    .then(async (browser) => {
      const page = await browser.newPage();
      if (url !== null && validUrl.isUri(url)) {
        await page.goto(url);
        
        try {
          await captureTable(page);
        } catch (e) {}

        await findChart(page);
        await browser.close();
      }
      main.next()
    });
}

module.exports = {
  captureURL
}