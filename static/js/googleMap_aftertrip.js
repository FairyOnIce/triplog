


function display_map_on_page_aftertrip(points_aftertrip){
     var mapProp = {
          center : new google.maps.LatLng(27.902475, 86.776891),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.HYBRID
      };
     var map = new google.maps.Map(document.getElementById('map'), mapProp);

     //https://developers.google.com/maps/documentation/javascript/examples/polyline-simple
     var path = new google.maps.Polyline({
                        path: points_aftertrip,
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.5,
                        strokeWeight: 10});
     path.setMap(map);


     return(map)
}


<!-- https://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/ -->
function initialize_aftertrip(points_aftertrip) {
    // info window contents
    var map = display_map_on_page_aftertrip(points_aftertrip);
};

