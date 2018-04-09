module.exports = {


  friendlyName: 'UUID',


  description: 'Generate a universally unique identifier (UUID v4).',


  extendedDescription:
  'A UUID is a pseudo-random, 36-digit string, consisting of five groups of hexadecimal digits (numerals '+
  '[0-9] and lowercase letters [a-f]), separated by hyphens.  UUIDs are standardized by '+
  '[RFC4122](http://www.ietf.org/rfc/rfc4122.txt).  Specifically, _this_ implementation generates UUIDs '+
  'according to version 4 of the specification.  Internally, it uses the [`uuid`](https://www.npmjs.com/package/uuid) '+
  'package from [defunctzombie](https://github.com/defunctzombie).',


  moreInfoUrl: 'https://en.wikipedia.org/wiki/Universally_unique_identifier',


  sync: true,


  sideEffects: 'cacheable',


  exits: {

    success: {
      outputFriendlyName: 'UUID',
      outputDescription: 'A universally unique identifier (UUID) string.',
      outputExample: '123e4567-e89b-12d3-a456-426655440000'
    }

  },


  fn: function(inputs, exits) {

    // Import `uuid`.
    var UUIDGenerator = require('uuid');

    // Use the uuid module to generate a random UUID.
    var uuid = UUIDGenerator.v4();

    // Generate the new UUID and return it through the `success` exit.
    return exits.success(uuid);
  }

};
