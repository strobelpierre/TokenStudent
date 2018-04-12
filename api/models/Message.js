/**
 * Message.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docsdocs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    team: { model: 'Team', required: true },
    intervenant: { model: 'User', required: true },
    message: { type: 'string', required: true },
    dateEnvoi: { type: 'string', required: true },
    dateLecture: { type: 'string' },
    dateReponse: { type: 'string' },
    reponse: { model: 'Message' }
  }

}
