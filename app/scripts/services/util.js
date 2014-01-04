angular.module('UserAdminApp')

/*
 * Utilities
 */
.service('Util', function ($location) {


	/*
	 * Simple util function for getting an array of integers. Optionally pass in
	 * an offset value, and it will offset the values in the array.
	 */
	var range = function (i, offset) {
		var rng = _.range(i);
		if (arguments.length > 1 && _.isNumber(offset)) {
			rng = _.map(rng, function (val) {
				return val + offset;
			});
		}
		return rng;
	};



	return {

		/*
		 * Pagination function. Provide an object containing the max_items_per_page value
		 * and a current_page value, and an items array of things to paginate. It will
		 * calculate the pagination
		 */
		paginate: function (config) {

			var page_params = $location.search(),
				defaults = {
					max_items_per_page: 20,
					num_pages: 1,
					next: null,
					prev: null,
					current_page: 1,
					first: null,
					last: null,
					limit: 20,
					offset: 0,
					items: [],
					beginning_item: 1,
					last_item: 20,
					page_numbers: function () {
						return range (this.num_pages, 1);
					}
				};

			// Get page number from querystring. If it is not in the querystring, assume page 1
			if (_.has(page_params, 'page')) {
				defaults.current_page = parseInt(page_params.page, 20);
			} else {
				$location.search('page', 1);
			}

			var options = _.extend(defaults, config);
				options.num_pages = Math.ceil(options.items.length / options.max_items_per_page);
				options.limit	 = options.current_page * options.max_items_per_page;
				options.offset	= (options.current_page - 1) * options.max_items_per_page;
			if (options.num_pages > 1) {
				if (options.current_page < options.num_pages) {
					options.last = options.num_pages;
					options.next = options.current_page + 1;
				}
				if (options.current_page > 1) {
					options.prev  = options.current_page - 1;
					options.first = 1;
				}
			}

			// If the page number is too high for the current number of items, fallback to the last page with items
			var paged_items = options.items.slice(options.offset, (options.offset + options.max_items_per_page));
			if (paged_items.length === 0) {
				$location.search('page', options.num_pages);
			}

			// 11 - 20 of 63 -> (beginning_item) - (last_item) of (items.length)
			options.beginning_item = options.offset + 1;
			options.last_item = options.limit > options.items.length ? options.items.length : options.limit;

			return options;
		}
	};
});