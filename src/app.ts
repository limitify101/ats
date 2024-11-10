import express, { Request, Response } from "express";
import path from "path";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Static files setup
app.use(express.static(path.join(__dirname, "../app", "dist")));
app.use(express.json());

// Static file routes
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../app", "dist", "index.html"));
});
app.get("/login", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../app", "dist", "login.html"));
});
app.get("/register", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../app", "dist", "register.html"));
});

export default app;
