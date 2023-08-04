const express = require("express");
const path = require("path");
const morgan = require("morgan"); // import morgan

const app = express();
const PORT = process.env.PORT || 3000; // set up on port 3k if not taken

// Middleware

app.use(morgan("dev")); // our predefined formats are : tiny, dev, short, common
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //Serves static files from the 'public' directory|| array

// firebase stuff
const admin = require("firebase-admin");
const credentials = require("./key.json");

admin.initializeApp({ credentials: admin.credential.cert(credentials) });
// setup database stuff
const db = admin.firestore();
app.use(express.json());

// Use Firebase bd to manage users
const users = [
  { id: 1, username: "user1@mlab.com", password: "password1" },
  { id: 2, username: "user2@mlab.com", password: "password2" },
];

// STORING IMAGE IN AN ARRAY
const images = ["./image1.jpg", "./image1.jpg", "./image1.jpg"];

// STORE VIDEOS IN ARRAY
const videos = ["./pexels-vid.mp4", "./pexels-vid.mp4", "./pexels-vid.mp4"];

// i will log important events in during runtime instead of start & end
function logRunPoints(event) {
  console.log(`Event: ${event}`);
}

// Get user profile images for ARRAY
function getUserImages(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(images);
    }, 1500); //get images 1.5s
  });
}
//   GET USER VIDEOS
function getUserVideos(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, 2000); //get images 2s (delayed 5ms after the images)
  });
}

async function loadUserInfo() {
  // Get user images after login
  logRunPoints("Fetching images...");
  const images = await getUserImages(users.id);
  console.log("User images:", images);

  // Get user videos 0.5s after images
  // console.log("Loading videos...");
  logRunPoints("Fetching videos...");
  const videos = await getUserVideos(users.id);
  console.log("User videos:", videos);

  // console.log("USER PROFILE CREATED SUCCESSFUL!");
  logRunPoints("USER PROFILE CREATED SUCCESSFUL!");
}

// Routes
app.get("/", (req, res) => {
  res.render("home", { message: "CREATE PROFILE" });
});

app.get("/profile", (req, res) => {
  res.render("profile", { images, videos });
});

// POST ENDPOINT | MAIN LOGIN HANDLER || ASYNC with tryCatch error approach
app.post("/profile", async (req, res) => {
  try {
    const userProfile = {
      email: req.body.email,
      password: req.body.password, //encrypt password if not testing
    };

    const response = await db.collection("Users").add(userProfile);

    logRunPoints("Data Recorded on db");
    // validate credentials within dummy users (must use Db later)
    // const user = users.find(
    //   (u) => u.username === email && u.password === password
    // );

    // // if credentials match send user to new success page or handle erros
    // if (email != "user1@mlab.com" && password != "password") {
    //   logRunPoints("Login Successful");
    //   // res.render('profile', { message: 'LOG IN SUCCESSFUL!', email: email });
    //   loadUserInfo();
    // } else {
    //   logRunPoints("Invalid credentials. Try Again!");
    //   // res.render('home', { message: 'Login Failed. Try Again!' });
    //   // logRunPoints(`username was: ${u.username}`);
    // }
    // Redirect to profile page or do something else after successful addition
    //res.redirect("/profile");
    res.send(response);
  } catch (error) {
    logRunPoints("Error: Login failed!");
    console.error(error);
    // Handle the error gracefully, e.g., render an error page
    
    // res.render('home', { message: 'An error occurred. Please try again later.' });
    res.end();
  }
});

// setup timed delay using setTimeOut
function asyncTimer() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000); // timed delay
  });
}

// Set up EJS view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // set up view engine to ejs | 'res.render' loads the ejs view file

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}! http://localhost:${PORT}`);
  // Start loging the login process.
  logRunPoints("App Started");
});
