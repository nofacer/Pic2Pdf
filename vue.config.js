/*jshint esversion: 6 */
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? `${process.cwd()}/dist/` : '/'
};