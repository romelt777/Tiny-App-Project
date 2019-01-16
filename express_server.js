var express = require("express");

var app = express();
var PORT = 8080;
var longURL = "Lol";

//body parser to access post request parameters
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


//declaring app to use EJS as templating engine
app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xK": "http://www.google.com",
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
// //random string test
// console.log(generateRandomString());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (request, respond) => {
  let template1 = { urls: urlDatabase,
                    username: request.headers.cookie
                  };

  // console.log("tst" , request.headers.cookie.username);
  respond.render("urls_index", template1);
});

app.get("/urls/new", (request, respond) => {
  respond.render("urls_new");
});

app.get("/urls/:id", (request, respond) => {
  console.log("tst1" , request);
  console.log("tst2", respond);

  let template2 = { shortURL: request.params.id,
                    urls: urlDatabase,
                    username: request.headers.cookie
  };
  respond.render("urls_show", template2);
});

app.get("/u/:shortURL", (request, respond) => {
  //found by console logging request.
  var shortURL = request.params.shortURL;
  respond.redirect(urlDatabase[shortURL]);
})

//replies to post requests.
app.post("/urls", (request, respond) => {
  // console.log(request.body.longURL);
  // console.log(request);
  longURL = request.body.longURL;
  var shortURL = generateRandomString();
  // respond.send("Okay!");
  urlDatabase[shortURL] = longURL;
  respond.redirect(`http://localhost:8080/urls/${shortURL}`);

});

app.post("/urls/:id/delete", (request, respond) => {

  // console.log(urlDatabase);
  var shortURL = request.params.id;
  // console.log("tst" ,shortURL);
  delete urlDatabase[shortURL];
  // respond.send("Okay!");
  console.log(urlDatabase);
  respond.redirect('http://localhost:8080/urls/');
});


app.post("/urls/:id", (request, respond) => {
  // console.log("tst 1 " , request.body.longURL);
  let template3 = { shortURL: request.params.id,
                    urls: urlDatabase,
                    username: request.headers.cookie
  };
  var newURL = request.body.longURL
  var shortURL = request.params.id;
  urlDatabase[shortURL] = newURL

  respond.render("urls_show", template3);
  // render.send("Okay!");
  console.log(urlDatabase);
});
var newUser = "Lol";
app.post("/login", (request, respond) => {
   newUser = request['body']['username']
  respond.cookie("username", newUser);
  // console.log(respond.body.username);
  respond.redirect('http://localhost:8080/urls/');
});

app.post("/logout", (request, respond) => {
  respond.clearCookie("username");
  respond.redirect('http://localhost:8080/urls/');
});





app.listen(PORT, () => {
  console.log(`Romel's app listening on port ${PORT}!`);

});
