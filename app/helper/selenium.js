export default {

    waitWhenWebLoadDoned: async (driver) => {
        return (await driver.executeScript('return document.readyState')) === 'complete';
    }

}