import React, { useCallback, useEffect, useState } from "react";
import styles from "./App.module.scss";
import Board from "./Components/Board/Board";
import Modal from "./Components/Modal/Modal";
import Result from "./Components/Result/Result";
import { checkWinner, minmax } from "./utils";

function App() {
  const board = Array(9).fill(null);
  const [gameState, setGameState] = useState({
    gameBoard: board,
    currentPlayer: "X",
    result: null,
    mode: "double",
    playerChoice: "X",
  });

  const { gameBoard, mode, playerChoice, result } = gameState;

  const handleMove = (index) => {
    setGameState((prev) => {
      if (prev.result || prev.gameBoard[index]) return prev;

      const newBoard = [...prev.gameBoard];
      newBoard[index] = prev.currentPlayer;
      const result = checkWinner(newBoard);

      return {
        ...prev,
        gameBoard: newBoard,
        currentPlayer: result ? null : prev.currentPlayer === "X" ? "O" : "X",
        result,
      };
    });
  };

  // --- AI logic separated into effect ---
  useEffect(() => {
    if (
      gameState.mode === "ai" &&
      !gameState.result &&
      gameState.currentPlayer !== gameState.playerChoice
    ) {
      const timer = setTimeout(() => {
        setGameState((prev) => {
          const aiBoard = [...prev.gameBoard];
          const aiMove = minmax(aiBoard);
          aiBoard[aiMove] = prev.currentPlayer;
          const aiResult = checkWinner(aiBoard);

          return {
            ...prev,
            gameBoard: aiBoard,
            currentPlayer: aiResult ? null : prev.playerChoice,
            result: aiResult,
          };
        });
      }, 500); // delay in ms

      return () => clearTimeout(timer); // cleanup if state changes fast
    }
  }, [gameState]); // runs whenever state changes

  const handleReset = useCallback(() => {
    setGameState((prev) => {
      return {
        ...prev,
        gameBoard: board,
        currentPlayer: "X",
        result: null,
      };
    });
  }, [board]);

  const handleSelect = useCallback(
    (selectedMode) => {
      if (mode === selectedMode) return;
      setGameState((prev) => {
        return {
          ...prev,
          gameBoard: board,
          currentPlayer: "X",
          result: null,
          mode: selectedMode,
        };
      });
    },
    [board, mode]
  );

  return (
    <div className={styles.appWrapper}>
      <h1 className={styles.title}>TIC TAC TOE</h1>
      <div className={styles.container}>
        <div className={styles.row}>
          <button
            className={`${styles.button} ${
              mode === "double" ? styles.selected : ""
            }`}
            onClick={() => handleSelect("double")}
          >
            <div>Double Mode</div>
          </button>
          <button
            className={`${styles.button} ${
              mode === "ai" ? styles.selected : ""
            }`}
            onClick={() => handleSelect("ai")}
          >
            <div>AI Mode</div>
          </button>
        </div>
        {mode === "ai" && (
          <>
            <div className={styles.row}>
              <button
                className={`${styles.button} ${
                  playerChoice === "X" ? styles.selected : ""
                }`}
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    playerChoice: "X",
                    gameBoard: board,
                    currentPlayer: "X",
                    result: null,
                  }))
                }
              >
                Play as X
              </button>
              <button
                className={`${styles.button} ${
                  playerChoice === "O" ? styles.selected : ""
                }`}
                onClick={() =>
                  setGameState((prev) => {
                    const newBoard = [...board];
                    const aiMove = minmax(newBoard);
                    newBoard[aiMove] = "X";
                    return {
                      ...prev,
                      playerChoice: "O",
                      gameBoard: newBoard,
                      currentPlayer: "O",
                      result: null,
                    };
                  })
                }
              >
                Play as O
              </button>
            </div>
          </>
        )}
        <button className={styles.resetButton} onClick={handleReset}>
          RESTART
        </button>
      </div>
      <Board gameBoard={gameBoard} handleClick={handleMove} />
      <Modal isOpen={result} onClose={() => handleReset()}>
        <Result winner={result} />
      </Modal>
    </div>
  );
}

export default App;
