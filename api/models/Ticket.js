/**
 * Ticket.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docsdocs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    message: { model: 'Message', required: true },
    project: { model: 'Project', required: true },
    intervenant: { model: 'User', required: true },
    team: { model: 'Team', required: true },
    status: { type: 'Integer', defaultsTo: 0 },
    jetonUtilises: { type: 'string' }
  }

}
