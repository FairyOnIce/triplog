


function display_map_on_page_aftertrip(){
     var mapProp = {
          center : new google.maps.LatLng(27.981109, 86.828985),
          zoom: 9,
          mapTypeId: google.maps.MapTypeId.HYBRID
      };
     var map = new google.maps.Map(document.getElementById('map'), mapProp);
     <!--map.setTilt(45);-->
     return(map)
}


<!-- https://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/ -->
function initialize_aftertrip() {
    // info window contents
    var map = display_map_on_page_aftertrip();
};

