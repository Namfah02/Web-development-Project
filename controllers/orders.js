import express from "express";
import validator from "validator";
import * as Orders from "../models/orders.js";
import * as OrdersProducts from "../models/orders_products.js";
import * as Products from "../models/products.js";
import access_control from "../access_control.js";

const orderController = express.Router();

orderController.post("/product_checkout", (request, response) => {
  if (request.body) {
    const formData = request.body;
    console.log(formData);
    // validate data formats
    //First name
    if (!/[a-zA-Z-]{2,}/.test(formData.customer_first_name)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid first name",
        message: "First name must be letters",
      });
      //stop
      return;
    }
    // Last name
    if (!/[a-zA-Z-]{2,}/.test(formData.customer_last_name)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid last name",
        message: "Last name must be letters",
      });
      //stop
      return;
    }

    //Phone number
    if (
      !/(^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$)/.test(formData.customer_phone)) {
          // show error and stop running
      response.render("status.ejs", {
        status: "Invalid phone number",
        message: "Please enter a valid Australian phone number",
      });
      //stop
      return;
    }

    //Email
    if (!/^\S{1,}@\S{1,}[.]\S{1,}$/.test(formData.customer_email)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid email address",
        message: "Please enter a valid email address",
      });
      //stop
      return;
    }

    // Address state
    if (!/[a-zA-Z-]{2,}/.test(formData.address_state)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid address state",
        message: "Please, enter Australian state",
      });
      //stop
      return;
    }

    //Address postcode
    if (!/[0-9]{3}/.test(formData.address_postcode)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid address postcode",
        message: "Please, enter Australian postcode with 4 numbers.",
      });
      //stop
      return;
    }

    if (!/[0-9]{1,}/.test(formData.product_id)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid product ID",
        message: "Please choose another product.",
      });
      //stop
      return;
    }


    //construct an order
    const newOrder = Orders.newOrder(
      null, //new order id
      new Date().toISOString().slice(0, 19).replace("T", " "),
      "pending",
      validator.escape(formData.customer_first_name),
      validator.escape(formData.customer_last_name),
      validator.escape(formData.customer_email),
      validator.escape(formData.customer_phone),
      validator.escape(formData.customer_address),
      validator.escape(formData.address_suburb),
      validator.escape(formData.address_state),
      validator.escape(formData.address_postcode),
      validator.escape(formData.product_id)
    );

    // add order to database
    Orders.create(newOrder).then(([result]) => {
      response.redirect("/order_details?id=" + result.insertId);
      Products.productStockDecrease(formData.product_id);
    }).catch(() => {
      response.render("status.ejs", {
          status: "Failed to create order",
          message: "Order creation failed, please contact staff for support."
      })
    })
  }
});

orderController.get("/order_details", (request, response) => {
  if (!/[0-9]{1,}/.test(request.query.id)) {
      response.render("status.ejs", {
          status: "Invalid order ID",
          message: "Please contact support.",
      });
      return;
  }

  if (request.query.id) {
      OrdersProducts.getAllByOrderId(request.query.id).then(
          orderProduct => {
              response.render("order_details.ejs", {
                  orderProduct,
              });
          }
      ).catch(error => {
          response.render("status.ejs", {
              status: "Failed to get order status",
              message: error,
          });
      })
  }
});


orderController.get(
  "/staff_order",
  access_control(["manager", "sales"]),
  (request, response) => {
      let orderStatus = request.query.status;
      if (!orderStatus) {
          orderStatus = "pending";
      }

      OrdersProducts.getAllByOrderStatus(orderStatus).then(ordersProducts => {
          response.render("staff_order.ejs", {
              ordersProducts,
              orderStatus,
              accessRole: request.session.user.accessRole,
          });
      });
  }
);

orderController.post(
  "/staff_order",
  access_control(["manager", "sales"]),
  (request, response) => {
      const formData = request.body;
      Orders.updateStatusById(formData.order_id, formData.status).then(
          ([result]) => {
              if (result.affectedRows > 0) {
                 response.redirect("/staff_order");
            }
          }
      );
  }
);

export default orderController;
