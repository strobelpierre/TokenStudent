module.exports = {


  friendlyName: 'Search string using regex',


  description: 'Search a string using a regular expression and return the first match.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      friendlyName: 'String to search',
      example: 'hello world',
      description: 'The string to search (i.e. "haystack").',
      required: true
    },

    regexp: {
      friendlyName: 'Regular expression',
      example: 'w(\\w+)d',
      description: 'The regular expression to match against (i.e. "metal detector").',
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
      outputFriendlyName: 'Matched substring info',
      outputDescription: 'Information about the matched substring, including its text, position and matching subgroups.',
      outputExample: {
        found: 'world',
        at: 6,
        subgroups: ['orl']
      }
    },

    notFound: {
      friendlyName: 'No match found',
      description: 'No match was found.'
    }

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

    // Run the regular expression on the input string.
    var matches = inputs.string.match(regexp);

    // If no matches are found, trigger the `notFound` exit.
    if (!matches) {
      return exits.notFound();
    }

    // Otherwise return information about the primary match and any subgroups.
    return exits.success({
      found: matches[0],
      at: matches.index,
      subgroups: matches.slice(1)
    });

  }

};
