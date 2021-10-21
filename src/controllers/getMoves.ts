import { NextFunction, Request, Response, Router } from 'express';
import {open} from "sqlite";
import sqlite3 from "sqlite3";
export const getMoves: Router = Router();

interface Row {
  col: string
}

getMoves.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const {id}: { id?: string } = req.params;
  if (id) {
    try {
      const db = await open<sqlite3.Database, sqlite3.Statement>({
        filename: './db/chess.db',
        driver: sqlite3.Database
      })

      const result:any = await db.get<Row>('select * from games ORDER by time LIMIT 1');
      result.moves = JSON.parse(result.moves);
      res.write(JSON.stringify(result));
      res.status(200).send()

      db.get<Row>('UPDATE games set time = (:time) where id = (:id);', {
        ':id': result.id,
        ':time': new Date().getTime()
      }).then().catch((error) => {
        console.log("update games.time",error)
      });
    } catch (e) {
      console.error("open DB ", e);
      next(e);
    }
  } else {
    next();
  }
});