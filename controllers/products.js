import express from "express";
import * as Products from "../models/products.js";
import * as ProductFeature from "../models/products_feature.js";
import * as ChangeLog from "../models/changelog.js";
import access_control from "../access_control.js";
import validator from "validator";

const productController = express.Router();

productController.get("/product_item", (request, response) => {
  if (request.query.search_product) {
    Products.getBySearch(request.query.search_product).then((products) => {
      response.render("product_item.ejs", { products });
    });
  } else if (request.query.brand) {
    Products.getByBrand(request.query.brand).then((products) => {
      response.render("product_item.ejs", { products });
    });
} else if (request.query.price) {
    Products.getByPrice(request.query.price).then((products) => {
      response.render("product_item.ejs", { products });
    });
  } 
  else {
    Products.getAll().then((products) => {
      response.render("product_item.ejs", { products });
    });
  }
});

productController.get("/product_details", (request, response) => {
  if (request.query.id) {
    ProductFeature.getAllByProductId(request.query.id)
      .then((productfeature) => {
        response.render("product_details.ejs", { productfeature });
      })
      .catch((error) => {
        response.status(500).send("An error happened " + error);
      });
  }
});

productController.get("/product_checkout", (request, response) => {
  ProductFeature.getAllByProductId(request.query.id)
    .then((productfeature) => {
      response.render("product_checkout.ejs", { productfeature });
    })
    .catch((error) => {
      response.status(500).send("An error happened " + error);
    });
});

productController.get(
  "/staff_product",
  access_control(["manager", "stock"]),
  (request, response) => {
    const editID = request.query.edit_id;
    if (editID) {
      ProductFeature.getAllByProductId(editID).then((editProduct) => {
        ProductFeature.getAllByProducts().then((allProduct) => {
          response.render("staff_product.ejs", {
            allProduct,
            editProduct,
            accessRole: request.session.user.accessRole,
          });
        });
      });
    } else {
      ProductFeature.getAllByProducts()
        .then((allProduct) => {
          response.render("staff_product.ejs", {
            allProduct,
            editProduct: ProductFeature.newProductFeature(
              0,
              "",
              "",
              "",
              "",
              "",
              0,
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              ""
            ),
            accessRole: request.session.user.accessRole,
          });
        })
        .catch((error) => {
          response.status(500).send("An error happened! " + error);
        });
    }
  }
);

productController.post(
  "/edit_product",
  access_control(["manager", "stock"]),
  (request, response) => {
    const formData = request.body;

    // Validation

    //Product name
    if (!/^[a-zA-Z0-9 ]+$/.test(formData.name)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid product name",
        message: "Product name accept letters, numbers and spaces",
      });
      //stop
      return;
    }

    //Product model
    if (!/^[a-zA-Z]{1}[0-9]{4}$/.test(formData.model)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid product model",
        message: "Product model must have 1 letters and 4 numbers",
      });
      //stop
      return;
    }

    //Product brand
    if (!/[a-zA-Z]{2,}$/.test(formData.brand)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid product brand",
        message: "Product brand must be letters",
      });
      //stop
      return;
    }
    
    //Product price
      if (!/^\d+(\d{3})*(\.\d{1,2})?$/.test(formData.price)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid product price",
        message: "Product price must have dollar and cents",
      });
      //stop
      return;
    }

    //Product stock
    if (!/^[0-9]+$/.test(formData.stock)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid product stock",
        message: "Product stock must be numbers",
      });
      //stop
      return;
    }

    //Feature weight
    if (!/^[0-9]+$/.test(formData.weight)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid feature weight",
        message: "Feature weight must be numbers",
      });
      //stop
      return;
    }

    //Feature dimensions
    if (!/(\d+(?:.\d+)?) x (\d+(?:.\d+)?)(?: x (\d+(?:.\d+)?))?/.test(formData.dimensions)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid feature dimensions",
        message: "Feature dimentions must be fllow dimensions format e.g. 146.7 x 71.5 x 7.4",
      });
      //stop
      return;
    }

    //Feature OS
    if (!/^[a-zA-Z0-9 ]+$/.test(formData.os)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid feature OS",
        message: "Feature OS accept letters, numbers and spaces",
      });
      //stop
      return;
    }

    //Feature screensize
    if (!/^\d{1,1}(\.\d{1})?$/.test(formData.screensize)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid feature screensize",
        message: "Feature screensize must follow screensize in inches e.g. 6.5",
      });
      //stop
      return;
    }

    //Feature resolution
    if (!/([0-9]{1,}|[1-9][0-9]{2}|600)* x ([0-9]{1,2}|[1-9][0-9]{2}|600)*/.test(formData.resolution)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid feature resolution",
        message: "Feature resolution must be fllow resolution format e.g. 1170 x 2532",
      });
      //stop
      return;
    }

    //Feature cpu
    if (!/^[a-zA-Z-]+$/.test(formData.cpu)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid feature cpu",
        message: "Feature cpu accept letters and hyphen",
      });
      //stop
      return;
    }

    //Feature ram
    if (!/^[0-9]+$/.test(formData.ram)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid feature ram",
        message: "Feature ram must be number",
      });
      //stop
      return;
    }

    //Feature storage
    if (!/^[0-9]+$/.test(formData.storage)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid feature storage",
        message: "Feature storage must be number",
      });
      //stop
      return;
    }

    //Feature battery
    if (!/^[0-9]+$/.test(formData.battery)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid feature battery",
        message: "Feature battery must be number",
      });
      //stop
      return;
    }

    //Feature camera
    if (!/^[a-zA-Z0-9 ]+$/.test(formData.camera)) {
      // show error and stop running
      response.render("status.ejs", {
        status: "Invalid feature camera",
        message: "Feature camera accept letters, numbers and spaces",
      });
      //stop
      return;
    }

    const editedProduct = ProductFeature.newProductFeature(
      validator.escape(formData.product_id),
      validator.escape(formData.name),
      validator.escape(formData.model),
      validator.escape(formData.brand),
      validator.escape(formData.price),
      validator.escape(formData.stock),
      validator.escape(formData.feature_id),
      validator.escape(formData.weight),
      validator.escape(formData.dimensions),
      validator.escape(formData.os),
      validator.escape(formData.screensize),
      validator.escape(formData.resolution),
      validator.escape(formData.cpu),
      validator.escape(formData.ram),
      validator.escape(formData.storage),
      validator.escape(formData.battery),
      validator.escape(formData.camera),
    );

    // Determine and run CRUD operation
    if (formData.action == "create") {
      ProductFeature.create(editedProduct)
      .then(([result]) => {
        //Add record to the change log
        ChangeLog.create(
          result.insertId,
          request.session.user.staffID,
          "Product " + editedProduct.product_name + " has been created by " + request.session.user.staffName
        )
        .then(([result]) => {
          response.redirect("/staff_product");
        });
      });
    }
    else if (formData.action == "update") {
      ProductFeature.updateProduct(editedProduct).then(([result]) => {
        ProductFeature.updateFeature(editedProduct)
        .then(([result]) => {
          //Add record to the change log
          ChangeLog.create(
            editedProduct.product_id,
            request.session.user.staffID,
            "Product " + editedProduct.product_name + " has been updated by " + request.session.user.staffName
          )
          .then(([result]) => {
            response.redirect("/staff_product");
          });
        });
      });
    }
    else if (formData.action == "delete") {
        ProductFeature.deleteProduct(editedProduct.product_id).then(([result]) => {
          //Add record to the change log
          ChangeLog.create(
            editedProduct.product_id,
            request.session.user.staffID,
            "Product " + editedProduct.product_name + " has been deleted by " + request.session.user.staffName
          )
          .then(([result]) => {
            response.redirect("/staff_product");
          });          
        });
    } 
    
  });
 

productController.get("/staff_changelog", access_control(["manager"]),(request, response) => {
  let startDate = "";
	let endDate = "";
    if (request.query.search_changelog,request.query.startDate, request.query.endDate){
      startDate = request.query.startDate;
		  endDate = request.query.endDate ? request.query.endDate : startDate;
       ChangeLog.getChangelogBySearch(request.query.search_changelog,request.query.startDate, request.query.endDate).then((changelog) => {
        response.render("staff_changelog.ejs", { changelog, accessRole: request.session.user.accessRole })
       })
   } 
  else {
    ChangeLog.getAll().then((changelog) => {
      response.render("staff_changelog.ejs", { changelog, accessRole: request.session.user.accessRole });
  });
   }
  });

export default productController;
