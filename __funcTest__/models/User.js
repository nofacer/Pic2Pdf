/*jshint esversion: 9 */


class User {
    constructor(app) {
        this.app = app;
    }

    async selectContentFakeFolder() {
        await this.app.client.element('#choose').click();
        return this;
    }
}

module.exports = {
    User: User,
};