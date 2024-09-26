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

    await signInName.sendKeys(process.env.FOUNDIT_USN, Key.RETURN)
    await password.sendKeys(process.env.FOUNDIT_PASSWORD, Key.RETURN)

    await signInbtn.click()
    await driver.wait(
      until.titleContains("My Dashboard | foundit Philippines"),
      10000
    ) // Replace 'your-dashboard-url' with part of the URL after login

    // await driver.wait(until.urlContains("your-dashboard-url"), 10000); // Replace 'your-dashboard-url' with part of the URL after login

    // Navigate to the target URL
    await driver.get(process.env.FOUNDIT_QUERY)

    // let items = await driver.findElements(By.css(".srpResultCard")); // Replace with the actual class or locator
    await driver.wait(until.elementLocated(By.css(".job-count")), 15000)
    // Locate the paragraph with the class 'job-count'
    let jobCountElement = await driver.findElement(By.css(".job-count"))

    // Get the text content of the element
    let jobCountText = await jobCountElement.getText()

    // Extract the number using a regular expression
    let jobCount = jobCountText.match(/\d+/)[0]

    console.log(`Job count: ${jobCount}`) // Output the job count
    for (let i = 0; i < jobCount / 14; i++) {
      await sleep(10000)
      await test(driver)
      await driver.actions().sendKeys(Key.END).perform()
      await sleep(5000)

      await NextButton(driver)
    }
  } finally {
    // Close the browser
    // await driver.quit();
  }
}

// Call the example function to run the script
example()

async function test(driver) {
  await driver.wait(until.elementLocated(By.className("srpResultCard")), 15000)
  let srpResultCard = await driver.findElement(By.className("srpResultCard"))
  await driver.wait(
    until.elementsLocated(By.css(".srpResultCard > div")),
    15000
  )
  for (let i = 1; i < 17; i++) {
    await driver.wait(
      until.elementsLocated(By.css(`.srpResultCard > div:nth-of-type(${i})`)),
      15000
    )
    let secondDiv = await driver.findElement(
      By.css(`.srpResultCard > div:nth-of-type(${i})`)
    )
    await secondDiv.click()

    await driver.wait(until.elementLocated(By.id("jobDescription")), 15000)

    // Find the jobDescInfo element
    let jobDescInfo = await driver.findElement(By.css(".jobDescInfo"))
    let jdTitle = await driver.findElement(By.css(".jdTitle span")).getText()

    // Retrieve the text content of jobDescInfo
    let jobDescText = await jobDescInfo.getText()

    // Check if the text contains "react" or "reactJs"
    if (
      jobDescText.toLowerCase().includes("react") ||
      jobDescText.toLowerCase().includes("react-redux") ||
      jobDescText.toLowerCase().includes("reactjs")
    ) {
      if (jobDescText.toLowerCase().includes("react native")) {
        //   console.log(
        //     `The job description contains 'react' or 'reactJs', but also contains 'React Native'. ${jdTitle}`
        //   )
      } else {
        console.log(
          `The job description contains 'react' or 'reactJs'. ${jdTitle}`
        )
        await applyButton(driver)
        await sleep(8000)
        await console.log(`${jdTitle} success`)
      }
    } else {
      // console.log(
      //   `The job description does not contain 'react' or 'reactJs'. ${jdTitle}`
      // )
    }
  }
}
async function applyButton(driver) {
  await sleep(2000)
  await driver.actions().sendKeys(Key.HOME).perform()
  await sleep(2000)
  await driver.wait(until.elementsLocated(By.id("applyNowBtn")), 15000)
  // Click the button that opens a new tab
  await driver.findElement(By.id("applyNowBtn")).click()

  // Store the original window handle
  let originalWindowHandle = await driver.getWindowHandle()

  // Wait for the new tab to open
  let newWindowHandle = await waitForNewTab(driver, originalWindowHandle, 10000) // 10 seconds timeout

  // Switch to the new tab
  await driver.switchTo().window(newWindowHandle)

  // Wait for the new tab to fully load (optional: you might wait for a specific element or title)
  await driver.wait(until.titleContains("Applied Successfully to"), 10000) // Adjust as needed

  // Perform any actions needed in the new tab here

  // Close the new tab
  await driver.close()

  // Switch back to the original tab
  await driver.switchTo().window(originalWindowHandle)

  // Continue with other actions in the original tab
}

async function waitForNewTab(driver, originalWindowHandle, timeout) {
  const startTime = Date.now()

  return new Promise((resolve, reject) => {
    const checkForNewTab = async () => {
      try {
        const windows = await driver.getAllWindowHandles()
        if (windows.length > 1) {
          const newWindowHandle = windows.find(
            handle => handle !== originalWindowHandle
          )
          if (newWindowHandle) {
            resolve(newWindowHandle)
          }
        }
        if (Date.now() - startTime > timeout) {
          reject(new Error("Timeout waiting for new tab"))
        }
      } catch (error) {
        reject(error)
      }
    }

    const interval = setInterval(() => {
      checkForNewTab()
    }, 500)

    checkForNewTab()
  })
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function NextButton(driver) {
  await driver.wait(until.elementLocated(By.css(".arrow.arrow-right")), 15000)
  let rightArrow = await driver.findElement(By.css(".arrow.arrow-right"))
  await rightArrow.click()
}
