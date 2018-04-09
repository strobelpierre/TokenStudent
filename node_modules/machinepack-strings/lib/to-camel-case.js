module.exports = {


  friendlyName: 'Camel-case string',


  description: 'Convert a string to camel-case (varying capitalization instead of spaces/underscores/dashes).',


  extendedDescription: 'Returns a version of the string with dashes removed, using medial capitalization to separate words instead. See http://en.wikipedia.org/wiki/CamelCase for more information.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    string: {
      example: 'foo-bar-baz',
      description: 'The string to convert (dash-delimited or otherwise).',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Camel-cased string',
      outputDescription: 'The camel-cased version of the input string.',
      outputExample: 'fooBarBaz',
    }

  },


  fn: function (inputs, exits) {

    // Import `lodash`.
    var _ = require('@sailshq/lodash');

    // Return the camel-cased version of the input string through the `success` exit.
    return exits.success(_.camelCase(inputs.string));
  }

};
