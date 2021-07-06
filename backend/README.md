# Notes 

* put /forum/tags == get /forum/tags (There's a swagger io bug that wont let me use get) 
Other than that returns desired list of tags <br />

* No implementation for file system as of yet <br />

## To start:

Download and install postgresql server <br />

Create database on pgAdmin4 with: 

```
database: metalms
password: metalms
```

Start SQL Shell (psql) and import data

```
\i schema.sql
\i sample_data.sql
```

## Bugs / Requests 

* Add any bugs or requests for data etc to: <br />
```
/docs/bugs.txt
/docs/requests.txt
```