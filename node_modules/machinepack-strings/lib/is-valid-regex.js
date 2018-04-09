module.exports = {


  friendlyName: 'Is valid regular expression?',


  description: 'Determine whether or not the input string constitutes a valid regular expression.',


  extendedDescription: 'Regular expressions should be provided without leading or trailing slashes, and without any modifiers like `m` or `i`.',


  sideEffects: 'cacheable',


  sync: true,


  inputs: {

    string: {
      example: 'h(e\\w)+llo w[ou]rld',
      description: 'The string to test as a regular expression.',
      extendedDescription:
        'The regular expression should be specified as a string WITHOUT including leading or trailing slashes '+
        'or modifiers like `/gi`.  For example, don\'t type `/f[o]+/i`.  Instead, type `f[o]+`.',
      moreInfoUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Is valid regular expression?',
      outputDescription: 'Whether or not the input string is a valid regular expression.',
      outputExample: true
    },

  },


  fn: function(inputs, exits) {

    // Attempt to make an honest regex out of the string.
    try {
      new RegExp(inputs.string);
    }

    // If there were any problems, return `false` through the `success` exit.
    catch (e) {
      return exits.success(false);
    }

    // Otherwise return `true` through the `success` exit.
    return exits.success(true);
  },



};
