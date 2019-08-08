/*jshint esversion: 9 */


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



}

module.exports = {
    Screen: Screen,
};