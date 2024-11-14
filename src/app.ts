import express, { Request, Response } from "express";
import path from "path";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Static files setup
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.json());

// Static file routes
app.get("*", (req: any, res: any) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

export default app;
