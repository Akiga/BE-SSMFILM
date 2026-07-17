require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const compression = require("compression");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const route = require("./routes");
const db = require("./config/config");

// Middlewares
const authen = require("./middlewares/authenticateMiddleware");

const app = express();
const port = process.env.PORT || 5000;

/* ===========================
   Database
=========================== */

db.connectDB();

/* ===========================
   Global Middlewares
=========================== */

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ssmfilm.vercel.app",
    ],
    credentials: true,
  })
);

// Gzip Compression
app.use(compression());

// Hỗ trợ PUT, DELETE trong form
app.use(methodOverride("_method"));

// Parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie
app.use(cookieParser());

/* ===========================
   Session
=========================== */

app.set("trust proxy", 1);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
  })
);

/* ===========================
   Static Files
=========================== */

app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "30d",
    etag: true,
    lastModified: true,
  })
);

/* ===========================
   View Engine
=========================== */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "resources", "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");

/* ===========================
   Custom Middlewares
=========================== */

app.use(authen);

/* ===========================
   Routes
=========================== */

route(app);

/* ===========================
   Start Server
=========================== */

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});