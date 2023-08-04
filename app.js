const express = require("express");
const path = require("path");
const morgan = require("morgan"); // import morgan

const app = express();
const PORT = process.env.PORT || 3000; // set up on port 3k if not taken

// Middleware

app.use(morgan("dev")); // our predefined formats are : tiny, dev, short, common
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //Serves static files from the 'public' directory|| array

// Use Firebase bd to manage users
const users = [
  { id: 1, username: "user1@mlab.com", password: "password1" },
  { id: 2, username: "user2@mlab.com", password: "password2" },
];

 // STORING IMAGE IN AN ARRAY
 const images = [
  "./image1.jpg",
  "./image1.jpg",
  "./image1.jpg",
];

 // STORE VIDEOS IN ARRAY
 const videos = [
  "./pexels-vid.mp4",
  "./pexels-vid.mp4",
  "./pexels-vid.mp4",
  
];

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
  res.render('profile', { images, videos });

});

// MAIN LOGIN HANDLER || ASYNC with tryCatch error approacj
app.post("/login", async (req, res) => {
  try {
    // start
    // logRunPoints('Creating Profile');
    const { email, password } = req.body; //get user data from the form body/fields

    // simulate async operation with timeout | db requests
    await asyncTimer();
    //   validate credentials within dummy users (must use Db later)
    const user = users.find(
      (u) => u.username === email && u.password === password
    );

    // if credentials match send user to new success page or handle erros
    if (email != "user1@mlab.com" && password != "password") {
      logRunPoints("Login Successful");
      // res.render('profile', { message: 'LOG IN SUCCESSFUL!', email: email });
      loadUserInfo();
    } else {
      logRunPoints("Invalid credentials. Try Again!");
      // res.render('home', { message: 'Login Failed. Try Again!' });
      // logRunPoints(`username was: ${u.username}`);
    }
  } catch (error) {
    logRunPoints("Error: Login failed!");
    console.error(error);
    // return home/ refresh to try again
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
