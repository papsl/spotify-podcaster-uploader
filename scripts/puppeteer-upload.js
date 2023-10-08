// inspired by https://raw.githubusercontent.com/geeksblabla/geeksblabla.com/8b299bfa7541230db6bfd65538d08298d4d87623/scripts/puppeteer-upload.js
// inspired by https://github.com/Schrodinger-Hat/youtube-to-anchorfm/blob/main/index.js

const puppeteer = require("puppeteer")
const audioFileBasePath = require("./utils")

/*
upload to anchor using puppeteer
*/

const email = process.env.ANCHOR_EMAIL
const password = process.env.ANCHOR_PASSWORD
const UPLOAD_TIMEOUT = process.env.UPLOAD_TIMEOUT || 60 * 7 * 1000

async function clickDom(page, domBtn) {
  await page.evaluate((elem) => {
    elem.click()
  }, domBtn)
}

async function clickXpath(page, xpath, options = {}) {
  await page.waitForXPath(xpath, options)
  const [xpathBtn] = await page.$x(xpath)
  await clickDom(page, xpathBtn)
}

const uploadToAnchor = async ({
  episode,
  audioFile = "test.m4a",
  debug = false,
  publish = false,
}) => {
  console.log("👉  Launching puppeteer")
  let browser = null
  if (debug) {
    browser = await puppeteer.launch({ devtools: true })
  } else {
    browser = await puppeteer.launch({ args: ["--no-sandbox"] })
  }
  const page = await browser.newPage()

  const navigationPromise = page.waitForNavigation()

  await page.goto("https://podcasters.spotify.com/pod/dashboard/episode/new")
  await page.setViewport({ width: 1800, height: 789 })
  await new Promise((r) => {
    setTimeout(r, 1 * 1000)
  })

  await navigationPromise
  // 1.) Cookie consent
  console.log("👉  Cookie consent")
  const acceptCookieButton = '#onetrust-accept-btn-handler';
  await page.waitForSelector(acceptCookieButton);
  await page.click(acceptCookieButton);

  // 2.) Login
  await navigationPromise
  await clickXpath(page, '//button[contains(text(),"email")]')
  await new Promise((r) => {
    setTimeout(r, 5 * 1000)
  })
  await page.waitForSelector("#email")
  await page.type("#email", email)
  await page.type("#password", password)
  await page.click("button[type=submit]")
  await navigationPromise
  console.log("👉  Logged in")
  await page.waitForSelector("input[type=file]")

  const inputFile = await page.$("input[type=file]")
  const audioFilepath = `${audioFileBasePath}/${audioFile}`
  console.log(`ℹ️ Uploading file ${audioFilepath}.`);

  await inputFile.uploadFile(audioFilepath)
  
  console.log("👉  Uploading audio file")
  console.log("Waiting for upload to finish")
  await new Promise((r) => {
    setTimeout(r, 25 * 1000)
  })

  await clickXpath(
    page,
    '//span[contains(text(),"Save")]/parent::button[not(boolean(@disabled))]',
    { timeout: UPLOAD_TIMEOUT }
  )
  await navigationPromise

  console.log("👉  Adding title and description")
  await page.waitForSelector("#title", { visible: true })
  // Wait some time so any field refresh doesn't mess up with our input
  await new Promise((r) => {
    setTimeout(r, 2000)
  })
  await page.type("#title", episode.title)

  // Click HTML
  // Original
  //   await page.click("label[for='description'] > div > div > button")
  //const [switchToHTMLButton] = await page.$x("//button[contains(., 'HTML')]")
  /*
  const [switchToHTMLButton] = await page.$x("#app-content > div > form > div:nth-child(5) > div > div.sc-jCHUfY.hXetmm > label");
  if (switchToHTMLButton) {
    await switchToHTMLButton.click()
  } else {
    console.log("❌  No switch to HTML button")
  }
  */
  await page.click("#app-content > div > form > div:nth-child(5) > div > div.sc-jCHUfY.hXetmm > label")

  // Fill in description
  await page.waitForSelector("textarea[name=description]", { visible: true })
  await page.type("textarea[name=description]", episode.description)

  // Fill in Content (Clean / explicit)
  await page.click("#app-content > div > form > div.sc-jIkXHa.crQZOt > div:nth-child(1) > table > tr:nth-child(4) > td:nth-child(3) > div")
  await navigationPromise

  // Save (original)
  /*
  const [saveAsDraftButton] = await page.$x("//button[contains(., 'draft')]")
  if (saveAsDraftButton) {
    await saveAsDraftButton.click()
  }
  */
  if(publish){
    console.log("👉  Publish ⚠️")
    await page.click("#app-content > div > form > div.sc-gkXSjM.fCRjav > div.sc-aQaku.sc-gYvqXj.hbCZeC.cvcWbB > button.Button-sc-qlcn5g-0.hWxHrB");
    await navigationPromise
  } else
  {
    console.log("👉  Save as Draft")
    await page.click("#app-content > div > form > div.sc-gkXSjM.fCRjav > div.sc-aQaku.sc-gYvqXj.hbCZeC.cvcWbB > button.Button-sc-y0gtbx-0.kCUxRI");
    await navigationPromise
 }

  // Close
  if(!debug){
    await browser.close()
  }
  
  console.log("👉  The episode has been successfully submitted to Anchor ✅");
}

module.exports = uploadToAnchor
