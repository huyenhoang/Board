var NUMBER_OF_COLS = 8,
	NUMBER_OF_ROWS = 8,
	BLOCK_SIZE = 100;

var BLOCK_COLOUR_1 = '#000000',
	BLOCK_COLOUR_2 = '#ffffff',
	HIGHLIGHT_COLOUR = '#fb0006';
	BLACK_COLOUR = '#000000';

var piecePositions = null;

var PIECE_PAWN = 0,
	PIECE_CASTLE = 1,
	PIECE_ROUKE = 2,
	PIECE_BISHOP = 3,
	PIECE_QUEEN = 4,
	PIECE_KING = 5,
	CHANGED_PAWN = 0;
	IN_PLAY = 0,
	OUT_PLAY = 1,
	pieces = null,
	ctx = null,
	json = null,
	canvas = null,
	BLACK_TEAM = 0,
	WHITE_TEAM = 1,
	SELECT_LINE_WIDTH = 5,
	currentTurn = BLACK_TEAM,
	selectedPiece = null,
	clickLock = false;

//engine
var SrcPos, DstPos, CurPieceCode,
    CurPlayer = 0, PawnPos, bPawnEnd = true, 
    aBoard = [], board = [],
    iSquare = 120, CONST_TEN = 10, CONST_FIFTEEN = 15, CONST_M = 10000,
    piecesCosts = [0,99,0,306,297,495,846], 
    rowsCosts = [-1,0,1,2,2,1,0,-1]; 

function defaultPositions() {
	json = {
		"white":
			[
				{
					"piece": PIECE_CASTLE,
					"row": 0,
					"col": 0,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_ROUKE,
					"row": 0,
					"col": 1,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_BISHOP,
					"row": 0,
					"col": 2,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_KING,
					"row": 0,
					"col": 3,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_QUEEN,
					"row": 0,
					"col": 4,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_BISHOP,
					"row": 0,
					"col": 5,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_ROUKE,
					"row": 0,
					"col": 6,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_CASTLE,
					"row": 0,
					"col": 7,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 1,
					"col": 0,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 1,
					"col": 1,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 1,
					"col": 2,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 1,
					"col": 3,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 1,
					"col": 4,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 1,
					"col": 5,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 1,
					"col": 6,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 1,
					"col": 7,
					"status": IN_PLAY
				}
			],
		"black":
			[
				{
					"piece": PIECE_CASTLE,
					"row": 7,
					"col": 0,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_ROUKE,
					"row": 7,
					"col": 1,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_BISHOP,
					"row": 7,
					"col": 2,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_KING,
					"row": 7,
					"col": 3,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_QUEEN,
					"row": 7,
					"col": 4,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_BISHOP,
					"row": 7,
					"col": 5,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_ROUKE,
					"row": 7,
					"col": 6,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_CASTLE,
					"row": 7,
					"col": 7,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 6,
					"col": 0,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 6,
					"col": 1,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 6,
					"col": 2,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 6,
					"col": 3,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 6,
					"col": 4,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 6,
					"col": 5,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 6,
					"col": 6,
					"status": IN_PLAY
				},
				{
					"piece": PIECE_PAWN,
					"row": 6,
					"col": 7,
					"status": IN_PLAY
				}
			]
	};
}

function SetupChessboard() {
    var x, y;
    var i = 0;
    var initial = [
         5,  3,  4,  6,  2,  4,  3,  5,
         1,  1,  1,  1,  1,  1,  1,  1,
         9,  9,  9,  9,  9,  9,  9,  9,
        13, 11, 12, 14, 10, 12, 11, 13
    ];
    for (y=0; y<12; y++) {
        for (x=0; x<10; x++) {
            if (x<1 || y<2 || x>8 || y>9) {
                // outside
                board[y*10+x] = 7;
            } else if (y>=4 && y<=7) {
                // empty
                board[y*10+x] = 0;
            } else {
                // pieces
                board[y*10+x] = initial[i++] | 16;
            }
        }
    }
}

function movesForPiece(piece) {
    var moves = [
        [9,11,10,20],                 // black pawn
        [-1,1,-10,10,-11,-9,9,11],    // king
        [-21,-19,-12,-8,8,12,19,21],  // knight
        [-11,-9,9,11],                // bishop
        [-1,1,-10,10],                // rook
        [-1,1,-10,10,-11,-9,9,11]     // queen
    ];

    // for white pawn
    if ((piece & 15) == 9)
        return [-9,-11,-10, -20];

    // for other pieces
    return moves[(piece & 7) - 1];
}

function executeMove(O, p, n, m, g) {
    board[p] = n;
    if (m) {
        board[g] = board[m];
        board[m] = 0;
    } else if (g) {
        board[g] = 0;
    }
    board[O] = 0;
}

function undoMove(O, p, o, r, m, g) {
    board[O] = o;
    board[p] = r;
    if (m) {
        board[m] = board[g];
        board[g] = 0;
    } else if (g) {
        board[g] = 9 ^ CurPlayer;
    }
}

function getPieceAtBlock(clickedBlock) {

	var team = (currentTurn === BLACK_TEAM ? json.black : json.white);

	return getPieceAtBlockForTeam(team, clickedBlock);
}

function SetPieceInfo(sBoardIndex, tBoardIndex){
	var iPieceCounter = 0;
	var sblock =  {
		"row": Math.floor((sBoardIndex - 21) / 10),
		"col": (sBoardIndex - 21) % 10
	};
	
	var tblock =  {
		"row": Math.floor((tBoardIndex - 21) / 10),
		"col": (tBoardIndex - 21) % 10
	};
	
	var team = (currentTurn === WHITE_TEAM ? json.white : json.black),
		opposite = (currentTurn !== WHITE_TEAM ? json.white : json.black);

	for (iPieceCounter = 0; iPieceCounter < opposite.length; iPieceCounter++) {
		curPiece = opposite[iPieceCounter];
		if (curPiece.status === IN_PLAY && curPiece.col === tblock.col && curPiece.row === tblock.row) {
			opposite[iPieceCounter].status = OUT_PLAY;		
			break;
		}
	}
	
	for (iPieceCounter = 0; iPieceCounter < team.length; iPieceCounter++) {
		curPiece = team[iPieceCounter];
		if (curPiece.status === IN_PLAY && curPiece.col === sblock.col && curPiece.row === sblock.row) {
			team[iPieceCounter].col = tblock.col;	
			team[iPieceCounter].row = tblock.row;
			if(bPawnEnd) team[iPieceCounter].piece = PIECE_KING;
			break;
		}
	}
}

function screenToBlock(x, y) {
	var block =  {
		"row": Math.floor(y / BLOCK_SIZE),
		"col": Math.floor(x / BLOCK_SIZE)
	};

	return block;
}

function getPieceAtBlockForTeam(teamOfPieces, clickedBlock) {

	var curPiece = null,
		iPieceCounter = 0,
		pieceAtBlock = null;

	for (iPieceCounter = 0; iPieceCounter < teamOfPieces.length; iPieceCounter++) {

		curPiece = teamOfPieces[iPieceCounter];

		if (curPiece.status === IN_PLAY &&
			curPiece.col === clickedBlock.col &&
			curPiece.row === clickedBlock.row) {
			
			curPiece.position = iPieceCounter;
			pieceAtBlock = curPiece;
			iPieceCounter = teamOfPieces.length;
		}
	}

	return pieceAtBlock;
}

function getBlockColour(iRowCounter, iBlockCounter) {
	var cStartColour;

	// Alternate the block colour
	if (iRowCounter % 2) {
		cStartColour = (iBlockCounter % 2 ? BLOCK_COLOUR_1 : BLOCK_COLOUR_2);
	} else {
		cStartColour = (iBlockCounter % 2 ? BLOCK_COLOUR_2 : BLOCK_COLOUR_1);
	}

	return cStartColour;
}

function drawBlock(iRowCounter, iBlockCounter) {
	// Set the background
	ctx.fillStyle = getBlockColour(iRowCounter, iBlockCounter);

	// Draw rectangle for the background
	ctx.fillRect(iRowCounter * BLOCK_SIZE, iBlockCounter * BLOCK_SIZE,
		BLOCK_SIZE, BLOCK_SIZE);

	ctx.stroke();
}

function getImageCoords(pieceCode, bBlackTeam) {

	var imageCoords =  {
		"x": pieceCode * BLOCK_SIZE,
		"y": (bBlackTeam ? 0 : BLOCK_SIZE)
	};

	return imageCoords;
}

function drawPiece(curPiece, bBlackTeam) {

	if(curPiece.status === IN_PLAY)
	{
		var imageCoords = getImageCoords(curPiece.piece, bBlackTeam);
		
		// Draw the piece onto the canvas
		ctx.drawImage(pieces,
			imageCoords.x, imageCoords.y,
			BLOCK_SIZE, BLOCK_SIZE,
			curPiece.col * BLOCK_SIZE, curPiece.row * BLOCK_SIZE,
			BLOCK_SIZE, BLOCK_SIZE);
	}
}

function removeSelection(selectedPiece) {
	drawBlock(selectedPiece.col, selectedPiece.row);
	drawPiece(selectedPiece, (currentTurn === BLACK_TEAM));
}

function drawRow(iRowCounter) {
	var iBlockCounter;

	// Draw 8 block left to right
	for (iBlockCounter = 0; iBlockCounter < NUMBER_OF_ROWS; iBlockCounter++) {
		drawBlock(iRowCounter, iBlockCounter);
	}
}

function drawBoard() {
	var iRowCounter;

	for (iRowCounter = 0; iRowCounter < NUMBER_OF_ROWS; iRowCounter++) {
		drawRow(iRowCounter);
	}

	// Draw outline
	ctx.lineWidth = 3;
	ctx.strokeStyle = BLACK_COLOUR;
	ctx.strokeRect(0, 0,
		NUMBER_OF_ROWS * BLOCK_SIZE,
		NUMBER_OF_COLS * BLOCK_SIZE);
}



function selectPiece(pieceAtBlock) {
	// Draw outline
	ctx.lineWidth = SELECT_LINE_WIDTH;
	ctx.strokeStyle = HIGHLIGHT_COLOUR;
	ctx.strokeRect((pieceAtBlock.col * BLOCK_SIZE) + SELECT_LINE_WIDTH,
		(pieceAtBlock.row * BLOCK_SIZE) + SELECT_LINE_WIDTH,
		BLOCK_SIZE - (SELECT_LINE_WIDTH * 2),
		BLOCK_SIZE - (SELECT_LINE_WIDTH * 2));

	selectedPiece = pieceAtBlock;
}

function checkIfPieceClicked(clickedBlock) {
	var pieceAtBlock = getPieceAtBlock(clickedBlock);

	if(selectedPiece !== null && selectedPiece !== pieceAtBlock)
		removeSelection(selectedPiece);
		
	if (pieceAtBlock !== null) {
		selectPiece(pieceAtBlock);
	}
}

function board_click(ev) {
	if (clickLock)
        return;
		
	var x = ev.clientX - canvas.offsetLeft,
		y = ev.clientY - canvas.offsetTop,
		
	clickedBlock = screenToBlock(x, y);
	
	var nIndex = 21 + clickedBlock.row * 10 + clickedBlock.col;
    CurPieceCode = (board[nIndex] ^ CurPlayer) & CONST_FIFTEEN;
    
	if (CurPieceCode > 8) {
        DstPos = nIndex;
        checkIfPieceClicked(clickedBlock);
		SrcPos=DstPos;
		bPawnEnd = false;
    } else if (SrcPos && CurPieceCode<9) {
        // clicked on the opponent piece or empty space
		DstPos = nIndex;
		CurPieceCode = board[SrcPos] & CONST_FIFTEEN;
		// pawn promotion
		if ((CurPieceCode & 7) == 1 & (DstPos < 29 | DstPos > 90))
		{
			CurPieceCode = 14 - CHANGED_PAWN ^ CurPlayer;
			bPawnEnd = true;
		}
		// verify player move and execute it
		ChessEngine(0,0,0,21,PawnPos,1);
		// Call A.aBoard. after some delay
		if (CurPlayer) {
			clickLock = true;
			setTimeout("ChessEngine(0,0,0,21,PawnPos,2/*ply*/);ChessEngine(0,0,0,21,PawnPos,1);clickLock=false;",250);
		}
	}
}

function drawTeamOfPieces(teamOfPieces, bBlackTeam) {
	var iPieceCounter;

	// Loop through each piece and draw it on the canvas	
	for (iPieceCounter = 0; iPieceCounter < teamOfPieces.length; iPieceCounter++) {
		drawPiece(teamOfPieces[iPieceCounter], bBlackTeam);
	}
}

function drawPieces() {
	drawBoard();
	drawTeamOfPieces(json.black, true);
	drawTeamOfPieces(json.white, false);
}


function ChessEngine(w,c,h,e,S,s) {
    var t, o, L, E, d, O = e,
        N = -CONST_M*CONST_M,
        K = (78 - h) << CONST_TEN, 
        p, g, n, m, q, r, C, J,
        a = CurPlayer ? -CONST_TEN : CONST_TEN, moves;
		
    CurPlayer ^= 8;
    iSquare++;
    d = w || (s && s>=h && ChessEngine(0,0,0,21,0,0) > CONST_M);

    do {
        p = O; 
        o = board[p]; 
        if (o) { 
            q = o & CONST_FIFTEEN ^ CurPlayer;
            if (q < 7) {
                q--;
                moves = movesForPiece(o);
                C = 0;
                do {
                    p += moves[C]; 
                    r = board[p];
                    if (!w | p == w) { 
                        g = (q == 0 && p + a == S) ? S : 0; 
                        if ((!r & (!!q | C>1 || !!g)) || ((r+1&CONST_FIFTEEN^CurPlayer)>9 && (q | C<2))) {
                            m = !(r - 2 & 7);
                            if (m) {
                                CurPlayer ^= 8;
                                aBoard[iSquare--] = O;
                                return K;
                            }
                            
                            J = n = o & CONST_FIFTEEN; 
                            E = board[p - a] & CONST_FIFTEEN; 
                           
						    t = (q | E-7) ? n : (n+=2,6^CurPlayer);
                            while (n <= t) {
                                L = r ? piecesCosts[r&7]-h-q : 0; 
                                if (s) {
                                    L+=((1-q) ? rowsCosts[(p-p%CONST_TEN)/CONST_TEN-2] - rowsCosts[(O-O%CONST_TEN)/CONST_TEN-2] +
                                                rowsCosts[p%CONST_TEN-1]*(q?1:2) - rowsCosts[O%CONST_TEN-1] + (o&16)/2
                                              : !!m * 9) +
                                       (!q ? !(board[p-1]^n) + !(board[p+1]^n) + piecesCosts[n&7] - 99 + !!g * 99 + (C == 3)
                                           : 0) +
                                       !(E ^ CurPlayer ^ 9);
                                }
                                if ((s > h) || ((1<s & s==h) && (L>CONST_FIFTEEN | d))) {
                                    executeMove(O, p, n, m, g);
                                    J = (q | C<3) ? 0 : p;
                                    L -= ChessEngine((s > h | d) ? 0 : p,
                                           L - N,
                                           h + 1,
                                           aBoard[iSquare+1],
                                           J,
                                           s);
                                    if (!h && s == 1 && SrcPos == O && CurPieceCode == n && p == DstPos && L >= -CONST_M) {
                                     //   DrawPieces();
									    SetPieceInfo(SrcPos, DstPos);
										drawPieces();
										currentTurn = (currentTurn === WHITE_TEAM ? BLACK_TEAM : WHITE_TEAM);
                                        iSquare--;
                                        PawnPos = J;
										selectedPiece = null;
                                        return PawnPos;
                                    }
                                    J = (q-1 | C>1) || m || (!s | d | r | o<CONST_FIFTEEN) || ChessEngine(0,0,0,21,0,0) > CONST_M;
                                    undoMove(O, p, o, r, m, g);
                                }
                                // if current move has better heuristic
                                if (L>N || (s>1 && L==N && !h && Math.random()<.5)) {
                                    aBoard[iSquare] = O;
                                    if (s > 1) {
                                        // cutoff
                                        if (h && L > c) {
                                            CurPlayer ^= 8;
                                            iSquare--;
                                            return L;
                                        }
                                        // output this move
                                        if (!h) {
                                            CurPieceCode = n;
                                            SrcPos = O;
                                            DstPos = p;
                                        }
                                    }
                                    N = L;
                                }
                                // try castling if J == 0
                                n += J || (g = p,
                                           m = (p < O) ? g-3 : g+2,
                                           (board[m] < CONST_FIFTEEN | board[m+O-p]) || board[p+=p-O]) ? 1 : 0;
                            }
                        }
                    }
                } while ((!r & q>2) || (p=O, (q | C < 2 | o > CONST_FIFTEEN & !r) && (++C < moves.length)));
            }
        }
    } while ((++O > 98) ? O = 20 : e - O);
    CurPlayer ^= 8;
    iSquare--;
    return (N + CONST_M*CONST_M && (N > 1924-K | d)) ? N : 0;
}

function draw() {
	// Main entry point got the HTML5 chess board example

	canvas = document.getElementById('chess');

	// Canvas supported?
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');

		// Calculdate the precise block size
		BLOCK_SIZE = canvas.height / NUMBER_OF_ROWS;

		CurPieceCode = 100;
		CurPlayer = PawnPos = 0;
		SetupChessboard();
		defaultPositions();

		// Draw pieces
		pieces = new Image();
		pieces.src = 'pieces.png';
		pieces.onload = drawPieces;
		
		canvas.addEventListener('click', board_click, false);
	} else {
		alert("Canvas not supported!");
	}
} 
