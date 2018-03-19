
function add_content_to_subsection(mytrip,pid){
    content = get_PID_info(mytrip,pid)
    document.getElementById("subsection_content").innerHTML = content
}


function get_PID_info(mytrip,i){
    text = "<h2>" + mytrip.placename[i] + "</h2>";
    text += "<h3>Day " + mytrip.Day[i].toString() +"</h3>";
    text += "\n<h4>Altitude: " + getAltString(mytrip.altitude[i]) +"</h4>" + mytrip.schedule[i]
    return(text)
}

function getAltString(meter){
    meter = Math.round(meter);
    feet = Math.round(meter * 3.28084);
    return meter.toString() + "m " + "(" + feet.toString()+"feet)";
}


function display_map_on_page(){
     var lukla = {lat: 27.695529, lng: 86.727778};
     var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 9,
          mapTypeId: google.maps.MapTypeId.HYBRID
      });
     map.setTilt(45);
     return(map)
}
<!-- https://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/ -->
function initialize(mytrip, mytrip_item) {
    // info window contents
    // N of rows in my trip
    Nitem = Object.keys(mytrip.placename).length
    var map = display_map_on_page();
    var bounds = new google.maps.LatLngBounds();


    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers & place each one on the map

    for( i = 0; i < Nitem; i++ ) {

        var position = new google.maps.LatLng(mytrip.lat[i], mytrip.lng[i]);
        bounds.extend(position);


        if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
            var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01,
                                                     bounds.getNorthEast().lng() + 0.01);
            bounds.extend(extendPoint1);

        }


        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: i.toString(),
            //label: mytrip.Day[i].toString()
        });


        // Allow each marker to have an info window
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                text = "<h2>" + mytrip.placename[i] + "</h2>";

                infoWindow.setContent(text);
                infoWindow.open(map, marker);
                map.setCenter(marker.getPosition());


                add_content_to_subsection(mytrip,i)

                // trace i starts from 0 in java script
                get_myChart(mytrip_item[ mytrip.PID[i+1] ]);

            }
        })(marker, i));

        if ( (Object.keys(mytrip_items)).length == 1){
            // There is only a single item if mytrip contains only a single day info:
            // description about the destination of the day
            // 0th element contains the starting point info, 1st element contains destination info
            add_content_to_subsection(mytrip,1)
            get_myChart(mytrip_item[  0 ]);
        }else{
           //  If mytrip contains all days..
            document.getElementById("subsection_content").innerHTML = "<h2>Click markers in google map to see the planned route of the day</h2>"
        }
        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);

    }

    llatlng = [];
    for (point_key in mytrip_items){
        point = mytrip_items[point_key];
        for (item_key in point["lat"]){
            llatlng.push({"lat":point["lat"][item_key],
                          "lng":point["lng"][item_key]});
        }

        //https://developers.google.com/maps/documentation/javascript/examples/polyline-simple
        var path = new google.maps.Polyline({
                        path: llatlng,
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.5,
                        strokeWeight: 10});
        path.setMap(map);
    }





    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(6);
        google.maps.event.removeListener(boundsListener);
    });
    google.maps.event.trigger(map, 'resize');

};



function get_myChart(mytrip){

    d = []
    var x = 0;
    for (key_alt in mytrip.altitude){
        if (mytrip.distance != undefined){
            x = mytrip.distance[key_alt];
        }else{
            x = key_alt
        }
        d.push({x: x,
                y:mytrip.altitude[key_alt]})
    }
    console.log(d)

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
        datasets: [{
            label: 'Altitude (m)',
            data: d
        }]},
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            },
            responsive:true,
            maintainAspectRatio: false
    }
});
return myChart
}
