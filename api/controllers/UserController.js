/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const util = require('util')
const sails = require('sails')
const User = sails.models.user
const faker = require('faker')
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

      return res.redirect('/')
    })
  },

  logout: function (req, res) {
    req.session.destroy()
    return res.redirect('/login')
  },

  rgpdValidation: function (req, res) {
    if (!req.session.user) {
      return res.redirect('/')
    }

    User.findOne({
      id: req.session.user
    }).decrypt().exec(async function afterFind (err, user) {
      if (err) {
        return res.serError(err)
      }

      await User.update({id: req.session.user}).set({rgpd: '1'})

      return res.redirect('/')
    })
  },

  viewAccount: function (req, res) {
    if (!req.session.user) {
      return res.redirect('/')
    }

    User.findOne({
      id: req.session.user
    }).decrypt().exec(async function afterFind (err, user) {
      if (err) {
        return res.serError(err)
      }
      return res.view('pages/account', {user})
    })
  },

  fakeUser: function (req, res) {
    var grade = ['B1', 'B2', 'B3', 'I4', 'I5']
    var campus = ['Arras', 'Bordeaux', 'Brest', 'Grenoble', 'Lille', 'Lyon', 'Montpellier', 'Nantes', 'Paris']
    var users = []
    faker.locale = 'fr'
    /**
    * Gen responsable
    */
    var responsable = {
      surname: faker.name.lastName(),
      firstName: faker.name.firstName(),
      role: 'Responsable pédagogique',
      email: 'john.doe@epsi.fr',
      password: 'epsi1234',
      avatar: faker.internet.avatar(),
      grade: '',
      campus: campus[Math.floor(Math.random() * campus.length)]
    }
    /**
    * Gen responsable
    */
    for (var i = 0; i < 300; i++) {
      var user = {
        surname: faker.name.lastName(),
        firstName: faker.name.firstName(),
        role: 'Intervenant',
        email: faker.internet.email(),
        password: 'epsi1234',
        avatar: faker.internet.avatar(),
        campus: campus[Math.floor(Math.random() * campus.length)]
      }
      users.push(user)
    }
    /**
    * Gen student
    */
    users.push(responsable)
    for (i = 0; i < 5000; i++) {
      user = {
        surname: faker.name.lastName(),
        firstName: faker.name.firstName(),
        role: 'Etudiant',
        email: faker.internet.email(),
        password: 'epsi1234',
        avatar: faker.internet.avatar(),
        grade: grade[Math.floor(Math.random() * grade.length)],
        campus: campus[Math.floor(Math.random() * campus.length)]
      }
      users.push(user)
    }
    User.createEach(users).exec(function aftercreate (err) {
      if (err) {
        sails.log.error(err)
      }
    })
    return res.json(users)
  }
}
