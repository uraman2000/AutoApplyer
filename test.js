const { Builder, By, Key, until } = require("selenium-webdriver")

async function example() {
  let driver = await new Builder().forBrowser("chrome").build()

  try {
    await driver.get("https://www.foundit.com.ph/rio/login")
    await driver.manage().window().maximize()
    //    // Wait until the button is present on the page
    //    let button = await driver.wait(until.elementLocated(By.id('seekerHeader')), 5000); // Use the actual button's locator

    //    // Click the button
    //    await button.click();

    let signInName = await driver.findElement(By.id("signInName"))
    let password = await driver.findElement(By.id("password"))
    let signInbtn = await driver.findElement(By.id("signInbtn"))

    await signInName.sendKeys("uraman2000@gmail.com", Key.RETURN)
    await password.sendKeys("asdfgbnm1202", Key.RETURN)

    await signInbtn.click()
    await driver.wait(
      until.titleContains("My Dashboard | foundit Philippines"),
      10000
    ) // Replace 'your-dashboard-url' with part of the URL after login

    // await driver.wait(until.urlContains("your-dashboard-url"), 10000); // Replace 'your-dashboard-url' with part of the URL after login

    // Navigate to the target URL
    await driver.get(
      "https://www.foundit.com.ph/srp/results?sort=1&limit=15&query=senior+react+developer&locations=Philippines&experienceRanges=5%7E7&jobFreshness=15&searchId=f9826d2d-09fd-420c-95ad-ee7c89d4bc08"
    )
    await driver.wait(until.elementLocated(By.css(".job-count")), 15000)
    // Locate the paragraph with the class 'job-count'
    let jobCountElement = await driver.findElement(By.css(".job-count"))

    // Get the text content of the element
    let jobCountText = await jobCountElement.getText()

    // Extract the number using a regular expression
    let jobCount = jobCountText.match(/\d+/)[0]

    console.log(`Job count: ${jobCount}`) // Output the job count
    for (let i = 0; i < jobCount / 14; i++) {
      NextButton(driver)
    }
    // NextButton(driver)
    // NextButton(driver)
    // NextButton(driver)
    // NextButton(driver)
    // NextButton(driver)
    // NextButton(driver)
  } finally {
    // Close the browser
    // await driver.quit();
  }
}

// Call the example function to run the script
example()
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function NextButton(driver) {
  await driver.wait(until.elementLocated(By.css(".arrow.arrow-right")), 15000)
  sleep(3000)
  await driver.actions().sendKeys(Key.END).perform()
  sleep(3000)
  let rightArrow = await driver.findElement(By.css(".arrow.arrow-right"))
  await rightArrow.click()
}
