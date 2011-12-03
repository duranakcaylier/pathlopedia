<html>
<head>
<title>Pathlopedia</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script
       type="text/javascript"
       src="http://maps.googleapis.com/maps/api/js?sensor=false&language=tr&region=TR">
</script>
<script
       type="text/javascript"
       src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js">
</script>
<script
       type="text/javascript"
       src="s/jquery.cookie.js">
</script>

<style type="text/css">
      html { height: 100%; }
      body { height: 100%; margin: 0; padding: 0; background: #000; }

</style>
</head>

<body>
<div id="map" style="width:100%; height:100%"></div>
<script>

/**
       * Map Mechanics
       */

      /**
       * Determine the current user location
       */
      var default_zoom_level = 14;
      var centerCoord = { x: 41.023362521843865, y: 28.9874267578125 }; /* Galata/İstanbul */
      var

      /* Whether browser has a location service or not
      if(navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        map.setCenter(initialLocation);
        centerCoord = { x: position.coords.latitude, y: position.coords.longitude };

        $.cookie("map_center", JSON.stringify(centerCoord));
        $.cookie("map_zoom_level", default_zoom_level);

        }, function() {
            handleNoGeolocation(browserSupportFlag);
           });

      } else {

        if($.cookies.get("map_center") && $.cookies.get("map_zoom_level")) {
            centerCoord = JSON.parse($.cookie("map_center"));
            default_zoom_level = $.cookies.get("map_zoom_level");
            initialLocation = new google.maps.LatLng(centerCoord.x,centerCoord.y);
            map.setCenter(initialLocation);
        } else {
             initialLocation = new google.maps.LatLng(centerCoord.x,centerCoord.y);
             map.setCenter(initialLocation);




        };

        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
      }

      function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
        alert("Geolocation service failed.");
        initialLocation = centerCoord;
        } else {
        alert("Your browser doesn't support geolocation. We've placed you in Turkey.");
        initialLocation = centerCoord;
        }
        map.setCenter(initialLocation);
      }


      var mapOpts = {
        center: new google.maps.LatLng(centerCoord.x, centerCoord.y),
        mapTypeId: google.maps.MapTypeId.HYBRID,
        disableDefaultUI: true,
        zoom: default_zoom_level,
        zoomControl: true
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOpts);




      google.maps.event.addListener(map, 'zoom_changed', function() {

        $.cookie("map_zoom_level", map.getZoom());

      });
</script>

</body>
</html>
