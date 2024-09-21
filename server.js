import express from "express";
import session from "express-session";

const app = express()
const port = 8082


app.use(
    session({
        secret: "secret phrase",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })
);

// Enable support for URL-encoded request bodies (form posts)
app.use(express.urlencoded({extended: true,}));
// TODO: setup and use session middleware

// TODO: setup nad the EJS view engine
app.set("view engine", "ejs")
// TODO: setup 404 and root page redirects

// TODO: setup and use static files middleware
app.use(express.static("static"))

//TODO: import and use controllers
import productController from "./controllers/products.js";
app.use(productController);
import orderController from "./controllers/orders.js";
app.use(orderController);
import staffController from "./controllers/staff.js";
app.use(staffController);
import mainController from "./controllers/main.js";
app.use(mainController);


app.listen(port, () => {
    console.log("Express server start on http://localhost:" + port + "/product_item")
    console.log("Express server start on http://localhost:" + port + "/staff_login")
})