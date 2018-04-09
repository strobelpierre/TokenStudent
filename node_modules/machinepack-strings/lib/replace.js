module.exports = {


  friendlyName: 'Replace substring using regex',


  description: 'Replace parts of a string that match a given regular expression with the specified replacement.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      example: 'Hello world!',
      description: 'The string to modify.',
      required: true
    },

    regexp: {
      friendlyName: 'Regular expression',
      example: 'World',
      description: 'The regular expression to match against.',
      extendedDescription: 'The regular expression should be specified as a string WIHOUUT including leading or trailing slashes or modifiers like /gi.',
      required: true
    },

    replacement: {
      description: 'The string to use when replacing matches.',
      extendedDescription: 'Note that you can use match expressions (e.g. "$1", "$2", etc.) to express the values of capture groups.',
      example: 'Mumbai',
      required: true
    },

    global: {
      friendlyName: 'Replace all?',
      description: 'Whether or not to replace all substrings that match the regular expression, or just the first.',
      extendedDescription: 'This will build the regular expression using the `/g` modifier.',
      example: true,
      defaultsTo: false
    },

    caseInsensitive: {
      friendlyName: 'Case insensitive?',
      description: 'Whether or not you care about uppercase/lowercase letters.',
      extendedDescription: 'This will build the regular expression using the `/i` modifier.',
      example: true,
      defaultsTo: true,
      advanced: true
    },


    multiline: {
      friendlyName: 'Multiline?',
      description: 'Whether to treat beginning and end characters (^ and $) as matching each line delimited by \\n or \\r.',
      extendedDescription: 'This will build the regular expression using the `/m` modifier.',
      example: true,
      defaultsTo: false,
      advanced: true
    }



  },


  exits: {

    success: {
      outputFriendlyName: 'Replaced string',
      outputDescription: 'The transformed input string, after applying the specified replacement.',
      outputExample: 'Hello Mumbai!'
    },

  },


  fn: function (inputs, exits) {

    // Make a copy of the `regexp` input string.
    var regexp = inputs.regexp;

    // Attempt to instantiate `regexp` into a RegExp object.
    try {

      // Declare a string to hold the requested regex modifiers.
      var modifiers = '';

      // Add an `i` modifier if case-insensitivity is requested.
      if (inputs.caseInsensitive) {
        modifiers += 'i';
      }

      // Add a `g` modifier if global matching is requested.
      if (inputs.global) {
        modifiers += 'g';
      }

      // Add an `m` modifier if multiline matching is requested.
      if (inputs.multiline) {
        modifiers += 'm';
      }

      // If there are any modifiers, use them when attempting to
      // create the regular expression.
      if (modifiers.length) {
        regexp = new RegExp(regexp, modifiers);
      }

      // Otherwise attempt to create it without modifiers.
      else {
        regexp = new RegExp(regexp);
      }
    }

    // If we run into any trouble, trigger the `invalidRegexp` exit.
    catch (e) {
      return exits.error(new Error('The provided `regexp` input did not represent a valid regular expression.  Make sure it does not contain leading or trailing slashes!'));
    }

    // Use the native String .replace() method to replace matches
    // in the input string.
    var newString = inputs.string.replace(regexp, inputs.replacement);

    // Return the resulting string through the `success` exit.
    return exits.success(newString);

  }

};
