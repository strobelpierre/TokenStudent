module.exports = {

  friendlyName: 'Generate random string',


  description: 'Generate a pseudo-random string which is probabalistically-unique.',


  extendedDescription: 'Internally, this method uses either the native Buffer from Node.js or the algorithm from the [hat](https://github.com/substack/node-hat) package by [@substack](https://github.com/substack).  If you are interested in learning more about psuedo-random number/string generators, you might be interested in reading the Wikipedia list of [random number generator algorithms](http://en.wikipedia.org/wiki/List_of_random_number_generators).\n\nNote that, while it is tempting to consider providing a per-process (pseudo-)guarantee of uniqueness by using a process-global "rack" to store past tokens, this module has opted against it in the latest release.  This feature was removed to avoid complications around use cases with memory overflow.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    style: {
      description: 'The style of random string to generate.',
      extendedDescription: 'This can be either "alphanumeric" (the default) or "url-friendly".\n'+
      '\n'+
      '• When "alphanumeric", it means the result string will consist only of numerals [0-9]\n'+
      'and lowercase letters [a-f].\n'+
      '\n'+
      '• When "url-friendly", it means the result string will have other characters as well,\n'+
      'but it is always guaranteed to work properly within the querystring of a URL.\n'+
      'Also note that, when using this style of random string, you needn\'t worry about\n'+
      'additional URI-decoding -- in other words, running decodeURI() or decodeURIComponent()\n'+
      'on the resulting random string won\'t have any effect.',
      // isIn: ['url-friendly', 'alphanumeric'],
      type: 'string',
      defaultsTo: 'alphanumeric'
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Random string',
      outputDescription: 'A random string.',
      extendedDescription: 'A generated alphanumeric random string will look something like "1a17d9af25aef464b46481d901ba2005", and a url-friendly random string will look something like "vt8qeSpSG9+HVXyhoRlecw==".',
      outputExample: '1a17d9af25aef464b46481d901ba2005'
    }

  },


  fn: function(inputs, exits) {

    var token;

    if (inputs.style === 'url-friendly') {

      // Generate a url-friendly token (e.g. for password reset or invitations)
      // https://github.com/substack/node-password-reset/blob/master/index.js
      var buf = new Buffer(16);
      for(var i = 0; i < buf.length; i++) {
        buf[i] = Math.floor(Math.random() * 256);
      }

      token = buf.toString('base64');

      // Encode URI just to be safe / clear (this leaves most special chars intact)
      // > https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
      token = encodeURI(token);

      // Get rid of plus signs (+) to avoid weird issues with spaces
      // in some parsing libraries (e.g. Sails/Express/Koa)
      //
      // > Note also that "+" is technically legal:
      // > https://stackoverflow.com/a/31300627/486547
      // > ...we just change it anyway to avoid issues.
      token = token.replace(/\+/g, '');

    }else if (inputs.style === 'alphanumeric') {

      // Generate a random, alphanumeric token.
      // Lifted more or less straight from `hat`
      // (Thanks @substack, for the amazing work!)
      // —· See https://github.com/substack/node-hat for more info.
      token = (function $recursivelyBuildingAlphanumericToken(bits, base) {

        var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
        for (var i = 2; digits === Infinity; i *= 2) {
          digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
        }

        var rem = digits - Math.floor(digits);

        var result = '';

        for (i = 0; i < Math.floor(digits); i++) {
          var x1 = Math.floor(Math.random() * base).toString(base);
          result = x1 + result;
        }

        if (rem) {
          var b = Math.pow(base, rem);
          var x2 = Math.floor(Math.random() * b).toString(base);
          result = x2 + result;
        }

        var parsed = parseInt(result, base);
        if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
          return $recursivelyBuildingAlphanumericToken(bits, base);
        }else {
          return result;
        }

      })(128, 16);//‰

    }else {
      throw new Error('Unrecognized random string style: `'+inputs.style+'`');
    }

    // Return our new probably-unique token through the `success` exit.
    return exits.success(token);
  }

};
