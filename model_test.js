// import { newStaff, create, getAll, getById, update,deleteById } from "./models/staff.js";

// const staff = newStaff(
//   null,
//   "Napassawan",
//   "P",
//   "sales",
//   "napassawan",
//   "abc123"
// );

// Create
// create(staff).then((result) => {
//   console.log("Query finished running!");
//   console.log(result);
// });

// Read
// getAll().then(results => console.log(results))
// getById(8)
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// Update
// getById(5).then(staff => {
//     staff.role = "stock"
//     update(staff)
//     .then(result => console.log("staff updated!"))
//     .catch(error => console.log("Failed to update"))
// })

// Delete
// deleteById(5).then(result => console.log("Staff deleted"))

// import { newProduct, create, getAll, getById, update, deleteById,getByBrand,get } from "./models/products.js";
// const product = newProduct(
//     null,
//     "iPhone 12",
//     "A2345",
//     "Apple",
//     "1100",
//     "23",
//     "1"
// );
// Create
// create(product).then((result) => {
//   console.log("Query finished running!");
//   console.log(result);
// });

// Read


// getByBrand("Apple")
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// Update
// getById(5).then(product => {
//     product.stock = "55"
//     update(product)
//     .then(result => console.log("product update!"))
//     .catch(error => console.log("Failed to update"))
// })

// Delete
// Delete
// deleteById(5).then(result => console.log("Product deleted"))


// import { newOrder, create, getAll, getById} from "./models/orders.js";
// const order = newOrder(
//     null,
//     (new Date().toISOString().slice(0, 19).replace('T', ' ')),
//     "pending",
//     null,
//     "Max",
//     "Well",
//     "max@well.com",
//     "0452678126",
//     "333 Koala ST",
//     "South Brisbane",
//     "QLD",
//     "4000",
//     "3"
// );

// // Create
// create(order).then((result) => {
//   console.log("Query finished running!");
//   console.log(result);
// });

// Read
// getAll().then(results => console.log(results))
// getById(1)
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// import { getAllByProductId, update} from "./models/products_feature.js";
// // getAllByProducts().then(results => console.log(results))
// // Update
// getAllByProductId(8).then(productfeature => {
//     productfeature.product_brand = "iphone"
//     update(productfeature)
//     .then(result => console.log("product update!"))
//     .catch(error => console.log("Failed to update"))
// })

// import { newFeature, create, getAll, getById, update, deleteById} from "./models/feature.js";

// const feature = newFeature(
//     null,
//     "200",
//     "168.9 x 76.7 x 8.8",
//     "Android 11",
//     "6.8",
//     "1080 x 2460",
//     "Octa-core",
//     "4",
//     "128",
//     "5000",
//     "main 48 MP"
// );

//Create
// create(feature).then((result) => {
//   console.log("Query finished running!");
//   console.log(result);
// });

// Read
// getAll().then(results => console.log(results))
// getById(5)
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));


//Update
// getById(5).then(feature => {
//     feature.ram = "2"
//     update(feature)
//     .then(result => console.log("feature updated!"))
//     .catch(error => console.log("Failed to update"))
// })

// Delete
// deleteById(7).then(result => console.log("Feature deleted"))

// import {getAllByOrderId, getAllByOrderStatus} from "./models/orders_products.js";

// getAllByOrderId(1)
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// getAllByOrderStatus("pending")
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// import {getAllByProductId} from "./models/products_feature.js";

// getAllByProductId(6)
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// import {getAll,getChangelogBySearch} from "./models/changelog.js";

// getChangelogBySearch("jenny")
// .then((result) => console.log(result))
//   .catch((error) => console.log(error));
// getChangelogBySearch("sky")
// .then((result) => console.log(result))
//   .catch((error) => console.log(error));