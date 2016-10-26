 var map;
 var socket =io();
  socket.on("connected", function() {
      console.log("Connected to the server socket");
    });

 socket.on("disconnected",function()
  {
    console.log("Disconnected from the server");
  });

 socket.on("tweetStream",function(tweet)
  {
    console.log("Connected to the twitter stream");
    var location=new google.maps.LatLng(tweet.longitude,tweet.latitude);
    var title=tweet.title;
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title:title
      });
  });

      function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 51.5074, lng: 0.1278},
          zoom: 2
        });
      };

  function selectItem(value)
  {
    alert("Tweets for "+value.toUpperCase()+" will start now");
    socket.emit("start-streaming",value);
  }  