const { Builder, By, Key, until } = require("selenium-webdriver")
var skipLoop = false
require("dotenv").config()
async function example() {
  let driver = await new Builder().forBrowser("chrome").build()

  try {
    await driver.get(
      "https://login.seek.com/login?state=hKFo2SBUaE9TZzYtclhCZUhlSG5tVUNuVGlJT3JmMXpXMENMWaFupWxvZ2luo3RpZNkgNWhuZjE2MjV0dlU4bU4tUUQwTTFtenc2eDZLb1JMMTejY2lk2SA4YXlYbXJSS3VSOWdwSXBaV2VuYWlTWGVxTDNyaTVQMg&client=8ayXmrRKuR9gpIpZWenaiSXeqL3ri5P2&protocol=oauth2&redirect_uri=https%3A%2F%2Fwww.jobstreet.com.ph%2Foauth%2Fcallback%2F&scope=openid%20profile%20email%20offline_access&audience=https%3A%2F%2Fseek%2Fapi%2Fcandidate&fragment=%2Foauth%2Flogin%3Flocale%3Dph%26language%3Den%26realm%3DUsername-Password-Authentication%26da_cdt%3Dvisid_01920ec264c50019b7a0229746bf0506f001d06700bd0-sesid_1726824473798-hbvid_f57b5351_9030_4e9e_85c7_23bae4474bed-tempAcqSessionId_1726824473802-tempAcqVisitorId_f57b535190304e9e85c723bae4474bed&ui_locales=en&JobseekerSessionId=77ef8177-55a4-42da-bfff-775696f97f2a&language=en-PH&response_type=code&response_mode=query&nonce=RGFHWnJtZW5IYTdrakQ3TlAtbERRQlU0WUFhYXZsdjdOdVluelNmQnZ0Zg%3D%3D&code_challenge=rbBsiWGDVdo5Ec4tWLwF1_-VUVsEG2nljCtYztDPmnk&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtc3BhLWpzIiwidmVyc2lvbiI6IjEuMjIuMyJ9#/login?locale=ph&language=en&realm=Username-Password-Authentication&da_cdt=visid_01920ec264c50019b7a0229746bf0506f001d06700bd0-sesid_1726824473798-hbvid_f57b5351_9030_4e9e_85c7_23bae4474bed-tempAcqSessionId_1726824473802-tempAcqVisitorId_f57b535190304e9e85c723bae4474bed"
    )
    await driver.manage().window().maximize()
    //    // Wait until the button is present on the page
    //    let button = await driver.wait(until.elementLocated(By.id('seekerHeader')), 5000); // Use the actual button's locator

    //    // Click the button
    //    await button.click();

    let signInName = await driver.findElement(By.id("emailAddress"))
    let password = await driver.findElement(By.id("password"))
    let signInbtn = await driver.findElement(By.css('button[type="submit"]'))

    await signInName.sendKeys(process.env.JOBSTREET_USN, Key.RETURN)
    await password.sendKeys(process.env.JOBSTREET_PASSWORD, Key.RETURN)

    await signInbtn.click()
    await driver.wait(
      until.titleContains(
        "Jobs in Philippines - Search Job Vacancies - Career | Jobstreet"
      ),
      10000
    )

    // await driver.wait(until.urlContains("your-dashboard-url"), 10000); // Replace 'your-dashboard-url' with part of the URL after login

    // Navigate to the target URL
    await driver.get(process.env.JOBSTREET_QUERY)
    await lookForJob(driver)
    await skipButton(driver)
    // for (let i = 0; i < jobCount / 14; i++) {
    //   await sleep(10000)
    //   await test(driver)
    //   await driver.actions().sendKeys(Key.END).perform()
    //   await sleep(5000)

    //   await NextButton(driver)
    // }
  } finally {
    // Close the browser
    // await driver.quit();
  }
}

// Call the example function to run the script
example()

async function skipButton(driver) {
  // Define the button's HTML
  const buttonHTML =
    '<button id="myButton" style="position:fixed; top:10px; right:10px;z-index:100">Click Me!</button>'

  // Execute JavaScript to add the button to the body
  await driver.executeScript(
    'document.body.insertAdjacentHTML("beforeend", arguments[0]);',
    buttonHTML
  )

  await driver.executeScript(`
            document.getElementById('myButton').onclick = function() {
                alert('Button clicked! Skipping loop...');
                window.skipLoop = true; // Set the flag to skip the loop
            };
        `)
}

async function lookForJob(driver) {
  // await driver.wait(until.elementLocated(By.css('[data-testid="your-test-id"]')), 15000)
  await driver.wait(until.elementLocated(By.id("jobcard-1")), 15000)

  for (let i = 2; i < 32; i++) {
    await driver.wait(until.elementLocated(By.id("jobcard-1")), 15000)

    let card = await driver.findElement(By.id(`jobcard-${i}`))
    if (skipLoop) {
      skipLoop = false // Reset flag for next iteration
      continue // Skip this iteration
    }
    try {
      await driver.wait(
        until.elementIsVisible(
          card.findElement(By.css('[data-testid="applied-job-icon"]'))
        ),
        10000
      )
      console.log(`Applied job icon found in job card ${i}`)
    } catch (error) {
      const jobLink = await driver.wait(
        until.elementIsVisible(
          card.findElement(
            By.css('a[data-testid="job-list-item-link-overlay"]')
          )
        ),
        10000
      )
      await driver.executeScript("arguments[0].scrollIntoView(true);", jobLink)

      await driver.executeScript("arguments[0].click();", jobLink)

      await driver.wait(
        until.elementLocated(By.css('[data-automation="jobAdDetails"]')),
        15000
      )

      // Find the jobDescInfo element
      let jobDescInfo = await driver.findElement(
        By.css('[data-automation="jobAdDetails"]')
      )
      let jdTitle = await driver
        .findElement(By.css('[data-automation="job-detail-title"]'))
        .getText()

      // Retrieve the text content of jobDescInfo
      let jobDescText = await jobDescInfo.getText()

      // Check if the text contains "react" or "reactJs"
      if (
        jobDescText.toLowerCase().includes("react") ||
        jobDescText.toLowerCase().includes("react-redux") ||
        jobDescText.toLowerCase().includes("reactjs")
      ) {
        if (
          jobDescText.toLowerCase().includes("react native") ||
          jobDescText
            .toLowerCase()
            .includes(
              "Japanese Front End Application Developer (Javascript, React JS)"
            )
        ) {
          //   console.log(
          //     `The job description contains 'react' or 'reactJs', but also contains 'React Native'. ${jdTitle}`
          //   )
        } else {
          console.log(
            `The job description contains 'react' or 'reactJs'. ${jdTitle}`
          )
          try {
            await applyButton(driver)
          } catch (error) {
            console.log(`${jdTitle} is already applied`)
          }
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
}
async function applyButton(driver) {
  await sleep(2000)
  await driver.actions().sendKeys(Key.HOME).perform()
  await sleep(2000)
  await driver.wait(
    until.elementsLocated(By.css('[data-automation="job-detail-apply"]')),
    15000
  )
  // Click the button that opens a new tab
  await driver
    .findElement(By.css('[data-automation="job-detail-apply"]'))
    .click()

  // Store the original window handle
  let originalWindowHandle = await driver.getWindowHandle()

  // Wait for the new tab to open
  let newWindowHandle = await waitForNewTab(driver, originalWindowHandle, 10000) // 10 seconds timeout

  // Switch to the new tab
  await driver.switchTo().window(newWindowHandle)

  // Wait for the new tab to fully load (optional: you might wait for a specific element or title)
  await driver.wait(until.titleContains("Choose documents | JobStreet"), 10000) // Adjust as needed

  let isSubmit = false

  await driver
    .findElement(By.css('input[data-testid="coverLetter-method-none"]'))
    .click()
  do {
    try {
      isSubmit = await driver.getTitle().then(title => {
        return title.includes("Review and submit | JobStreet")
      })

      if (!isSubmit) {
        await driver
          .findElement(By.css('[data-testid="continue-button"]'))
          .click()
        await sleep(3000)
      }
    } catch (error) {
      console.error("Error while waiting for title:", error)
    }
  } while (!isSubmit)

  await driver
    .findElement(By.css('[data-testid="review-submit-application"]'))
    .click()
  await sleep(3000)
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
