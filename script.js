function msToTime (ms) {
	var date = new Date(ms * 1000);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var stamp = "";
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (hours < 12) {
		stamp = " am";
	} else if (hours == 12) {
		stamp = " am";
	} else {
		hours -= 12;
		stamp = " pm";
	}
	return hours + ":" + minutes + stamp
}

function getIcon(icon) {
	var icons = {
		"01d": "wi-day-sunny",
		"01n": "wi-night-clear",
		"02d": "wi-day-sunny-overcast",
		"02n": "wi-night-partly-cloudy",
		"03d": "wi-day-cloudy",
		"03n": "wi-night-cloudy",
		"04d": "wi-day-cloudy-high",
		"04n": "wi-night-cloudy-high",
		"09d": "wi-day-showers",
		"09n": "wi-night-showers",
		"10d": "wi-day-rain",
		"10n": "wi-night-rain",
		"11d": "wi-thunderstorm",
		"11n": "wi-night-thunderstorm",
		"13d": "wi-day-snow",
		"13n": "wi-night-snow",
		"50d": "wi-day-haze",
		"50n": "wi-night-fog"
	}

	return icons[icon]
}

function createURL(str, pos) {

	// API key: 44ac8c4a984af06a1d177d3ab7361359

	url = 'http://api.openweathermap.org/data/2.5/';
	url += str;
	url += '?lat=';
	url += pos.coords.latitude;
	url += '&lon=';
	url += pos.coords.longitude;
	url += '&APPID=44ac8c4a984af06a1d177d3ab7361359';

	return url
}

function k2F(kalvin) {
	return Math.round(kalvin * 9 / 5 - 459.67)
}

function parseWeather(data) {

	var place = data.name.toLowerCase();
	var conditions = data.weather[0].description;

	var iconKey = data.weather[0].icon;
	icon = getIcon(iconKey);

	var tempK = data.main.temp;
	var tempF = k2F(tempK)

	var sunrise = data.sys.sunrise;
	var sunset = data.sys.sunset;
	sunrise = msToTime(sunrise);
	sunset = msToTime(sunset);

	$('#location').html("<h3>current weather in " + place + "</h3>");
	$('#conditions').html("<h3>" + conditions + "</h3>");
	$('#icon').html("<h1><i class='wi " + icon + "'></i></h1>");
	$('#temp').html("<h1>" + tempF + "&deg; <span id='converter'>f</span></h1>");
	$('#sun').html("<h3><p>sunrise " + sunrise + "</p><p>sunset " + sunset + "</p></h3>")

	// TODO: build F/C converter
	$('#converter').on('click', function(){
		console.log('clicked')
	})

}

function parseForecast(data) {

	var forecast = [{
		'time': msToTime(data.list[0].dt),
		'weather': data.list[0].weather[0].description,
		'icon': getIcon(data.list[0].weather[0].icon),
		'temp': k2F(data.list[0].main.temp)
	},
	{
		'time': msToTime(data.list[1].dt),
		'weather': data.list[1].weather[0].description,
		'icon': getIcon(data.list[1].weather[0].icon),
		'temp': k2F(data.list[1].main.temp)
	},
	{
		'time': msToTime(data.list[2].dt),
		'weather': data.list[2].weather[0].description,
		'icon': getIcon(data.list[2].weather[0].icon),
		'temp': k2F(data.list[2].main.temp)
	},
	{
		'time': msToTime(data.list[3].dt),
		'weather': data.list[3].weather[0].description,
		'icon': getIcon(data.list[3].weather[0].icon),
		'temp': k2F(data.list[3].main.temp)
	},
	{
		'time': msToTime(data.list[4].dt),
		'weather': data.list[4].weather[0].description,
		'icon': getIcon(data.list[4].weather[0].icon),
		'temp': k2F(data.list[4].main.temp)
	}]

	var output = ''

	for ( i = 0; i < forecast.length; i++ ) {
		output += '<p>';
		output += forecast[i].time;
		output += ': ';
		output += "<i class='wi " + forecast[i].icon + "'></i>";
		output += ' ';
		output += forecast[i].weather;
		output += ' ';
		output += forecast[i].temp + '&deg; F';
		output += '</p>'
	}

	$('#forecast').html(output);

}

$(document).ready(function(){

	if ('geolocation' in navigator) {
	} else {
		alert("Geolocation not in navigator (use a modern browser).")
	};



	function success(pos) {

		weatherURL = createURL("weather", pos)
		forecastURL = createURL("forecast", pos)

		$.getJSON(weatherURL, function(data) {
			parseWeather(data);
		});

		$.getJSON(forecastURL, function(data) {
			parseForecast(data);
		})

	}

	function error(err) {
		console.log('ERROR (' + err.code + '): ' + err.message);
		$('#location').html("Geolocation is not supported by this browser. (Check your browswer and system settings, they could be disabled.)")
	}

	navigator.geolocation.getCurrentPosition(success, error);
});


