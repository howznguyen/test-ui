import fs from 'fs';

export default {
    captureScreen : async (driver,path) => {
        try {
            let image = await driver.takeScreenshot();
            await fs.writeFileSync(path, image, 'base64');
            return true;
        } catch (error) {
            return false;
        }
    },
    createDir : async (path) => {
        try {
            if(!fs.existsSync(path)){
                await fs.mkdirSync(path);
            }
            return true;
        } catch (error) {
            return false;
        }
    },
    readJSON : async (path) => {
        try {
            let data = await fs.readFileSync(path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    },
    writeJSON : async (path,data) => {
        try {
            let json = JSON.stringify(data);
            await fs.writeFileSync(path, json);
            return true;
        } catch (error) {
            return false;
        }
    }
}