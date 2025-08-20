export function minmax(board) {
  const nullIndices = board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null);

  if (nullIndices.length === 0) return null; // no empty spots

  const randomIndex = Math.floor(Math.random() * nullIndices.length);
  return nullIndices[randomIndex];
}

export const checkWinner = (board) => {
  const wins = [
    //rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let [a, b, c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : "Draw";
};
