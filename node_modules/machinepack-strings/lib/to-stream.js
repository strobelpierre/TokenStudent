module.exports = {


  friendlyName: 'Convert string to stream',


  description: 'Convert a string into a readable stream of data.',


  extendedDescription: 'The stream that is returned is a modern (streams>=2) Node Readable instance. In other words it is _paused_ until it is used.',


  moreInfoUrl: 'http://stackoverflow.com/a/22085851/486547',


  sync: true,


  inputs: {

    string: {
      example: 'foo bar baz',
      description: 'The string to convert.',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Stream',
      outputDescription: 'A Readable stream representing a string.',
      extendedDescription:
      'Note that this result stream is _not flowing_.  In other words, it is _paused_, which means '+
      'you don\'t have to worry about using it immediately (i.e. don\'t worry about a tick of the event loop elapsing). '+
      'Also keep in mind that the stream returned is a modern (streams>=2) Node Readable instance.',
      outputExample: '==='
    },

  },


  fn: function (inputs,exits) {

    // Create a new readable stream
    var string__ = new require('stream').Readable();

    // Add the mandatory `_read()` method to the new stream.  Since we'll be pushing the whole
    // string in to the stream at once, `_read()` can just be a no-op (as opposed to something
    // that pushes more data into the stream for the consumer to read later).
    string__._read = function () {};

    // Push the string onto the stream.
    string__.push(inputs.string);

    // Push a null byte to signal EOF.
    string__.push(null);

    // Return the stream through the `success` exit.
    return exits.success(string__);

  },


};
