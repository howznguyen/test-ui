import {Builder, Capabilities, Browser, By, Key, until} from 'selenium-webdriver';
import assert from 'assert';
// import Url from '../lib/config/url'
// import User from '../lib/input/user'
import ObjectsToCsv from 'objects-to-csv';


describe('Packing List', function() {

    it('Check CSV',async function() {
      let urls = ["http://localhost/shimada_shoji_v2","http://localhost/shimada_shoji"];
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
          await driver.findElement(By.css('#user')).sendKeys("admin");
          //input password
          await driver.findElement(By.css('#pass')).sendKeys("Csv020201#");
          //login button click
          await driver.findElement(By.css("input[value='Login']")).click();

          // wait for packing slidebar
          await driver.get(url+"/packing_list");

          //wait until table load completed
          await driver.wait(until.elementLocated(By.css("#packing_list tbody tr td :nth-child(1)")));

          //select show 100 entries
          await (await driver.wait(until.elementLocated(By.css("select[name='packing_list_length'] > option[value='100']")))).click();
          await (await driver.wait(until.elementLocated(By.css("select[name='packing_list_length']")))).sendKeys('100');

          //wait until table load completed
          // driver.wait(until.elementLocated(By.css("#packing_list tbody tr td :nth-child(1)")));

          await driver.wait(until.elementLocated(By.css('#packing_list_processing[style*="display: none;"]')));

          //Click pack no to sort 
          await (await driver.wait(until.elementLocated(By.css("div[class='DTFC_LeftHeadWrapper'] th[aria-label='Pack No: activate to sort column ascending']")))).click();
          
          await driver.wait(until.elementLocated(By.css('#packing_list_processing[style*="display: none;"]')));

          let arr = [];

          // for (let i = 0; i < 10; i++) {
          //   //Get datatable packing_list
          //   console.log(`Page ${i+1}`)

            let tableCells = await driver.findElements(By.css("#packing_list tbody tr"));
          
            
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
            
            // await (await driver.wait(until.elementLocated(By.xpath("//a[normalize-space()='Next']")))).click();

            // await driver.wait(until.elementLocated(By.css('#packing_list_processing[style*="display: none;"]')));
            
          // }

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