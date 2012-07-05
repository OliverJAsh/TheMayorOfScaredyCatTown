define([
	"jquery",
	"mustache",
	"jquery.isblank",
	"jquery.loading",
	"jquery.bindif"
], function ($, Mustache) {
	"use strict";

	var $viewport = $('#viewport'),
		$book = $('#book'),
		$pages = $('div', $book),
		$page,
		$signature,
		$hiddenPages = $pages.filter(':odd').not(':nth-child(2)'),
		displayLogs = 8,
		logTemplate = $('#log').html(),
		logbookTemplate = $('#logbook').html(),
		logbookPage = 0,
		
	getPageNumber = function () {
		return parseInt(window.location.hash.replace("#", ""), 10) || 0;
	},
	
	goto = function ($gotoPage) {
		var gotoPageNumber = $pages.index($gotoPage);

		if (getPageNumber() !== gotoPageNumber) {
			window.location.hash = $pages.index($gotoPage);
		} else {
			$book.trigger('pageChange');
		}
	},

	triggerPageChange = function () {
		$book.trigger('pageChange');
	},

	enablePageChange = function () {
		$(window).on('hashchange', triggerPageChange);
	},

	disablePageChange = function () {
		$(window).off('hashchange', triggerPageChange);
	},
	
	pageChange = function () {
		var $prevPage,
			pageNumber,
			prevPageNumber,
			turnPage;
		
		pageNumber = getPageNumber();
		
		if ($pages.eq(pageNumber).length) {
			if ($page) {
				// Store previous page
				$prevPage = $page;
				prevPageNumber = $prevPage.index();

				// Calculate if the page needs turning
				turnPage =	(pageNumber > prevPageNumber && prevPageNumber % 2 === 0) ||
							(pageNumber < prevPageNumber && pageNumber % 2 === 0);
			}
			
			$page = $pages.eq(pageNumber);

			if (turnPage) {
				var newPageZ = parseInt($prevPage.css('z-index'), 10) + 1;

				// Need to check for direction
				((parseInt($prevPage.css('z-index'), 10)) ? $page.next() : $page.prev()).css('z-index', newPageZ);
				$page.css('z-index', newPageZ + 1);

				// Animate!
				$book.addClass('flip');
				$page.addClass('flipIn');
				$prevPage.addClass('flipOut');
			}
			
			// Put the page in the viewport by calculting whether its on the left or right
			if (pageNumber % 2) {
				$book.removeClass('right');
			} else if (!$book.hasClass('right')) {
				$book.addClass('right');
			}
		}
	},
	
	fbLogin = function () {
		FB.login(function (response) {
			if (response.authResponse) {
				FB.api('/me', function (response) {
					// Prepare data for saving to the database
					var user = {
							first_name: response.first_name,
							fbid: response.id,
							gender: response.gender,
							last_name: response.last_name,
							name: response.name,
							username: response.username
						},
						template = $('#introduction').html();
					
					// The user might not share their location, so we have to check for it
					if (response.location.name) {
						user.location = response.location.name;
					}

					$page.next().html(Mustache.to_html(template, {
						name: ((user.gender === 'male') ? 'Mr' : 'Miss') + '. ' + user.last_name
					}));
					
					$book.data('user', user);
					
					$signature = $('canvas');
					
					$signature.context = $signature[0].getContext('2d');
					$signature.context.lineWidth = 4;
					$signature.context.lineCap = "round";
					
					$signature.context.beginPath();
					
					goto($page.next());
				});
			}
		}, {
			scope: 'email, user_location'
		});
	},

	share = function () {
		FB.ui({
			method: 'feed', 
			name: 'The Mayor of Scaredy Cat Town',
			link: 'http://themayorofscaredycattown.com/',
			picture: 'https://fbcdn-photos-a.akamaihd.net/photos-ak-snc1/v85006/31/209559529121071/app_1_209559529121071_9625.gif',
			description: "The most secretive London speakeasy bar. The Mayor of Scaredy Cat Town is a one of London's hidden gems."
		});
	},
	
	startSignature = function (event) {
		event = event.originalEvent;
		event = (event.touches) ? event.touches[0] : event;
		
		$signature.context.moveTo(event.pageX - $signature.offset().left, event.pageY - $signature.offset().top);
		
		$(document).bind('touchmove.scrolling', function (event) {
			event.preventDefault();
		});
		
		$(this).bind('touchmove.drawing mousemove.drawing', function (event) {
			event = event.originalEvent;
			event = (event.touches) ? event.touches[0] : event;
			
			$signature.context.lineTo(event.pageX - $signature.offset().left, event.pageY - $signature.offset().top);
			$signature.context.stroke();
		});
	},
	
	endSignature = function () {
		$(document).unbind('touchmove.scrolling');
		$(this).unbind('touchmove.drawing mousemove.drawing');
	},
	
	clearSignature = function () {
		$signature.context.clearRect(0, 0, $signature[0].width, $signature[0].height);
		$signature.context.beginPath();
	},
	
	signLogbook = function () {
		var user = $book.data('user');
		
		if ($signature.isBlank() === false) {
			user.signature = $signature[0].toDataURL('image/png');

			$.post('post', user, function (visits) {
				visits = $.parseJSON(visits);

				$page.next().html(Mustache.to_html(logTemplate, $.extend(user, visits, {
					his_her: (user.gender === "male") ? "His" : "Her",
					times: (visits.visit_count > 1) ? "s" : null
				})));
				
				goto($page.next());
			});
		} else {
			alert('You must sign before continuing.');
		}
	},
	
	viewLogbook = function () {
		$.get('get-logs', function (logs) {
			var logsWidth;

			logs = $.parseJSON(logs);

			$page.next().html(Mustache.to_html(logbookTemplate, { logs: logs }));

			logsWidth = $page.next().find('ul')[0].clientWidth;

			$page.next().find('li').width((logsWidth - (10 * 3)) / 4);
			
			goto($page.next());
		});
	},

	viewLog = function () {
		$.get('get-log', { fbid: $(this).data('fbid') }, function (log) {
			log = $.parseJSON(log);

			$page.prev().html(Mustache.to_html(logTemplate, $.extend(log, {
				his_her: (log.gender === "male") ? "His" : "Her",
				times: (log.visit_count > 1) ? "s" : null
			})));

			goto($page.prev());
		});
	},

	start = function () {
		setTimeout(function () {
			$book.toggleLoading();
			goto($pages.eq(1));
		}, 2000);
	},

	animationEnd = function () {
		// Re-enable page changing
		enablePageChange();

		// Clean-up
		$hiddenPages.removeClass('hidden');
		$book.removeClass('flip');
		$pages.removeClass('flipIn flipOut dummyText');
	},

	animationStart = function (event) {
		switch (event.target) {
			case !$viewport[0]:
				// While the pages are animating, disable page changing
				disablePageChange();
			break;
			case $pages[0]:
				// Hide pages when closing/opening book
				$hiddenPages.addClass('hidden');
			break;
		}

		// Add dummy text to empty pages so that nothing appears empty
		$pages.not(':first-child').filter(':empty').addClass('dummyText');
	},

	showLogs = function (direction) {
		if (direction === 'prev' && logbookPage !== 0) {
			logbookPage -= 1;
		} else if (direction === 'next' && logbookPage !== Math.floor($pages.find('li').length / 8)) {
			logbookPage += 1;
		}

		var $showLogs = $page.find('li').slice(logbookPage * displayLogs, (((logbookPage + 1)  * displayLogs)));

		if ($showLogs.length) {
			$page.find('li').hide();
			$showLogs.show();
		}
	};

	return {
		init: function () {
			// Event delegation
			$viewport
				.on('animationstart webkitAnimationStart', animationStart)
				.bindIf('animationend webkitAnimationEnd', animationEnd, function () {
					// Only bind if the book is being animated
					return $book.hasClass('flip');
				})
				.bindIf('animationend webkitAnimationEnd', start, function (event) {
					return getPageNumber() === 0;
				});
			
			$book.bindIf('pageChange', pageChange, function () {
				return $pages.eq(getPageNumber()).not(':empty').length || getPageNumber() === 0;
			})
			
			$pages.eq(1).delegate('#login', 'click', fbLogin);
			
			$pages.eq(2)
				.delegate('canvas', 'touchstart mousedown', startSignature)
				.delegate('canvas', 'touchend mouseup', endSignature)
				.delegate('.reset', 'click', clearSignature)
				.delegate('.next', 'click', signLogbook);
			
			$pages.eq(3)
				.delegate('.next', 'click', viewLogbook)
				.delegate('#post', 'click', share);

			$pages.eq(4)
				.delegate('li', 'click', viewLog)
				.delegate('.prev', 'click', function () {
					showLogs('prev');
				})
				.delegate('.next', 'click', function () {
					showLogs('next');
				});

			// Some final initialization
			$viewport.addClass('animated');

			$book.toggleLoading();
			
			// Stack the pages of the book like a real book
			$pages.css('z-index', function () {
				return Math.floor($pages.length / 2) - Math.ceil($(this).index() / 2);
			});

			enablePageChange();

			goto($pages[0]);
		}
	};
});