var express = require("express");

var app = express();
var PORT = 8080;

//body parser to access post request parameters
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


//declaring app to use EJS as templating engine
app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xK": "http://www.google.com"
};


function generateRandomString() {
  var list = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var randomString = "";
  var randomNumber = 0;

  for(let i = 0; i < 6; i++){
    //62 characters * random number between 0-1, math floor returns largest integer.
    randomNumber = Math.floor(62 * Math.random());
    randomString += list[randomNumber];
  }
  return randomString;

}
//random string test
console.log(generateRandomString());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (request, respond) => {
  let template1 = { urls: urlDatabase}; // sends url Database to urls_index
  respond.render("urls_index", template1);
});

app.get("/urls/new", (request, respond) => {
  respond.render("urls_new");
});

app.get("/urls/:id", (request, respond) => {
  let template2 = { shortURL: request.params.id,
                    urls: urlDatabase
  };
  respond.render("urls_show", template2);
});

app.post("/urls", (request, respond) => {
  console.log(request.body);
  respond.send("Okay!");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});