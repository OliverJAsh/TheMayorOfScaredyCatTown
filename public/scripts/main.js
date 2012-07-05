require({
	paths: {
		"jquery": "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min",
		"facebook": "http://connect.facebook.net/en_US/all"
	}
},
[
	"modernizr",
	"application",
	"facebook"
], function (Modernizr, Application) {
	if (!Modernizr.canvas || !Modernizr.cssanimations || !Modernizr.csstransforms3d) {
		alert('The browser you are using does not support the latest technology required by this application. You can continue to use it but there will be noticeable defects.');
	}

	Application.init();

	FB.init({
		appId: '209559529121071', // 
		oauth: true
	});
});