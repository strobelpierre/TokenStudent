/**
 * ResetPasswordController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const sails = require('sails')
const User = sails.models.user
module.exports = {
  checkHash: function (req, res) {
    User.findOne({
      resetPassword: req.param('hash')
    }).exec(function afterFind (err, user) {
      if (err) {
        req.addFlash('error', 'Erreur MySQL')
        sails.log.error('Erreur MySQL')
        return res.serError(err)
      } else {
        if (!user) {
          req.addFlash('error', 'Hash invalide')
          sails.log.error('Hash invalide')
        } else {
          req.addFlash('info', 'Hash valide')
          sails.log.debug('Hash valide')
          req.addFlash('id', user.id)
        }
      }
      return res.view('pages/resetPassword')
    })
  },
  resetPassword: async function (req, res) {
    await User.update({id: req.body.user.id}).set({password: req.body.user.password})
    await User.update({id: req.body.user.id}).set({resetPassword: ''})
    sails.log.info('Nouveau mot de passe crée')
    req.addFlash('info', 'Nouveau mot de passe crée')
    return res.redirect('/login')
  }
}
