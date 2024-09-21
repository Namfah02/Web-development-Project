import { db_conn } from "../database.js";

export function newProduct(id, name, model, brand, price, stock, feature_id) {
  return {
    id,
    name,
    model,
    brand,
    price,
    stock,
    feature_id,
  };
}

// Create
export function create(product) {
  return db_conn.query(
    "INSERT INTO products (product_name, product_model, product_brand, product_price, product_stock, product_feature_id) VALUES (?, ?, ?, ?, ?, ?)",
    [
      product.name,
      product.model,
      product.brand,
      product.price,
      product.stock,
      product.feature_id,
    ]
  );
}
// Read
export function getAll() {
  return db_conn.query("SELECT * FROM products WHERE product_deleted = 0 ").then(([queryResult]) => {
    return queryResult.map((result) =>
      newProduct(
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

export function getById(productID) {
  return db_conn
    .query("SELECT * FROM products WHERE product_id = ?", [productID])
    .then(([queryResult]) => {
      if (queryResult.length > 0) {
        const result = queryResult[0];
        return newProduct(
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

// Update
export function update(product) {
  return db_conn.query(
    `
      UPDATE products
      SET product_name = ?, product_model = ?, product_brand = ?, product_price = ?, product_stock = ?, product_feature_id = ?
      WHERE product_id = ?
  `,
    [
      product.name,
      product.model,
      product.brand,
      product.price,
      product.stock,
      product.feature_id,
      product.id,
    ]
  );
}

// Delete
export function deleteById(productID) {
  return db_conn.query("UPDATE products SET product_deleted = 1 WHERE product_id = ?", 
  [productID])
}

// Search
export function getBySearch(searchProduct) {
  return db_conn
    .query(
      "SELECT * FROM products WHERE product_deleted = 0 AND (product_name LIKE ? OR product_brand LIKE ? OR product_price LIKE ?)",
      [`%${searchProduct}%`, `%${searchProduct}%`, `%${searchProduct}%`]
    )
    .then(([queryResult]) => {
      return queryResult.map((result) =>
        newProduct(
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

//product by brand
export function getByBrand(brand) {
  if (brand == 'All') {
    return db_conn
		.query(`SELECT * from products WHERE product_deleted = 0`)
		.then(([queryResult]) => {
      return queryResult.map((result) =>
        newProduct(
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
  } else
  {
    return db_conn
		.query(`SELECT * from products WHERE product_deleted = 0 AND product_brand = ?`, [brand])
		.then(([queryResult]) => {
      return queryResult.map((result) =>
        newProduct(
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

}
//product by price
export function getByPrice(price) {
	return db_conn
		.query(`SELECT * from products WHERE product_deleted = 0 AND product_price <= ?`, [price])
		.then(([queryResult]) => {
      return queryResult.map((result) =>
        newProduct(
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

// Product out of stock
export function updateStockById(productID, difference) {
  return db_conn.query(`
  UPDATE products
  SET product_stock = product_stock + ?
  WHERE product_id = ?
  `, [difference, productID])
}

//stock decrease after customer ordered
export function productStockDecrease(product_id) {
  return db_conn.query(`
    UPDATE products
    SET product_stock= product_stock - 1
    WHERE product_id =?
    `,
    [product_id]
  );
}



