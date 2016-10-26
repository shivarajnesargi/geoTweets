var PORT=9090;

var express=require('express');
var app=express();
var cors=require('cors');
var http=require('http');
var server= http.createServer(app).listen(process.env.PORT||PORT);
var io= require('socket.io')(server);
var twitter=require('twitter');
var env= require('dotenv').config();

var twitterCredentials =new twitter({
consumer_key:process.env.consumer_key,
consumer_secret:process.env.consumer_secret,
access_token_key:process.env.access_token_key,
access_token_secret:process.env.access_token_secret
});

var stream=null;

app.use(express.static("./public"));

var item="Donald Trump";
app.get("/:item",function(req,res){
console.log(req.params.item);
item=req.params.item;
if(item===null||item==="")
{
	item="Donald Trump";
	console.log("Null Check");
}

});
io.sockets.on('connection', function (socket) {

  socket.on("start-streaming", function(itemValue) {
  	console.log("Streaming started");
    console.log(`The item value is:-> ${itemValue}`)
  	if(stream === null)
  	{
      console.log("Stream is null");
      twitterCredentials.stream('statuses/filter', {track:itemValue}, function(stream) {
          stream.on('data', function(tweet) {
            console.log(`item is ${itemValue}`);
          	console.log("Tweets started");
          	console.log(JSON.stringify(tweet));
              /*if (tweet.coordinates){
                if (tweet.coordinates !== null){
                  var latlong = {"latitude": tweet.coordinates.coordinates[0],"longitude": tweet.coordinates.coordinates[1],"title":tweet.place.full_name};
                  socket.broadcast.emit("tweetStream", latlong);
                  socket.emit('tweetStream', latlong);
                }
              }*/
               if(tweet.place)
                {
                  if(tweet.place.bounding_box)
                  {
                  console.log("Bounding box entered");
                  if(tweet.place.bounding_box)
                   { 
                  if(tweet.place.bounding_box.type==='Polygon'){   
                  var crd=tweet.place.bounding_box.coordinates[0][0];
                  var latlong = {"latitude": crd[0],"longitude": crd[1],"title":tweet.place.full_name};
                  console.log(`shivraj-> ${crd[0]}`);
                  socket.broadcast.emit("tweetStream", latlong);
                  socket.emit('tweetStream', latlong);
                }
              }
              }
              }
                
              stream.on('limit', function(msg) {
               console.log(msg);
              });

              stream.on('warning', function(warning) {
               console.log(msg);
              });

              stream.on('disconnect', function(msg) {
                console.log(msg);
              });
          }); 
      });
  	};
  });

    socket.emit("connected");
});


console.log("Listening on port: "+PORT);
