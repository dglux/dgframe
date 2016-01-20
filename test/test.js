var assert = require('assert'),
    dgframe = require('../');

describe('dgframe', function() {
  it('#onReady / foreign#init', function(done) {
    dgframe.onReady(function() {
      done();
    });

    dgframe.foreign.init();
  });

  it('#isTable', function() {
    assert(dgframe.isTable({cols: [], rows: []}));
    assert(!dgframe.isTable({cols: {}, rows: []}));
  });

  it('#updateParam', function() {
    var pass = true;
    var emitter = dgframe.on('test', function() {
      pass = false;
    });

    dgframe.updateParam('test', true);
    assert(pass === true);
    assert(dgframe.params.test === true);

    dgframe.updateParam('test', false, 'test', true, 'test', false, 'test2');
    assert(dgframe.params.test === false);

    emitter.removeListener();
  });

  it('#pushParams', function() {
    dgframe.params.test = false;
    dgframe.pushParams(); // sets test_param to false in DGLux

    assert(dgframe.params.test === false);

    dgframe.pushParams({
      test: true
    });

    assert(dgframe.params.test === true);
  });

  it('updates event emitter', function(done) {
    var val = {cols: [], rows: []};
    var emitter = dgframe.on('test', function(value, isTable) {
      assert(value.cols.length === 0);
      assert(value.rows.length === 0);
      assert(isTable === true);
      done();
      emitter.removeListener();
    });

    dgframe.foreign.updateParam('test', val);
  });
});

describe('dgframe.foreign', function() {
  it('#updateParam', function(done) {
    var emitter = dgframe.on('test', function() {
      assert(dgframe.params.test === true);

      done();
      emitter.removeListener();
    });

    dgframe.foreign.updateParam('test', true);
  });
});

describe('dgframe.EventEmitter', function() {
  var emitter = new dgframe.EventEmitter();

  it('has proper property visibility', function() {
    assert(Object.keys(emitter).indexOf('_listeners') === -1);
  });

  it('#on', function() {
    var sub = emitter.on('test', function() {});
    sub.removeListener();
  });

  it('#emit', function(done) {
    var index = 0;
    var sub = emitter.on('test', function() {
      index++;

      if(index === 1) {
        assert(arguments.length === 0);
      }

      if(index === 2) {
        assert(arguments.length === 1);
        assert(arguments[0] === 1);
      }

      if(index === 3) {
        assert(arguments.length === 3);
        assert(arguments[0] === 1);
        assert(arguments[1] === 2);
        assert(arguments[2] === 3);

        sub.removeListener();
        done();
      }
    });

    emitter.emit('test');
    emitter.emit('test', 1);
    emitter.emit('test', 1, 2, 3)
  });

  it('#removeListener', function() {
    var pass = true;
    var sub = emitter.on('test', function() {
      pass = false;
    });

    sub.removeListener();
    emitter.emit('test');
    assert(pass === true);

    var func = function() {
      pass = false;
    };

    sub = emitter.on('test', func);
    emitter.removeListener('test', func);

    emitter.emit('test');
    assert(pass === true);
  });
  
});
