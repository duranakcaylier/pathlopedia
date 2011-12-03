/**
       * Map Mechanics
       */

      /**
       * Determine the current user location
       */
      if(navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        map.setCenter(initialLocation);
        $.cookie("map_center", position.coords.latitude+'hebele'+position.coords.longitude);
        $.cookie("map_zoom_level", "14");

        }, function() {
            handleNoGeolocation(browserSupportFlag);
           });
      } else if (google.gears) {
        browserSupportFlag = true;
        var geo = google.gears.factory.create('beta.geolocation');
        geo.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
        map.setCenter(initialLocation);
        }, function() {
            handleNoGeoLocation(browserSupportFlag);
           });
      } else {
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
      }

      function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
        alert("Geolocation service failed.");
        initialLocation = newyork;
        } else {
        alert("Your browser doesn't support geolocation. We've placed you in Turkey.");
        initialLocation = centerCoord;
        }
        map.setCenter(initialLocation);
      }

      var centerCoord = { x: 41.023362521843865, y: 28.9874267578125 }; /* Galata/İstanbul */
      var mapOpts = {
        center: new google.maps.LatLng(centerCoord.x, centerCoord.y),
        mapTypeId: google.maps.MapTypeId.HYBRID,
        disableDefaultUI: true,
        zoom: 14,
        zoomControl: true
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOpts);




      google.maps.event.addListener(map, 'zoom_changed', function() {

        $.cookie("map_zoom_level", map.getZoom());

      });