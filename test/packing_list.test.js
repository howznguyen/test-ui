import {Builder, Capabilities, Browser, By, Key, until} from 'selenium-webdriver';
import assert from 'assert';
import { Url } from '../app/config'
import { User } from '../app/input'
import { PackingListElements } from '../app/elements';
import {SeleniumHelper} from '../app/helper';

import ObjectsToCsv from 'objects-to-csv';


describe('Packing List', function() {

    it('Check CSV',async function() {
      let urls = [Url.shimada_v1,Url.shimada_v2];
      let outputs = [];
      
      for (const index in urls) {
        let url = urls[index];
        let driver =  null;
        try{
          driver = await new Builder().forBrowser(Browser.CHROME).build();
          //set viewport size
          driver.manage().window().maximize();
          //open web browser v2
          await driver.get(url);
          //input user name
          await driver.findElement(By.css(PackingListElements.INPUT_USERNAME)).sendKeys(User.admin.username);
          //input password
          await driver.findElement(By.css(PackingListElements.INPUT_PASSWORD)).sendKeys(User.admin.password);
          //login button click
          await driver.findElement(By.css(PackingListElements.BUTTON_LOGIN)).click();

          await driver.wait(SeleniumHelper.waitWhenWebLoadDoned(driver), 10000);

          // wait for packing slidebar
          await driver.get(url+"/packing_list");

          //wait until table load completed
          await driver.wait(until.elementLocated(By.css(PackingListElements.LABEL_LOADING_TABLE_DONE)), 10000);

          //select show 100 entries
          await (await driver.wait(until.elementLocated(By.css(PackingListElements.DROPDOWN_CHANGE_LENGTH_TABLE)))).sendKeys('100');



          await driver.wait(until.elementLocated(By.css()));

          //Click pack no to sort 
          await (await driver.wait(until.elementLocated(By.css(PackingListElements.BUTTON_SORT_PACK_NO_ASC)))).click();
          
          await driver.wait(until.elementLocated(By.css(PackingListElements.LABEL_LOADING_TABLE_DONE)));

          let arr = [];

          for (let i = 0; i < 10; i++) {
            //Get datatable packing_list
            console.log(`Page ${i+1}`)

            let tableCells = await driver.findElements(By.css(PackingListElements.TR_PACKING_LIST));
          
            
            for (let index = 0; index < tableCells.length; index++) {
              let obj = {};
              obj.pack_no = await tableCells[index].findElement(By.css('td:nth-child(1)')).getText();
              obj.dvt_no = await tableCells[index].findElement(By.css('td:nth-child(2)')).getText();
              obj.times = await tableCells[index].findElement(By.css('td:nth-child(3)')).getText();
              obj.type = await tableCells[index].findElement(By.css('td:nth-child(4)')).getText();
              obj.kvt_no = await tableCells[index].findElement(By.css('td:nth-child(5)')).getText();
              obj.req_pack_date = await tableCells[index].findElement(By.css('td:nth-child(6)')).getText();
              obj.meas_date = await tableCells[index].findElement(By.css('td:nth-child(7)')).getText();
              obj.consignee = await tableCells[index].findElement(By.css('td:nth-child(8)')).getText();   
              arr.push(obj);
            }
            
            await (await driver.wait(until.elementLocated(By.css(PackingListElements.BUTTON_NEXT_PAGE_TABLE)))).click();

            await driver.wait(until.elementLocated(By.css(PackingListElements.LABEL_LOADING_TABLE_DONE)));
            
          }

          const csv = new ObjectsToCsv(arr);
          await csv.toDisk(`./list${index}.csv`);
          let csv_str = await csv.toString();
          outputs.push(csv_str);
          await driver.quit();
        }catch{
          await driver.quit();
          outputs.push(`Error at ${url}`);
        }
      }
      assert.equal(outputs[0],outputs[1]);
    });
});