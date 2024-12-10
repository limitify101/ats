import app from "../src/app";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

// Start the Express server
app.listen(port, () => {
  if (process.env.NODE_ENV === "test") {
    console.log("Initialized testing environment...");
  }
  console.log(`Server listening on port ${port}`);
});
