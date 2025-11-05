import { useState, useEffect } from "react";
import "./App.css";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? "winner-square" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  const winner = result.winner;
  const winningLine = result.line;

  let status = "";
  if (winner) status = `Winner: ${winner}`;
  else if (!squares.includes(null)) status = "Draw!";
  else status = `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="board-container">
      {winner && <div className="banner win"> {winner} a câștigat!</div>}
      {!winner && !squares.includes(null) && (
        <div className="banner draw"> Egalitate!</div>
      )}

      <div className="status">{status}</div>

      {Array(3)
        .fill(null)
        .map((_, row) => (
          <div key={row} className="board-row">
            {Array(3)
              .fill(null)
              .map((_, col) => {
                const index = row * 3 + col;
                const isWinningSquare = winningLine?.includes(index);
                return (
                  <Square
                    key={index}
                    value={squares[index]}
                    onSquareClick={() => handleClick(index)}
                    highlight={isWinningSquare}
                  />
                );
              })}
          </div>
        ))}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const result = calculateWinner(currentSquares);
  const winner = result.winner;

  useEffect(() => {
    if (winner) {
      setScore((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
      setTimeout(() => handleRestart(), 2000);
    } else if (!currentSquares.includes(null)) {
      setTimeout(() => handleRestart(), 2000);
    }
  }, [winner, currentSquares]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function resetScore() {
    setScore({ X: 0, O: 0 });
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <div className="buttons">
          <button onClick={handleRestart}>Restart Game</button>
          <button onClick={resetScore}>Reset Score</button>
        </div>
      </div>

      <div className="game-info">
        <div className="score"> Scor:</div>
        <p>X: {score.X}</p>
        <p>O: {score.O}</p>
      </div>
    </div>
  );
}

/* === FUNCȚIE WINNER === */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}
