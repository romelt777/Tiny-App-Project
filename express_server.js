var express = require("express");

var app = express();
var PORT = 8080;
var longURL = "Lol";
var randID = generateRandomString();
//body parser to access post request parameters
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


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
  newID = (id.replace("user_id=",""));
  // console.log(newID);
  return urlDatabase[newID];
}


app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (request, respond) => {
 // console.log("tst 3" , request.headers.cookie);
 // console.log("tst67" , request.headers.cookie === undefined);
  // if(!(request.headers.cookie === undefined)) {
  //   // console.log("hello");
  //   // console.log(usersDatabase);
  //   // console.log(urlsForUser(((request.headers.cookie).replace("user_id=",""))));
  //   if(urlDatabase[((request.headers.cookie).replace("user_id=",""))] === undefined){
  //     var templatevars = { shortURL: request.params.id,
  //                 urls: "",
  //                 cookie: ((request.headers.cookie)),
  //                 user_id: usersDatabase[(request.headers.cookie).replace("user_id=","")]['id'],
  //                 user_email: usersDatabase[(request.headers.cookie).replace("user_id=","")]['email'],
  //                 user_password: usersDatabase[(request.headers.cookie).replace("user_id=","")]['password']
  //                  }
  //   } else{
  //     var templatevars = { shortURL: request.params.id,
  //             urls: urlDatabase[((request.headers.cookie).replace("user_id=",""))],
  //             user_id: usersDatabase[(request.headers.cookie).replace("user_id=","")]['id'],
  //             user_email: usersDatabase[(request.headers.cookie).replace("user_id=","")]['email'],
  //             user_password: usersDatabase[(request.headers.cookie).replace("user_id=","")]['password'],
  //             cookie: ((request.headers.cookie).replace("user_id=",""))
  //             };
  //   }

  // } else {
  //   // console.log("goodbye");

  // var templatevars = { shortURL: request.params.id,
  //                   urls: urlDatabase,
  //                   cookie: ((request.headers.cookie))
  //                   // user_id:  ,
  //                   // user_email: ,
  //                   // user_password:
  //                    }
  // }
  if(!(request.headers.cookie === undefined) && urlsForUser(request.headers.cookie) === undefined){
      var check = false;
      console.log("high")
      // console.log(request.headers.cookie);
      // console.log(urlsForUser(request.headers.cookie));
      // console.log(urlDatabase[urlsForUser(request.headers.cookie)]);
      var templatevars = { shortURL: request.params.id,
                          user_id: usersDatabase[(request.headers.cookie).replace("user_id=","")]['id'],
                          user_email: usersDatabase[(request.headers.cookie).replace("user_id=","")]['email'],
                          user_password: usersDatabase[(request.headers.cookie).replace("user_id=","")]['password'],
                          cookie: ((request.headers.cookie).replace("user_id=","")),
                          check2 : check
                          };

  }else if(!(request.headers.cookie === undefined)) {
      var check = true;
      console.log("low");
      urlsForUser(request.headers.cookie);
     var templatevars = { shortURL: request.params.id,
              urls:  urlsForUser(request.headers.cookie),
              user_id: usersDatabase[(request.headers.cookie).replace("user_id=","")]['id'],
              user_email: usersDatabase[(request.headers.cookie).replace("user_id=","")]['email'],
              user_password: usersDatabase[(request.headers.cookie).replace("user_id=","")]['password'],
              cookie: ((request.headers.cookie).replace("user_id=","")),
              check2: check
              };
  } else {
    var templatevars = { shortURL: request.params.id,
                        urls: urlDatabase,
                        cookie: ((request.headers.cookie))
                 }
  }









  respond.render("urls_index", templatevars);
  // console.log("tst 4" , usersDatabase);
});

app.get("/urls/new", (request, respond) => {
  if(!(request.headers.cookie === undefined)) {
    // console.log("hello");
    var templatevars = { shortURL: request.params.id,
                    urls: urlDatabase,
                    user_id: usersDatabase[(request.headers.cookie).replace("user_id=","")]['id'],
                    user_email: usersDatabase[(request.headers.cookie).replace("user_id=","")]['email'],
                    user_password: usersDatabase[(request.headers.cookie).replace("user_id=","")]['password'],
                    cookie: ((request.headers.cookie).replace("user_id=",""))
                    };
  respond.render("urls_new", templatevars);
  } else {
  // console.log("goodbye");
  // console.log(request.headers.cookie);
  var templatevars = { shortURL: request.params.id,
                    urls: urlDatabase,
                    cookie: ((request.headers.cookie))
                    // user_id:  ,
                    // user_email: ,
                    // user_password:
                     }

  respond.redirect('http://localhost:8080/urls/');

  }


});

app.get("/urls/:id", (request, respond) => {
  // console.log(request.headers.cookie);
  if(!(request.headers.cookie === undefined)) {
    // console.log("hello");
    // console.log(usersDatabase);
    var templatevars = { shortURL: request.params.id,
                    urls: urlDatabase[(request.headers.cookie).replace("user_id=","")],
                    user_id: usersDatabase[(request.headers.cookie).replace("user_id=","")]['id'],
                    user_email: usersDatabase[(request.headers.cookie).replace("user_id=","")]['email'],
                    user_password: usersDatabase[(request.headers.cookie).replace("user_id=","")]['password'],
                    cookie: ((request.headers.cookie).replace("user_id=",""))
                    };


  respond.render("urls_show", templatevars);
  } else {
    // console.log("goodbye");
  var templatevars = { shortURL: request.params.id,
                    urls: urlDatabase,
                    cookie: ((request.headers.cookie))
                    // user_id:  ,
                    // user_email: ,
                    // user_password:
                     }
  respond.redirect('http://localhost:8080/login');
  }



  });
app.get("/u/:shortURL", (request, respond) => {
  //found by console logging request.
  var shortURL = request.params.shortURL;
  respond.redirect(urlDatabase[shortURL]);
})


app.get("/register", (request, respond) => {
  // console.log(request);

  let templatevars = { shortURL: request.params.id,
                    urls: urlDatabase,
                    userObject: usersDatabase[request.headers.cookie]
  };
  respond.render("urls_register", templatevars);
});

app.get("/login", (request, respond) => {
  // console.log(request);
  let templatevars = { shortURL: request.params.id,
                    urls: urlDatabase,
                    userObject: usersDatabase[request.headers.cookie]
  };
  respond.render("urls_login", templatevars);
})




app.post("/register", function (request, respond) {
  let templatevars = { shortURL: request.params.id,
                    urls: urlDatabase,
                    userInfo: usersDatabase,
                    userObject: usersDatabase[request.headers.cookie]
  };
  // console.log("tst 1 " ,request.body.email);
  if(request.body.email === ""){
    console.log("error");
    return respond.sendStatus(400);
  }
  newUser = randID
  respond.cookie("user_id", newUser);

  usersDatabase[randID] = {
    id: randID,
    email: request.body.email,
    password:request.body.password
  }

  // console.log(usersDatabase);
  respond.redirect('http://localhost:8080/urls/');

});


//replies to post requests.
app.post("/urls", (request, respond) => {
  // console.log(request.body.longURL);
  // console.log(request);
  var user_id = (request.headers.cookie).replace("user_id=","");
  longURL = request.body.longURL;
  var shortURL = generateRandomString();
  // respond.send("Okay!");
  // console.log("tst 606" , urlDatabase);
  var addObject = {
              [shortURL]: longURL
                        }
  console.log("tst 707" , addObject);

  console.log("tst909 ", urlDatabase[user_id]);
  if(urlDatabase[user_id] === undefined){
    urlDatabase[user_id] = addObject;
    respond.redirect(`http://localhost:8080/urls/${shortURL}`);
  } else{
    Object.assign(urlDatabase[user_id], addObject);
    console.log("tst 607" , urlDatabase[user_id]);
    respond.redirect(`http://localhost:8080/urls/${shortURL}`);
  }



});

app.post("/urls/:id/delete", (request, respond) => {

  // console.log(urlDatabase);
  var shortURL = request.params.id;
  // console.log("tst" ,shortURL);
  delete urlDatabase[(request.headers.cookie).replace("user_id=","")][shortURL];
  // respond.send("Okay!");
  // console.log(urlDatabase);
  respond.redirect('http://localhost:8080/urls/');
});


app.post("/urls/:id", (request, respond) => {
  // console.log("tst 1 " , request.body.longURL);
  let templatevars = { shortURL: request.params.id,
                    urls: urlDatabase,
                    user_id: usersDatabase[(request.headers.cookie).replace("user_id=","")]['id'],
                    user_email: usersDatabase[(request.headers.cookie).replace("user_id=","")]['email'],
                    user_password: usersDatabase[(request.headers.cookie).replace("user_id=","")]['password'],
                    cookie: ((request.headers.cookie).replace("user_id=",""))
                      }
  var newURL = request.body.longURL
  var shortURL = request.params.id;
  urlDatabase[[(request.headers.cookie).replace("user_id=","")]][shortURL] = newURL

  respond.redirect('http://localhost:8080/urls/' + shortURL);
  // render.send("Okay!");
  // console.log(urlDatabase);
});

app.post("/login", (request, respond) => {
  var checkEmail = false;
  var checkEmailArray = [];
  var email = request.body.email
  // console.log(email);

  var checkPassword = false;
  var checkPasswordArray= [];
  var password = request.body.password;
  // console.log(password);

  var checkIdArray = [];


  for (var LONGID in usersDatabase) {
    var obj = usersDatabase[LONGID];
    checkEmailArray.push(obj.email);
    checkPasswordArray.push(obj.password);
    checkIdArray.push(obj.id);
}
// console.log(checkEmailArray);
// console.log(checkPasswordArray);
  // console.log("tst 90" , checkIdArray);
  var checkLength = checkEmailArray.length;
  // console.log(checkLength);
  for(let i = 0; i < checkLength; i ++){
     if(email === checkEmailArray[i]){
        checkEmail = true;
        console.log("correct email!");
        console.log("tst1" , checkPasswordArray[i]);
        console.log("tst2", password);
        if(password === checkPasswordArray[i]){
           console.log("correct!")
            respond.cookie("user_id", checkIdArray[i]);
            checkPassword = true;
            respond.redirect('http://localhost:8080/');
            break;
        } else{
            console.log("error");
            return respond.sendStatus(400);
        }
    }
  };
  return respond.sendStatus(400);






  // for(let i = 0; i < checkLength; i ++){
  //   if(email === checkEmailArray){
  //     console.log("correct email!")
  //     console.log(password);
  //     console.log(checkPasswordArray[i]);
  //     if(password === passwordIdentify[i]){
  //       console.log("correct!")
  //       respond.redirect('http://localhost:8080/');
  //       break;
  //     }
  //   } else{
  //       console.log("error");
  //       return respond.sendStatus(400);
  //   }
  // // }

  // console.log("tst1" , request.body.email);
  // console.log("tst 2" ,request.body.password);


});

app.post("/logout", (request, respond) => {
  respond.clearCookie("user_id");
  // console.log("tst 77" , usersDatabase);
  respond.redirect('http://localhost:8080/urls/');
});
app.listen(PORT, () => {
  console.log(`Romel's app listening on port ${PORT}!`);

});
