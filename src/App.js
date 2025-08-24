import React, { useCallback, useEffect, useState } from "react";
import styles from "./App.module.scss";
import Board from "./Components/Board/Board";
import Icon from "./Components/Icon/Icon";
import Modal from "./Components/Modal/Modal";
import Result from "./Components/Result/Result";
import APPCONSTANTS from "./Constants/AppConstants";
import { checkWinner, getAIMove, randomMove } from "./utils";

function App() {
  const board = Array(9).fill(null);
  const [gameState, setGameState] = useState({
    gameBoard: board,
    currentPlayer: APPCONSTANTS.PLAYERS.X,
    result: null,
    mode: {
      type: "double",
      difficulty: APPCONSTANTS.DIFFICULTIES.Easy,
    },
    playerChoice: APPCONSTANTS.PLAYERS.X,
  });

  const [thinking, setThinking] = useState(false);

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
        currentPlayer: result
          ? null
          : prev.currentPlayer === APPCONSTANTS.PLAYERS.X
          ? APPCONSTANTS.PLAYERS.O
          : APPCONSTANTS.PLAYERS.X,
        result,
      };
    });
  };

  // --- AI logic separated into effect ---
  useEffect(() => {
    if (
      gameState.mode.type === "ai" &&
      !gameState.result &&
      gameState.currentPlayer !== gameState.playerChoice
    ) {
      setThinking(true);
      const timer = setTimeout(() => {
        setGameState((prev) => {
          const aiBoard = [...prev.gameBoard];
          const bypassAIMode = aiBoard.every((cell) => cell === null);
          if (bypassAIMode) {
            const aiMove = randomMove(aiBoard);
            aiBoard[aiMove] = prev.currentPlayer;
            return {
              ...prev,
              gameBoard: aiBoard,
              currentPlayer: prev.playerChoice,
              result: null,
            };
          }
          const aiMove = getAIMove(
            aiBoard,
            prev.currentPlayer,
            prev.mode.difficulty
          );
          aiBoard[aiMove] = prev.currentPlayer;
          const aiResult = checkWinner(aiBoard);

          return {
            ...prev,
            gameBoard: aiBoard,
            currentPlayer: aiResult ? null : prev.playerChoice,
            result: aiResult,
          };
        });
        setThinking(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleReset = useCallback(() => {
    setGameState((prev) => {
      return {
        ...prev,
        gameBoard: board,
        currentPlayer: APPCONSTANTS.PLAYERS.X,
        result: null,
      };
    });
  }, [board]);

  const handleSelect = useCallback(
    (selectedMode) => {
      if (mode.type === selectedMode) return;
      setGameState((prev) => {
        return {
          ...prev,
          gameBoard: board,
          currentPlayer: APPCONSTANTS.PLAYERS.X,
          result: null,
          mode: {
            ...prev.mode,
            type: selectedMode,
          },
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
              mode.type === "double" ? styles.selected : ""
            }`}
            onClick={() => handleSelect("double")}
          >
            <div>Double Mode</div>
          </button>
          <button
            className={`${styles.button} ${
              mode.type === "ai" ? styles.selected : ""
            }`}
            onClick={() => handleSelect("ai")}
          >
            <div>AI Mode</div>
          </button>
        </div>
        {mode.type === "ai" && (
          <>
            <div className={styles.row}>
              <button
                className={`${styles.button} ${
                  mode.difficulty === APPCONSTANTS.DIFFICULTIES.Easy
                    ? styles.selected
                    : ""
                }`}
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    playerChoice: APPCONSTANTS.PLAYERS.X,
                    gameBoard: board,
                    currentPlayer: APPCONSTANTS.PLAYERS.X,
                    result: null,
                    mode: {
                      ...prev.mode,
                      difficulty: APPCONSTANTS.DIFFICULTIES.Easy,
                    },
                  }))
                }
              >
                Easy
              </button>
              <button
                className={`${styles.button} ${
                  mode.difficulty === APPCONSTANTS.DIFFICULTIES.Hard
                    ? styles.selected
                    : ""
                }`}
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    playerChoice: APPCONSTANTS.PLAYERS.X,
                    gameBoard: board,
                    currentPlayer: APPCONSTANTS.PLAYERS.X,
                    result: null,
                    mode: {
                      ...prev.mode,
                      difficulty: APPCONSTANTS.DIFFICULTIES.Hard,
                    },
                  }))
                }
              >
                Hard
              </button>
            </div>
            <div className={styles.row}>
              <button
                className={`${styles.button} ${
                  playerChoice === APPCONSTANTS.PLAYERS.X ? styles.selected : ""
                }`}
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    playerChoice: APPCONSTANTS.PLAYERS.X,
                    gameBoard: board,
                    currentPlayer: APPCONSTANTS.PLAYERS.X,
                    result: null,
                  }))
                }
              >
                Play as X
              </button>
              <button
                className={`${styles.button} ${
                  playerChoice === APPCONSTANTS.PLAYERS.O ? styles.selected : ""
                }`}
                onClick={() =>
                  setGameState((prev) => {
                    const newBoard = [...board];
                    const aiMove = randomMove(newBoard);
                    newBoard[aiMove] = APPCONSTANTS.PLAYERS.X;
                    return {
                      ...prev,
                      playerChoice: APPCONSTANTS.PLAYERS.O,
                      gameBoard: newBoard,
                      currentPlayer: APPCONSTANTS.PLAYERS.O,
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
      <div className={styles.boardWrapper}>
        <Board gameBoard={gameBoard} handleClick={handleMove} />
        {!!thinking && (
          <div className={styles.loaderOverlay}>
            <div className={styles.loader}>
              <Icon type="Thinking" />
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={result} onClose={() => handleReset()}>
        <Result winner={result} />
      </Modal>
    </div>
  );
}

export default App;
