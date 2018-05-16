#! /usr/bin/env node

console.log("Server Starting");

require("dotenv").config();
require("dotenv-safe").config({
    allowEmptyValues: true
})

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const db = require("./database");

const bcrypt = require("bcrypt");
const saltRounds = 10;
// will change to enviroment variable when deploying
// const secret = process.env.secretvarname
const secret = process.env.SECRET;

const path = require("path");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.static(path.join(__dirname, 'static')));

// index landing page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

// useful for grabing data out of post requests
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.get("/users", function(req, res) {
    getUsers(req, res);
});

app.get("/trips", function(req, res) {
    getTrips(req, res);
});

app.post("/trips", function(req, res) {
    console.log(req.body);
    createTrip(req, res);
});

app.post("/login", function(req, res) {
    processLogin(req, res);
});

app.post("/register", function(req, res) {
    console.log(req.body);
    createAccount(req, res);
});

// login related
// Function to Handle Login Request
let processLogin = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    db.findUser("email", email)
        .then((user) => {
            console.log(user);
            if (user.length === 0) {
                errorObj = {};
                errorObj.status = "failed";
                errorObj.reason = "No user found";
                res.end(JSON.stringify(errorObj));
            }
            bcrypt.compare(password, user[0].password)
                .then(isValid => {
                    if (isValid) {
                        console.log("Inside then", user);
                        let token = createToken(user[0]);
                        let userObj = {};
                        userObj.id = user[0].id;
                        userObj.username = user[0].username;
                        userObj.email = user[0].email;
                        userObj.jwt = token;
                        res.end(JSON.stringify(userObj));
                    } else {
                        errorObj = {};
                        errorObj.status = "failed";
                        errorObj.reason = "No token for you";
                        console.log(error);
                        res.end(JSON.stringify(errorObj));
                        // res.end('No token for you');
                    }
                })
                .catch(error => {
                    errorObj = {};
                    errorObj.status = "failed";
                    errorObj.reason = "Failed to Login";
                    console.log(error);
                    res.end(JSON.stringify(errorObj));
                })
        })
};

let createToken = (user) => {
    let token = jwt.sign({ userID: user.id },
        secret, { expiresIn: "7d" }
    );
    return token;
};

let createAccount = (req, res) => {
    console.log(req.body);
    let userData = req.body;
    bcrypt.hash(userData.password, saltRounds)
        .then(encryptedPwd => {
            db.insertUser(userData.username, encryptedPwd, userData.location, userData.email)
                .then(() => {
                    statusObj = {};
                    statusObj.status = "success";
                    statusObj.reason = "New User Stored";
                    res.end(JSON.stringify(statusObj));
                })
                .catch(error => {
                    errorObj = {};
                    errorObj.status = "failed";
                    errorObj.reason = "Failed to store User";
                    console.log(error);
                    res.end(JSON.stringify(errorObj));
                })
        })
        .catch(error => {
            console.log(error);
            res.end("Failed to generate Hash");
        })
};


//authorizes users based on their json webtoken
// Slicing the authorization value as the request.headers will have key value pair as this ... "authorization: Bearer <token>"
let userAuthorization = (request, response) => {
    console.log("Req headers inside authorization", request.headers);
    let { authorization } = request.headers;
    let payload;
    try {
        payload = jwt.verify(authorization.slice(7), secret);
    } catch (err) {
        console.log(err);
    }
    if (payload) {
        console.log("Payload", payload);
        console.log("User Authorization", payload.userID);
        return userID = payload.userID;
    }
    return false;
};

let getUsers = (req, res) => {
    if (userAuthorization(req, res)) {
        db.getAllUsers()
            .then(usersList => {
                res.end(JSON.stringify(usersList));
            })
    }
};

let createTrip = (req, res) => {
    console.log("createTrip", req.body);
    let userid = userAuthorization(req, res);
    if (userid) {
        let tripData = req.body;
        db.insertTrip(userid, tripData.name, tripData.source, tripData.destination, tripData.startdate, tripData.enddate, tripData.description, JSON.stringify(tripData.plans))
            .then(() => {
                statusObj = {};
                statusObj.status = "success";
                statusObj.reason = "New Trip Stored";
                res.end(JSON.stringify(statusObj));
            })
            .catch(error => {
                console.log(error);
                errorObj = {};
                errorObj.status = "failed";
                errorObj.reason = "Failed to store Trip";
                console.log(error);
                res.end(JSON.stringify(errorObj));
            })
    } else {
        console.log('Invalid User');
    }
};

let getTrips = (req, res) => {
    let id = userAuthorization(req, res);
    if (id) {
        db.getAllTrips(id)
            .then(tripsList => {
                res.end(JSON.stringify(tripsList));
            })
    }
}

app.listen(process.env.PORT || 3000, () => console.log("Server is now listening."));