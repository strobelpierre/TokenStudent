/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docsdocs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    surname: { type: 'string', required: true },
    firstName: { type: 'string', required: true },
    role: { type: 'string', required: true, isIn: ['Responsable pédagogique', 'Etudiant', 'Intervenant'] },
    email: { type: 'string', required: true },
    password: { type: 'string', required: true, encrypt: true },
    avatar: {type: 'string', defaultsTo: 'https://www.tousvoisins.fr/img/avatar-default.png'},
    grade: {type: 'string', isIn: ['B1', 'B2', 'B3', 'I4', 'I5']},
    teams: {
      collection: 'Team',
      via: 'users'
    }
  }
}
