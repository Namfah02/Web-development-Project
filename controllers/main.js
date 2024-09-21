import express from "express";

const mainController = express.Router();

mainController.get("/about", (request, response) => {
    response.render("about.ejs");
});

mainController.get("/review", (request, response) => {
    response.render("review.ejs");
});

export default mainController;