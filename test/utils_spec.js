var _ = require('lodash');
var sinon = require('sinon');
var should = require('chai').should();
var serverbone = require('..');

describe('Utils tests', function() {
  var model;
  var sandbox;

  before(function() {
    sandbox = sinon.sandbox.create();
  });

  after(function() {
    sandbox.restore();
  });

  it('should sendError', function() {
    var req = {};
    var res = {
      writeHead: function() {},
      end: function() {

      }
    };
    var err = new Error('Foo error');
    serverbone.utils.response.sendError(req, res, err);
  });

  it('should fail if trying to send JSON without resource', function() {
    var req = {};
    var res = {
      locals: {},
      writeHead: function() {},
      end: function() {

      }
    };
    serverbone.utils.response.sendJson(req, res);
  });
});
