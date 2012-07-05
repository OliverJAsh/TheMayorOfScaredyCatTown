<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, width=device-width, user-scalable=no">
		<title>The Mayor of Scaredy Cat Town</title>
		<script data-main="scripts/main" src="scripts/require.js"></script>
		<link rel="stylesheet" href="css/main.css">
		<link rel="apple-touch-icon-precomposed" href="images/apple-touch-icon-precomposed.png">
		<link rel="apple-touch-icon-precomposed" sizes="57x57" href="images/apple-touch-icon-57x57-precomposed.png">
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="images/apple-touch-icon-72x72-precomposed.png">
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="images/apple-touch-icon-114x114-precomposed.png">
	</head>
	<body>
		<header>
			<h1>The Mayor of Scaredy Cat Town</h1>
		</header>
		<div id="viewport" class="fadeInDown">
			<div id="book" class="right">
				<div data-page="0"></div>
				<div data-page="1">
					<p>Congratulations, you found The Mayor of Scaredy Cat Town. The Mayor has personally invited you to sign your name into his sacred book of acquaintances. Don't be a scaredy cat&hellip;</p>
					<hr>
					<button id="login">Sign Logbook with Facebook</button>
				</div>
				<div data-page="2"></div>
				<div data-page="3"></div>
				<div data-page="4"></div>
			</div>
		</div>
		
		<!-- Facebook container for loading JS asynchronously -->
		<div id="fb-root"></div>
		
		<!-- Templates -->
		<script id="introduction" type="text/x-mustache-template">
			<p>Good day, {{name}}. You are required to sign in the box below to complete your logbook entry.</p>
			<canvas width="251" height="85"></canvas>
			<button class="reset">Reset</button>
			<button class="next">Next</button>
		</script>
		<script id="log" type="text/x-mustache-template">
			<header>
				<img src="http://graph.facebook.com/{{fbid}}/picture" id="picture" alt="">
				<h1>{{name}}</h1>
				{{#username}}<h2>{{username}}</h2>{{/username}}
				{{#location}}<span>from {{location}}</span>{{/location}}
			</header>
			<p>{{first_name}} has visited here {{visit_count}} time{{times}}. {{his_her}} last visit was on {{last_visit}}.</p>
			<img src="{{signature}}" alt="">
			<button class="next">View Logbook</button>
			<button id="post">Tell your friends</button>
		</script>
		<script id="logbook" type="text/x-mustache-template">
			<ul>
				{{#logs}}
				<li data-fbid="{{fbid}}">
					<a>
						<img src="http://graph.facebook.com/{{fbid}}/picture" alt="">
						<h1>{{initials}}</h1>
					</a>
				</li>
				{{/logs}}
			</ul>
			<button class="prev">Previous</button>
			<button class="next">Next</button>
		</script>
	</body>
</html>