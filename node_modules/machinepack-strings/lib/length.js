module.exports = {


  friendlyName: 'Get string length',


  description: 'Determine the length of a string (i.e. count the number of characters).',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      example: 'guido villeriño',
      description: 'The string whose characters will be counted.',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'String length',
      outputDescription: 'The length of the specified string.',
      outputExample: 15,
    }

  },


  fn: function (inputs, exits) {

    // Return the input string's length through the `success` exit.
    return exits.success(inputs.string.length);
  }

};
