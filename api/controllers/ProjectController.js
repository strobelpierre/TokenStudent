/**
 * ProjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sails = require('sails')
const User = sails.models.user
module.exports = {

  viewAllProjects: function (req, res) {
    if (!req.session.user) {
      return res.redirect('/')
    }

    User.findOne({
      id: req.session.user
    }).decrypt().exec(function afterFind (err, user) {
      if (err) {
        return res.serError(err)
      }

      /**
       * Vérifiction du rôle
       */
      sails.log.debug(user.role)
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
