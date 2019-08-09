/*jshint esversion: 9 */


class User {
    constructor(app) {
        this.app = app;
    }

    // async click(id) {
    //     await this.app.client.element('#click').click();
    //     return this;
    // }

    async selectFolder(){
        await this.app.client.element('#click').click();
        return this;
    }




}

module.exports = {
    User: User,
};