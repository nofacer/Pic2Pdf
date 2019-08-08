/*jshint esversion: 8 */
jest.unmock('electron');
const Application = require('spectron').Application;
const electron = require('electron');
const path = require('path');

const {
    Screen
} = require('./models/Screen');

let screen;

describe('Whole user journey', function () {
    beforeAll(() => {

        this.app = new Application({
            path: electron,
            args: [path.join(__dirname, '../app.js')]
        });
        screen = new Screen(this.app);
        return this.app.start();
    });

    afterAll(() => {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    it('detect window', async () => {
        await screen
            .checkWindow()
            .then(screen => screen.checkTitle());

    });





});