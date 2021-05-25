# run this code to setup a blank databse

rm -f "database.sqlite3"

cat schema.sql | sqlite3 database.sqlite3
