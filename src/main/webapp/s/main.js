$(document).ready(function(){
    p9a.init();
    p9a.checkUserCookies();

});
var g = google.maps;
var polyLine;
var tmpPolyLine;
var markers = [];
var vmarkers = [];
var p9a = {
    map: null,
    mapElement: document.getElementById("map"),
    centerCoord: { x: 0, y: 0 },


    init: function() {
        // Initialize and display the map.
        var mapOpts = {
            mapTypeId: g.MapTypeId.HYBRID,
            disableDefaultUI: true,
            zoom: 14,
            zoomControl: true
        };

        this.map = new g.Map(this.mapElement, mapOpts);
        // Set last zoom level stored in cookies, if there is any.
        var centerCoordStr = $.cookie("map_center");
        var zoomLevelStr = $.cookie("map_zoom_level");
        if (zoomLevelStr != null) {
            var newZoomLevel = JSON.parse(zoomLevelStr);
            this.map.setZoom(newZoomLevel);
        } else {
            this.map.setZoom(14);
        }
        // Try to get current user location via Geolocation API.
        if (navigator.geolocation) {
            var that = this;
            navigator.geolocation.getCurrentPosition(
                function(pos) {
                    that.setMapCenter(pos.coords.latitude, pos.coords.longitude);
                },
                function() {

                    // Move user to her last location stored in cookies, if there is any.
                    if (centerCoordStr != null) {
                        var newCenterCoord = JSON.parse(centerCoordStr);
                        that.setMapCenter(newCenterCoord.x, newCenterCoord.y);
                    } else {
                    // Move user to a particular location we choose.
                    that.setMapCenter(41.023362521843865, 28.9874267578125); /* Galata/İstanbul */
                    }

                }
            );
        } else {
            //If browser doesn't support navigation.

            // Move user to her last location stored in cookies, if there is any.
            if (centerCoordStr != null) {
                var newCenterCoord = JSON.parse(centerCoordStr);
                this.setMapCenter(newCenterCoord.x, newCenterCoord.y);
            } else {
            // Oops! Move user to a particular location we choose.
            this.setMapCenter(41.023362521843865, 28.9874267578125); /* Galata/İstanbul */
            }

        }
        // Track map position and level changes.
        var that = this;
        g.event.addListener(this.map, 'center_changed', function() {
            var center = that.map.getCenter();
            that.setMapCenter(center.lat(), center.lng());
        });

        var thlevel = this;
        g.event.addListener(this.map, 'zoom_changed', function() {
            var zoom = thlevel.map.getZoom();
            $.cookie("map_zoom_level", JSON.stringify(zoom));

        });

        $('#signup_button').click(function() {
            var username = $('#signup_username').val();
            var email =  $('#signup_email').val();
            p9a.userAdd(username,email);
            return false;
        });

        $('#signin_button').click(function() {
            var email = $('#signin_email').val();
            p9a.userLogin(email);
            return false;
        });
        $('#logout_button').click(function() {
            p9a.userLogout();
            return false;
        });

        $('#hand_b').click(function() {
            p9a.stopEditing();
            return false;
        });

        $('#placemark_b').click(function() {
            p9a.placeMarker();
            return false;
        });

        $('#line_b').click(function() {
            p9a.startLine();
            return false;
        });




    },

    setMapCenter: function(lat, lng) {
        if (lat == this.centerCoord.x && lng == this.centerCoord.y) return;
        this.centerCoord.x = lat;
        this.centerCoord.y = lng;
        $.cookie("map_center", JSON.stringify(this.centerCoord));
        this.map.setCenter(new g.LatLng(lat, lng));
    },

    checkUserCookies: function(){
        var userId = JSON.parse($.cookie("user_id"));
        var userEmail = JSON.parse($.cookie("user_email"));
        var userName = JSON.parse($.cookie("user_name"));
        if (userId != null) {
            $("#user_name").html("Hello "+userName);
            $("#nav").css('display', 'none');
            $("#user_info").css('display', 'block');
        }  else if (userEmail != null){
            $("#signin_email").val(userEmail);
            $("#nav").css('display', 'block');
            $("#user_info").css('display', 'none');

        }
    },

    userAdd: function(user_name,e_mail){
        $.post("/f/user/add", { name: user_name, email: e_mail },
            function(result){
                //if the result is 1
                if(result.status != 0){
                    $("#error_signup").css('display', 'block');
                    $("#error_signup").html(result.message);

                } else {
                    $.cookie("user_id", JSON.stringify(result.data.id));
                    $.cookie("user_email", JSON.stringify(e_mail));
                    $.cookie("user_name", JSON.stringify(user_name));
                    p9a.checkUserCookies();

                }
        });

    },

    userLogin: function(e_mail){
        $.post("/f/user/login", { email: e_mail },
            function(result){
                //if the result is 1
                if(result.status != 0){
                    $("#error_signin").css('display', 'block');
                    $("#error_signin").html(result.message);

                } else {
                    $.cookie("user_id", JSON.stringify(result.data.id));
                    $.cookie("user_email", JSON.stringify(e_mail));
                    $.cookie("user_name", JSON.stringify(result.data.name));
                    p9a.checkUserCookies();

                }
        });

    },

    userLogout: function(){
        $.get("/f/user/logout",
            function(result){
                //if the result is 0
                if(result.status == 0){
                    $.cookie('user_id', '', { expires: -1 });
                    $.cookie('user_name', '', { expires: -1 });

                    p9a.checkUserCookies();
                }
        });

    },
    //Toolbar functions start here.
    select: function(buttonId) {
          document.getElementById("hand_b").className="unselected";
          document.getElementById("line_b").className="unselected";
          document.getElementById("placemark_b").className="unselected";
          document.getElementById(buttonId).className="selected";
    },

    stopEditing: function() {
          p9a.select("hand_b");
    },

    placeMarker: function() {
          p9a.select("placemark_b");
          var pm = this;
          var listener = g.event.addListener(this.map, 'click', function(event) {

            if (event.latLng) {

              p9a.select("hand_b");
              var latlng = event.latLng;

              g.event.removeListener(listener);

              var markersingle = new g.Marker({map:pm.map, position:latlng, draggable:true, title:"First Marker!", animation: g.Animation.DROP});
            }
          });
    },

    startLine: function() {
           p9a.select("line_b");
           markers = [];
		   vmarkers = [];
		   p9a.initPolyline();
		   var sl=this;
		   g.event.addListener(this.map, 'click', function(event) {

		        if (event.latLng) {
					var marker = p9a.createMarker(event.latLng);
					markers.push(marker);
					if (markers.length != 1) {
						var vmarker = p9a.createVMarker(event.latLng);
						vmarkers.push(vmarker);
						vmarker = null;
					}
					var path = polyLine.getPath();
					path.push(event.latLng);
					marker = null;
				}
				event = null;


		   });


    },
    createMarker: function(point) {
				var imageNormal = new g.MarkerImage(
					"s/images/square.png",
					new g.Size(11, 11),
					new g.Point(0, 0),
					new g.Point(6, 6)
				);
				var imageHover = new g.MarkerImage(
					"s/images/square_over.png",
					new g.Size(11, 11),
					new g.Point(0, 0),
					new g.Point(6, 6)
				);
				var marker = new g.Marker({
					position: point,
					map: this.map,
					icon: imageNormal,
					draggable: true
				});
				g.event.addListener(marker, "mouseover", function() {
					marker.setIcon(imageHover);
				});
				g.event.addListener(marker, "mouseout", function() {
					marker.setIcon(imageNormal);
				});
				g.event.addListener(marker, "drag", function() {
					for (var m = 0; m < markers.length; m++) {
						if (markers[m] == marker) {
							polyLine.getPath().setAt(m, marker.getPosition());
							p9a.moveVMarker(m);
							break;
						}
					}
					m = null;
				});
				g.event.addListener(marker, "click", function() {
					for (var m = 0; m < markers.length; m++) {
						if (markers[m] == marker) {
							marker.setMap(null);
							markers.splice(m, 1);
							polyLine.getPath().removeAt(m);
							p9a.removeVMarkers(m);
							break;
						}
					}
					m = null;
				});
				return marker;
	},

	createVMarker: function(point) {
				var prevpoint = markers[markers.length-2].getPosition();
				var imageNormal = new g.MarkerImage(
					"s/images/square_transparent.png",
					new g.Size(11, 11),
					new g.Point(0, 0),
					new g.Point(6, 6)
				);
				var imageHover = new g.MarkerImage(
					"s/images/square_transparent_over.png",
					new g.Size(11, 11),
					new g.Point(0, 0),
					new g.Point(6, 6)
				);
				var marker = new g.Marker({
					position: new g.LatLng(
						point.lat() - (0.5 * (point.lat() - prevpoint.lat())),
						point.lng() - (0.5 * (point.lng() - prevpoint.lng()))
					),
					map: this.map,
					icon: imageNormal,
					draggable: true
				});
				g.event.addListener(marker, "mouseover", function() {
					marker.setIcon(imageHover);
				});
				g.event.addListener(marker, "mouseout", function() {
					marker.setIcon(imageNormal);
				});
				g.event.addListener(marker, "dragstart", function() {
					for (var m = 0; m < vmarkers.length; m++) {
						if (vmarkers[m] == marker) {
							var tmpPath = tmpPolyLine.getPath();
							tmpPath.push(markers[m].getPosition());
							tmpPath.push(vmarkers[m].getPosition());
							tmpPath.push(markers[m+1].getPosition());
							break;
						}
					}
					m = null;
				});
				g.event.addListener(marker, "drag", function() {
					for (var m = 0; m < vmarkers.length; m++) {
						if (vmarkers[m] == marker) {
							tmpPolyLine.getPath().setAt(1, marker.getPosition());
							break;
						}
					}
					m = null;
				});
				g.event.addListener(marker, "dragend", function() {
					for (var m = 0; m < vmarkers.length; m++) {
						if (vmarkers[m] == marker) {
							var newpos = marker.getPosition();
							var startMarkerPos = markers[m].getPosition();
							var firstVPos = new g.LatLng(
								newpos.lat() - (0.5 * (newpos.lat() - startMarkerPos.lat())),
								newpos.lng() - (0.5 * (newpos.lng() - startMarkerPos.lng()))
							);
							var endMarkerPos = markers[m+1].getPosition();
							var secondVPos = new g.LatLng(
								newpos.lat() - (0.5 * (newpos.lat() - endMarkerPos.lat())),
								newpos.lng() - (0.5 * (newpos.lng() - endMarkerPos.lng()))
							);
							var newVMarker = p9a.createVMarker(secondVPos);
							newVMarker.setPosition(secondVPos);//apply the correct position to the vmarker
							var newMarker = p9a.createMarker(newpos);
							markers.splice(m+1, 0, newMarker);
							polyLine.getPath().insertAt(m+1, newpos);
							marker.setPosition(firstVPos);
							vmarkers.splice(m+1, 0, newVMarker);
							tmpPolyLine.getPath().removeAt(2);
							tmpPolyLine.getPath().removeAt(1);
							tmpPolyLine.getPath().removeAt(0);
							newpos = null;
							startMarkerPos = null;
							firstVPos = null;
							endMarkerPos = null;
							secondVPos = null;
							newVMarker = null;
							newMarker = null;
							break;
						}
					}
				});
				return marker;
	},

	moveVMarker: function(index) {
				var newpos = markers[index].getPosition();
				if (index != 0) {
					var prevpos = markers[index-1].getPosition();
					vmarkers[index-1].setPosition(new g.LatLng(
						newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
						newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
					));
					prevpos = null;
				}
				if (index != markers.length - 1) {
					var nextpos = markers[index+1].getPosition();
					vmarkers[index].setPosition(new g.LatLng(
						newpos.lat() - (0.5 * (newpos.lat() - nextpos.lat())),
						newpos.lng() - (0.5 * (newpos.lng() - nextpos.lng()))
					));
					nextpos = null;
				}
				newpos = null;
				index = null;
	},

	removeVMarkers: function(index) {
				if (markers.length > 0) {//clicked marker has already been deleted
					if (index != markers.length) {
						vmarkers[index].setMap(null);
						vmarkers.splice(index, 1);
					} else {
						vmarkers[index-1].setMap(null);
						vmarkers.splice(index-1, 1);
					}
				}
				if (index != 0 && index != markers.length) {
					var prevpos = markers[index-1].getPosition();
					var newpos = markers[index].getPosition();
					vmarkers[index-1].setPosition(new g.LatLng(
						newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
						newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
					));
					prevpos = null;
					newpos = null;
				}
				index = null;
	},
    initPolyline: function() {
				var polyOptions = {
					strokeColor: "#3355FF",
					strokeOpacity: 0.8,
					strokeWeight: 4
				};
				var tmpPolyOptions = {
					strokeColor: "#3355FF",
					strokeOpacity: 0.4,
					strokeWeight: 4
				};
				polyLine = new g.Polyline(polyOptions);
				polyLine.setMap(this.map);
				tmpPolyLine = new g.Polyline(tmpPolyOptions);
				tmpPolyLine.setMap(this.map);
	}








}





