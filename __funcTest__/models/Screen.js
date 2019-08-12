/*jshint esversion: 9 */
const fs = require('fs');

class Screen {
    constructor(app) {
        this.app = app;
    }


    async checkWindow() {
        const isVisible = await this.app.browserWindow.isVisible();
        expect(isVisible).toBe(true);
        return this;
    }
    async checkTitle() {
        const title = await this.app.client.getTitle();
        expect(title).toBe('Comic2Pdf');
        return this;
    }

    async checkText(id, value) {
        const actualText = await this.app.client.getText(id);
        expect(actualText).toBe(value);
        return this;
    }

    async deleteFakeFile() {
        const fakeFilePath = `${process.cwd()}/src/assets/content_fake_folder.pdf`;
        const isExists = fs.existsSync(fakeFilePath);
        if (isExists) {
            try {
                fs.unlinkSync(fakeFilePath);
            } catch (err) {
                console.error(err);
            }
        }

        const isExistsAgain = fs.existsSync(fakeFilePath);
        expect(isExistsAgain).toBe(false);
        return this;
    }



}

module.exports = {
    Screen: Screen,
};