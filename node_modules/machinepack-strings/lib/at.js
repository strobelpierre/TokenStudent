module.exports = {


  friendlyName: 'Get character in string',


  description: 'Get a character from a string at a particular position.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      example: 'villeriño',
      description: 'The source string.',
      required: true
    },

    at: {
      friendlyName: 'Character position',
      description: 'The index to look up within the string.',
      extendedDescription: 'Strings are indexed starting from the left at 0.  This value must be a non-negative integer.',
      example: 7,
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Character from string',
      outputExample: 'ñ',
      outputDescription: 'The character found at the specified index of the input string.'
    },

    notFound: {
      friendlyName: 'Out of range',
      description: 'The specified string didn\'t have a character at the specified index (i.e. it was too short).'
    }

  },


  fn: function (inputs, exits) {

    // If the index is not a non-negative integer, trigger `error`.
    if (inputs.at !== Math.floor(inputs.at) || inputs.at < 0) {
      return exits.error(new Error('The configured value for `at` must be a non-negative integer.'));
    }

    // If the index is >= than the string length, trigger `notFound`.
    if (inputs.at >= inputs.string.length) {
      return exits.notFound();
    }

    // Return the character at the specified index.
    return exits.success(inputs.string[inputs.at]);
  }

};
