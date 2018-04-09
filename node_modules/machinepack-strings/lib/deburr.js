module.exports = {


  friendlyName: 'Deburr string',


  description: 'Replace special alphabetical characters such as umlauts and accents with their basic, boring equivalents.',


  extendedDescription: 'Technically, this converts "latin-1 supplementary characters" to basic letters and removes combining diacritical marks.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      description: 'The string to clean up.',
      example: 'déjà vu, Günther. Just more of your saß.',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Deburred string',
      outputExample: 'deja vu, Gunther. Just more of your sass.',
      outputDescription: 'The input string with special characters replaced.'
    }

  },


  fn: function (inputs, exits) {

    // Import `lodash`.
    var _ = require('@sailshq/lodash');

    // Deburr the string and return through the `success` exit.
    return exits.success(_.deburr(inputs.string));

  }

};
