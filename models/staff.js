import { db_conn } from "../database.js";

export function newStaff(id, first_name, last_name, role, username, password) {
  return {
    id,
    first_name,
    last_name,
    role,
    username,
    password,
  };
}

// Create
export function create(staff) {
  return db_conn.query(
    "INSERT INTO staff (staff_first_name, staff_last_name, staff_role, staff_username, staff_password) VALUES (?, ?, ?, ?, ?)",
    [
      staff.first_name,
      staff.last_name,
      staff.role,
      staff.username,
      staff.password,
    ]
  );
}

// Read
export function getAll() {
  return db_conn.query("SELECT * FROM staff WHERE staff_deleted = 0 ").then(([queryResult]) => {
    return queryResult.map((result) =>
      newStaff(
        result.staff_id,
        result.staff_first_name,
        result.staff_last_name,
        result.staff_role,
        result.staff_username,
        result.staff_password
      )
    );
  });
}

export function getById(staffId) {
  return db_conn
    .query("SELECT * FROM staff WHERE staff_id = ?", [staffId])
    .then(([queryResult]) => {
      if (queryResult.length > 0) {
        const result = queryResult[0];
        return newStaff(
          result.staff_id,
          result.staff_first_name,
          result.staff_last_name,
          result.staff_role,
          result.staff_username,
          result.staff_password
        );
      } else {
        return Promise.reject("no results was found");
      }
    });
}

export function getByUsername(username) {
  return db_conn
    .query(`SELECT * FROM staff WHERE staff_username = ?`, [username])
    .then(([queryResult]) => {
      if (queryResult.length > 0) {
        const result = queryResult[0];
        return newStaff(
          result.staff_id,
          result.staff_first_name,
          result.staff_last_name,
          result.staff_role,
          result.staff_username,
          result.staff_password
        );
      } else {
        return Promise.reject("no matching results");
      }
    });
}

// Update
export function update(staff) {
  return db_conn.query(
    "UPDATE staff SET staff_first_name = ?, staff_last_name = ?, staff_role = ?, staff_username = ?, staff_password = ? WHERE staff_id = ? ",
    [
      staff.first_name,
      staff.last_name,
      staff.role,
      staff.username,
      staff.password,
      staff.id,
    ]
  );
}
// Delete
export function deleteById(staffID) {
  return db_conn.query("UPDATE staff SET staff_deleted = 1 WHERE staff_id = ?", [staffID]);
}
