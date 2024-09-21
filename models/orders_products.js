import { db_conn } from "../database.js";

export function newOrderProduct(
  order_id,
  order_datetime,
  order_status,
  customer_first_name,
  customer_last_name,
  customer_email,
  customer_phone,
  customer_address,
  address_state,
  address_suburb,
  address_postcode,
  product_id,
  product_name,
  product_model,
  product_brand,
  product_price,
  product_stock,
  product_feature_id
) {
  return {
    order_id,
    order_datetime,
    order_status,
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_phone,
    customer_address,
    address_state,
    address_suburb,
    address_postcode,
    product_id,
    product_name,
    product_model,
    product_brand,
    product_price,
    product_stock,
    product_feature_id,
  };
}

export function getAllByOrderStatus(status) {
  return db_conn
    .query(
      "SELECT * FROM orders INNER JOIN products ON orders.order_product_id = products.product_id WHERE orders.order_status = ?",
      [status]
    )
    .then(([queryResult]) => {
      return queryResult.map((result) =>
        newOrderProduct(
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
          result.product_id,
          result.product_name,
          result.product_model,
          result.product_brand,
          result.product_price,
          result.product_stock,
          result.product_feature_id
        )
      );
    });
}

export function getAllByOrderId(orderID) {
  return db_conn
    .query(
      "SELECT * FROM orders INNER JOIN products ON orders.order_product_id = products.product_id WHERE orders.order_id = ?",
      [orderID]
    )
    .then(([queryResult]) => {
      if (queryResult.length > 0) {
        const result = queryResult[0];

        return newOrderProduct(
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
          result.product_id,
          result.product_name,
          result.product_model,
          result.product_brand,
          result.product_price,
          result.product_stock,
          result.product_feature_id
        );
      } else {
        return Promise.reject("no results was found");
      }
    });
}
