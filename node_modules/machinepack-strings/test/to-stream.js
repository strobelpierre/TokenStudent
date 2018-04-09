var assert = require('assert');
var Strings = require('../');

describe('.toStream()', function() {

  it('should provide a readable stream with the correct data', function() {

    var stream = Strings.toStream({string: 'abc123 foo bar baz'}).execSync();
    var contents = stream.read().toString();

    assert.equal(contents, 'abc123 foo bar baz');

  });

});
