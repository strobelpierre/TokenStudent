/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const util = require('util')
const sails = require('sails')
const User = sails.models.user
module.exports = {
  login: function (req, res) {
    if (req.session.user) {
      return res.redirect('/')
    }
    sails.log.debug(util.inspect(req.body.user))
    User.findOne({
      email: req.body.user.email
    }).decrypt().exec(function afterFind (err, user) {
      if (err) {
        return res.serError(err)
      }
      if (!user || user.password !== req.body.user.password) {
        sails.log.error('No user find')
        req.addFlash('error', 'Wrong email or password')
        return res.redirect('/login')
      }
      /**
       * Creation de session
       */
      req.session.user = user.id

      /**
       * Vérifiction du rôle
       */
      sails.log.info(user.role)
      switch (user.role) {
        case 'Responsable pédagogique':
          return res.view('pages/homeResp', {user})
        case 'Etudiant':
          return res.view('pages/homeEtu', {user})
        case 'Intervenant':
          return res.view('pages/homeInter', {user})
        default:
          return res.render('/')
      }
    })
  }
}
