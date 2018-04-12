/**
 * PasswordRecoveryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const sails = require('sails')
const User = sails.models.user
module.exports = {
  passwordRecovery: function (req, res) {
    sails.log.debug('recovery ' + req.body.user.recoveryMail)
    User.findOne({
      email: req.body.user.recoveryMail
    }).exec(async function afterFind (err, user) {
      if (err) {
        res.serError(err)
        sails.log.error('Erreur MySQL ' + err)
        req.addFlash('errorRecovery', 'Erreur MySQL ' + err)
        return res.redirect('/login')
      }
      if (!user) {
        sails.log.error('Email ' + req.body.user.recoveryMail + ' lié à aucun compte')
        req.addFlash('infoRecovery', 'Email de confirmation envoyé à ' + req.body.user.recoveryMail)
        return res.redirect('/login')
      }
      var nodemailer = require('nodemailer')

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'contact.tokenstudent@gmail.com',
          pass: 'TokenStudentPass'
        }
      })

      var bcryptNodejs = require('bcrypt-nodejs')
      var salt = bcryptNodejs.genSaltSync(10)
      var hash = bcryptNodejs.hashSync(req.body.user.recoveryMail, salt)
      sails.log.debug(hash)

      var host = req.headers.host

      hash = hash.replace(/\./g, '')
      hash = hash.replace(/\//g, '')

      var mailOptions = {
        from: 'contact.tokenstudent@gmail.com',
        to: req.body.user.recoveryMail,
        subject: 'Réinitialisation de votre mot de passe',
        text: 'Bonjour ' + user.firstName + ' ' + user.surname + ' accédez à ce lien pour réinitialiser votre mot de passe : http://' + host + '/reset/' + hash
      }

      await User.update({id: user.id}).set({resetPassword: hash})
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          sails.log(error)
          req.addFlash('errorRecovery', error)
          return res.redirect('/login')
        } else {
          sails.log('Email envoyé: ' + info.response)
          req.addFlash('infoRecovery', 'Email de confirmation envoyé à ' + req.body.user.recoveryMail)
          return res.redirect('/login')
        }
      })
    })
  }
}
