import { SudokuUtil } from "./src/utils/sudoku-util.js";
import { Util } from "./src/utils/util.js";

export class Sudoku {
  constructor(sudoku, difficulty) {
    if (!sudoku) {
      this._sudoku = createPuzzle(difficulty);
    } else {
      this._sudoku = sudoku;
    }
    this.solvedSudoku = [];
    this.isValidSudoku = false;
    this.isSolved = false;
  }

  get sudoku() {
    return this._sudoku;
  }

  set sudoku(sudoku) {
    this._sudoku = sudoku;
  }

  get getSolvedPuzzle() {
    return this.solvedSudoku;
  }

  validate() {
    return isValidSolution(this.sudoku);
  }

  isSolvable() {
    this.isValidSudoku = isValidPuzzle(this.sudoku);
    if (this.isValidSudoku) {
      Util.copyGrid(this.sudoku, this.solvedSudoku);
      return solve(this.solvedSudoku);
    } else {
      return false;
    }
  }
}

function isValidPuzzle(grid) {
  if (SudokuUtil.isValidPuzzle(grid)) {
    return true;
  }
  return false;
}

function isValidSolution(grid) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        return false;
      }
    }
  }
  return SudokuUtil.isValidPuzzle(grid);
}

function solve(grid) {
  for (let row = 0; row < grid[0].length; row++) {
    for (let col = 0; col < grid.length; col++) {
      if (grid[row][col] === 0) {
        for (let guess = 1; guess < 10; guess++) {
          if (isValidPlace(grid, row, col, guess)) {
            grid[row][col] = guess;
            if (solve(grid)) {
              return true;
            } else {
              grid[row][col] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

function createPuzzle(difficulty) {
  let level;
  switch (difficulty) {
    case "easy":
      level = 0.98;
      break;
    case "medium":
      level = 0.5;
      break;
    case "hard":
      level = 0.3;
      break;
    default:
      throw new Error("invalid difficulty");
  }

  let puzzle = getRandomSudoku();
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (Math.random() > level) puzzle[i][j] = 0;
    }
  }
  return puzzle;
}

function getRandomSudoku() {
  let puzzle = [];
  for (let i = 0; i < 9; i++) {
    puzzle[i] = Array(9).fill(0);
  }
  for (let i = 0; i < 8; i++) {
    let number = Math.floor(Math.random() * 8) + 1;
    while (!isValidPlace(puzzle, 0, i, number)) {
      number = Math.floor(Math.random() * 8) + 1;
    }
    puzzle[0][i] = number;
  }
  solve(puzzle);
  return puzzle;
}

function isValidPlace(grid, row, col, number) {
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === number) {
      return false;
    }
  }
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === number) {
      return false;
    }
  }
  let localBoxRow = row - (row % 3);
  let localBoxCol = col - (col % 3);
  for (let i = localBoxRow; i < localBoxRow + 3; i++) {
    for (let j = localBoxCol; j < localBoxCol + 3; j++) {
      if (grid[i][j] === number) {
        return false;
      }
    }
  }
  return true;
}
