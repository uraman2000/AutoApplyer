const { Builder, By } = require('selenium-webdriver');

(async function addButton() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Navigate to the page
        await driver.get('https://www.facebook.com/');

        // Define the button's HTML
        const buttonHTML = '<button id="myButton" style="position:fixed; top:10px; right:10px;z-index:100">Click Me!</button>';

        // Execute JavaScript to add the button to the body
        await driver.executeScript('document.body.insertAdjacentHTML("beforeend", arguments[0]);', buttonHTML);

        // Optionally, you can add a click event listener
        await driver.executeScript(`
            document.getElementById('myButton').onclick = function() {
                alert('Button clicked!');
            };
        `);

        await driver.executeScript(`
            document.getElementById('myButton').onclick = function() {
                alert('Button clicked! Skipping loop...');
                window.skipLoop = true; // Set the flag to skip the loop
            };
        `);

    } catch (error) {
        console.log("Error occurred: ", error);
    } finally {
        // Optionally wait before quitting, so you can see the button
        await driver.sleep(5000);
        // await driver.quit();
    }
})();