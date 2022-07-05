import {Builder, Capabilities, Browser, By, Key, until} from 'selenium-webdriver';
import assert from 'assert';
import moment from 'moment';
import _ from 'lodash';

import { Url } from '../app/config'
import { User } from '../app/input'
import { OrderOutListElements } from '../app/elements';
import { SeleniumHelper, FileHelper } from '../app/helper';
import { LoginAction } from '../app/action';


describe('Order Out Page', () =>{

    it('ID_002', async () => {

      const PATH_IMG = './image/order_out/';
      const PATH_LOG = './log/order_out/';

      // Create tabs for manage tabs
      let urls = {
        v1 : Url.shimada_v1,
        v2 : Url.shimada_v2
      }
      let tabs = {};
      let driver =  null;
      
      FileHelper.createDir(PATH_IMG);
      FileHelper.createDir(PATH_LOG);

      driver = await new Builder().forBrowser(Browser.CHROME).build();
      //set viewport size
      await driver.manage().window().maximize();
      try{

        // Login to Two Web
        for(const index in urls){
          let url = urls[index];

          FileHelper.createDir(`${PATH_IMG}/${index}`);

          //open web browser v2
          await driver.get(url);

          //Save tab into tabs
          tabs[index] = driver.getWindowHandle();

          // Login Action
          if(index === 'v1'){
              await LoginAction.loginAction(driver,User.admin.username,User.admin.password);
          }
          // wait for login success
          await driver.wait(SeleniumHelper.waitWhenWebLoadDoned(driver), 10000);
          // wait for order out list
          await driver.get(`${url}/orders`);
          // wait for order table load completed
          await driver.wait(SeleniumHelper.waitWhenWebLoadDoned(driver), 10000);

          if(index === 'v1'){
            await driver.switchTo().newWindow('tab');
          }else{
            await driver.switchTo().window(tabs['v1']);
          }
        }
        // Search by date
        let beginDate = moment().startOf('year').format('DD-MMM-YYYY').toString();
        let endDate = moment().endOf('year').format('DD-MMM-YYYY').toString();

        for(const index in urls){

          let order_date_from = await driver.findElement(By.css(OrderOutListElements.ORDER_DATE_FROM));
          let order_date_to =  await driver.findElement(By.css(OrderOutListElements.ORDER_DATE_TO));
          driver.executeScript(`arguments[0].setAttribute ('value','${beginDate}')`,order_date_from);
          driver.executeScript(`arguments[0].setAttribute ('value','${endDate}')`,order_date_to);
            
          await (await driver.wait(until.elementLocated(By.css(OrderOutListElements.DROPDOW_CHANGE_TYPE_DATE)))).sendKeys('edit_date');

          await driver.findElement(By.css(OrderOutListElements.BUTTON_SEARCH)).click();

          if(index === 'v1'){
            await driver.sleep(7000);
          }else{
            await driver.wait(until.elementLocated(By.css(OrderOutListElements.LABEL_LOADING_TABLE_DONE)), 10000);
          }

          // select show 100 entries
          await (await driver.wait(until.elementLocated(By.css(OrderOutListElements.DROPDOWN_CHANGE_LENGTH_TABLE)))).sendKeys('100');

          if(index === 'v1'){
            await driver.sleep(10000);
          }else{
            await driver.wait(until.elementLocated(By.css(OrderOutListElements.LABEL_LOADING_TABLE_DONE)), 10000);
          }

          await (await driver.wait(until.elementLocated(By.css(OrderOutListElements.BUTTON_SORT_PACK_NO_ASC)))).click();

          if(index === 'v1'){
            await driver.switchTo().window(tabs['v2']);
          }else{
            await driver.switchTo().window(tabs['v1']);
          }
        }
        // Check Detail Order
        let allData = Object.keys(urls).reduce((acc, cur) => {
          acc[cur] = [];
          return acc;
        }, {});

        let page_element = await driver.findElements(By.css(OrderOutListElements.BUTTON_PAGES));
        let last_page = await page_element[page_element.length - 2].getText();
        for(let page = 1; page <= last_page; page++)
        {
          await driver.switchTo().window(tabs['v1']);
          console.log(`- Page ${page}`);
          let data = Object.keys(urls).reduce((acc, cur) => {
            acc[cur] = [];
            return acc;
          }, {});
          for(const index in urls){
            let tableCells = await driver.findElements(By.css(OrderOutListElements.TR_PACKING_LIST));

            for(let i = 0; i < tableCells.length; i++){
              let obj = {};

              obj.po_no = await tableCells[i].findElement(By.css('td:nth-child(1)')).getText();
              obj.times = await tableCells[i].findElement(By.css('td:nth-child(2)')).getText();
              obj.order_user = await tableCells[i].findElement(By.css('td:nth-child(3)')).getText();
              obj.supplier = await tableCells[i].findElement(By.css('td:nth-child(4)')).getText();
              obj.amount = await tableCells[i].findElement(By.css('td:nth-child(5)')).getText();
              obj.delivery_date = await tableCells[i].findElement(By.css('td:nth-child(6)')).getText();
              obj.cus_clear_sheet_no = await tableCells[i].findElement(By.css('td:nth-child(7)')).getText();
              obj.im_cus_clear_fee = await tableCells[i].findElement(By.css('td:nth-child(8)')).getText();
              obj.transport_fee = await tableCells[i].findElement(By.css('td:nth-child(9)')).getText();
              obj.create_user = await tableCells[i].findElement(By.css('td:nth-child(10)')).getText();
              obj.accept_user = await tableCells[i].findElement(By.css('td:nth-child(11)')).getText();
              obj.accept_date = await tableCells[i].findElement(By.css('td:nth-child(12)')).getText();
              obj.status = await tableCells[i].findElement(By.css('td:nth-child(13)')).getText();
              obj.po_sh_print_date = await tableCells[i].findElement(By.css('td:nth-child(14)')).getText();
              obj.note = await tableCells[i].findElement(By.css('td:nth-child(15)')).getText();
              obj.package_qty = await tableCells[i].findElement(By.css('td:nth-child(16)')).getText();
              obj.m3 = await tableCells[i].findElement(By.css('td:nth-child(17)')).getText();
              obj.update_user = await tableCells[i].findElement(By.css('td:nth-child(18)')).getText();
              obj.detailLink =  await (await tableCells[i].findElement(By.css('td:nth-child(1) > a')).getAttribute('href'));
              obj.child = [];
              data[index].push(obj);
            }
            
            if(index === 'v1'){
              await driver.switchTo().window(tabs['v2']);
            }else{
              await driver.switchTo().window(tabs['v1']);
            }
            
          }

          if(data['v1'].length != data['v2'].length)
          {
            await driver.switchTo().window(tabs['v1']);
            await FileHelper.captureScreen(driver, `${PATH_IMG}/v1/V1_LIST_DIFF_PAGE_1.png`);
            await driver.switchTo().window(tabs['v2']);
            await FileHelper.captureScreen(driver, `${PATH_IMG}/v2/V2_LIST_DIFF_PAGE_1.png`);
          }else{
            await driver.switchTo().window(tabs['v1']);
            for(let i = 0; i < data.v1.length; i++){
              console.log(`+ Row ${i+1}`);
              for(let index in urls){
                await driver.switchTo().newWindow('tab');
                await driver.get(data[index][i].detailLink);
                await driver.wait(SeleniumHelper.waitWhenWebLoadDoned(driver), 10000);
                tabs[`detail_${index}`] = await driver.getWindowHandle();

                await driver.wait(until.elementLocated(By.css(OrderOutListElements.DETAIL_TD_FIRST)), 10000);

                let tableCellsDetail = await driver.findElements(By.css(OrderOutListElements.DETAIL_TR_ORDER_LIST));
                for (let dt = 0; dt < tableCellsDetail.length; dt++) {
                  let objDetail = {};
                  let column = 1;
                  objDetail.no = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.pv_no = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.item_code = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.item_name = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.size = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.color = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  if(index === 'v2'){
                    column++;
                  }
                  objDetail.quantity = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.unit = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.buy_price = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.amount = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.indentify_name = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.type = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.supplier = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.salesman =  await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.surcharge = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.lapdip_note = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.package_qty = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();
                  column++;
                  objDetail.m3 = await tableCellsDetail[dt].findElement(By.css(`td:nth-child(${column})`)).getText();

                  data[index][i].child.push(objDetail);
                }

                if(index === 'v1'){
                  await driver.switchTo().window(tabs['v2']);
                }else{
                  delete data.v1[i].detailLink
                  delete data.v2[i].detailLink
                  const result = _.isEqual(data.v1[i], data.v2[i]);
                  if(!result){
                    await driver.switchTo().window(tabs['detail_v1']);
                    await FileHelper.captureScreen(driver, `${PATH_IMG}/v1/V1_ROW_${i+1}_PAGE_${page}.png`);
                    await driver.switchTo().window(tabs['detail_v2']);
                    await FileHelper.captureScreen(driver, `${PATH_IMG}/v2/V2_ROW_${i+1}_PAGE_${page}.png`);
                    let json = await FileHelper.readJSON(`${PATH_LOG}/ID_002.json`);
                    json.push({
                      v1: data.v1[i],
                      v2: data.v2[i]
                    });
                    await FileHelper.writeJSON(`${PATH_LOG}/ID_002.json`, json);
                  }
                  await driver.switchTo().window(tabs['detail_v1']);
                  await driver.close();
                  await driver.switchTo().window(tabs['detail_v2']);
                  await driver.close();
                  await driver.switchTo().window(tabs['v1']);
                }
              }
            }
          }
          for(const index in urls){
            allData[index] = allData[index].concat(data[index]);
            await driver.switchTo().window(tabs[index]);
            if(page != last_page){
              await (await driver.wait(until.elementLocated(By.css(OrderOutListElements.BUTTON_NEXT_PAGE_TABLE)))).click();
              if(index === 'v1'){
                await driver.sleep(10000);
              }else{
                await driver.wait(until.elementLocated(By.css(OrderOutListElements.LABEL_LOADING_TABLE_DONE)), 10000);
              }
            }
          }

        }
        assert.equal(true,true);
        await driver.quit();
      }
      catch(err){
        await driver.quit();
        console.log(err);
        assert.equal(true,false);
       
      }
    });

});