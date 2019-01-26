const express = require("express");
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;

let longURL = "";
let randID = generateRandomString();
let checkEmailArray = [];


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

let urlDatabase = {

};

let usersDatabase = {

};


function generateRandomString() {
  const list = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  let randomNumber = 0;

  for(let i = 0; i < 6; i++){
    //62 characters * random number between 0-1, math floor returns largest integer.
    randomNumber = Math.floor(62 * Math.random());
    randomString += list[randomNumber];
  }
  return randomString;
}

function urlsForUser(id) {
  return urlDatabase[id];
}


app.get("/", (request, respond) => {
  if(request.session.user_id){
    respond.redirect('/urls/');
  } else {
    respond.redirect('/login/');
  }
});


app.get("/urls", (request, respond) => {
  if((request.session.user_id) && urlsForUser(request.session.user_id) === undefined){
      let check = false;
      var templateVars = {shortURL: request.params.id,
                          user_id: usersDatabase[request.session.user_id]['id'],
                          user_email: usersDatabase[request.session.user_id]['email'],
                          cookie: (request.session.user_id),
                          check2 : check
                          };
  }else if(request.session.user_id) {
      let check = true;
      urlsForUser(request.session.user_id);
      var templateVars = {shortURL: request.params.id,
                          urls:  urlsForUser(request.session.user_id),
                          user_id: usersDatabase[request.session.user_id]['id'],
                          user_email: usersDatabase[request.session.user_id]['email'],
                          cookie: (request.session.user_id),
                          check2: check
                          };
  } else {
      var templateVars = {shortURL: request.params.id,
                          urls: urlDatabase,
                          cookie: request.session.user_id
                          }
  }

  respond.render("urls_index", templateVars);

});

app.get("/urls/new", (request, respond) => {
  if(request.session.user_id) {
    var templateVars = {shortURL: request.params.id,
                        urls: urlDatabase,
                        user_id: usersDatabase[request.session.user_id]['id'],
                        user_email: usersDatabase[request.session.user_id]['email'],
                        cookie: (request.session.user_id)
                       };
  respond.render("urls_new", templateVars);

  } else {
  var templateVars = {shortURL: request.params.id,
                      urls: urlDatabase,
                      cookie: ((request.session.user_id))
                      }

  respond.redirect('/login/');

  }


});

app.get("/urls/:id", (request, respond) => {
  if(request.session.user_id) {
    var templateVars = {shortURL: request.params.id,
                        urls: urlDatabase[request.session.user_id],
                        user_id: usersDatabase[request.session.user_id]['id'],
                        user_email: usersDatabase[request.session.user_id]['email'],
                        cookie: (request.session.user_id)
                        };

  respond.render("urls_show", templateVars);
  } else {
  var templateVars = {shortURL: request.params.id,
                      urls: urlDatabase,
                      cookie: ((request.session.user_id))
                      }
  respond.redirect('/login');
  }
});

app.get("/u/:shortURL", (request, respond) => {
  //found by console logging request.
  const shortURL = request.params.shortURL;
  let newUrlData = "";
  for (let longId in urlDatabase) {
  let obj = urlDatabase[longId]
    for(let id in obj){
      if(id === shortURL){
        newUrlData = obj[id];
      }
    }
  }
  respond.redirect(newUrlData);
});

app.get("/register", (request, respond) => {
  var templateVars = {shortURL: request.params.id,
                      urls: urlDatabase,
                      userObject: usersDatabase[request.session.user_id]
  };
  respond.render("urls_register", templateVars);
});

app.get("/login", (request, respond) => {
  var templateVars = { shortURL: request.params.id,
                      urls: urlDatabase,
                      userObject: usersDatabase[request.session.user_id]
  };
  respond.render("urls_login", templateVars);
});

app.post("/register", function (request, respond) {
  var templateVars = { shortURL: request.params.id,
                    urls: urlDatabase,
                    userInfo: usersDatabase,
                    userObject: usersDatabase[request.session.user_id]
  };

  const email = request.body.email
//creating array of emails already stored.
  for (var longId in usersDatabase) {
    var obj = usersDatabase[longId];
    checkEmailArray.push(obj.email);
}

  let checkLength = checkEmailArray.length;

  for(let i = 0; i < checkLength; i ++){
//checking if user entered email already exists.
   if(email === checkEmailArray[i]){
        return respond.sendStatus(400);
      }
  }

//checking if user entered email is blank.
  if(request.body.email === ""){
    return respond.sendStatus(400);
  }

//checking if user tried to register w/ blank password.
  if(request.body.password === ""){
    return respond.sendStatus(400);
  }


  newUser = randID
  request.session.user_id = newUser;
  var hashedPassword = bcrypt.hashSync(request.body.password, 10);

//setting profile of new registered user
  usersDatabase[randID] = {
    id: randID,
    email: request.body.email,
    password: hashedPassword
  }
  checkEmailArray.push(request.body.email);

  respond.redirect('/urls/');
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
    respond.redirect(`/urls/${shortURL}`);
  } else{
    Object.assign(urlDatabase[user_id], addObject);
    respond.redirect(`/urls/${shortURL}`);
  }
});

app.post("/urls/:id/delete", (request, respond) => {

  const shortURL = request.params.id;
  delete urlDatabase[request.session.user_id][shortURL];
  respond.redirect('/urls/');
});

app.post("/urls/:id", (request, respond) => {
  var templateVars = {shortURL: request.params.id,
                      urls: urlDatabase,
                      user_id: usersDatabase[request.session.user_id]['id'],
                      user_email: usersDatabase[request.session.user_id]['email'],
                      cookie: (request.session.user_id)
                      }
  const newURL = request.body.longURL
  const shortURL = request.params.id;
  urlDatabase[[request.session.user_id]][shortURL] = newURL
  respond.redirect(`/urls/${shortURL}`);
});

app.post("/login", (request, respond) => {

  const email = request.body.email

  let checkPasswordArray= [];
  let password = request.body.password;

  let checkIdArray = [];

//creating arrays of existing email, passwords, and ids already stored.
  for (let longId in usersDatabase) {
    let obj = usersDatabase[longId];
    checkEmailArray.push(obj.email);
    checkPasswordArray.push(obj.password);
    checkIdArray.push(obj.id);
}
  let checkLength = checkEmailArray.length;

//comparing entered email to existing emails, then if true, compare the specified password for the email.
  for(let i = 0; i < checkLength; i ++){
     if(email === checkEmailArray[i]){
        if(bcrypt.compareSync(password, checkPasswordArray[i])){
            request.session.user_id = checkIdArray[i];
            respond.redirect('/');
            break;
        } else{
            return respond.sendStatus(400);
        }
      }
  };
  return respond.sendStatus(400);
});

app.post("/logout", (request, respond) => {
  //setting session cookie to null, this will log out the user.
  if(request.session.user_id) {
    request.session.user_id = null;
  }
  request.session = null;
  respond.redirect('/urls/');
});

app.listen(PORT, () => {
  console.log(`Romel's app listening on port ${PORT}!`);
});