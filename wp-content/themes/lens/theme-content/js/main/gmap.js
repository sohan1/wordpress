/* --- GMAP Init --- */

function gmapInit() {
	if ($('#gmap').length) {

		var gmap_link, gmap_variables, gmap_zoom, gmap_style;
		gmap_link = $('#gmap').data('url');
		gmap_style = typeof $('#gmap').data('customstyle') !== "undefined" ? "style1" : google.maps.MapTypeId.ROADMAP;

		// Overwrite Math.log to accept a second optional parameter as base for logarhitm
		Math.log = (function() {
			var log = Math.log;
			return function(n, base) {
				return log(n)/(base ? log(base) : 1);
			};
		})();

		function get_url_parameter(needed_param, gmap_url) {
			var sURLVariables = (gmap_url.split('?'))[1];
			if (typeof sURLVariables === "undefined") {
				return sURLVariables;
			}
			sURLVariables = sURLVariables.split('&');
			for (var i = 0; i < sURLVariables.length; i++)  {
				var sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] == needed_param) {
					return sParameterName[1];
				}
			}
		}

		var gmap_coordinates = [],
			gmap_zoom;

		if (gmap_link) {
			//Parse the URL and load variables (ll = latitude/longitude; z = zoom)
			var gmap_variables = get_url_parameter('ll', gmap_link);
			if (typeof gmap_variables === "undefined") {
				gmap_variables = get_url_parameter('sll', gmap_link);
			}
			// if gmap_variables is still undefined that means the url was pasted from the new version of google maps
			if (typeof gmap_variables === "undefined") {

				if(gmap_link.split('!3d') != gmap_link){
					//new google maps old link type

					var split, lt, ln, dist, z;
					split = gmap_link.split('!3d');
					lt = split[1];
					split = split[0].split('!2d');
					ln = split[1];
					split = split[0].split('!1d');
					dist = split[1];
					gmap_zoom = 21 - Math.round(Math.log(Math.round(dist/218), 2));
					gmap_coordinates = [lt, ln];

				} else {
					//new google maps new link type

					var gmap_link_l;

					gmap_link_l = gmap_link.split('@')[1];
					gmap_link_l = gmap_link_l.split('z/')[0];

					gmap_link_l = gmap_link_l.split(',');

					var latitude = gmap_link_l[0];
					var longitude = gmap_link_l[1];
					var zoom = gmap_link_l[2];

					if(zoom.indexOf('z') >= 0)
						zoom = zoom.substring(0, zoom.length-1);

					gmap_coordinates[0] = latitude;
					gmap_coordinates[1] = longitude;
					gmap_zoom = zoom;
				}



			} else {
				gmap_zoom = get_url_parameter('z', gmap_link);
				if (typeof gmap_zoom === "undefined") {
					gmap_zoom = 10;
				}
				gmap_coordinates = gmap_variables.split(',');
			}
		}

		$("#gmap").gmap3({
			map:{
				options:{
					center: new google.maps.LatLng(gmap_coordinates[0], gmap_coordinates[1]),
					zoom: parseInt(gmap_zoom),
					mapTypeId: gmap_style,
					mapTypeControlOptions: {mapTypeIds: []},
					scrollwheel: false
				}
			},
			overlay:{
				latLng: new google.maps.LatLng(gmap_coordinates[0], gmap_coordinates[1]),
				options:{
					content:  '<div class="pin_ring pin_ring--outer">' +
						'<div class="pin_ring pin_ring--inner"></div>' +
						'</div>'
				}
			},
			styledmaptype:{
				id: "style1",
				options:{
					name: "Style 1"
				},
				styles: [
					{
						stylers: [
							{ saturation: -100 }
						]
					}
				]
			}
		});
	}
}
