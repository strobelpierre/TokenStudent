module.exports = {


  friendlyName: 'Split string into array',


  description: 'Split a string into an array of strings using a regular expression.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      example: 'Hello world!',
      description: 'The string to split.',
      required: true
    },

    regexp: {
      friendlyName: 'Regular expression',
      example: '\\s',
      description: 'The regular expression for detecting delimiters which mark the end of each string segment.',
      extendedDescription: 'The regular expression should be specified as a string _without_ including leading or trailing slashes or modifiers like /gi.',
      required: true
    },

    caseInsensitive: {
      friendlyName: 'Case insensitive?',
      description: 'Whether or not you care about uppercase/lowercase letters.',
      extendedDescription: 'This will build the regular expression using the `/i` modifier.',
      example: true,
      defaultsTo: true,
      advanced: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Split-up string',
      outputDescription: 'An array of substrings.',
      outputExample: ['Hello']
    }

  },


  fn: function (inputs, exits) {

    // Make a copy of the `regexp` input string.
    var regexp = inputs.regexp;

    // Attempt to instantiate `regexp` into a RegExp object.
    try {
      // If specified, make it a case-insensitive regexp.
      if (inputs.caseInsensitive) {
        regexp = new RegExp(regexp, 'i');
      }
      // Otherwise, skip the modifier
      else {
        regexp = new RegExp(regexp);
      }
    }

    // If we run into any trouble, trigger the `invalidRegexp` exit.
    catch (e) {
      return exits.error(new Error('The provided `regexp` input did not represent a valid regular expression.  Make sure it does not contain leading or trailing slashes!'));
    }

    // Use `.split()` to split the input string into an array.
    var substrings = inputs.string.split(regexp);

    // Return the new array through the `success` exit.
    return exits.success(substrings);

  }

};
