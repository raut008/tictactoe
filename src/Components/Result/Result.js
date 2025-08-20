import React from "react";
import Icon from "../Icon/Icon";
import styles from "./Result.module.scss";

const Result = ({ winner }) => {
  const isDraw = winner === "Draw";

  return (
    <div className={styles.resultContainer}>
      <div className={styles.svgWrapper}>{isDraw ? <DrawSVG /> : <Icon type={winner} />}</div>
      <h2 className={styles.resultText}>{isDraw ? "It’s a Draw!" : `Winner`}</h2>
    </div>
  );
};

const DrawSVG = () => (
  <>
    <Icon type="X" />
    <Icon type="O" />
  </>
);

export default Result;
