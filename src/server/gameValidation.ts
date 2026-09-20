export interface ValidateMovePayload {
  gameSlug: string;
  gameState: any;
  playerRole: 'host' | 'guest';
  move: any;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  nextState?: any;
  nextTurn?: 'host' | 'guest';
  winner?: 'host' | 'guest' | 'draw' | null;
  winningLine?: any;
  isGameOver?: boolean;
}

/**
 * Validate Connect Four moves on the server
 */
export function validateConnectFourMove(
  gameState: any,
  playerRole: 'host' | 'guest',
  col: number
): ValidationResult {
  if (col < 0 || col > 6) {
    return { valid: false, error: 'Column index must be between 0 and 6.' };
  }

  const grid: number[][] = gameState?.grid ? JSON.parse(JSON.stringify(gameState.grid)) : null;
  if (!grid || grid.length !== 6 || grid[0].length !== 7) {
    return { valid: false, error: 'Invalid Connect Four board state.' };
  }

  // Find lowest available row in column
  let targetRow = -1;
  for (let r = 5; r >= 0; r--) {
    if (grid[r][col] === 0) {
      targetRow = r;
      break;
    }
  }

  if (targetRow === -1) {
    return { valid: false, error: 'That column is already completely full.' };
  }

  const playerVal = playerRole === 'host' ? 1 : 2;
  grid[targetRow][col] = playerVal;

  // Check 4-in-a-row
  const win = checkConnectFourWin(grid, targetRow, col, playerVal);
  const nextTurn = playerRole === 'host' ? 'guest' : 'host';

  if (win.hasWon) {
    return {
      valid: true,
      nextState: { grid, lastMove: { row: targetRow, col } },
      nextTurn,
      winner: playerRole,
      winningLine: win.line,
      isGameOver: true
    };
  }

  // Check board full (draw)
  let isFull = true;
  for (let c = 0; c < 7; c++) {
    if (grid[0][c] === 0) {
      isFull = false;
      break;
    }
  }

  if (isFull) {
    return {
      valid: true,
      nextState: { grid, lastMove: { row: targetRow, col } },
      nextTurn,
      winner: 'draw',
      isGameOver: true
    };
  }

  return {
    valid: true,
    nextState: { grid, lastMove: { row: targetRow, col } },
    nextTurn,
    winner: null,
    isGameOver: false
  };
}

function checkConnectFourWin(grid: number[][], r: number, c: number, val: number): { hasWon: boolean; line?: [number, number][] } {
  const directions = [
    [0, 1],  // Horizontal
    [1, 0],  // Vertical
    [1, 1],  // Diagonal down-right
    [1, -1]  // Diagonal down-left
  ];

  for (const [dr, dc] of directions) {
    let count = 1;
    const line: [number, number][] = [[r, c]];

    // forward
    for (let step = 1; step <= 3; step++) {
      const nr = r + dr * step;
      const nc = c + dc * step;
      if (nr >= 0 && nr < 6 && nc >= 0 && nc < 7 && grid[nr][nc] === val) {
        count++;
        line.push([nr, nc]);
      } else break;
    }

    // backward
    for (let step = 1; step <= 3; step++) {
      const nr = r - dr * step;
      const nc = c - dc * step;
      if (nr >= 0 && nr < 6 && nc >= 0 && nc < 7 && grid[nr][nc] === val) {
        count++;
        line.push([nr, nc]);
      } else break;
    }

    if (count >= 4) {
      return { hasWon: true, line };
    }
  }

  return { hasWon: false };
}

/**
 * Validate Tic-Tac-Toe moves on the server
 */
export function validateTicTacToeMove(
  gameState: any,
  playerRole: 'host' | 'guest',
  cellIndex: number
): ValidationResult {
  const board: (string | null)[] = gameState?.board ? [...gameState.board] : null;
  if (!board || cellIndex < 0 || cellIndex >= board.length) {
    return { valid: false, error: 'Invalid board position.' };
  }

  if (board[cellIndex] !== null) {
    return { valid: false, error: 'That grid cell is already occupied.' };
  }

  const mark = playerRole === 'host' ? 'X' : 'O';
  board[cellIndex] = mark;

  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        valid: true,
        nextState: { ...gameState, board, winningLine: line },
        nextTurn: playerRole === 'host' ? 'guest' : 'host',
        winner: playerRole,
        winningLine: line,
        isGameOver: true
      };
    }
  }

  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return {
      valid: true,
      nextState: { ...gameState, board, winningLine: null },
      nextTurn: playerRole === 'host' ? 'guest' : 'host',
      winner: 'draw',
      isGameOver: true
    };
  }

  return {
    valid: true,
    nextState: { ...gameState, board },
    nextTurn: playerRole === 'host' ? 'guest' : 'host',
    winner: null,
    isGameOver: false
  };
}
