const db = require("../models/blog/");
const findUser = id => {
  return db.User.findById(id).then(r => r.name);
};
module.exports = { findUser };
