function msearch ( postalCode ){
  var apiweather = "http://api.wunderground.com/api/ba5d75bcb981cb1f/conditions/q/" + postalCode + ".json?callback=?";
  $.getJSON( apiweather,
    function( data ) {
      weatherdata( data );
  });

  var apimeet = "https://api.meetup.com/2/open_events?key=5b1f19391b33131e2d5b447737572a48&sign=true&zip=" + postalCode + "&page=20&callback=?";
  $.getJSON( apimeet,
    function( data ) {
      meetdata( data );
  });
}

function nclear( thisNode ) {
  while( thisNode.firstChild ) {
    thisNode.removeChild( thisNode.firstChild );
  }
}

function weatherdata( data ){
	nclear(document.getElementById("weather"));
	var wObject = {
		tempF: data['current_observation']['temp_f'],
		tempC : data['current_observation']['temp_c'],
		weather : data['current_observation']['weather'],
		humidity : data['current_observation']['relative_humidity'],
		wind : data['current_observation']['wind_string'],
		icon :  data['current_observation']['icon_url'],
		uri: data['current_observation']['forecast_url'],
	}
	$("#weather").css({"border-width": "red", "border-style": "solid", "border-color": "#C80000", "border-radius": "10px"});
	$('#weather').append('<b>Current Weather</b>' +
		'<br/>' +
		'<img src="' + wObject['icon'] + '"/>' +
		wObject['tempF'] + "F | " + wObject['tempC'] + "C" +
		'<br/>' +
		wObject['weather'] + 
		'<br/>' +
		'Humidity: ' + wObject['humidity'] 
	);
}

function meetdata ( data ){
	map.clearMarkers();
	var results  = data['results'];
	if (results == undefined){
		alert("Invalid Postal code!");
	}
	
	for(var i=0; i < results.length; i++){
		var tobject = results[i];
		var dataevent = {
			description: tobject['description'],
			event_url: tobject['event_url'],
			name: tobject['name'],
			lat: tobject['group']['group_lat'],
			lng: tobject['group']['group_lon'],
		};
		
		var latLng = new google.maps.LatLng(dataevent['lat'], dataevent['lng']);
		pointer(latLng, map, tobject);

		if(i == 0){
			map.panTo(latLng);
		}
			}

}

google.maps.Map.prototype.markers = new Array();

google.maps.Map.prototype.pointer = function(marker) {
    this.markers[this.markers.length] = marker;
};

google.maps.Map.prototype.getMarkers = function() {
    return this.markers
};

google.maps.Map.prototype.clearMarkers = function() {
    for(var i=0; i<this.markers.length; i++){
        this.markers[i].setMap(null);
    }
    this.markers = new Array();
};

var markers = new Array();		
var map;
var myLatLang = new google.maps.LatLng(32.95705, -97.28171);
function initialize() {
	var mapOptions = {
		zoom: 13,
		center: myLatLang,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
	
	
}

function pointer(latLang, map, tobject){
	infowindow = new google.maps.InfoWindow({});
	var marker = new google.maps.Marker({
		position: latLang,
		title: tobject['name']
	});


	google.maps.event.addListener(marker, 'click', function(){
		infowindow.setContent(
			tobject['name'] + 
			"<br/>" +
			'<a href="' + tobject['event_url'] + '">' + "Event page" + '</a>' +
			tobject['description']
		
		);
		infowindow.open(map, marker);
		
	});
	marker.setMap(map);
}