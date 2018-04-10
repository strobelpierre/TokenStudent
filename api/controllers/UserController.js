/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const util = require('util')
const sails = require('sails')
module.exports = {
  login: function (req, res) {
    sails.log.debug(util.inspect(req.body.user.email))
    User.findOne({
      email: req.body.user.email
    }).exec(function afterFind (err, user) {
      if (err) {
        return res.serError(err)
      }
      if (!user) {
        sails.log.error('No user find')
        return res.notFound('user')
      }
      if (user.password !== req.body.user.password) {
        return res.notFound('user')
      }
      return res.json(user)
    })
  }
}
