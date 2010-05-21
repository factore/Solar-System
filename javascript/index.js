// interesting settings:
// radius_scale = 1/2440 (radius of mercury, smallest planet in solar system
// radius_scale = 1 / 5000000, distance_scale = 1/5 (this sets them the same scale, but planets are still too big on screen)
var time_scale = 1000; // microseconds / day
var distance_pixels = 5;
var distance_mkm = 1;
var distance_scale = distance_pixels / distance_mkm; // pixels / million km
var radius_pixels = 1;                              
var radius_km = 2440;
var radius_scale = radius_pixels / radius_km; // pixels / km (radius of mercury, smallest planet in solar system)
var show_orbits = false;

$().ready(function() {
	
	/* 
	To Do:
	* elliptical orbits
	* drop in some info about the planets, controlled by a rollover
	*/

	$("#time_scale").val(time_scale);
	$("#distance_pixels").val(distance_pixels);
	$("#distance_mkm").val(distance_mkm);
	$("#radius_pixels").val(radius_pixels);
	$("#radius_km").val(radius_km);
	$('#show_orbits').attr('checked', "");
	
	createSS();
	$("#settings").submit( function(event) {
		event.preventDefault();      
		ok = true;
		if (isNaN($("#time_scale").val()) || isNaN($("#distance_pixels").val()) || isNaN($("#distance_mkm").val()) || isNaN($("#radius_pixels").val()) || isNaN($("#radius_km").val()) ) {
			alert("Scaling numbers must be numerical.  I mean, come on.");
			ok = false;
		}            
		if ($("#distance_mkm").val() == 0 || $("#radius_km").val() == 0) {
			alert("No dividing by zero!  Are you trying to cause a black hole and kill us all?!?");
			ok = false;
		} 
		if (ok) {
			time_scale = Math.abs($("#time_scale").val());
			distance_scale = Math.abs($("#distance_pixels").val() / $("#distance_mkm").val());
			radius_scale = Math.abs($("#radius_pixels").val() / $("#radius_km").val());
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

	$("#presets input").click( function() {
		preset($(this).val());
	});
	
});

function createSS() {
	ss = new SolarSystem("solar_system",23000,1000, 695500);
	
	mercury = new Planet(ss, 2440, 58, 88, "#999999", false);
	animatePlanet("mercury");
	
	venus = new Planet(ss, 6052, 108, 225, "#dddddd", false);
	venus.go();
	animatePlanet("venus");

	earth = new Planet(ss, 6371, 150, 365, "#3c4355", false);
	earth.go();
	animatePlanet("earth");

	mars = new Planet(ss, 3396, 228, 687, "#fdaf5c", false);
	mars.go();
	animatePlanet("mars");
	
	asteroids = ss.canvas.circle(ss.sun_x, ss.sun_y, earth.distance_from_sun * 2.8);
	asteroids.attr({"stroke-width": earth.distance_from_sun,
		stroke: "#333333",
		opacity: .5
	});
	asteroids.attr();
	
	jupiter = new Planet(ss, 71492, 779, 4332, "120-#a68a75-#fee-#e9a274:50-#fee-#a68a75", false);
	jupiter.go();
	animatePlanet("jupiter");
	
	saturn = new Planet(ss, 60268, 1433, 10759, "90-#8e8c73-#dcbb78-#8e8c73", true);
	saturn.go();
	animatePlanet("saturn");
	
	uranus = new Planet(ss, 25559, 2877, 30799, "#ccf2f3", false);
	uranus.go();
	animatePlanet("uranus");
	
	neptune = new Planet(ss, 24764, 4503,  60190, "#6197f9", false);
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
function Planet(solar_system, radius, distance_from_sun, year_in_days, colour, has_rings) {
	this.radius = radius * radius_scale >= 1 ? radius * radius_scale : 1;
	this.distance_from_sun = distance_from_sun * distance_scale;
	this.year_in_days = year_in_days * time_scale;
	this.colour = colour;
	this.has_rings = has_rings;
	this.orbit = solar_system.canvas.path("M" + (solar_system.sun_x + this.distance_from_sun) + "," + solar_system.sun_y + "a" + this.distance_from_sun + "," + this.distance_from_sun + " 0 1,1 0,-1 z");
	this.body = solar_system.canvas.circle(solar_system.sun_x + this.distance_from_sun, solar_system.sun_y, this.radius).attr({fill: colour, stroke: "transparent"});
	if (this.has_rings) {
		this.rings = solar_system.canvas.ellipse(solar_system.sun_x + this.distance_from_sun, solar_system.sun_y, this.radius * 2, this.radius * .5 ).attr({fill: colour}).toBack();
	}
	this.show_orbit = function (show_orbit) {
		if (show_orbit) {
			this.orbit.attr("stroke", "white");
		} else {
			this.orbit.attr("stroke", "black");
		}
	}
	this.scale = function(scale) {
		this.body.scale(scale);
		if (this.has_rings) {
			this.rings.scale(scale);
		}
	}
	this.go = function() {
		this.body.animateAlong(this.orbit, this.year_in_days);
		if (this.has_rings) {
			this.rings.animateAlong(this.orbit, this.year_in_days);
		}
		//setTimeout(this.go(), year_in_days * 1000);
	}
}

function animatePlanet(planet) {
	eval(planet + ".go();");
	setTimeout("animatePlanet(\"" + planet + "\");", eval(planet + ".year_in_days"));
}

function preset(name) {
	sets = {
		first: [1000, 5, 1, 1, 2440],
		second: [1000, 1, 3, 1, 36000],
		third: [1000, 1, 5, 1, 5000000]
	}
	selected = sets[name];
	$("#time_scale").val(selected[0]);
	$("#distance_pixels").val(selected[1]);
	$("#distance_mkm").val(selected[2]);
	$("#radius_pixels").val(selected[3]);
	$("#radius_km").val(selected[4]);
	$("#settings").submit();
}