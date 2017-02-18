var express = require('express'),
    app = express();
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');


// APP CONFIG
mongoose.connect("mongodb://admin:Mammamia1@ds155509.mlab.com:55509/videolog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// mongoose model CONFIG
var videoSchema = new mongoose.Schema({
  title: String,
  video: String,
  desc: String,
  created: {type: Date, default: Date.now}
});
var Video = mongoose.model("Video", videoSchema);

// RESTful routes
app.get("/", function(req, res){
  res.redirect("/videos");
});

// index
app.get("/videos", function(req, res){
  Video.find({}, function(err, videos){
    if(err){
      console.log(err)
    } else {
      res.render("index", {videos: videos});
    };
  });
});

// new
app.get("/videos/new", function(req, res){
  res.render("new");
});

// create
app.post("/videos", function(req, res){
  Video.create(req.body.video, function(err, newVideo){
    if(err){
      console.log(err);
      res.redirect("/videos");
    } else {
      console.log(newVideo);
      res.redirect("/videos");
    }
  });
});

// show
app.get("/videos/:id", function(req, res){
  Video.findById(req.params.id, function(err, foundVideo){
    if(err){
      console.log(err);
      res.render("index");
    } else {
      res.render("show", {video: foundVideo});
    };
  });
});

//edit
app.get("/videos/:id/edit", function(req, res){
  Video.findById(req.params.id, function(err, video){
    if(err){
      res.redirect("/videos/" + req.params.id)
    } else {
      res.render("edit", {video: video});
    };
  });
});

//update
app.put("/videos/:id", function(req, res){
  Video.findByIdAndUpdate(req.params.id, req.body.video, function(err, updated){
    if(err){
      res.redirect("/videos");
    } else {
      res.redirect("/videos/" + req.params.id);
    };
  });
});

//destroy
app.delete("/videos/:id", function(req, res){
  Video.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/videos");
    } else {
      res.redirect("/videos");
    };
  });
});

app.listen(process.env.PORT, function(){
  console.log("Server has started...");
});
