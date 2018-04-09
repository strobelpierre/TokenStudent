module.exports = {


  friendlyName: 'Convert stream to string',


  description: 'Consume a readable stream of data and return a string.',


  extendedDescription:
  'This reads _all_ incoming data.  So be careful not to use this on a stream that is too big.  '+
  '(Its contents might not fit into memory all at the same time!)',


  inputs: {

    sourceStream: {
      type: 'ref',
      description: 'The Readable stream to consume.',
      extendedDescription: 'Must be a utf8-encoded, modern (streams>=2) Readable stream.',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'String',
      outputDescription: 'The data that was accumulated from consuming the stream, represented as a raw string.',
      outputType: 'string'
    },

  },


  fn: function (inputs, exits) {

    // Check for the methods we need on the provided Readable source stream.
    if (!inputs.sourceStream || typeof inputs.sourceStream !== 'object' || typeof inputs.sourceStream.pipe !== 'function' || typeof inputs.sourceStream.on !== 'function') {
      throw new Error('Invalid stream provided (has no `.pipe()` and/or `.on()` methods).');
    }

    var stream = inputs.sourceStream;

    // (Note: The $-prefixed functions are standalone declarations because we use
    // references to them again below as we clean up.)
    var $onData;
    var $onEnd;
    var $onError;
    (function(proceed){

      var dataSoFar = '';
      var spun;

      // Bind "data", "end", and "error" listeners.
      $onData = function (chunk) {
        // console.log('on("data")', arguments);
        dataSoFar += chunk.toString();
        // console.log('read chunk:', dataSoFar);
      };//ƒ
      stream.on('data', $onData);

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // For some reason, we have to use the traditional streams1 approach here,
      // for some streams anyway.  It seems like the request module does not fully
      // support the streams>=2 API as documented, as of mid-2017 and request@2.81 thru 2.83.
      //
      // For proof, try out:
      // https://github.com/sailshq/machinepack-strings/commit/ca02704a1d5ae6ba168d988ee20972b5de6e7258
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

      $onEnd = function () {
        // console.log('end', arguments);
        if (spun) { return; }
        spun = true;
        proceed(undefined, dataSoFar);
      };//ƒ
      stream.on('end', $onEnd);

      $onError = function(err) {
        // console.log('error', err);
        if (spun) { return; }
        spun = true;
        proceed(err);
      };
      stream.on('error', $onError);


    })(function(err, data) {
      stream.removeListener('data', $onData);
      stream.removeListener('end', $onEnd);
      stream.removeListener('error', $onError);

      if (err) {
        return exits.error(err);
      }

      return exits.success(data);

    });//_∏_ (†)

  },


};
