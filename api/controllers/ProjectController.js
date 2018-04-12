/**
 * ProjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sails = require('sails')
const User = sails.models.user
const Project = sails.models.project
const Ticket = sails.models.ticket
const Team = sails.models.team
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
      var projects
      switch (user.role) {
        case 'Responsable pédagogique':
          projects = await Project.find()
          return res.view('pages/homeResp', {user, projects})

        case 'Etudiant':
          projects = await Project.find({grade: user.grade})
          return res.view('pages/homeEtu', {user, projects})

        case 'Intervenant':
          projects = []
          var intervenant = await User.findOne({id: user.id}).populateAll()
          intervenant.pool.forEach(function (project) {
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
      var intervenants = []
      var project = await Project.findOne({id: req.param('id')}).populateAll()
      project.intervenants.forEach(function (inter) {
        intervenants.push(inter)
      })
      var tickets = await Ticket.find({project: req.param('id')}).populateAll()
      var team = await Team.findOne({id: 1}).populateAll()
      var teams = await Team.find({project: req.param('id')}).populateAll()
      var jetonsUtilises = '00:14'

      switch (user.role) {
        case 'Responsable pédagogique':
          return res.view('pages/projetResp', {user, project, teams, jetonsUtilises})

        case 'Etudiant':
          return res.view('pages/projetEtu', {user, project, intervenants, tickets, team})

        case 'Intervenant':

          return res.view('pages/projetInter', {user, project, tickets, team, jetonsUtilises})

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
          intervenants: req.body.intervenant,
          campus: req.body.project.campus
        }
        var createdProject = await Project.create(project)

        var url = '/projet/' + createdProject.id
        res.redirect(url)
      } else {
        return res.render('/')
      }
    })
  }

}
