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
const faker = require('faker')
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
  genProject: function (req, res) {
    /**
     * Select * intervenant
     */
   
      var grade = ['B1', 'B2', 'B3', 'I4', 'I5']
      var campus = ['Arras', 'Bordeaux', 'Brest', 'Grenoble', 'Lille', 'Lyon', 'Montpellier', 'Nantes', 'Paris']
      var project = {
        title: faker.commerce.productName(),
        description: faker.company.catchPhrase(),
        beginDate: faker.date.past(),
        deadline: faker.date.future(),
        grade: grade[Math.floor(Math.random() * grade.length)],
        campus: campus[Math.floor(Math.random() * campus.length)],
        intervenants:[]
      }
      User.find(
        {
          role: 'Intervenant',
          campus: project.campus
        }
      ).limit(5).exec(function afterFind (err, Intevenants) {
        if (err) {
          res.json(err)
        }
        Intevenants.forEach(function(element) {
          project.intervenants.push(element.id)
          sails.log.debug(project)
        })
        Project.create(project).exec(function aftercreate(err, created) {
          if (err) {
            sails.log.error(err)
            sails.log.debug(project)
          }
          
        })
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
