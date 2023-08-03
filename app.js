const express = require('express');
const path = require('path');
// import morgan
const morgan = require("morgan");

const app = express();
// set up on port 3k or find available port
const PORT = process.env.PORT || 3000;

// Middleware
// our predefined formats are : tiny, dev, short, common
app.use(morgan("dev")); //'common' includes access date
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));    //Serves static files from the 'public' directory|| array

// Use Firebase bd to manage users 
const users = [
  { id: 1, username: 'user1@mlab.com', password: 'password1' },
  { id: 2, username: 'user2@mlab.com', password: 'password2' },
];

//MANAGE APP START & END as per assessment equest
// Function to log 'start' and 'end' points'
function logRunPoints() {
    console.log("Started app...");
    process.on("exit", () => {
      console.log("Closed app...");
    });
  }
  
// Routes
app.get('/', (req, res) => {
  res.render('/home', { message: '' });
});

// handle respomse and errors || 'log' action results
app.post('/login', (req, res) => {
    // 

  const { username, password } = req.body;
//   validate credentials
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // send user to new success page
    res.render('profile', { message: 'LOG IN SUCCESFUL!'});
    // res.render('profile', { username });
  } else {
console.log()
// return home/ refresh to try again
    res.render('home', { message: 'Invalid credentials. Try Again!' });
  }
});

// Set up EJS view engine
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");  // set up view engine to ejs | 'res.render' loads the ejs view file

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
   // Start loging the login process.
      logRunPoints();
});


