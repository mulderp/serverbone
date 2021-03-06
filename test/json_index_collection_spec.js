var should = require('chai').should();
var _ = require('lodash');
var when = require('when');
var sequence = require('when/sequence');
var testSetup = require('./test_setup');
var TestCollection = testSetup.TestJSONIndexCollection;
var TestMultiIndexCollection = testSetup.TestMultiIndexCollection;
var serverbone = require('..');
var JSONModel = serverbone.models.JSONModel;

describe('Test JSONIndexCollection', function () {
  var collection;
  var data = [
    {
      foo: 'bar',
      hello: 'world'
    },
    {
      foo: 'bar1',
      hello: 'world1'
    },
    {
      foo: 'bar2',
      hello: 'world2'
    }
  ];

  before(function(done) {
    collection = new TestCollection(null, {foo_id: 1});
    done();
  });

  after(function(done) {
    testSetup.clearDb();
    done();
  });

  it('should create JSONModel instance', function() {
    var model = new JSONModel({foo: 'bar', hello: 'world'});
    model.get('foo').should.equal('bar');
    var json = model.toJSON();
    json.hello.should.equal('world');
  });

  it('should add JSON values to index', function(done) {
    var fns = _.map(data, function(row) {
      return _.bind(collection.addToIndex, collection, row);
    });
    sequence(fns)
      .then(function() {
        done();
      }).otherwise(done);
  });

  it('should fetch all values', function(done) {
    collection
      .fetch()
      .then(function() {
        collection.length.should.equal(3);
        var json = collection.toJSON();
        json[0].foo.should.equal('bar');
        collection.at(1).get('hello').should.equal('world1');
        done();
      }).otherwise(done);
  });

  it('should add values to another index', function(done) {
    var anotherColl = new TestCollection(null, {foo_id: 2});
    anotherColl
      .addToIndex({foo: 'barx'})
      .then(function(){
        done();
      }).otherwise(done);
  });

  it('should read values from both indexes', function(done) {
    var multiColl = new TestMultiIndexCollection(null, {
      foo_id: 1,
      indexProperties: [{foo_id: 1}, {foo_id: 2}]
    });
    multiColl.indexKey.should.equal('i:Value:1:relation');
    multiColl.unionKey.should.equal('i:Values:1');
    multiColl.indexKeys.length.should.equal(2);
    multiColl.indexKeys[1].should.equal('i:Value:2:relation');
    multiColl
      .readFromIndex()
      .then(function() {
        multiColl.length.should.equal(4);
        done();
      }).otherwise(done);
  });

  it('should remove all values from index', function(done) {
    collection = new TestCollection(null, {foo_id: 1});
    var fns = [
      _.bind(collection.destroyAll, collection),
      _.bind(collection.fetch, collection)
    ];
    sequence(fns)
      .then(function() {
        collection.length.should.equal(0);
        done();
      }).otherwise(done);
  });

});