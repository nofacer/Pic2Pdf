/*jshint esversion: 6 */
const Application = require('spectron').Application;
const electronPath = require('electron');
const path = require('path');

describe('Application launch', function () {

    beforeAll(() => {
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '../app.js')]
        });
        return this.app.start();
    });

    afterAll(() => {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    it('always pass', () => {
        return expect(true).toBe(true);
    });

    it('should show correct version', () => {
        return this.app.client.getText('#version').then((value) => {
            expect(value).toBe('6.0.0');
        });
    });
});