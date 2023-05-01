const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

dotenv.config({ path: "config.env" });

const app = express();
const connectDb = require("./utils/connectDb");

connectDb();

app.set("view engine", "ejs");

// routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const UserModel = require("./models/userModel");

const port = process.env.PORT || 7002;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Authentication from https://youtu.be/cGAdC4A5fF4
const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  console.log({ token });

  if (token) {
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = await UserModel.findById(decoded.user.id);

    console.log(req.user);
    next();
  } else {
    res.render("login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("home");
});

app.get("/sign-up", (req, res) => {
  res.render("signUp");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", isAuthenticated, (req, res) => {
  res.render("logout", { user: req.user.username });
});

app.post("/api/sign-up", async (req, res) => {
  const { username, email, password } = req.body;

  const findUser = await UserModel.findOne({ email });

  if (findUser) {
    return res.render("login");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    username,
    email,
    password: hashedPassword,
  });

  res.redirect("/login");
});

app.post("/api/login", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.redirect("/sign-up");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", accessToken, {
      expires: new Date(Date.now() + 120000),
      httpOnly: true,
    });

    res.redirect("/");
  } else {
    console.log("incorrect");
    res.redirect("/login");
  }

  // const accessToken = jwt.sign(
  //   {
  //     user: {
  //       email: user.email,
  //       id: user.id,
  //     },
  //   },
  //   process.env.ACCESS_TOKEN_SECRET,
  //   { expiresIn: "1d" }
  // );

  // console.log({ accessToken });

  // res.cookie("token", accessToken, {
  //   expires: new Date(Date.now() + 120000),
  //   httpOnly: true,
  // });

  // res.redirect("/");
});

app.get("/api/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.redirect("/");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
