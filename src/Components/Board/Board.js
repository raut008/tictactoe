import React from "react";
import Empty from "../Empty/Empty";
import Icon from "../Icon/Icon";
import styles from "./Board.module.scss";

const Board = ({ gameBoard, handleClick }) => {
  return (
    <div className={styles.boardContainer}>
      {gameBoard.map((state, index) => {
        return (
          <div
            key={index}
            className={styles.block}
            onClick={() => {
              handleClick(index);
            }}
          >
            {state === "X" ? <Icon type="X" /> : state === "O" ? <Icon type="O" /> : <Empty />}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
