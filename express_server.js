var express = require("express");

const cookieSession = require('cookie-session');




var app = express();
var PORT = 8080;
var longURL = "Lol";
var randID = generateRandomString();
//body parser to access post request parameters
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ["romelsecret"]
}))


// using b crypt
const bcrypt = require('bcrypt');


//declaring app to use EJS as templating engine
app.set("view engine", "ejs");

var urlDatabase = {
  romelID : {
    "b2xVn2": "http://www.lighthouse.ca",
    "9sm5xK": "http://www.google.com",
  },
  kawhiID : {
    "b2xVn2": "http://www.lighthouse.ca",
    "9sm5xK": "http://www.google.com",
  }
};

var usersDatabase = {
  romelID : {
    id: "romelID",
    email: "romel@example.com",
    password: "lighthouse"
  },
  kawhiID : {
    id: "kawhiID",
    email: "kawhi@raptors.ca",
    password: "leonard"
  }
}


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

function urlsForUser(id) {
  newID = id;
  return urlDatabase[newID];
}


app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (request, respond) => {
  if(!(request.session.user_id === undefined) && urlsForUser(request.session.user_id) === undefined){
      var check = false;
      var templatevars = {shortURL: request.params.id,
                          user_id: usersDatabase[request.session.user_id]['id'],
                          user_email: usersDatabase[request.session.user_id]['email'],
                          user_password: usersDatabase[request.session.user_id]['password'],
                          cookie: (request.session.user_id),
                          check2 : check
                          };
  }else if(!(request.session.user_id === undefined)) {
      var check = true;
      urlsForUser(request.session.user_id);
      var templatevars = {shortURL: request.params.id,
                          urls:  urlsForUser(request.session.user_id),
                          user_id: usersDatabase[request.session.user_id]['id'],
                          user_email: usersDatabase[request.session.user_id]['email'],
                          user_password: usersDatabase[request.session.user_id]['password'],
                          cookie: (request.session.user_id),
                          check2: check
                          };
  } else {
      var templatevars = {shortURL: request.params.id,
                          urls: urlDatabase,
                          cookie: ((request.session.user_id))
                          }
  }

  respond.render("urls_index", templatevars);

});

app.get("/urls/new", (request, respond) => {
  if(!(request.session.user_id === undefined)) {
    var templatevars = {shortURL: request.params.id,
                        urls: urlDatabase,
                        user_id: usersDatabase[request.session.user_id]['id'],
                        user_email: usersDatabase[request.session.user_id]['email'],
                        user_password: usersDatabase[request.session.user_id]['password'],
                        cookie: (request.session.user_id)
                       };
  respond.render("urls_new", templatevars);

  } else {
  var templatevars = {shortURL: request.params.id,
                      urls: urlDatabase,
                      cookie: ((request.session.user_id))
                      }

  respond.redirect('http://localhost:8080/login/');

  }


});

app.get("/urls/:id", (request, respond) => {
  if(!(request.session.user_id === undefined)) {
    var templatevars = {shortURL: request.params.id,
                        urls: urlDatabase[request.session.user_id],
                        user_id: usersDatabase[request.session.user_id]['id'],
                        user_email: usersDatabase[request.session.user_id]['email'],
                        user_password: usersDatabase[request.session.user_id]['password'],
                        cookie: (request.session.user_id)
                        };

  respond.render("urls_show", templatevars);
  } else {
  var templatevars = {shortURL: request.params.id,
                      urls: urlDatabase,
                      cookie: ((request.session.user_id))
                      }
  respond.redirect('http://localhost:8080/login');
  }
});

app.get("/u/:shortURL", (request, respond) => {
  //found by console logging request.
  var shortURL = request.params.shortURL;
  var newUrlData = "";
  for (var LONGID in urlDatabase) {
  var obj = urlDatabase[LONGID]
    for(var id in obj){
      if(id === shortURL){
        newUrlData = obj[id];
      }
    }
  }
  respond.redirect(newUrlData);
});

app.get("/register", (request, respond) => {
  let templatevars = {shortURL: request.params.id,
                      urls: urlDatabase,
                      userObject: usersDatabase[request.session.user_id]
  };
  respond.render("urls_register", templatevars);
});

app.get("/login", (request, respond) => {
  let templatevars = { shortURL: request.params.id,
                      urls: urlDatabase,
                      userObject: usersDatabase[request.session.user_id]
  };
  respond.render("urls_login", templatevars);
});

app.post("/register", function (request, respond) {
  let templatevars = { shortURL: request.params.id,
                    urls: urlDatabase,
                    userInfo: usersDatabase,
                    userObject: usersDatabase[request.session.user_id]
  };
  if(request.body.email === ""){
    return respond.sendStatus(400);
  }
  newUser = randID
  request.session.user_id = newUser;
  var hashedPassword = bcrypt.hashSync(request.body.password, 10);

  usersDatabase[randID] = {
    id: randID,
    email: request.body.email,
    password: hashedPassword
  }

  respond.redirect('http://localhost:8080/urls/');
});

//replies to post requests.
app.post("/urls", (request, respond) => {
  var user_id = request.session.user_id;
  longURL = request.body.longURL;
  var shortURL = generateRandomString();
  var addObject = {
                  [shortURL]: longURL
                  }

  if(urlDatabase[user_id] === undefined){
    urlDatabase[user_id] = addObject;
    respond.redirect(`http://localhost:8080/urls/${shortURL}`);
  } else{
    Object.assign(urlDatabase[user_id], addObject);
    respond.redirect(`http://localhost:8080/urls/${shortURL}`);
  }
});

app.post("/urls/:id/delete", (request, respond) => {

  var shortURL = request.params.id;
  delete urlDatabase[request.session.user_id][shortURL];
  respond.redirect('http://localhost:8080/urls/');
});

app.post("/urls/:id", (request, respond) => {
  let templatevars = {shortURL: request.params.id,
                      urls: urlDatabase,
                      user_id: usersDatabase[request.session.user_id]['id'],
                      user_email: usersDatabase[request.session.user_id]['email'],
                      user_password: usersDatabase[request.session.user_id]['password'],
                      cookie: (request.session.user_id)
                      }
  var newURL = request.body.longURL
  var shortURL = request.params.id;
  urlDatabase[[request.session.user_id]][shortURL] = newURL
  respond.redirect('http://localhost:8080/urls/' + shortURL);
});

app.post("/login", (request, respond) => {

  var checkEmailArray = [];
  var email = request.body.email

  var checkPasswordArray= [];
  var password = request.body.password;

  var checkIdArray = [];

  for (var LONGID in usersDatabase) {
    var obj = usersDatabase[LONGID];
    checkEmailArray.push(obj.email);
    checkPasswordArray.push(obj.password);
    checkIdArray.push(obj.id);
}
  var checkLength = checkEmailArray.length;

  for(let i = 0; i < checkLength; i ++){
     if(email === checkEmailArray[i]){
        if(bcrypt.compareSync(password, checkPasswordArray[i])){
            respond.cookie("user_id", checkIdArray[i]);
            respond.redirect('http://localhost:8080/');
            break;
        } else{
            return respond.sendStatus(400);
        }
      }
  };
  return respond.sendStatus(400);
});

app.post("/logout", (request, respond) => {
  if(request.session.user_id) {
    request.session.user_id = null;
  }
  request.session = null;
  respond.redirect('http://localhost:8080/urls/');
});
app.listen(PORT, () => {
  console.log(`Romel's app listening on port ${PORT}!`);
});
