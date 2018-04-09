module.exports = {


  friendlyName: 'Get string slice',


  description: 'Get a substring of consecutive characters from a string.',


  sideEffects: 'cacheable',


  sync: true,


  inputs: {

    string: {
      description: 'The string to get a slice of.',
      example: 'McGee',
      required: true
    },

    start: {
      friendlyName: 'Start from index',
      description: 'The index of the first item to include in the new substring.',
      extendedDescription: 'This index should be zero or a positive integer.',
      example: 2,
      required: true
    },

    end: {
      friendlyName: 'End with index',
      description: 'The index of the last item to include in the new substring.',
      extendedDescription: 'This index should be zero or a positive integer. If this value is omitted, all of the string starting from \'Start from index\' will be returned.',
      example: 3,
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Sliced substring',
      outputDescription: 'The desired slice of the input string.',
      outputExample: 'Ge'
    },

  },


  fn: function (inputs,exits) {

    // Import `lodash`.
    var _ = require('@sailshq/lodash');

    // If the start index is invalid, trigger the `error` exit.
    if (inputs.start < 0) {
      return exits.error(new Error('`start` index must be least zero.'));
    }

    // If the start value is not a whole number, trigger the `error` exit.
    if (Math.floor(inputs.start) !== inputs.start) {
      return exits.error(new Error('`start` index must be a whole number.'));
    }

    // If no ending index was specified, return everything starting from the start index.
    if (_.isUndefined(inputs.end)) {
      return exits.success(inputs.string.slice(inputs.start));
    }

    // Otherwise if the end index is invalid, trigger the `error` exit.
    if (inputs.end < 0) {
      return exits.error(new Error('`end` index must be least zero.'));
    }

    // If the end value is not a whole number, trigger the `error` exit.
    if (Math.floor(inputs.end) !== inputs.end) {
      return exits.error(new Error('`end` index must be a whole number.'));
    }

    // If the end value is less than the start value, trigger the `error` exit.
    if (inputs.end < inputs.start) {
      return exits.error(new Error('`end` index must be >= `start` index.'));
    }

    // Increment `end` by 1 (since the second arg to `_.slice()` is exclusive),
    // and return the result of `.slice()` through the `success` exit.
    return exits.success(inputs.string.slice(inputs.start, inputs.end+1));
  },


};
