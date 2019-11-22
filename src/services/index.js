const army = require('./army/army.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(army);
};
