module.exports = {


  friendlyName: 'Uppercase string',


  description: 'Convert all lowercase letters to uppercase in the specified string.',


  extendedDescription: 'Returns a version of the string with uppercase characters replaced with lowercase characters -- this is equivalent to using `toUpperCase()` in JavaScript.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      example: 'Some stuff and THINGS 235823523',
      description: 'The string to uppercase.',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Upper-cased string',
      outputDescription: 'The upper-cased version of the input string.',
      outputExample: 'SOME STUFF AND THINGS 235823523',
    }

  },


  fn: function (inputs, exits) {

    // Return the uppercased version of the input string through the `success` exit.
    return exits.success(inputs.string.toUpperCase());

  }


};
