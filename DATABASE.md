# Database Documentation

## Current Implementation
The API uses **SQLite** as the database, which stores data in `database.sqlite` file.

## Data in Database
Total users: 5
- John Doe (ID: 1)
- Jane Smith (ID: 2)
- Bob Johnson (ID: 3)
- lyhour (ID: 4)
- yuna (ID: 5)

## MySQL Compatibility
MySQL schema and data are provided in:
- `database.sql` - MySQL table structure
- `mysql_import.sql` - Complete MySQL database with data

## To Switch to MySQL
1. Import `mysql_import.sql` to phpMyAdmin
2. Update `.env` file:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=myapp
3. Update `src/config/db.js` to use MySQL (see mysql_version.js)
