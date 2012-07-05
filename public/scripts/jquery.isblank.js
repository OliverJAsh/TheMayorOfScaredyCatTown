define([
	"jquery"
], function ($) {
	$.fn.isBlank = function () {
		var result = true;
		
		this.each(function () {
			var context = this.getContext('2d'),
				imageData = context.getImageData(0, 0, this.offsetWidth, this.offsetHeight);
			
			for (var i = 0; i < imageData.data.length; i += 4) {
				if (imageData.data[i + 3] !== 0) {
					result = false;
				}
			}
		});
		
		return result;
	}
});