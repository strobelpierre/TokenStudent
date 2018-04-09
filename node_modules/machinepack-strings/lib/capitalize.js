module.exports = {


  friendlyName: 'Capitalize string',


  description: 'Capitalize the first (or any) letter in a string.',


  extendedDescription: 'If the character at the specified position in a string is not a letter, it will be left as-is.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      example: 'villeriño',
      description: 'The string to capitalize.',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Capitalized string',
      outputExample: 'Villeriño',
      outputDescription: 'The input string with the specified character capitalized.'
    }

  },


  fn: function (inputs, exits) {

    // Import `lodash`.
    var _ = require('@sailshq/lodash');

    // Capitalize the string and return through the `success` exit.
    return exits.success(
      _.capitalize(inputs.string)
    );

  }

};
