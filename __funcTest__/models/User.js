/*jshint esversion: 9 */
const fs = require('fs');


class User {
    constructor(app) {
        this.app = app;
    }

    async selectContentFakeFolder() {
        await this.app.client.element('#choose').click();
        return this;
    }

    async clickGenerateButton() {
        this.app.client.element('#convertButton').click();

        await new Promise(resolve => setTimeout(function () {
            const fakeFilePath = `${process.cwd()}/src/assets/content_fake_folder.pdf`;
            const isExists = fs.existsSync(fakeFilePath);
            expect(isExists).toBe(true);
            resolve();
        }, 3000));

        return this;
    }
}

module.exports = {
    User: User,
};