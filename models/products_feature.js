import { db_conn } from "../database.js";

export function newProductFeature(
  product_id,
  product_name,
  product_model,
  product_brand,
  product_price,
  product_stock,
  feature_id,
  feature_weight,
  feature_dimensions,
  feature_os,
  feature_screensize,
  feature_resolution,
  feature_cpu,
  feature_ram,
  feature_storage,
  feature_battery,
  feature_camera
) {
  return {
    product_id,
    product_name,
    product_model,
    product_brand,
    product_price,
    product_stock,
    feature_id,
    feature_weight,
    feature_dimensions,
    feature_os,
    feature_screensize,
    feature_resolution,
    feature_cpu,
    feature_ram,
    feature_storage,
    feature_battery,
    feature_camera,
  };
}
// Create

export function create(productfeature) {
  return db_conn.query(
    "INSERT INTO feature (feature_weight, feature_dimensions, feature_os, feature_screensize, feature_resolution, feature_cpu, feature_ram, feature_storage, feature_battery, feature_camera ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      productfeature.feature_weight,
      productfeature.feature_dimensions,
      productfeature.feature_os,
      productfeature.feature_screensize,
      productfeature.feature_resolution,
      productfeature.feature_cpu,
      productfeature.feature_ram,
      productfeature.feature_storage,
      productfeature.feature_battery,
      productfeature.feature_camera,
    ]
  ).then(([queryResult]) => {
    return db_conn.query(
      "INSERT INTO products (product_name, product_model, product_brand, product_price, product_stock, product_feature_id) VALUES (?, ?, ?, ?, ?, " + queryResult.insertId + ")",
      [
        productfeature.product_name,
        productfeature.product_model,
        productfeature.product_brand,
        productfeature.product_price,
        productfeature.product_stock
      ]
    );
  });


}

//Read
export function getAllByProducts() {
  return db_conn.query("SELECT * FROM products INNER JOIN feature ON products.product_feature_id = feature.feature_id WHERE products.product_deleted = 0").then(([queryResult]) => {
    return queryResult.map((result) =>
    newProductFeature(
      result.product_id,
      result.product_name,
      result.product_model,
      result.product_brand,
      result.product_price,
      result.product_stock,
      result.feature_id,
      result.feature_weight,
      result.feature_dimensions,
      result.feature_os,
      result.feature_screensize,
      result.feature_resolution,
      result.feature_cpu,
      result.feature_ram,
      result.feature_storage,
      result.feature_battery,
      result.feature_camera
      )
    );
  });
}


export function getAllByProductId(productID) {
  return db_conn
    .query(
      "SELECT * FROM products INNER JOIN feature ON products.product_feature_id = feature.feature_id WHERE products.product_deleted = 0 AND products.product_id = ?",
      [productID]
    )
    .then(([queryResult]) => {
      if (queryResult.length > 0) {
        const result = queryResult[0];

        return newProductFeature(
          result.product_id,
          result.product_name,
          result.product_model,
          result.product_brand,
          result.product_price,
          result.product_stock,
          result.feature_id,
          result.feature_weight,
          result.feature_dimensions,
          result.feature_os,
          result.feature_screensize,
          result.feature_resolution,
          result.feature_cpu,
          result.feature_ram,
          result.feature_storage,
          result.feature_battery,
          result.feature_camera
        );
      } else {
        return Promise.reject("no results was found");
      }
    });
}

//Update
export function updateProduct(productfeature) {
  return db_conn.query(
    `
      UPDATE products 
      SET product_name = ?, product_model = ?, product_brand = ?, product_price = ?, product_stock = ?
      WHERE product_id = ?
  `,
    [
      productfeature.product_name,
      productfeature.product_model,
      productfeature.product_brand,
      productfeature.product_price,
      productfeature.product_stock,
      productfeature.product_id
    ]
  );

}

export function updateFeature(productfeature) {
  return db_conn.query(
    `
    UPDATE feature
    SET feature_weight = ?, feature_dimensions = ?, feature_os = ?, feature_screensize = ?, feature_resolution = ?, feature_cpu = ?, feature_ram = ?, feature_storage = ?, feature_battery = ?, feature_camera = ? 
    WHERE feature_id = ? 
    `,
    [
      productfeature.feature_weight,
      productfeature.feature_dimensions,
      productfeature.feature_os,
      productfeature.feature_screensize,
      productfeature.feature_resolution,
      productfeature.feature_cpu,
      productfeature.feature_ram,
      productfeature.feature_storage,
      productfeature.feature_battery,
      productfeature.feature_camera,
      productfeature.feature_id,
    ]
  );
  }




  // Delete
export function deleteProduct(productID) {
  return db_conn.query("UPDATE products SET product_deleted = 1 WHERE product_id = ?", [
    productID,
  ]);
}

export function deleteFeature(featureID) {
  return db_conn.query("DELETE FROM feature WHERE feature_id = ?", [
    featureID,
  ]);
}