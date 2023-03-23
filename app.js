
const createGameBoard = () => {
  const board = [];
  for (let row = 0; row < 10; row++) {
    board[row] = [];
    for (let col = 0; col < 10; col++) {
      board[row][col] = null;
    }
  }

  const getCell = (row, col) => {
    return board[row][col];
  };

  const setCell = (row, col, value) => {
    board[row][col] = value;
  };
  return {
    board,
    getCell,
    setCell,
  };
};
const Player = (name, score = 0, isAttacked = false) => {
  const gameBoard = createGameBoard();
  const ships = [];
  const player = {
    name,
    score,
    ...gameBoard,
    ships,
    isAttacked,
  };

  return player;
};
const createShip = (length, hitTimes = 0, isSunk = false) => {
  const ship = {
    length,
    hitTimes,
    isSunk,
  };

  ship.hit = function () {
    this.hitTimes += 1;
    if (this.hitTimes === this.length) {
      this.isSunk = true;
    }
  };

  ship.reset = function () {
    this.isSunk = false;
    this.hitTimes = 0;
  };

  return ship;
};
const fillBoard = (player, x, y, shipLength) => {
  let feedBack = { isFilledCell: false, isOutOfBoard: false };
  let initialX = x;
  const finalX = initialX + shipLength - 1;

  if (finalX > 9) {
    feedBack.isOutOfBoard = true;
    return feedBack;
  }

  for (let i = 0; i < shipLength; i++) {
    if (player.getCell(initialX, y) || player.getCell(finalX, y)) {
      feedBack.isFilledCell = true;
      return feedBack;
    }

    player.setCell(initialX, y, 'ship cell');
    initialX += 1;
  }

  return feedBack;
};
const addShipToBoard = (player, x, y, newShipLength) => {
  const feedBack = fillBoard(player, x, y, newShipLength);
  const { isFilledCell, isOutOfBoard } = feedBack;
  if (isFilledCell || isOutOfBoard) return feedBack;

  const newShip = createShip(newShipLength);
  newShip.x = [x, newShip.length + x];
  newShip.y = [y];
  player.ships.push(newShip);
};
const receiveAttack = (player, x, y) => {
  let msg;
  let shipMsg = 'not attacked';

  if (player.getCell(x, y) === 'ship cell') {
    msg = 'hit';
  } else if (player.getCell(x, y) === null) {
    msg = 'attacked empty cell';
    player.setCell(x, y, 'attacked empty cell');
  } else if (
    player.getCell(x, y) === 'attacked empty cell' ||
    'attacked ship cell'
  ) {
    msg = 'already attacked';
    return { msg, shipMsg };
  }

  player.ships.forEach((ship) => {
    let shipInitX = ship.x[0];
    let shipFinalX = ship.x[1];

    if (y === ship.y[0] && shipInitX <= x && x < shipFinalX) {
      shipMsg = 'ship got a hit';
      ship.hit();
      player.setCell(x, y, 'attacked ship cell');
    }
  });

  return { msg, shipMsg };
};
/*______________________________________________________________________________*/

//! DOM Manipulation part
const playerBoard = document.querySelector('.player-board');
const computerBoard = document.querySelector('.computer-board');
const gameOverBoard = document.querySelector('.game-over');
const restartBtn = document.querySelector('.game-over button');
const CELL_COLORS = {
  TARGETED: 'rgb(51, 51, 51)',
  HIT: 'red',
  MISS: 'green',
};

// events handling
const checkForWinner = () => {
  const isAllComputerShipsSunk = computer.ships.every(
    (ship) => ship.isSunk === true
  );
  const isAllPlayer1ShipsSunk = player1.ships.every(
    (ship) => ship.isSunk === true
  );

  // manipulation winner DOM
  if (isAllComputerShipsSunk || isAllPlayer1ShipsSunk) {
    gameOverBoard.classList.remove('hidden');
  }
  if (isAllComputerShipsSunk) {
    gameOverBoard.children[0].textContent = 'You have won';
  } else {
    gameOverBoard.children[0].textContent = 'You have lost';
  }
};
const getCoordinates = (e, cells) => {
  const coordinates = (cells.indexOf(e.target) / 10).toFixed(1).split('');
  const x = Number(coordinates[0]);
  const y = Number(coordinates[2]);
  return { x, y };
};
const handleClick = (e, cells, player, shipLength) => {
  const { x, y } = getCoordinates(e, cells);
  addShipToBoard(player, x, y, shipLength);
};
const placeShipsDOM = (e, cells, cellData, player, shipLength) => {
  let { targetedCellIndex, cellColor } = cellData;
  let distanceShipCellIndex = (shipLength - 1) * 10;

  if (e.type === 'click') {
    cellColor = CELL_COLORS.TARGETED;
    handleClick(e, cells, player, shipLength);
  }

  if (e.type === 'mouseout') {
    cellColor = 'inherit';
  }

  // boundary condition
  if (
    !cells[targetedCellIndex + distanceShipCellIndex] ||
    cells[targetedCellIndex + distanceShipCellIndex].style.backgroundColor ===
    CELL_COLORS.TARGETED
  ) {
    return;
  }

  // styling ship cells vertically
  for (let i = 0; i < shipLength; i++) {
    // return if already filled
    if (
      cells[targetedCellIndex].style.backgroundColor === CELL_COLORS.TARGETED
    ) {
      return;
    }
    cells[targetedCellIndex].style.backgroundColor = cellColor;
    targetedCellIndex += 10;
  }
};
const handleAttack = (e, player, cells) => {
  const { x, y } = getCoordinates(e, cells);
  const { msg, shipMsg } = receiveAttack(player, x, y);

  if (msg === 'already attacked' && player === computer) {
    return;
  } else if (shipMsg === 'ship got a hit') {
    e.target.style.backgroundColor = CELL_COLORS.HIT;
  } else {
    e.target.style.backgroundColor = CELL_COLORS.MISS;
  }

  const getPlayerTurn = player1.isAttacked ? computer : player1;
  getPlayerTurn.isAttacked = true;
  player.isAttacked = false;

  return getPlayerTurn;
};
const handleEvent = (e, player) => {
  //! player param here represent the player who is being attacked
  const cells = [...e.target.parentElement.children];
  const cellData = {
    targetedCellIndex: cells.indexOf(e.target),
    cellColor: '#ccc',
  };

  // if touching the parent div return
  if (cells[cellData.targetedCellIndex].classList[0] === 'computer-board') {
    return;
  }

  //attacking only after setting all the ships, player1 attack first
  if (e.type === 'click' && player1.ships.length === 5) {
    // Don't play if it's not your turn
    if (player.isAttacked === false) {
      return;
    }

    const nextPlayer = handleAttack(e, player, cells);

    if (nextPlayer === player1) {
      lunchComputerAttack();
    }

    checkForWinner();
  }

  if (player.ships.length === 5) {
    return;
  }

  // placing one ship of each length
  const shipLength = (() => {
    switch (player.ships.length) {
      case 0:
        return 5;
      case 1:
        return 4;
      case 2:
        return 3;
      case 3:
      case 4:
        return 2;
      default:
        throw new Error('Invalid number of ships!');
    }
  })();

  placeShipsDOM(e, cells, cellData, player, shipLength);
};

// player1 event side
const handlePlayerEvent = (e) => {
  handleEvent(e, player1);
};
playerBoard.addEventListener('mouseover', handlePlayerEvent);
playerBoard.addEventListener('mouseout', handlePlayerEvent);
playerBoard.addEventListener('click', handlePlayerEvent);

// computer event side
const hideComputerShips = () => {
  const computerCells = [...document.querySelectorAll('.cell')].slice(100);
  for (const cell of computerCells) {
    cell.style.backgroundColor = 'inherit';
  }
};
const handleComputerEvent = (e) => {
  handleEvent(e, computer);
};
const placeComputerShips = () => {
  const computerCells = [...document.querySelectorAll('.cell')].slice(100);
  const randomNum = Math.floor(Math.random() * 100);
  // triggering computerEvent
  computerCells[randomNum].click();
  if (computer.ships.length < 5) {
    placeComputerShips();
  }
};
const lunchComputerAttack = () => {
  const playerCells = [...document.querySelectorAll('.cell')].slice(0, 100);
  const randomNum = Math.floor(Math.random() * 100);
  if (randNumArr.includes(randomNum)) {
    lunchComputerAttack();
  }
  randNumArr.push(randomNum);
  playerCells[randomNum].click();
};
computerBoard.addEventListener('mouseover', handleComputerEvent);
computerBoard.addEventListener('mouseout', handleComputerEvent);
computerBoard.addEventListener('click', handleComputerEvent);

// restarting part
const restartDom = () => {
  gameOverBoard.classList.add('hidden');
  [...playerBoard.children].forEach((cell) => {
    cell.style.backgroundColor = 'inherit';
  });
  [...computerBoard.children].forEach((cell) => {
    cell.style.backgroundColor = 'inherit';
  });
  initializeGame()
};
restartBtn.addEventListener('click', restartDom);

// initializing the game
let randNumArr = [];
let player1 = Player('Player1', 0);
let computer = Player('Computer', 0);
const initializeGame = () => {
  randNumArr.length = 0;
  player1 = Player('Player1', 0);
  computer = Player('Computer', 0);
  computer.isAttacked = true;
  placeComputerShips();
  hideComputerShips();
};
initializeGame();

// export {
//   createGameBoard,
//   Player,
//   createShip,
//   receiveAttack,
//   addShipToBoard,
// };
