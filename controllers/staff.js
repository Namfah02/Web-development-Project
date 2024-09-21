import express from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
import access_control from "../access_control.js";
import * as Staff from "../models/staff.js";

const staffController = express.Router();

//Staff login
staffController.get("/staff_login", (request, response) => {
  response.render("staff_login.ejs");
});

staffController.post("/staff_login", (request, response) => {
  const login_username = request.body.username;
  const login_password = request.body.password;

  Staff.getByUsername(login_username)
    .then((staff) => {
      if (bcrypt.compareSync(login_password, staff.password)) {
        request.session.user = {
          staffID: staff.id,
          accessRole: staff.role,
          staffName: staff.username
        };
        if (request.session.user.accessRole === "manager") {
          response.redirect("/staff_user")
        } else if (request.session.user.accessRole === "stock") {
          response.redirect("/staff_product")
        } else if (request.session.user.accessRole === "sales") {
          response.redirect("/staff_order");
        }
      } else {
        response.render("status.ejs", {
          status: "Login Failed",
          message: "Invalid password",
        });
      }
    })
    .catch((error) => {
      response.render("status.ejs", {
        status: "Staff member not found",
        message: error,
      });
    });
});

staffController.get("/staff_logout", (request, response) => {
  request.session.destroy();
  response.redirect("/product_item");
});

staffController.get(
  "/staff_user",
  access_control(["manager"]),
  (request, response) => {
    const editID = request.query.edit_id;
    if (editID) {
      Staff.getById(editID).then((editStaff) => {
        Staff.getAll().then((allStaff) => {
          response.status(200).render("staff_user.ejs", {
            allStaff,
            editStaff,
            accessRole: request.session.user.accessRole,
          });
        });
      });
    } else {
      Staff.getAll()
        .then((allStaff) => {
          let staffList = "";
          for (const staff of allStaff) {
            staffList += staff.username + "<br>";
          }
          response.status(200).render("staff_user.ejs", {
            allStaff,
            editStaff: Staff.newStaff(0, "", "", "", "", ""),
            accessRole: request.session.user.accessRole,
          });
        })
        .catch((error) => {
          response.status(500).send("An error happened! " + error);
        });
    }
  }
);

staffController.post(
  "/edit_staff",
  access_control(["manager"]),
  (request, response) => {
    const formData = request.body;
    //validation
    if (!/[a-zA-Z-]{2,}/.test(formData.first_name)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid first name",
        message: "First name must be letters",
      });
      //stop
      return;
    }

    if (!/[a-zA-Z-]{2,}/.test(formData.last_name)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid last name",
        message: "Last name must be letters",
      });
      //stop
      return;
    }

    if (!/[a-zA-Z0-9-]{6,}/.test(formData.password)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid password",
        message:
          "Password must be at least 6 characters and contain a variety of characters.",
      });
      //stop
      return;
    }

    // Create a staff model object to represent the staff member submitted
    const editStaff = Staff.newStaff(
      validator.escape(formData.staff_id),
      validator.escape(formData.first_name),
      validator.escape(formData.last_name),
      validator.escape(formData.access_role),
      validator.escape(formData.username),
      formData.password
    );

    // hash the password 
    if (!editStaff.password.startsWith("$2a")) {
      editStaff.password = bcrypt.hashSync(editStaff.password);
    }

    // Determine and run CRUD operation
    if (formData.action == "create") {
      Staff.create(editStaff).then(([result]) => {
        response.redirect("/staff_user");
      });
    } else if (formData.action == "update") {
      Staff.update(editStaff).then(([result]) => {
        response.redirect("/staff_user");
      });
    } else if (formData.action == "delete") {
      Staff.deleteById(editStaff.id).then(([result]) => {
        response.redirect("/staff_user");
      });
    }
  }
);
export default staffController;
