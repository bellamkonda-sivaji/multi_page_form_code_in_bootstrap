const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// Get data API
app.get("/user/", async (request, response) => {
  const getBooksQuery = `SELECT
      *
    FROM
      user_details
    `;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

//Post data api
app.post("/user/", async (request, response) => {
  const bookDetails = request.body;
  const {
    name,
    gender,
    age,
    emailId,
    password,
    zipCode,
    state,
    city,
    phoneNumber,
  } = bookDetails;
  const addBookQuery = `INSERT INTO
      user_details (name,gender,age,email_id,password,zip_code,state,city,phone_number)
    VALUES
      (
        '${name}',
         ${gender},
         ${age},
         ${emailId},
         ${password},
        '${zipCode}',
         ${state},
        '${city}',
        '${phoneNumber}'
         
      );`;

  const dbResponse = await db.run(addBookQuery);

  response.send(dbResponse);
});
