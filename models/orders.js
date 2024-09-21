import { db_conn } from "../database.js";

export function newOrder(
  id,
  datetime,
  status,
  customer_first_name,
  customer_last_name,
  customer_email,
  customer_phone,
  customer_address,
  address_suburb,
  address_state,
  address_postcode,
  product_id
) {
  return {
    id,
    datetime,
    status,
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_phone,
    customer_address,
    address_suburb,
    address_state,
    address_postcode,
    product_id
  };
}

//Create
export function create(order) {
  return db_conn.query(
    "INSERT INTO orders (order_datetime, order_status, customer_first_name, customer_last_name, customer_email, customer_phone, customer_address, address_suburb, address_state, address_postcode, order_product_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      order.datetime,
      order.status,
      order.customer_first_name,
      order.customer_last_name,
      order.customer_email,
      order.customer_phone,
      order.customer_address,
      order.address_suburb,
      order.address_state,
      order.address_postcode,
      order.product_id,
    ]
  );
}

//Read
export function getAll() {
  return db_conn.query("SELECT * FROM orders").then(([queryResult]) => {
    // convert each result into a model object
    return queryResult.map((result) =>
      newOrder(
        result.order_id,
        result.order_datetime,
        result.order_status,
        result.customer_first_name,
        result.customer_last_name,
        result.customer_email,
        result.customer_phone,
        result.customer_address,
        result.address_suburb,
        result.address_state,
        result.address_postcode,
        result.order_product_id
      )
    );
  });
}
export function getById(orderID) {
  return db_conn
    .query("SELECT * FROM orders WHERE order_id = ?", [orderID])
    .then(([queryResult]) => {
      if (queryResult.length > 0) {
        const result = queryResult[0];

        return newOrder(
          result.order_id,
          result.order_datetime,
          result.order_status,
          result.customer_first_name,
          result.customer_last_name,
          result.customer_email,
          result.customer_phone,
          result.customer_address,
          result.address_suburb,
          result.address_state,
          result.address_postcode,
          result.order_product_id
        );
      } else {
        return Promise.reject("no results was found");
      }
    });
}

//status
export function updateStatusById(orderID, status) {
  return db_conn.query(
    "UPDATE orders SET order_status = ? WHERE order_id = ?",
    [status, orderID]
  );
}


