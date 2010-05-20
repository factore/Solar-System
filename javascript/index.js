// interesting settings:
// radius_scale = 1/2440 (radius of mercury, smallest planet in solar system
// radius_scale = 1 / 5000000, distance_scale = 1/5 (this sets them the same scale, but planets are still too big on screen)
var time_scale = 1000; // microseconds / day
var radius_scale = 1 / 2440; // pixels / km (radius of mercury, smallest planet in solar system)
var distance_scale = 5 / 1 // pixels / million km
var show_orbits = false;

$().ready(function() {
	
	/* 
	To Do:
	* elliptical orbits
	* rings around saturn 
	* colours of jupiter and saturn
	* have the above settings controlled by ui    
	* drop in some info about the planets, controlled by a rollover
	* check the input types, to make sure they are numbers
	
	*/
	
	createSS();
	$("#settings").submit( function(event) {
		event.preventDefault();      
		ok = true;
		if (isNaN($("#time_scale").val()) || isNaN($("#distance_pixels").val()) || isNaN($("#distance_mkm").val()) || isNaN($("#radius_pixels").val()) || isNaN($("#radius_km").val()) ) {
			alert("Scaling numbers must be numerical.  I mean, come on.");
			ok = false;
		}    
		if (ok) {
			time_scale = $("#time_scale").val();
			distance_scale = $("#distance_pixels").val() / $("#distance_mkm").val();
			radius_scale = $("#radius_pixels").val() / $("#radius_km").val();
		}
		$("#solar_system").html("");
		$('#show_orbits').attr('checked', "");
		createSS();
	});                           
	                                                                                               
	$("#menu li").hover(function(){
		var planet = $(this).attr("id");
		if (!show_orbits) {
			eval(planet + ".show_orbit(true);"); 
		}
		eval(planet + ".scale(5);");
	}, function(){       
		var planet = $(this).attr("id");
		if (!show_orbits) {
			eval(planet + ".show_orbit(false);"); 
		}
		eval(planet + ".scale(1);");
	});
 // $("#mercury").hover(function(){mercury.show_orbit(true)}, function(){mercury.show_orbit(false)});
	
	$("#show_orbits").change( function() {
		if ($('#show_orbits').is(':checked')) { 
			show_orbits = true;
			mercury.show_orbit(true);
			venus.show_orbit(true);
			earth.show_orbit(true);
			mars.show_orbit(true);
			jupiter.show_orbit(true);
			saturn.show_orbit(true);
			uranus.show_orbit(true);
			neptune.show_orbit(true);
		} else {             
			show_orbits = false;
			mercury.show_orbit(false);
			venus.show_orbit(false);
			earth.show_orbit(false);
			mars.show_orbit(false);
			jupiter.show_orbit(false);
			saturn.show_orbit(false);
			uranus.show_orbit(false);
			neptune.show_orbit(false);
		}
  });
	
});

function createSS() {
	ss = new SolarSystem("solar_system",23000,1000, 695500);
	
	mercury = new Planet(ss, 2440, 58, 88, "#666666");
	animatePlanet("mercury");
	
	venus = new Planet(ss, 6052, 108, 225, "#eeeeee");
	venus.go();
	animatePlanet("venus");

	earth = new Planet(ss, 6371, 150, 365, "#0000ff");
	earth.go();
	animatePlanet("earth");

	mars = new Planet(ss, 3396, 228, 687, "#ff0000");
	mars.go();
	animatePlanet("mars");
	
	asteroids = ss.canvas.circle(ss.sun_x, ss.sun_y, earth.distance_from_sun * 2.8);
	asteroids.attr({"stroke-width": earth.distance_from_sun,
		stroke: "#333333",
		opacity: .5
	});
	asteroids.attr();
	
	jupiter = new Planet(ss, 71492, 779, 4332, "#eeeeee");
	jupiter.go();
	animatePlanet("jupiter");
	
	saturn = new Planet(ss, 60268, 1433, 10759, "#eeeeee");
	saturn.go();
	animatePlanet("saturn");
	
	uranus = new Planet(ss, 25559, 2877, 30799, "#ccf2f3");
	uranus.go();
	animatePlanet("uranus");
	
	neptune = new Planet(ss, 24764, 4503,  60190, "#6197f9");
	neptune.go();
	animatePlanet("neptune");
}

function SolarSystem(div, width, height, sun_radius) {
	this.canvas = Raphael(document.getElementById(div), width, height);
	this.sun_x = 0;
	this.sun_y = Math.round(height/2);
	this.sun_radius = sun_radius * radius_scale >= 1 ? sun_radius * radius_scale : 1;
	this.sun = this.canvas.circle(this.sun_x, this.sun_y, this.sun_radius).attr("fill", "#ff0");
}

// radius in km, distance_from_sun in millions of km, years in earth days
function Planet(solar_system, radius, distance_from_sun, year_in_days, colour) {
	this.radius = radius * radius_scale >= 1 ? radius * radius_scale : 1;
	this.distance_from_sun = distance_from_sun * distance_scale;
	this.year_in_days = year_in_days * time_scale;
	this.colour = colour;
	this.orbit = solar_system.canvas.path("M" + (solar_system.sun_x + this.distance_from_sun) + "," + solar_system.sun_y + "a" + this.distance_from_sun + "," + this.distance_from_sun + " 0 1,1 0,-1 z");
	this.body = solar_system.canvas.circle(solar_system.sun_x + this.distance_from_sun, solar_system.sun_y, this.radius).attr({fill: colour});
	this.show_orbit = function (show_orbit) {
		if (show_orbit) {
			this.orbit.attr("stroke", "white");
		} else {
			this.orbit.attr("stroke", "black");
		}
	}
	this.scale = function(scale) {
		this.body.scale(scale);
	}
	this.go = function() {
		this.body.animateAlong(this.orbit, this.year_in_days);
		//setTimeout(this.go(), year_in_days * 1000);
	}
}

function animatePlanet(planet) {
	eval(planet + ".go();");
	setTimeout("animatePlanet(\"" + planet + "\");", eval(planet + ".year_in_days"));
}