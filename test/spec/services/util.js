'use strict';

describe('Service: Util', function() {

  // ===============================================================================
  // MOCKS
  // ===============================================================================

  beforeEach(module('UserAdminApp'));

  var util, location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(Util, $location) {

    location = $location;
    util = Util;

  }));

  // ===============================================================================
  // TESTS
  // ===============================================================================

  it('Util should have a paginate function', function() {
    expect(util.paginate).toBeDefined();
  });

  it ('Pagination defaults should be set when no params are passed', function () {
    var p = util.paginate({ items: [1,2,3,4,5,6,7,8,9,10,11,12] });
    expect(p.max_items_per_page).toBe(10);
    expect(p.current_page).toBe(1);
    expect(p.num_pages).toBe(2);
    expect(p.limit).toBe(10);
    expect(p.offset).toBe(0);
    expect(p.first).toBe(null);
    expect(p.prev).toBe(null);
    expect(p.next).toBe(2);
    expect(p.last).toBe(2);
    expect(p.beginning_item).toBe(1);
    expect(p.last_item).toBe(10);
  });

  it ('Pagination should retrieve page number from location', function () {
    location.search('page', 2);
    var p = util.paginate({ items: [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0 ] });
    expect(p.max_items_per_page).toBe(10);
    expect(p.current_page).toBe(2);
    expect(p.num_pages).toBe(3);
    expect(p.limit).toBe(20);
    expect(p.offset).toBe(10);
    expect(p.first).toBe(1);
    expect(p.prev).toBe(1);
    expect(p.next).toBe(3);
    expect(p.last).toBe(3);
    expect(p.beginning_item).toBe(11);
    expect(p.last_item).toBe(20);
  });

  it ('Pagination should accept override params', function () {
    location.search('page', 4);
    var p = util.paginate({ max_items_per_page: 5, items: [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0 ] });
    expect(p.max_items_per_page).toBe(5);
    expect(p.current_page).toBe(4);
    expect(p.num_pages).toBe(6);
    expect(p.limit).toBe(20);
    expect(p.offset).toBe(15);
    expect(p.first).toBe(1);
    expect(p.prev).toBe(3);
    expect(p.next).toBe(5);
    expect(p.last).toBe(6);
    expect(p.beginning_item).toBe(16);
    expect(p.last_item).toBe(20);
  });

  it ('Pagination should reset location to last page if page number is too high', function () {
    location.search('page', 8);
    var p = util.paginate({ items: [1,2,3,4,5,6,7,8,9,10,11,12] });
    expect(location.search().page).toBe(2);
  });

  it ('Pagination page_numbers() should return array of page numbers', function () {
    var p = util.paginate({ items: [0,0,0,0,0,0,0,0,0,0,0,0] });
    expect(p.page_numbers().length).toBe(2);
    expect(p.page_numbers()).toEqual([1,2]);
    p = util.paginate({ items: [0,0,0,0,0,0,0,0,0,0,0,0], max_items_per_page: 2 });
    expect(p.page_numbers().length).toBe(6);
    expect(p.page_numbers()).toEqual([1,2,3,4,5,6]);
  });

});
