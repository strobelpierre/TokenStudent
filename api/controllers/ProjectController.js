/**
 * ProjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sails = require('sails')
const User = sails.models.user
const Project = sails.models.project
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
        User.find({
          role: 'Intervenant'
        }).decrypt().exec(function afterFind (err, Intervenants) {
          if (err) {
            return res.json(err)
          }
          return res.view('pages/newProject', {user, Intervenants})
        })
      } else {
        return res.render('/')
      }
    })
  },
  testproject: function (req, res) {
    var project={
      title: 't',
      description: 'tt',
      beginDate: '2011-04-20 10:00:00',
      deadline: '2011-04-20 10:00:00'
    }
    Project.create(project).exec(function aftercreate (err) {
      if (err) {
        sails.log.error(err)
      }
      res.json(project)
    })
  },
  createProject: function (req, res) {
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
        /*
        var title = req.body.project.title
        var description = req.body.project.description
        var beginDate = req.body.project.beginDate
        var deadline = req.body.project.deadline
        var intervenants = req.body.project.intervenant
        */
        sails.log.debug(util.inspect(req.body.project))
        sails.log.debug(util.inspect(req.body.intervenant))
        var project={
          title: req.body.project.title,
          description: req.body.project.description,
          beginDate: req.body.project.beginDate,
          deadline: req.body.project.deadline,
          grade: req.body.project.classe,
          intervenants: req.body.intervenant
        }
        Project.create(project).exec(function aftercreate (err) {
          if (err) {
            sails.log.error(err)
          }
          res.json(project)
        })
        // return res.view('pages/newProject', {user})
      } else {
        return res.render('/')
      }
    })
  }

}
