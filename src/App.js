import React, { useState } from "react";
import "./App.css"; // Define CSS for animations

const SudokuBoard = () => {
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [isSolving, setIsSolving] = useState(false);
  const [isResetting, setIsResetting] = useState(false); // New flag for reset


  const handleChange = (rowIdx, colIdx, newValue) => {
    const value = board[rowIdx][colIdx];

    // Check conditions for red or green animation
    if (newValue !== value && value !== '') {
      red_animate(rowIdx, colIdx);
    } else if (value === '' && newValue !== '') {
      green_animate(rowIdx, colIdx);
    }

    if (/^[1-9]?$/.test(newValue)) {
      const newBoard = board.map(row => [...row]);  // Deep copy
      newBoard[rowIdx][colIdx] = newValue;
      setBoard(newBoard);
    }
  };

  const red_animate = (rowIdx, colIdx) => {
    const cell = document.getElementById(`cell-${rowIdx}-${colIdx}`);
    cell.classList.add("red-animate");
    setTimeout(() => {
      cell.classList.remove("red-animate");
    },50); // Animation duration
  };

  const green_animate = (rowIdx, colIdx) => {
    const cell = document.getElementById(`cell-${rowIdx}-${colIdx}`);
    cell.classList.add("green-animate");
    setTimeout(() => {
      cell.classList.remove("green-animate");
    },50); // Animation duration
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const renderCell = (rowIdx, colIdx) => {
    return (
      <input
        type="text"
        id={`cell-${rowIdx}-${colIdx}`}
        className="cell"
        maxLength={1}
        value={board[rowIdx][colIdx]}
        onChange={(e) => handleChange(rowIdx, colIdx, e.target.value)}
        disabled={isSolving}
      />
    );
  };

  const renderMiniBox = (rowOffset, colOffset) => {
    const miniBox = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3;col++) {
        miniBox.push(renderCell(rowOffset + row, colOffset + col));
      }
    }
    return <div className="mini-box">{miniBox}</div>;
  };

  const renderBoard = () => {
    const boardElements = [];
    for (let row = 0; row < 9; row += 3) {
      for (let col = 0; col < 9; col += 3) {
        boardElements.push(renderMiniBox(row, col));
      }
    }
    return <div className="sudoku-board">{boardElements}</div>;
  };

  // Solve function with delay for animation
  const solveSudoku = async () => {
    setIsSolving(true);
    await dfs(board, 9);
    setIsSolving(false);
  };

  const dfs = async (currentBoard, n) => {
    for (let row = 0; row < n; row++) {
      if(isResetting)
        break ;
      for (let col = 0; col < n; col++) {
        if(isResetting)
          break;
        if (currentBoard[row][col] !== '') continue;

        for (let num = 1; num <= 9; num++) {
          if (isValid(currentBoard, row, col, n, num)) {
            green_animate(row,col);
            const newBoard = currentBoard.map(row => [...row]); // Create a deep copy
            newBoard[row][col] = String(num); // Update the state safely
            setBoard(newBoard);  // Set the new board
            await delay(60);  // Add a delay of 100ms to show animation
            if (await dfs(newBoard, n)) return true;
            red_animate(row,col);
            // Backtrack
            newBoard[row][col] = '';  // Revert the state
            setBoard(newBoard);  // Set the reverted board
            await delay(60);  // Add delay for backtracking visualization
          }
        }
        return false;
      }
    }
    return true;
  };

  const isValid = (currentBoard, row, col, n, num) => {
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < n; i++) {
      if (currentBoard[row][i] === String(num) || currentBoard[i][col] === String(num)) return false;

      const curRow = blockRow + Math.floor(i / 3);
      const curCol = blockCol + Math.floor(i % 3);
      if (currentBoard[curRow][curCol] === String(num)) return false;
    }
    return true;
  };

  const handleSolve = () => {
    if (!isSolving) {
      solveSudoku();
    }
  };
  const handleReset=()=>{
    if(!isResetting){
      setIsResetting(true);
      setBoard(Array(9).fill(Array(9).fill(''))); // Reset the board
      setIsSolving(false); // Reset solving state
      setTimeout(()=>{setIsResetting(false)},0);
    }    
  };
  return (
    <div className="sudoku-container">
      {renderBoard()}
      <div className="button-container">
  <button className="solve-button" onClick={handleSolve} disabled={isSolving}>
    Solve
  </button>
  <button className="reset-button" onClick={handleReset}>
    Reset
  </button>
</div>

    </div>
  );
};

export default SudokuBoard;
