module.exports = {


  friendlyName: 'Lowercase string',


  description: 'Convert all uppercase letters to lowercase in the specified string.',


  extendedDescription: 'Returns a version of the string with lowercase characters replaced with uppercase characters -- this is equivalent to using `toLowerCase()` in JavaScript.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      example: 'Some stuff and THINGS 235823523',
      description: 'The string to lowercase.',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Lower-cased string',
      outputDescription: 'The lower-cased version of the input string.',
      outputExample: 'some stuff and things 235823523',
    }

  },


  fn: function (inputs, exits) {

    // Return the lowercased version of the input string through the `success` exit.
    return exits.success(inputs.string.toLowerCase());

  }


};
