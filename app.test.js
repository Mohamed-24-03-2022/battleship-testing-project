import { createShip, createGameBoard, receiveAttack } from './app';

test('createShip factory', () => {
  expect(createShip(5, 0)).toMatchObject({
    length: 5,
    hitTimes: 0,
    isSunk: false,
  });
});

test('create and fill game board', () => {
  expect(createGameBoard(0, 0, 5).board).toEqual([
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
  ]);
  expect(createGameBoard(1, 1, 5).board).toEqual([
    ['ship cell', null, null, null, null, null, null, null, null, null],
    ['ship cell', 'ship cell', null, null, null, null, null, null, null, null],
    ['ship cell', 'ship cell', null, null, null, null, null, null, null, null],
    ['ship cell', 'ship cell', null, null, null, null, null, null, null, null],
    ['ship cell', 'ship cell', null, null, null, null, null, null, null, null],
    [null, 'ship cell', null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ]);
  expect(createGameBoard(1, 0, 5).isFilled).toBe(true);
});

test('test attack function ', () => {
  createGameBoard(1, 1, 5);
  expect(receiveAttack(1, 1)).toEqual({ msg: 'hit', shipMsg: 'ship got a hit' });
  expect(receiveAttack(3, 3)).toEqual({ msg: 'attacked empty cell', shipMsg: undefined });
  expect(receiveAttack(2, 1)).toEqual({ msg: 'hit', shipMsg: 'ship got a hit' });
  expect(receiveAttack(3, 1)).toEqual({ msg: 'hit', shipMsg: 'ship got a hit' });
  expect(receiveAttack(4, 1)).toEqual({ msg: 'hit', shipMsg: 'ship got a hit' });
  expect(receiveAttack(5, 1)).toEqual({ msg: 'hit', shipMsg: 'ship got a hit' });
  expect(receiveAttack(5, 1)).toEqual({ msg: "already attacked", shipMsg: undefined });
  expect(receiveAttack(6, 1)).toEqual({ msg: 'attacked empty cell', shipMsg: undefined });
});
//
