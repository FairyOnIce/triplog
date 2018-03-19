
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
                map.setZoom(10);

                add_content_to_subsection(mytrip,i)

                // trace
                data = get_trace(mytrip_item[ mytrip.PID[i] ]);
                Plotly.newPlot('plot_trace', data["trace"],data["layout"]);

            }
        })(marker, i));

        if ( (Object.keys(mytrip_items)).length == 1){
            // There is only a single item if mytrip contains only a single day info:
            add_content_to_subsection(mytrip,0)
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
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });
    google.maps.event.trigger(map, 'resize');

};


function get_trace(mytrip){
    var x, xlabel;
    if (mytrip.distance != undefined){
        x = Object.values(mytrip.distance);
        xlabel = "Distance (km)";
    }else{
        x = Object.keys(mytrip.altitude);
        xlabel = "Day"
    }

    var trace1 = {
      x: x,
      y: Object.values(mytrip.altitude),
      type: 'scatter',
      text: Object.values(mytrip.placename),
      mode: 'lines+markers+text',
      name: 'trace from Google Map'
    };

    data = {
        "trace":[trace1],
        "layout": {
        autosize: true,
        height: 200,
        title:"Altitude changes",
        margin: {l: 100,r: 100,b: 50,t: 30,pad: 0},
        annotations: [{
          xref: 'paper',
          yref: 'paper',
          x: 0,
          xanchor: 'right',
          y: 1,
          yanchor: 'bottom',
          text: 'Altitude (m)',
          showarrow: false
            }, {
          xref: 'paper',
          yref: 'paper',
          x: 1,
          xanchor: 'left',
          y: 0,
          yanchor: 'top',
          text: xlabel,
          showarrow: false
        }]
        //paper_bgcolor: '#7f7f7f',
        //plot_bgcolor: '#c7c7c7'
        }
    };
    return data;
};

