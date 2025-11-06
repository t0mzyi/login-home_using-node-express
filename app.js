import express from "express";
import session from "express-session";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use('/public', express.static('node_modules/@fortawesome/fontawesome-free'));


app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "-1");
  next();
});


app.use(
  session({
    secret: "kedsgbdkekeke",
    resave: false,
    saveUninitialized: false,
  })
);


//loginn
app.get("/", (req, res) => {
  if(req.session.user){
    res.redirect("/home")
  }else{
    const message = req.session.message || null;
    req.session.message = null; 
    res.render("login", { message });
  }
});

app.post("/", (req, res)=> {
  const { username, password } = req.body;

  const crtUser = "admin";
  const crtPass = "1234";

  if(username === crtUser && password === crtPass){
    req.session.user = username;
    res.redirect('/home')
  }else{
    req.session.message = "Incorrect username / password";
    res.redirect("/");
  }

});


//home
app.get('/home', (req,res) => {
    if(req.session.user){
        res.render('home', {username: req.session.user})
    }else{
        res.redirect('/')
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) return res.send("Error while logging out");
      res.clearCookie("connect.sid");
      res.redirect("/");
  });
})


app.listen(3000, ()=> {
    console.log(`Server On http://localhost:3000`)
})
