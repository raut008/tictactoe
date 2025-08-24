import React from "react";
import APPCONSTANTS from "../../Constants/AppConstants";
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
            {state === APPCONSTANTS.PLAYERS.X ? (
              <Icon type={APPCONSTANTS.PLAYERS.X} />
            ) : state === APPCONSTANTS.PLAYERS.O ? (
              <Icon type={APPCONSTANTS.PLAYERS.O} />
            ) : (
              <Empty />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
