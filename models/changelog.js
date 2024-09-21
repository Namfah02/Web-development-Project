import { db_conn } from "../database.js";

export function newChangelog(
  id,
  date_last_updated,
  product_id,
  staff_id,
  description
) {
  return {
    id,
    date_last_updated,
    product_id,
    staff_id,
    description
  };
}

export function getAll() {
  return db_conn.query(`SELECT changelog.changelog_id, DATE_FORMAT(changelog.date_last_updated, '%d-%m-%Y %H:%i:%s') AS date_last_updated, changelog.product_id, changelog.staff_id, changelog.description 
  FROM changelog ORDER BY date_last_updated DESC `).then(([queryResult]) => {
    return queryResult.map((result) =>
    newChangelog(
        result.changelog_id,
        result.date_last_updated,
        result.product_id,
        result.staff_id,
        result.description
      )
    );
  });
}


//Create
export function create(product_id, staff_id, description) {
  return db_conn.query(
    "INSERT INTO changelog (product_id, staff_id, description) VALUES (?, ?, ?)",
    [
      product_id,
      staff_id,
      description
    ]
  );
}




export function getChangelogBySearch(searchChangelog, startDate, endDate){
  return db_conn.query(
      `SELECT changelog.changelog_id, DATE_FORMAT(changelog.date_last_updated, '%d-%m-%Y %H:%i:%s') AS date_last_updated, changelog.product_id, changelog.staff_id, changelog.description 
      FROM changelog
      INNER JOIN staff
       ON staff.staff_id = changelog.staff_id
       INNER JOIN products
       ON products.product_id = changelog.product_id
       WHERE (staff.staff_username LIKE ? OR products.product_name LIKE ?  OR description LIKE ?) 
       AND DATE(date_last_updated) BETWEEN ? AND ?
      `,
      [`%${searchChangelog}%`, `%${searchChangelog}%`, `%${searchChangelog}%`, `${startDate}`, `${endDate}`]
  ).then(([queryResult]) => {
    return queryResult.map((result) =>
    newChangelog(
        result.changelog_id,
        result.date_last_updated,
        result.product_id,
        result.staff_id,
        result.description
      )
    );
  });
}

