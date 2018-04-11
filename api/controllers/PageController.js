/**
 * PageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const sails = require('sails')
const User = sails.models.user
module.exports = {
  home: function (req, res) {
    let currrentUser
    if (!req.session.user) {
      return res.redirect('/login')
    }
    User.findOne({
      id: req.session.user.id
    }).exec(function afterFind (err, user) {
      if (err) {
        sails.log.error(err)
      }
      currrentUser = user
    })
    return res.view('pages/homepage', currrentUser)
  }
}
