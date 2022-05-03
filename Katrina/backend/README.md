# Backend

## Running the backend

1. Establish **postgres** database with the following credential

   ```json
   {
     user: 'postgres',
     host: 'localhost',
     database: 'postgres',
     password: 'postgres',
     port: 5432,
   }
   ```

2. Execute all of the statements provided in `schema.sql`.

3. To install dependencies, run `yarn install`.

4. Run `yarn start` command in this directory.

5. To reset the database, re-execute the statements provided in `schema.sql`

    