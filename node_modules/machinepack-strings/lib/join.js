module.exports = {


  friendlyName: 'Join strings',


  description: 'Combine an array of strings into one new string.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    strings: {
      description: 'The array of strings to join.',
      example: ['foo'],
      required: true
    },

    separator: {
      description: 'The optional separator to insert between each string.',
      defaultsTo: '',
      example: ','
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Joined string',
      outputDescription: 'The concatenated result string.',
      outputExample: 'foo'
    }

  },


  fn: function(inputs, exits) {

    // Combine the array of strings into a single string, using the
    // optional separator as "glue".
    var result = inputs.strings.join(inputs.separator||'');

    // Return the result through the `success` exit.
    return exits.success(result);
  },

};
