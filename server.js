var express = require('express');
var app = express();
var url = require("url");
var mongoInsert = require("./storage.js").mongoInsert; //function that creates a new url
var mongoOriginal = require("./storage.js").mongoOriginal; //function that retrives the original url

app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/new/*", function (request, response){
  var newUrl = request.url.substring(5);
  
  //if the url is invalid, alert it
  if (!validUrl(newUrl)){
    response.send({
      error : "invalid url, make sure you have a valid protocol"
    })
  } else {
    mongoInsert(newUrl, sendData);
  }
  //send the data back to the client
  function sendData(data){
    response.send(data)
  }
  
})

app.get("/*", function (request, response){
  var newUrl = request.url.substring(1);
  
  
  mongoOriginal(newUrl, redirectToOriginal);
  
  //redirect the client to the orignial url
  function redirectToOriginal(originalUrl){
    response.redirect("http://" + originalUrl.replace(/^(https?:\/\/)/, ""));
  }
})

//check if a string is a vali url (from Stackoverflow)
function validUrl(str) {
  var pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/ig;
  console.log("testing " + str);
  return pattern.test(str)
}





// listen for requests :)
var listener = app.listen(process.env.PORT);

