//jshint esversion:6
//CopyRight : Team Cultivators
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const fs = require("fs");
const { PythonShell } = require("python-shell");
var districtName;
var temp;
var humid;
var rain;
var cropList = [];
// var dummy=[1,2,3,4,5,6]
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/output", function (req, res) {
  fs.readFile("predCrop.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    cropList = data.split(" ");
    res.render("output", {
      district: districtName,
      temp: temp,
      humidity: humid,
      rainfall: rain,
      ListOfCrops: cropList,
    });
  });
});

app.post("/", function (req, res) {
  districtName = req.body.district;
  console.log(districtName);
  const apikey = "05c210ab686ab28af7dcacdf1f407eb4";
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    districtName +
    "&appid=" +
    apikey +
    "&units=" +
    unit;
  https.get(url, function (response) {
    if (response.statusCode === 200) {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        temp = weatherData.main.temp;
        //  temp = temp.toFixed(2);
        humid = weatherData.main.humidity;
        if (weatherData.weather.main == "Rain") {
          rain = weatherData.rain.rain3h;
        } else rain = 0;
        // console.log(typeof temp);
        // console.log(typeof humid);
        // console.log(typeof rain);
        let options = {
          args: [temp, humid, rain],
        };
        PythonShell.run("crop_model.py", options, function (err, results) {
          if (err) {
            console.log(err);
          } else {
            console.log(results);
          }
        });
        res.redirect("output");
      });
    } else res.send("Data not found");
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});
app.get("/contact", function (req, res) {
  res.render("contact");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});


//Website: https://pacific-caverns-26526.herokuapp.com/