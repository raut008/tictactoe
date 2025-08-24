import APPCONSTANTS from "../Constants/AppConstants";

export function randomMove(board) {
  const nullIndices = board
    .map((val, idx) => (val === null ? idx : null))
    .filter((val) => val !== null);

  if (nullIndices.length === 0) return null; // no empty spots

  const randomIndex = Math.floor(Math.random() * nullIndices.length);
  return nullIndices[randomIndex];
}

function minimaxMove(board, player, alpha = -Infinity, beta = Infinity) {
  const opponent =
    player === APPCONSTANTS.PLAYERS.X
      ? APPCONSTANTS.PLAYERS.O
      : APPCONSTANTS.PLAYERS.X;
  const winner = checkWinner(board);
  if (winner === player) return { score: 1 };
  if (winner === opponent) return { score: -1 };
  if (winner === APPCONSTANTS.DRAW) return { score: 0 };

  let bestMove = null;
  let bestScore = -Infinity;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = player;
      const moveScore = -minimaxMove(board, opponent, -beta, -alpha).score;
      board[i] = null;

      if (moveScore > bestScore) {
        bestScore = moveScore;
        bestMove = { index: i, score: bestScore };
      }

      alpha = Math.max(alpha, moveScore);
      if (beta <= alpha) break; // Alpha-Beta Pruning
    }
  }

  return bestMove;
}

export function getAIMove(board, player, difficulty) {
  switch (difficulty) {
    case APPCONSTANTS.DIFFICULTIES.Easy:
      return randomMove(board);
    case APPCONSTANTS.DIFFICULTIES.Hard:
      const move = minimaxMove(board, player);
      return move.index;
    default:
      return;
  }
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
  return board.includes(null) ? null : APPCONSTANTS.DRAW;
};
