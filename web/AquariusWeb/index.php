<!DOCTYPE html>
<html>
<head>
	<!-- include bootstrap, jquery for easy div manipulation -->
	<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
	<link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
	<script src="node_modules/socket.io-client/socket.io.js"></script>
	<script>
		var socket = io.connect('http://192.168.7.2:3001');  //enter the IP of your beaglebone and port you are using in app.js

		socket.on('clear', function (data) { //append sensors to table
			$('#temps').html("");
			$('#temps').append("<thead><tr><th>Date</th><th>Temperature (celsius)</th></tr></thead>");
		});
		//update corresponding row with sensor value
		socket.on('temps', function (data) {
			var html = '<tr><td>' + data.date + '</td><td id="' + data.date + '">' + data.value + '</td></tr>';
			$('#temps').append(html);
		});

	</script>
</head>
<body>
<h1>DS18B20 Temps</h1>

<div class="container">
	<table class="table" id="temps">
		<thead>
		<tr>
			<th>Date</th>
			<th>Temperature (celsius)</th>
		</tr>
		</thead>
	</table>
</div>
</body>
</html>