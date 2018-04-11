/**
 * PageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sails = require('sails')
const User = sails.models.user
const util = require('util')
module.exports = {
  home: function (req, res) {
    if (!req.session.user) {
      return res.redirect('/login')
    }
    User.findOne({
      id: req.session.user
    }).exec(function afterFind (err, user) {
      if (err) {
        return res.serError(err)
      }
      if (!user) {
        sails.log.error('No user find')
        return res.notFound('user')
      }
      /**
       * Creation de session
       */
      sails.log.error(util.inspect(user))
      return res.view('pages/homepage', {user})
    })
  }
}
