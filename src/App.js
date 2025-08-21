import React, { useCallback, useState } from "react";
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

      let nextPlayer = result ? null : prev.currentPlayer === "X" ? "O" : "X";

      let updatedState = {
        ...prev,
        gameBoard: newBoard,
        currentPlayer: nextPlayer,
        result,
      };

      // AI move
      if (prev.mode === "ai" && !result && nextPlayer !== prev.playerChoice) {
        const aiMove = minmax(newBoard);
        newBoard[aiMove] = nextPlayer;
        const aiResult = checkWinner(newBoard);

        updatedState = {
          ...updatedState,
          gameBoard: newBoard,
          currentPlayer: aiResult ? null : prev.playerChoice,
          result: aiResult,
        };
      }

      return updatedState;
    });
  };

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
          <button className={`${styles.button} ${mode === "double" ? styles.selected : ""}`} onClick={() => handleSelect("double")}>
            <div>Double Mode</div>
          </button>
          <button className={`${styles.button} ${mode === "ai" ? styles.selected : ""}`} onClick={() => handleSelect("ai")}>
            <div>AI Mode</div>
          </button>
        </div>
        {mode === "ai" && (
          <>
            <div className={styles.row}>
              <button
                className={`${styles.button} ${playerChoice === "X" ? styles.selected : ""}`}
                onClick={() => setGameState((prev) => ({ ...prev, playerChoice: "X", gameBoard: board, currentPlayer: "X", result: null }))}
              >
                Play as X
              </button>
              <button
                className={`${styles.button} ${playerChoice === "O" ? styles.selected : ""}`}
                onClick={() =>
                  setGameState((prev) => {
                    const newBoard = [...board];
                    const aiMove = minmax(newBoard);
                    newBoard[aiMove] = "X";
                    return { ...prev, playerChoice: "O", gameBoard: newBoard, currentPlayer: "O", result: null };
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
