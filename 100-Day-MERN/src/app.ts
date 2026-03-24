import express, { Request, Response } from "express";
import { json } from "node:stream/consumers";

const app = express();
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello from TypeScript + Express" });
});

export default app;
