define([
	"jquery"
], function ($) {
	$.fn.toggleLoading = function () {
		var options = {
				height: 42,
				speed: 75
			};
		
		return this.each(function () {
			var $this = $(this),
				$contents = $this.children(),
				loading = $this.data('loading');
			
			if (!loading) {
				loading = $this.data('loading', {
					spinner: $(document.createElement('div'))
						.addClass('spinner')
						.insertBefore(this),
					interval: setInterval(function () {
						loading.spinner.css({
							'background-position': function (i, v) {
								return "0 " + (parseInt(v.split(" ")[1], 10) - options.height) + "px"
							}
						});
					}, options.speed)
				}).data('loading');
			} else {
				loading.spinner.remove();
				clearInterval(loading.interval);
				
				$this.removeData('loading');
			}
			
			return this;
		});
	}
});