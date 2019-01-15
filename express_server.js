var express = require("express");

var app = express();
var PORT = 8080;

//declaring app to use EJS as templating engine
app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouse.ca",
  "9sm5xK": "http://www.google.com"
};

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

app.get("/urls/:id", (request, respond) => {
  let template2 = { shortURL: request.params.id,
                    urls: urlDatabase
  };
  respond.render("urls_show", template2);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});