
function get_plot_latlng(points_aftertrip){

    d = []
    var x = 0;
    var i;
    var myd = 0;
    for (i = 0; i < points_aftertrip.length ;i++){
        myd += points_aftertrip[i].dist
        d.push({x: myd,
                y: points_aftertrip[i].alt})
    }

    var ctx = document.getElementById("get_plot_latlng").getContext('2d');
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
     var bounds = new google.maps.LatLngBounds();
     // run over all the points
     for (i = 0; i < points_aftertrip.length ;i++){

        if (Day == points_aftertrip[i]["Day"]){
            pointsDay.push(points_aftertrip[i])

            // record points to adjust the bounding box size
            var position = new google.maps.LatLng(
                points_aftertrip[i]["lat"],
                points_aftertrip[i]["lng"]);
            bounds.extend(position);
            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }else{
           // The first point for this new Day
            var path = new google.maps.Polyline({
                        path: pointsDay,
                        geodesic: true,
                        strokeColor: strokeColors[Day % 3],
                        strokeOpacity: 0.5,
                        strokeWeight: 10});
            path.setMap(map);
            Day = points_aftertrip[i]["Day"]
            pointsDay = []

            // :::Day <i> marker:::
            marker = new google.maps.Marker({
                position: points_aftertrip[i],
                map: map
            });
            // Allow each marker to have an info window
            google.maps.event.addListener(marker, 'click', (function(marker,i) {
                return function() {
                    text = summary_of_the_day(points_aftertrip[i-1]);
                    infoWindow.setContent(text);
                    infoWindow.open(map, marker);
                    map.setCenter(marker.getPosition());

                    // Blog comments
                    content = i
                    document.getElementById("blog_diary").innerHTML = content

                }
            })(marker, i));

        }
     }


     // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
     var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
                this.setZoom(4);
                google.maps.event.removeListener(boundsListener);
     });
     //google.maps.event.trigger(map, 'resize');
     return(map)
}

function summary_of_the_day(pt){
    text = '<a href="/ebc/ebc_aftertrip/' + pt["Day"];
    text += '"><h3> Day ' +  pt["Day"] + " Goal</h3></a><h4>" + pt["date"] + " </h4>";
    text += "<ul>"
    text += "<li>Altitude: " + m2feet(pt["alt"]) + "</li>";
    text += "<li>Total ascent: " + m2feet(pt["gain"])+ "</li>";
    text += "<li>Total descent: " + m2feet(pt["loss"])+ "</li>";
    text += "<li>Total distance: " + m2feet(pt["csdist"],"km")+ "</li>";
    text += "</ul>"
    return(text)
}

function m2feet(p,unit="m"){
    if (unit == "km"){
        p *= 1000
    }
    return(Math.round(p) + " m (" + Math.round(3.28084*p) + " feet)");
}
// https://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/ -->
function initialize_aftertrip(points_aftertrip) {
    // info window contents
    var map = display_map_on_page_aftertrip(points_aftertrip);
};




function image_zoom_out(randompics){
// Reference
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal_img
// Get the modal
var modal = document.getElementById('myModal');
// Get the image and insert it inside the modal - use its "alt" text as a caption
for (var i = 0 ; i < randompics.length ; i++){
    pic = randompics[i];


    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var img = document.getElementById("myImg_" + pic)
    img.onclick = function(){
             modal.style.display = "block";
             modalImg.src = this.src;
             captionText.innerHTML = this.alt;
                }

}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
}