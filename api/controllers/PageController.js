/**
 * PageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
  home: function (req, res) {
    if (!req.session.user) {
      return res.redirect('/login')
    }
    return res.view('pages/homepage')
  }
}
