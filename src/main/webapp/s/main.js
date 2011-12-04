$(document).ready(function(){
    p9a.init();
});

var p9a = {
    map: null,
    mapElement: document.getElementById("map"),
    centerCoord: { x: 0, y: 0 },

    init: function() {
        // Initialize and display the map.
        var mapOpts = {
            mapTypeId: google.maps.MapTypeId.HYBRID,
            disableDefaultUI: true,
            zoom: 14,
            zoomControl: true
        };
        this.map = new google.maps.Map(this.mapElement, mapOpts);
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
                    // Oops! Move user to a particular location we choose.
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
        google.maps.event.addListener(this.map, 'center_changed', function() {
            var center = that.map.getCenter();
            that.setMapCenter(center.lat(), center.lng());
        });

        var thlevel = this;
        google.maps.event.addListener(this.map, 'zoom_changed', function() {
            var zoom = thlevel.map.getZoom();
            $.cookie("map_zoom_level", JSON.stringify(zoom));

        });


    },

    setMapCenter: function(lat, lng) {
        if (lat == this.centerCoord.x && lng == this.centerCoord.y) return;
        this.centerCoord.x = lat;
        this.centerCoord.y = lng;
        $.cookie("map_center", JSON.stringify(this.centerCoord));
        this.map.setCenter(new google.maps.LatLng(lat, lng));
    }


}





