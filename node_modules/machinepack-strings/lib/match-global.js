module.exports = {


  friendlyName: 'Search string using regex (global)',


  description: 'Search a string using a global regular expression and return all matches.',


  extendedDescription: 'This uses the `/g` modifier to find every match in the input string.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      friendlyName: 'String to search',
      example: 'hello world',
      description: 'The string to search.',
      required: true
    },

    regexp: {
      friendlyName: 'Regular expression',
      example: 'l(\\w)',
      description: 'The regular expression to match against.',
      extendedDescription:
        'The regular expression should be specified as a string WITHOUT including leading or trailing slashes '+
        'or modifiers like `/gi`.  For example, don\'t type `/f[o]+/i`.  Instead, type `f[o]+` and also set '+
        '"Case insensitive?" to true.',
      moreInfoUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp',
      required: true
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
      outputFriendlyName: 'Substring match info',
      outputDescription: 'Information about the matched substrings, including their text, position and matching subgroups.',
      outputExample: [{
        found: 'll',
        at: 2,
        subgroups: ['l']
      }]
    },

    notFound: {
      friendlyName: 'No matches found',
      description: 'No matches were found.'
    }

  },


  fn: function (inputs, exits) {

    // Make a copy of the `regexp` input string.
    var regexp = inputs.regexp;

    // Attempt to instantiate `regexp` into a RegExp object.
    try {

      // Declare a string to hold the requested regex modifiers.
      // Since this is a global search, we'll always use the "g" modifier.
      var modifiers = 'g';

      // Add an `i` modifier if case-insensitivity is requested.
      if (inputs.caseInsensitive) {
        modifiers += 'i';
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

    // If we run into any trouble, trigger the `error` exit.
    catch (e) {
      return exits.error(new Error('The provided `regexp` input did not represent a valid regular expression.  Make sure it does not contain leading or trailing slashes!'));
    }

    // Declare an array var to hold the matches
    var matches = [];

    // Declare a var to hold a single match
    var match;

    // Keep running the regex until out of matches
    while (match = regexp.exec(inputs.string)) {

      // Push information about the match onto the `matches` array
      matches.push({
        found: match[0],
        at: match.index,
        subgroups: match.slice(1)
      });

    }

    // If no matches are found, trigger the `notFound` exit.
    if (matches.length === 0) {
      return exits.notFound();
    }

    // Otherwise return information about the matches.
    return exits.success(matches);

  }

};
