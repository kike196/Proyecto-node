-- updateUserPath.sql
UPDATE users SET name = IFNULL(?, name), user = IFNULL(?, user), phone = IFNULL(?, phone), email = IFNULL(?, email), rol = IFNULL(?, rol) WHERE id = ?;
