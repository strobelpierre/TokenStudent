/**
 * ProjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sails = require('sails')
const User = sails.models.user
const Project = sails.models.project
const util = require('util')
module.exports = {

  viewAllProjects: function (req, res) {
    if (!req.session.user) {
      return res.redirect('/')
    }

    User.findOne({
      id: req.session.user
    }).decrypt().exec(async function afterFind (err, user) {
      if (err) {
        return res.serError(err)
      }

      /**
       * Vérifiction du rôle
       */
      sails.log.debug(user.role)

      switch (user.role) {
        case 'Responsable pédagogique':
          var projects = await Project.find()
          return res.view('pages/homeResp', {user, projects})

        case 'Etudiant':
          var projects = await Project.find({grade: user.grade})
          return res.view('pages/homeEtu', {user, projects})

        case 'Intervenant':
          var projects = []
          var intervenant = await User.findOne({id: user.id}).populateAll()
          sails.log.debug(intervenant.pool)
          intervenant.pool.forEach(function(project){
            projects.push(project)
          })
          return res.view('pages/homeInter', {user, projects})


        default:
          return res.render('/')
      }
    })
  },

  viewProject: function (req, res) {
    if (!req.session.user) {
      return res.redirect('/')
    }

    User.findOne({
      id: req.session.user
    }).decrypt().exec(async function afterFind (err, user) {
      if (err) {
        return res.serError(err)
      }
      var project = await Project.find({id: req.param('id')})

      var intervenants = await User.find({role: 'Intervenant', pool: project.id})

      sails.log.debug(project)
      return res.view('pages/projetEtu', {user, project, intervenants})

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
    var project = {
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
    }).decrypt().exec(async function afterFind (err, user) {
      if (err) {
        return res.serError(err)
      }

      /**
       * Vérifiction du rôle
       */
      if (user.role === 'Responsable pédagogique') {
        sails.log.debug(util.inspect(req.body.project))
        sails.log.debug(util.inspect(req.body.intervenant))
        var project = {
          title: req.body.project.title,
          description: req.body.project.description,
          beginDate: req.body.project.beginDate,
          deadline: req.body.project.deadline,
          grade: req.body.project.classe,
          intervenants: req.body.intervenant
        }
        var createdProject = await Project.create(project)

        var url = '/projet/' + createdProject.id
        res.redirect(url);
      } else {
        return res.render('/')
      }
    })
  }

}
