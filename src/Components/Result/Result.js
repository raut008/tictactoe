import React from "react";
import APPCONSTANTS from "../../Constants/AppConstants";
import Icon from "../Icon/Icon";
import styles from "./Result.module.scss";

const Result = ({ winner }) => {
  const isDraw = winner === APPCONSTANTS.DRAW;

  return (
    <div className={styles.resultContainer}>
      <div className={styles.svgWrapper}>
        {isDraw ? <DrawSVG /> : <Icon type={winner} />}
      </div>
      <h2 className={styles.resultText}>
        {isDraw ? "It’s a Draw!" : `Winner`}
      </h2>
    </div>
  );
};

const DrawSVG = () => (
  <>
    <Icon type={APPCONSTANTS.PLAYERS.X} />
    <Icon type={APPCONSTANTS.PLAYERS.O} />
  </>
);

export default Result;
