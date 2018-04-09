module.exports = {


  friendlyName: 'Ensure string uniqueness',


  description: 'Make a unique, but still human-readable, version of a string vs. a set of existing strings by adding a number to the end.',


  sideEffects: 'cacheable',


  sync: true,


  inputs: {

    string: {
      friendlyName: 'Unique string',
      example: 'Siri',
      description: 'The string to ensure the uniqueness of.',
      required: true
    },

    existingStrings: {
      description: 'The set of existing strings to check uniqueness against.',
      example: ['Siri'],
      required: true
    },

    caseSensitive: {
      friendlyName: 'Case sensitive?',
      description: 'Whether or not the uniqueness check should be case-sensitive (care about uppercase vs. lowercase letters).',
      example: false,
      defaultsTo: false
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Unique string',
      outputDescription: 'A version of the input string guaranteed to be unique among the specified `existingStrings`.',
      outputExample: 'Siri2'
    },

  },


  fn: function (inputs,exits) {

    // Import `lodash`.
    var _ = require('@sailshq/lodash');

    // Make a copy of the input string.
    var potentiallyUniqueStr = inputs.string;

    // Keep checking the current iteration of the string against all of the
    // existing strings until we come up with something unique.
    while (

      // Use _.any() to see if any of the strings in the `existingStrings` array
      // match the current candidate string.
      _.any(inputs.existingStrings, function doesItMatch(existingStr) {

        // If we're doing a case-sensitive check, just see if the candidate string
        // matches the existing string
        if (inputs.caseSensitive) {
          return existingStr === potentiallyUniqueStr;
        }

        // Otherwise check if the lower-cased versions of both strings match.
        return existingStr.toLowerCase() === potentiallyUniqueStr.toLowerCase();

      })
    )

    // If the candidate string did match an existing string, modify it in some way.
    {
      // If the last part of the candidate string is one or more numerals, we'll take a pass at incrementing
      // that existing number rather than just chaining more numbers onto the end.
      if (potentiallyUniqueStr.match(/[0-9]+$/g)) {
        potentiallyUniqueStr = potentiallyUniqueStr.replace(/[0-9]+$/, function(substr) {
          return ''+((+substr) + 1);
        });
      }
      // If not, just add a big fat "2" onto the end.
      else {
        potentiallyUniqueStr += '2';
      }
    }

    // Once we have our unique string, return it through the `success` exit.
    return exits.success(potentiallyUniqueStr);
  },


};
