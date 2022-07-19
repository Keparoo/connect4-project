/* Connect Four
 *
 * Player 1 and 2 alternate turns. First, player 1 and player 2 choose their color.
 * On each turn, a piece is dropped down a columnn until a player gets
 * four-in-a-row (horiz, vert, or diag) or until the board is filled (tie)
 * 
 */

const DEFAULT_HEIGHT = 6;
const DEFAULT_WIDTH = 7;

class Game {
	constructor(
		p1,
		p2,
		htmlBoard,
		footer,
		button,
		height = DEFAULT_HEIGHT,
		width = DEFAULT_WIDTH
	) {
		// Check that colors entered are valid and unique
		if (
			Helper.isColor(p1.color) &&
			Helper.isColor(p2.color) &&
			p1.color !== p2.color
		) {
			this.p1 = p1;
			this.p2 = p2;
			footer.innerText = '';
		} else {
			footer.innerText = 'Please enter 2 valid different colors!';
			throw new Error('Invalid Color');
		}

		this.width = width; // board width
		this.height = height; // board height
		this.currPlayer = this.p1; // active player: 1 or 2
		this.board = []; // Javascript representation of board (board[y][x])
		this.htmlBoard = htmlBoard; // HTML representation of board  (htmlBoard[y][x])
		this.footer = footer; // Message to players
		this.button = button; // start/reset button
		this.makeBoard();
		this.makeHtmlBoard();
		document.body.classList.add('start-color');
		document.body.classList.remove('win-color');
	}

	// Create JS repr of board: array or rows, each row array of cells (board[y][x])
	// Creates a 2D array of length and width with null at each value
	makeBoard = () => {
		this.board = [];
		for (let row = 0; row < this.height; row++) {
			this.board.push(Array.apply(null, { length: this.width }));
		}
	};

	// Create top row (tr) of board to accept click events
	createTopRow = () => {
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');
		top.addEventListener('click', this.handleClick);

		// Set up the tds of tr and assign each td and id of the x position
		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}
		return top;
	};

	//create HTML representation of board: HTML table and row of column tops
	makeHtmlBoard = () => {
		this.htmlBoard.innerHTML = '';

		this.htmlBoard.append(this.createTopRow());

		// Create the HTML board for play as a table, each td having ids of x-y
		// where x and y are the coordinate indexes
		for (let y = 0; y < this.height; y++) {
			const row = document.createElement('tr');

			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				row.append(cell);
			}
			this.htmlBoard.append(row);
		}
		this.button.innerText = 'Reset Game';
		this.footer.innerText = `${this.currPlayer.color} player's turn`;
	};

	// return y coord of next available grid space or null if column is filled
	findSpotForCol = (x) => {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) return y;
		}
		return null;
	};

	// create a new piece to insert in HTMLboard
	createPiece = () => {
		const newPiece = document.createElement('div');
		newPiece.classList.add('piece');
		newPiece.style.backgroundColor = this.currPlayer.color;
		return newPiece;
	};

	// place a piece in HTML table at passed coords. Set color based on player number
	placeInHTMLTable = (y, x) => {
		const square = document.getElementById(`${y}-${x}`);
		square.append(this.createPiece());
	};

	toggleBackgroundColor = () => {
		document.body.classList.toggle('win-color');
		document.body.classList.toggle('start-color');
	};

	// Alert player that game is over with passed msg
	endGame = (msg) => {
		const top = document.querySelector('#column-top');
		top.removeEventListener('click', this.handleClick);
		this.toggleBackgroundColor();
		document.querySelector('#footer').innerText = msg;
	};

	win = (cells) => {
		// check array of 4 (y, x) array pairs (coords)
		// If the coordinates are valid (on the board)
		// check to see if they are all the same color (player) if so return true
		return cells.every(
			([ y, x ]) =>
				y >= 0 &&
				y < this.height &&
				x >= 0 &&
				x < this.width &&
				this.board[y][x] === this.currPlayer
		);
	};

	// checkForWin: check board cell-by-cell for "does a win start here?"
	checkForWin = () => {
		// loop through each square on the board, use each square as a starting
		// point to check for 4 in a row
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// collect the 4 cells horizontally to right
				let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
				// collect the 4 cells vertically down
				let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
				//collect the 4 cells diagonally down-right
				let diagDR = [
					[ y, x ],
					[ y + 1, x + 1 ],
					[ y + 2, x + 2 ],
					[ y + 3, x + 3 ]
				];
				// collect the 4 cells diagonally up-left
				let diagDL = [
					[ y, x ],
					[ y + 1, x - 1 ],
					[ y + 2, x - 2 ],
					[ y + 3, x - 3 ]
				];

				// Check if any of the 4-sets of 4-adjacent squares are the same color
				if (
					this.win(horiz) ||
					this.win(vert) ||
					this.win(diagDR) ||
					this.win(diagDL)
				) {
					return true;
				}
			}
		}
	};

	// Switch current player
	changePlayer = () => {
		this.currPlayer === this.p1
			? (this.currPlayer = this.p2)
			: (this.currPlayer = this.p1);
		this.footer.innerText = `${this.currPlayer.color} player's turn`;
	};

	// Check if all cells on board are filled, if so end game as a tie
	checkForTie = () => {
		// return this.board.every((row) => row.every((square) => square));
		let result = true;
		for (let x = 0; x < this.width; x++) {
			if (!this.board[0][x]) {
				result = false;
				break;
			}
		}
		return result;
	};

	// Get x, y coordinates to place piece in htmlBoard
	getCoordsToPlacePiece = (evt) => {
		const x = evt.target.id;
		const y = this.findSpotForCol(x);
		return [ x, y ];
	};

	// When square of top row is clicked, attempt to put piece in that column
	handleClick = (evt) => {
		const [ x, y ] = this.getCoordsToPlacePiece(evt);
		if (y === null) return; // column full

		// place piece in HTML board correspoding JS array representation
		this.board[y][x] = this.currPlayer;
		this.placeInHTMLTable(y, x);

		if (this.checkForWin()) {
			return this.endGame(`The ${this.currPlayer.color} player  won!`);
		}

		if (this.checkForTie()) {
			return this.endGame('Player 1 and 2 have Tied!');
		}

		this.changePlayer();
	};
}

// Color of player's pieces
class Player {
	constructor(color) {
		this.color = color;
	}
}

document.querySelector('#colors').addEventListener('submit', (e) => {
	e.preventDefault();
	let p1 = new Player(document.querySelector('#p1color').value.toLowerCase());
	let p2 = new Player(document.querySelector('#p2color').value.toLowerCase());
	const htmlBoard = document.querySelector('#board');
	const footer = document.querySelector('#footer');
	const button = document.querySelector('#reset');
	new Game(p1, p2, htmlBoard, footer, button);
});
