/**
 * ProjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sails = require('sails')
const User = sails.models.user
// const Project = sails.models.project
const util = require('util')
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
  },

  newProject: function (req, res) {
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
      if (user.role === 'Responsable pédagogique') {
        return res.view('pages/newProject', {user})
      } else {
        return res.render('/')
      }
    })
  },

  createProject: function (req, res) {
    if (!req.session.user) {
      return res.redirect('/')
    }
    sails.log.debug(util.inspect(req.body))
    User.findOne({
      id: req.session.user
    }).decrypt().exec(function afterFind (err, user) {
      if (err) {
        return res.serError(err)
      }

      /**
       * Vérifiction du rôle
       */
      if (user.role === 'Responsable pédagogique') {
        /*
        var title = req.body.project.title
        var description = req.body.project.description
        var beginDate = req.body.project.beginDate
        var deadline = req.body.project.deadline
        var intervenants = req.body.project.intervenant
        */
        return res.view('pages/newProject', {user})
      } else {
        return res.render('/')
      }
    })
  }

}
