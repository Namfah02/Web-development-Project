import { db_conn } from "../database.js";

export function newFeature(
  id,
  weight,
  dimensions,
  os,
  screensize,
  resolution,
  cpu,
  ram,
  storage,
  battery,
  camera
) {
  return {
    id,
    weight,
    dimensions,
    os,
    screensize,
    resolution,
    cpu,
    ram,
    storage,
    battery,
    camera,
  };
}

//Create
export function create(feature) {
  return db_conn.query(
    "INSERT INTO feature (feature_weight, feature_dimensions, feature_os, feature_screensize, feature_resolution, feature_cpu, feature_ram, feature_storage, feature_battery, feature_camera ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      feature.weight,
      feature.dimensions,
      feature.os,
      feature.screensize,
      feature.resolution,
      feature.cpu,
      feature.ram,
      feature.storage,
      feature.battery,
      feature.camera,
    ]
  );
}

// Read
export function getAll() {
  return db_conn.query("SELECT * FROM feature").then(([queryResult]) => {
    return queryResult.map((result) =>
      newFeature(
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
export function getById(featureID) {
  return db_conn
    .query("SELECT * FROM feature WHERE feature_id = ?", [featureID])
    .then(([queryResult]) => {
      if (queryResult.length > 0) {
        const result = queryResult[0];

        return newFeature(
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
export function update(feature) {
  return db_conn.query(
    `
    UPDATE feature SET feature_weight = ?, feature_dimensions = ?, feature_os = ?, feature_screensize = ?, feature_resolution = ?, feature_cpu = ?, feature_ram = ?, feature_storage = ?, feature_battery = ?, feature_camera = ? 
    WHERE feature_id = ? 
    `,
    [
      feature.weight,
      feature.dimensions,
      feature.os,
      feature.screensize,
      feature.resolution,
      feature.cpu,
      feature.ram,
      feature.storage,
      feature.battery,
      feature.camera,
      feature.id,
    ]
  );
}

//Delete
export function deleteById(featureID) {
  return db_conn.query("DELETE FROM feature WHERE feature_id = ?", [featureID]);
}
