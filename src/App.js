import React from "react";
import styles from "./App.module.scss";
function App() {
  return <div className={styles.App}>PRODUCTION v5 - {process.env.REACT_APP_PLATFORM}</div>;
}

export default App;
