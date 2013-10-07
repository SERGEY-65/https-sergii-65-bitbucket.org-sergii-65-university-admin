'use strict';

describe('Filter: limit', function() {

  // ===============================================================================
  // MOCKS
  // ===============================================================================

  beforeEach(module('UserAdminApp'));

  var limit;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($filter) {

    limit = $filter('limit');


  }));

  // ===============================================================================
  // TESTS
  // ===============================================================================

  it ('limit $filter should be defined', function() {
    expect(limit).toBeDefined();
  });

  it ('should slice the passed in array against the limit/offset provided', function () {
    var ray = [0,0,0,2,2,2,5,5,5];
    var cut = limit(ray, 0, 3);
    expect(cut.length).toBe(3);
    expect(cut).toEqual([0,0,0]);

    cut = limit(ray, 3, 7);
    expect(cut.length).toBe(4);
    expect(cut).toEqual([2,2,2,5]);

    cut = limit(ray, 12, 15);
    expect(cut.length).toBe(0);
    expect(cut).toEqual([]);

    cut = limit(ray, 8);
    expect(cut.length).toBe(1);
    expect(cut).toEqual([5]);

    cut = limit(ray);
    expect(cut.length).toBe(9)
    expect(cut).toEqual(ray);

    cut = limit(undefined);
    expect(cut.length).toBe(0);
    expect(cut).toEqual([])

  });

});