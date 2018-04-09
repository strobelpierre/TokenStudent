module.exports = {


  friendlyName: 'Kebab-case string',


  description: 'Convert a string to kebab-case (dashes instead of spaces/underscores/varying capitalization).',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      example: 'fooBar_baz bong___',
      description: 'The string to convert.',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Kebab-cased string',
      outputDescription: 'The kebab-cased (i.e. dash-delimited) string, lower-cased, with underscores and spaces removed.',
      outputExample: 'foo-bar-baz-bong',
    }

  },


  fn: function (inputs, exits) {

    // Import `lodash`.
    var _ = require('@sailshq/lodash');

    // Return the kebab-cased version of the input string through the `success` exit.
    return exits.success(_.kebabCase(inputs.string));
  }

};
