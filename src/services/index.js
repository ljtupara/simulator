const army = require('./army/army.service.js');
const game = require('./game/game.service.js');
const battlelog = require('./battlelog/battlelog.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(army);
  app.configure(game);
  app.configure(battlelog);
};
