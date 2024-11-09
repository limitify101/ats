import app from "./src/app";
import dotenv from "dotenv";
import db from "./models/index";
dotenv.config();

const port = process.env.PORT || 3000;
db.sequelize
  .sync()
  .then(() => {
    console.log("Database in sync mode...");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err: any) => {
    console.error("Failed to sync database:", err);
  });
