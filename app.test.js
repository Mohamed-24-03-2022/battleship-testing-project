import {
  createGameBoard,
  Player,
  createShip,
  receiveAttack,
  addShipToBoard,
} from './app';
let player1 = Player('Player1', 0);

test('createShip factory', () => {
  expect(createShip(5, 0)).toMatchObject({
    length: 5,
    hitTimes: 0,
    isSunk: false,
  });
});

test('create a game board', () => {
  expect(createGameBoard().board).toEqual([
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ]);
});

test('adding ships to the board', () => {
  addShipToBoard(player1, 0, 0, 5)
  expect(player1.board).toEqual([
    ['ship cell', null, null, null, null, null, null, null, null, null],
    ['ship cell', null, null, null, null, null, null, null, null, null],
    ['ship cell', null, null, null, null, null, null, null, null, null],
    ['ship cell', null, null, null, null, null, null, null, null, null],
    ['ship cell', null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ])
});

test('test attack function ', () => {
  addShipToBoard(player1, 1, 1, 5);
  expect(receiveAttack(player1, 1, 1)).toEqual({
    msg: 'hit',
    shipMsg: 'ship got a hit',
  });
  expect(receiveAttack(player1, 3, 3)).toEqual({
    msg: 'attacked empty cell',
    shipMsg: 'not attacked',
  });
  expect(receiveAttack(player1, 2, 1)).toEqual({
    msg: 'hit',
    shipMsg: 'ship got a hit',
  });
  expect(receiveAttack(player1, 3, 1)).toEqual({
    msg: 'hit',
    shipMsg: 'ship got a hit',
  });
  expect(receiveAttack(player1, 4, 1)).toEqual({
    msg: 'hit',
    shipMsg: 'ship got a hit',
  });
  expect(receiveAttack(player1, 5, 1)).toEqual({
    msg: 'hit',
    shipMsg: 'ship got a hit',
  });
  expect(receiveAttack(player1, 5, 1)).toEqual({
    msg: 'already attacked',
    shipMsg: 'not attacked',
  });
  expect(receiveAttack(player1, 6, 1)).toEqual({
    msg: 'attacked empty cell',
    shipMsg: 'not attacked',
  });
});
