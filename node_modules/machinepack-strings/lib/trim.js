module.exports = {


  friendlyName: 'Trim whitespace',


  sideEffects: 'cacheable',


  sync: true,


  description: 'Trim trailing and leading whitespace from a string.',


  inputs: {

    string: {
      example: '   I went to the store to get some more milk.     ',
      description: 'The string to trim.',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Trimmed string',
      outputDescription: 'The trimmed version of the input string, with whitespace removed from both sides.',
      outputExample: 'I went to the store to get some more milk.'
    },

  },


  fn: function (inputs,exits) {

    // Import `lodash`.
    var _ = require('@sailshq/lodash');

    // Trim the input string and return it through the `success` exit.
    return exits.success(_.trim(inputs.string));
  },



};
