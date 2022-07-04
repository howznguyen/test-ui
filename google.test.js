import {Builder, Capabilities, Browser, By, Key, until} from 'selenium-webdriver';
import assert from 'assert';
import {Url} from './app/config'
import {GoogleElements} from './app/elements'
import {SeleniumHelper} from './app/helper';

describe("Google", function() {
    it("should work", async function() {
        let driver = await new Builder().forBrowser(Browser.CHROME).build();
        driver.manage().window().maximize();

        
        await driver.get(Url.google);
        await driver.findElement(By.css(GoogleElements.INPUT_SEARCH)).sendKeys("webdriver",Key.RETURN);
        await driver.wait(SeleniumHelper.waitWhenWebLoadDoned(driver), 5000);
        let title = await driver.getTitle();
        assert.equal(title, "webdriver - Tìm trên Google");
        await driver.quit();
    });
});