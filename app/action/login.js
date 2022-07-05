import { By } from "selenium-webdriver";
import { LoginElements } from "../elements";

export default {
    loginAction : async (driver,username,password) => {
        // Username
        await driver.findElement(By.css(LoginElements.INPUT_USERNAME)).sendKeys(username);
        // Password
        await driver.findElement(By.css(LoginElements.INPUT_PASSWORD)).sendKeys(password);
        // Login button click
        await driver.findElement(By.css(LoginElements.BUTTON_LOGIN)).click();
        //Done
    }
}