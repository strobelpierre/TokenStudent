/**
 * TicketController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sails = require('sails')
const User = sails.models.user
const Ticket = sails.models.ticket
const Team = sails.models.team
const Project = sails.models.project
const Message = sails.models.message
const util = require('util')

module.exports = {

  createTicket: async function (req, res) {
    if (!req.session.user) {
      return res.redirect('/')
    }
    var message = {
      team: req.body.ticket.team,
      intervenant: req.body.ticket.intervenant,
      message: req.body.ticket.message,
      dateEnvoi: new Date()
    }
    var sendedMessage = await Message.create(message).fetch()

    var ticket = {
      message: sendedMessage.id,
      project: req.body.ticket.project,
      intervenant: req.body.ticket.intervenant,
      team: req.body.ticket.team,
      status: 0
    }
    var createdTicket = await Ticket.create(ticket).fetch()

    sails.log.debug(createdTicket)
    var url = '/projet/' + req.body.ticket.project
    res.redirect(url)
  }

}
