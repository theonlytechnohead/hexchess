function play() {
	document.getElementById("play").remove();
	createBoard();
	setBoard();
};

const whiteKing = "♔";
const whiteQueen = "♕";
const whiteRook = "♖";
const whiteBishop = "♗";
const whiteKnight = "♘";
const whitePawn = "♙";
const whitePawns = [[16, 0], [16, 4], [15, 1], [15, 4], [14, 1], [14, 3], [13, 2], [13, 3], [12, 2]];
const whitePieces = [whiteKing, whiteQueen, whiteRook, whiteBishop, whiteKnight, whitePawn];

const blackKing = "♚";
const blackQueen = "♛";
const blackRook = "♜";
const blackBishop = "♝";
const blackKnight = "♞";
const blackPawn = "♟︎";
const blackPawns = [[4, 0], [4, 4], [5, 1], [5, 4], [6, 1], [6, 3], [7, 2], [7, 3], [8, 2]];
const blackPieces = [blackKing, blackQueen, blackRook, blackBishop, blackKnight, blackPawn];


var selectedRow = null;
var selectedColumn = null;

var possible = [];

function createBoard() {
	let pulse = document.createElement("pulse");
	document.getElementsByTagName("main")[0].appendChild(pulse);
	setTimeout(() => {
		pulse.remove();
	}, 1000);
	let board = document.createElement("board");
	document.body.onclick = (e) => {
		deselect();
	}
	for (let r = 1; r < 22; r++) {
		let row = document.createElement("row");
		if (r < 6) {
			var n = r;
			var m = Math.min(4 - n + (r + 1) % 2, 2);
		} else if (r < 17) {
			if (r % 2)
				var n = 5;
			else
				var n = 6;
			var m = 0;
		} else {
			var n = 22 - r;
			var m = Math.min(4 - n + (r + 1) % 2, 2);
		}

		for (let h = 0; h < 6 - r % 2; h++) {
			let hex = document.createElement("hex");
			if (h < m) {
				hex.classList.add("disabled");
			} else if (m <= h && h < 6 - m - r % 2) {
				switch (r % 3) {
					case 0:
						hex.classList.add("tile1");
						break;
					case 1:
						hex.classList.add("tile2");
						break;
					case 2:
						hex.classList.add("tile3");
						break;
				}
				hex.onclick = (e) => {
					if (selectSquare(r - 1, h))
						showPossible(r - 1, h);
					// event is handled, stop propagation now
					var evt = e ? e : window.event;
					if (evt.stopPropagation) { evt.stopPropagation(); }
					else { evt.cancelBubble = true; }
					return false;
				};
			} else {
				hex.classList.add("disabled");
			}
			let p = document.createElement("p");
			hex.appendChild(p);
			row.appendChild(hex);
		}
		board.appendChild(row);
	}
	document.getElementsByTagName("main")[0].appendChild(board);
}

function setBoard() {
	setPieceRaw(0, 2, blackBishop);
	setPieceRaw(1, 2, blackQueen);
	setPieceRaw(1, 3, blackKing);
	setPieceRaw(2, 1, blackKnight);
	setPieceRaw(2, 2, blackBishop);
	setPieceRaw(2, 3, blackKnight);
	setPieceRaw(3, 1, blackRook);
	setPieceRaw(3, 4, blackRook);
	setPieceRaw(4, 2, blackBishop);
	setPieceRaw(4, 0, blackPawn);
	setPieceRaw(4, 4, blackPawn);
	setPieceRaw(5, 1, blackPawn);
	setPieceRaw(5, 4, blackPawn);
	setPieceRaw(6, 1, blackPawn);
	setPieceRaw(6, 3, blackPawn);
	setPieceRaw(7, 2, blackPawn);
	setPieceRaw(7, 3, blackPawn);
	setPieceRaw(8, 2, blackPawn);

	setPieceRaw(20, 2, whiteBishop);
	setPieceRaw(19, 2, whiteQueen);
	setPieceRaw(19, 3, whiteKing);
	setPieceRaw(18, 1, whiteKnight);
	setPieceRaw(18, 2, whiteBishop);
	setPieceRaw(18, 3, whiteKnight);
	setPieceRaw(17, 1, whiteRook);
	setPieceRaw(17, 4, whiteRook);
	setPieceRaw(16, 2, whiteBishop);
	setPieceRaw(16, 0, whitePawn);
	setPieceRaw(16, 4, whitePawn);
	setPieceRaw(15, 1, whitePawn);
	setPieceRaw(15, 4, whitePawn);
	setPieceRaw(14, 1, whitePawn);
	setPieceRaw(14, 3, whitePawn);
	setPieceRaw(13, 2, whitePawn);
	setPieceRaw(13, 3, whitePawn);
	setPieceRaw(12, 2, whitePawn);
}


function setPieceRaw(row, column, piece) {
	let board = document.getElementsByTagName("board")[0];
	let r = board.children[row];
	let h = r.children[column];
	let p = h.children[0];
	p.textContent = piece;
	if (blackPieces.includes(piece))
		p.classList.add("black");
	else if (whitePieces.includes(piece))
		p.classList.add("white");
}


function deselect() {
	applyHighlight();
	possible.length = 0;
	let board = document.getElementsByTagName("board")[0];
	if (selectedRow != null && selectedColumn != null) {
		let r = board.children[selectedRow];
		let h = r.children[selectedColumn];
		h.classList.remove("selected");
		selectedRow = null;
		selectedColumn = null;
	}
}

function move(fromRow, fromColumn, toRow, toColumn) {
	let board = document.getElementsByTagName("board")[0];
	let r = board.children[fromRow];
	let h = r.children[fromColumn];
	let p = h.children[0];
	let piece = p.textContent;
	if (piece === whitePawn) {
		moves = en_passant(fromRow, fromColumn);
		if (moves.length) {
			if (moves[0][0] === toRow && moves[0][1] === toColumn) {
				console.log("you shall not pass!");
				let r_ = board.children[toRow + 2];
				let h_ = r_.children[toColumn];
				let p_ = h_.children[0];
				// en passant
				p_.textContent = "";
			}
		}
	}
	// clear piece
	p.textContent = "";


	r = board.children[toRow];
	h = r.children[toColumn];
	p = h.children[0];
	p.textContent = piece;
}

function selectSquare(row, column) {
	let board = document.getElementsByTagName("board")[0];
	let r = board.children[row];
	let h = r.children[column];
	if (h.classList.contains("possible")) {
		move(selectedRow, selectedColumn, row, column);
		deselect();
		return false;
	}
	deselect();
	let p = h.children[0];
	let piece = p.textContent;
	if (whitePieces.includes(piece)) {
		selectedRow = row;
		selectedColumn = column;
		h.classList.add("selected")
		return true;
	}
	return false;
}

function highlight(row, column) {
	let board = document.getElementsByTagName("board")[0];
	let r = board.children[row];
	let h = r.children[column];
	h.classList.toggle("possible");
}

function applyHighlight() {
	possible.forEach(element => {
		highlight(element[0], element[1]);
	});
}

function en_passant(row, column) {
	let board = document.getElementsByTagName("board")[0];
	let possible = [];
	let offset = row % 2;
	// en passant left up
	let en_passant = blackPawns.filter((position) => { return position[0] + 2 === row - 1 && position[1] === column - offset })
	if (en_passant.length) {
		let taking = [en_passant[0][0] + 4, en_passant[0][1]];
		let r = board.children[taking[0]];
		let h = r.children[taking[1]];
		let p = h.children[0];
		let piece = p.textContent;
		if (piece === blackPawn) {
			let moving = [en_passant[0][0] + 2, en_passant[0][1]]
			possible.push(moving);
		}
	}
	// en passant right up
	offset = row % 2 == 0;
	en_passant = blackPawns.filter((position) => { return position[0] + 2 === row - 1 && position[1] === column + offset });
	if (en_passant.length) {
		let taking = [en_passant[0][0] + 4, en_passant[0][1]];
		let r = board.children[taking[0]];
		let h = r.children[taking[1]];
		let p = h.children[0];
		let piece = p.textContent;
		if (piece === blackPawn) {
			let moving = [en_passant[0][0] + 2, en_passant[0][1]]
			possible.push(moving);
		}
	}
	return possible;
}


function showPossible(row, column) {
	applyHighlight();
	// clear array
	possible.length = 0;
	let board = document.getElementsByTagName("board")[0];
	let r = board.children[row];
	let h = r.children[column];
	let p = h.children[0];
	let piece = p.textContent;

	let needsFilter = false;
	let offset = row % 2;
	let currentRow;
	let currentColumn;
	switch (piece) {
		case whitePawn:
			// starting row (white)
			if (whitePawns.filter((position) => { return position[0] === row && position[1] === column }).length) {
				possible.push([row - 4, column]);
			}
			// take left up
			r = board.children[row - 1];
			h = r.children[column - offset];
			p = h.children[0];
			piece = p.textContent;
			if (blackPieces.includes(piece))
				possible.push([row - 1, column - offset]);
			// take right up
			offset = row % 2 == 0;
			r = board.children[row - 1];
			h = r.children[column + offset];
			p = h.children[0];
			piece = p.textContent;
			if (blackPieces.includes(piece))
				possible.push([row - 1, column + offset]);
			possible = possible.concat(en_passant(row, column));
			// forward
			possible.push([row - 2, column]);
			needsFilter = true;
			break;
		case whiteKing:
			// forward
			possible.push([row - 2, column]);
			// left
			possible.push([row, column - 1]);
			// left up
			possible.push([row - 1, column - offset]);
			// forward left
			possible.push([row - 3, column - offset]);
			// right
			possible.push([row, column + 1]);
			// right up
			possible.push([row - 1, column + 1 - offset]);
			// forward right
			possible.push([row - 3, column + 1 - offset]);
			// left down
			possible.push([row + 1, column - offset]);
			// backward left
			possible.push([row + 3, column - offset]);
			// right down
			possible.push([row + 3, column + 1 - offset]);
			// backward right
			possible.push([row + 1, column + 1 - offset]);
			// backward
			possible.push([row + 2, column]);
			needsFilter = true;
			break;
		case whiteKnight:
			// forward
			possible.push([row - 5, column - offset]);
			possible.push([row - 5, column + 1 - offset]);
			// forward left
			possible.push([row - 4, column - 1]);
			possible.push([row - 1, column - 1 - offset]);
			// forward right
			possible.push([row - 4, column + 1]);
			possible.push([row - 1, column + 2 - offset]);
			// backward left
			possible.push([row + 1, column - 1 - offset]);
			possible.push([row + 4, column - 1]);
			// backward right
			possible.push([row + 1, column + 2 - offset]);
			possible.push([row + 4, column + 1]);
			// backward
			possible.push([row + 5, column - offset]);
			possible.push([row + 5, column + 1 - offset]);
			needsFilter = true;
			break;
		case whiteRook:
			// forward
			currentRow = row;
			currentColumn = column;
			do {
				currentRow -= 2;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow <= 0;
			} while (!end);
			// left up
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2;
				currentRow -= 1;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right up
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2 == 0;
				currentRow -= 1;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// left down
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2;
				currentRow += 1;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right down
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2 == 0;
				currentRow += 1;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// backward
			currentRow = row;
			currentColumn = column;
			do {
				currentRow += 2;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19;
			} while (!end);
			break;
		case whiteBishop:
			// left
			currentRow = row;
			currentColumn = column;
			do {
				currentColumn -= 1;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn <= 0;
			} while (!end);
			// left up
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2;
				currentRow -= 3;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2 == 0;
				currentColumn += 1;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset >= 5;
			} while (!end);
			// right up
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2 == 0;
				currentRow -= 3;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// left down
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2;
				currentRow += 3;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
				break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 18 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right down
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2 == 0;
				currentRow += 3;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 18 ||
					currentColumn >= 6 - offset;
			} while (!end);
			break;
		case whiteQueen:
			// rook-like
			// forward
			currentRow = row;
			currentColumn = column;
			do {
				currentRow -= 2;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow <= 0;
			} while (!end);
			// left up
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2;
				currentRow -= 1;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right up
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2 == 0;
				currentRow -= 1;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// left down
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2;
				currentRow += 1;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right down
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2 == 0;
				currentRow += 1;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// backward
			currentRow = row;
			currentColumn = column;
			do {
				currentRow += 2;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19;
			} while (!end);
			// bishop-like
			// left
			currentRow = row;
			currentColumn = column;
			do {
				currentColumn -= 1;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn <= 0;
			} while (!end);
			// left up
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2;
				currentRow -= 3;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2 == 0;
				currentColumn += 1;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset >= 5;
			} while (!end);
			// right up
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2 == 0;
				currentRow -= 3;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// left down
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2;
				currentRow += 3;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 18 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right down
			currentRow = row;
			currentColumn = column;
			do {
				offset = currentRow % 2 == 0;
				currentRow += 3;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined)
					break;
				h = r.children[currentColumn];
				if (h == undefined)
					break;
				p = h.children[0];
				piece = p.textContent;
				if (whitePieces.includes(piece))
					break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" ||
					blackPieces.includes(piece) ||
					currentRow >= 18 ||
					currentColumn >= 6 - offset;
			} while (!end);
			break;
		default:
			break;
	}
	// filter invalid moves
	function invalid(value, index, array) {
		let row = value[0];
		let column = value[1];
		let r = board.children[row];
		if (r == undefined)
			return false;
		let h = r.children[column];
		if (h == undefined)
			return false;
		let p = h.children[0];
		let piece = p.textContent;
		if (whitePieces.includes(piece))
			return false;
		return true;
	}
	if (needsFilter)
		possible = possible.filter(invalid);
	applyHighlight();
}