import cors from "cors";
import dotenv from "dotenv";
import express from "express";
// import mongoose from "mongoose";
import { Sudoku } from "../sudoku.js";
import Score from "./models/score.js";
import { Util } from "./utils/util.js";

dotenv.config();
// const mongoURI = process.env.MONGO_URI;
// mongoose
//   .connect(mongoURI)
//   .then(() => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });

    app.get("/puzzle", (req, res) => {
      let sudoku = new Sudoku(undefined, req.query.difficulty ?? "easy");
      let puzzle = sudoku._sudoku;
      res.status(200).send({ game: puzzle });
    });

    app.post("/solve", (req, res) => {
      let puzzle = [];
      Util.copyGrid(req.body.board, puzzle);
      let sudoku = new Sudoku(puzzle);
      let solution = sudoku.isSolvable();
      let solvedSudoku;
      let status;
      if (solution) {
        solvedSudoku = sudoku.getSolvedPuzzle;
        status = true;
      } else {
        solvedSudoku = req.body.board;
        status = false;
      }
      res.status(200).send({ solution: solvedSudoku, status });
    });

    app.post("/validate", async (req, res) => {
      let puzzle = [];
      Util.copyGrid(req.body.board, puzzle);
      let sudoku = new Sudoku(puzzle);
      let status = sudoku.validate();
      if (status) {
        const score = new Score({ level: req.body.level, time: req.body.time });
        await score.save();
      }
      res.status(200).send({ status });
    });
  // })
  // .catch((error) => {
  //   console.error("Error connecting to MongoDB:", error);
  // });
