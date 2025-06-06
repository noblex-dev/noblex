import { app } from "../app.ts";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

export default function createApp(allowOrigin: string[]) {
  app.set("query parser", "extended");
  app.use(
    cors({
      credentials: true,
      origin: allowOrigin,
    })
  );
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
}
