


function display_map_on_page_aftertrip(points_aftertrip){

     var strokeColors = ['#FF0000','#0000FF','#00FF00']

     var mapProp = {
          center : new google.maps.LatLng(27.840475, 86.726891),
          zoom: 11.12,
          mapTypeId: google.maps.MapTypeId.HYBRID
      };
     var map = new google.maps.Map(document.getElementById('map'), mapProp);
     //https://developers.google.com/maps/documentation/javascript/examples/polyline-simple
     var infoWindow = new google.maps.InfoWindow(), marker, i;
     var i;
     var Day = 1;
     var pointsDay = []

     marker = new google.maps.Marker({
                position: points_aftertrip[0],
                map: map
     });

     // Allow each marker to have an info window
     google.maps.event.addListener(marker, 'click', (function(marker,i) {
         return function() {
             text = summary_of_the_day(points_aftertrip[0]);
             infoWindow.setContent(text);
             infoWindow.open(map, marker);
             map.setCenter(marker.getPosition());
             }
         })(marker, i));

     for (i = 0; i < points_aftertrip.length ;i++){

        if (Day == points_aftertrip[i]["Day"]){
            pointsDay.push(points_aftertrip[i])
        }else{
            var path = new google.maps.Polyline({
                        path: pointsDay,
                        geodesic: true,
                        strokeColor: strokeColors[Day % 3],
                        strokeOpacity: 0.5,
                        strokeWeight: 10});
            path.setMap(map);
            Day = points_aftertrip[i]["Day"]
            pointsDay = []
            marker = new google.maps.Marker({
                position: points_aftertrip[i],
                map: map
            });

            // Allow each marker to have an info window
            google.maps.event.addListener(marker, 'click', (function(marker,i) {
                return function() {
                    text = summary_of_the_day(points_aftertrip[i]);
                    infoWindow.setContent(text);
                    infoWindow.open(map, marker);
                    map.setCenter(marker.getPosition());
                }
            })(marker, i));



        }
     }



     return(map)
}


function summary_of_the_day(pt){
    text = "<h3> Day " +  pt["Day"] + "</h3> <h4>" + pt["date"] + " </h4>";
    text += "<ul>"
    text += "<li>Altitude: " + m2feet(pt["alt"]) + "</li>";
    text += "<li>Total ascent: " + m2feet(pt["gain"])+ "</li>";
    text += "<li>Total decent: " + m2feet(pt["loss"])+ "</li>";
    text += "</ul>"
    return(text)
}

function m2feet(p){
    return(Math.round(p) + " m (" + Math.round(3.28084*p) + " feet)");
}
<!-- https://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/ -->
function initialize_aftertrip(points_aftertrip) {
    // info window contents
    var map = display_map_on_page_aftertrip(points_aftertrip);
};

