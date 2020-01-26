const db = require("../models/blog/");
var slugify = require("slugify");
const shortid = require("shortid");

const findUser = id => {
  return db.User.findById(id).then(r => r.name);
};

const uniquieSlug = title => {
  const slug = slugify(title, {
    replacement: "-", // replace spaces with replacement
    remove: null, // regex to remove characters
    lower: true // result in lower case
  });
  return new Promise((resolve, rejecet) => {
    db.Blog.find({ slug })
      .then(r => {
        if (r.length > 0) {
          resolve({
            postExist: true,
            post: r,
            slug: slugify(title + "-" + shortid.generate(), {
              replacement: "-", // replace spaces with replacement
              remove: null, // regex to remove characters
              lower: true
            })
          });
        } else {
          resolve({
            postExist: false,
            slug: slug
          });
        }
      })
      .catch(er =>
        resolve({
          postExist: false,
          slug: slug
        })
      );
  });
};
module.exports = { findUser, uniquieSlug };
