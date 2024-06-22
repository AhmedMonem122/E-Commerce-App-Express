const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 6000;

const url = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(url).then(() => {
  console.log("Database is connected successfully!");
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
