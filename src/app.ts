import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import express, { Application } from 'express';
import cors from "cors";
import {routes} from "./routes";

export const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(express.static("./db/"));
routes(app);