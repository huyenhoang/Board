
var piecePositions = null;

var pieces = null,
	ctx = null,
	json = null,
	canvas = null,
	CHANGED_PAWN = 0,
	currentTurn = BLACK_TEAM,
	selectedPiece = null,
	clickLock = false,
	prevClickedBlock = null,
	arrHistory = [],
	nHistoryIndex = -1;
	curGamestate = GS_NONE;
	
//engine
var SrcPos, DstPos, CurPieceCode,
    CurPlayer = 0, PawnPos, bPawnEnd = false, 
	bCheckQueenState = false,bMovedPiece = false,
    aBoard = [], board = [],
    iSquare = 120;
     

function SetupChessboard() {
    var x, y;
    var i = 0;
    var initial = [
         5,  3,  4,  6,  2,  4,  3,  5,
         1,  1,  1,  1,  1,  1,  1,  1,
         9,  9,  9,  9,  9,  9,  9,  9,
        13, 11, 12, 14, 10, 12, 11, 13
    ];
	
	var EnemyTeam = json.white;
	
	// Variables for random pos of kinght, bishop, rook
	var rand = [[3,4,5], [3,5,4], [4,3,5], [4,5,3], [5,3,4], [5,4,3]];
	var nIndex1 = Math.floor(Math.random( ) * 6); 		
	var nIndex2 = Math.floor(Math.random( ) * 6); 
	
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
				console.log(initial[i], ( initial[i]|16));
				if(i<3){
					EnemyTeam[i].piece = rand[nIndex1][i] - 1;
					board[y*10+x] = rand[nIndex1][i++] | 16; 
					continue;
				}
				if(i>4 && i<8){
					EnemyTeam[i].piece = rand[nIndex2][i-5] - 1;
					board[y*10+x] = rand[nIndex2][i-5] | 16; 
					i++; 
					continue;
				}
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



function ReadHistory(){
	
	if(bRedo == UNDO) nHistoryIndex++;
	
	var sIndex = arrHistory[nHistoryIndex].FromBoardPos;
	var tIndex = arrHistory[nHistoryIndex].ToBoardPos;
	
	if(bRedo==UNDO)
	{
		board[tIndex] = arrHistory[nHistoryIndex].FromBoardVal;
		board[sIndex] = 0;
		SetJsonInfo(sIndex, tIndex,  arrHistory[nHistoryIndex].WhereTurn, false);
	}
	else
	{
		board[sIndex] = arrHistory[nHistoryIndex].FromBoardVal;
		SetJsonInfo(tIndex, sIndex,  arrHistory[nHistoryIndex].WhereTurn, false);
		
		
		if(arrHistory[nHistoryIndex].DiedEnemyIndex < 16)
		{
			var Eteam = (arrHistory[nHistoryIndex].WhereTurn === WHITE_TEAM ? json.black : json.white);
			sIndex = arrHistory[nHistoryIndex].DiedEnemyIndex;
			Eteam[sIndex].status = IN_PLAY;
			board[tIndex] = arrHistory[nHistoryIndex].ToBoardVal;
		}
		else
		{
			board[tIndex] = 0;
		}
		nHistoryIndex--;
	}
	
	drawPieces();
	
}

function SetJsonInfo(sBoardIndex, tBoardIndex, Turn, bSave, sPieceVal, tPieceVal){
	//Set Info of Pieces

	var iPieceCounter = 0;
	var sblock =  {
		"row": Math.floor((sBoardIndex - 21) / 10),
		"col": (sBoardIndex - 21) % 10
	};
	
	var tblock =  {
		"row": Math.floor((tBoardIndex - 21) / 10),
		"col": (tBoardIndex - 21) % 10
	};
	
	var team = (Turn === WHITE_TEAM ? json.white : json.black),
		opposite = (Turn !== WHITE_TEAM ? json.white : json.black);

	for (iPieceCounter = 0; iPieceCounter < team.length; iPieceCounter++) {
		curPiece = team[iPieceCounter];
		if (curPiece.status === IN_PLAY && curPiece.col === sblock.col && curPiece.row === sblock.row) {
			team[iPieceCounter].col = tblock.col;	
			team[iPieceCounter].row = tblock.row;
			if(bPawnEnd) team[iPieceCounter].piece = PIECE_KING;
			if(!bSave && arrHistory[nHistoryIndex].PawnChange == true)
				team[iPieceCounter].piece = PIECE_PAWN;
			break;
		}
	}
	
	for (iPieceCounter = 0; iPieceCounter < opposite.length; iPieceCounter++) {
		curPiece = opposite[iPieceCounter];
		if (curPiece.status === IN_PLAY && curPiece.col === tblock.col && curPiece.row === tblock.row) {
			opposite[iPieceCounter].status = OUT_PLAY;		
			break;
		}
	}

	if(bSave)
	{
		var history ={//piece moved FromPos -> ToPos
			"FromBoardPos"	:sBoardIndex,
			"ToBoardPos"  	:tBoardIndex,
			"WhereTurn"		:currentTurn,
			"DiedEnemyIndex":iPieceCounter,
			"FromBoardVal"	:sPieceVal,
			"ToBoardVal"	:tPieceVal,
			"PawnChange"	:bPawnEnd,
		}
		
		nHistoryIndex++;
		if(nHistoryIndex != arrHistory.length)
			arrHistory.splice(nHistoryIndex);
		
		arrHistory.push(history);
	}
	
	 bPawnEnd=false;
	
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
										
                                    	bMovedPiece = true;
										if(!bCheckQueenState)
										{
                                    	    SetJsonInfo(SrcPos, DstPos, currentTurn, true, o, r);
											drawPieces();
											currentTurn = (currentTurn === WHITE_TEAM ? BLACK_TEAM : WHITE_TEAM);
											iSquare--;
											PawnPos = J;
											selectedPiece = null;
											writeAllChessInfo();
											return PawnPos;
										}
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

function checkIfPieceClicked(clickedBlock) {
	var pieceAtBlock = getPieceAtBlock(clickedBlock);

	if(selectedPiece !== null && selectedPiece !== pieceAtBlock)
		removeSelection(selectedPiece);
		
	if (pieceAtBlock !== null) {
		selectPiece(pieceAtBlock);
	}
}

function CheckQueenState(){
	bMovedPiece = false;
	bCheckQueenState = false;
	ChessEngine(0,0,0,21,PawnPos,2/*ply*/);
	ChessEngine(0,0,0,21,PawnPos,1);
	
	if(!bMovedPiece)
	{
		alert("You Win!!!");
		curGamestate = GS_WIN;
		return;
	}
	
	bMovedPiece = false;
	bCheckQueenState = true;
	ChessEngine(0,0,0,21,PawnPos,2/*ply*/);
	ChessEngine(0,0,0,21,PawnPos,1);
	if(!bMovedPiece)
	{
		alert("You lose");
		curGamestate = GS_LOSS;
	}
	bCheckQueenState = false;
	clickLock=false;
}

function SwitchChessPosition(fromPos, toPos)
{

	var fromBoardIndex = fromPos.row * 10 + fromPos.col + 21;
	var toBoardIndex = toPos.row * 10 + toPos.col + 21;
	if(board[fromBoardIndex] == board[toBoardIndex])
		return;
		
	var Val = board[fromBoardIndex];
	board[fromBoardIndex] = board[toBoardIndex];
	board[toBoardIndex] = Val;
	
	var Team = json.black;
	var frompiece = Team[fromPos.col].piece;
	Team[fromPos.col].piece = Team[toPos.col].piece;
	Team[toPos.col].piece = frompiece;
	
	drawPieces();
}

function board_click(ev) {
	if (clickLock)
        return;
		
	var x = ev.clientX - canvas.offsetLeft,
		y = ev.clientY - canvas.offsetTop,
		
	clickedBlock = screenToBlock(x, y);
	if(curGamestate != GS_START)
	{
		if(clickedBlock.row == 7 && clickedBlock.col != 3 && clickedBlock.col != 4)
		{//If selected piece is not King or Queen.
			if(prevClickedBlock == null)
			{
				prevClickedBlock = clickedBlock;	
			}
			else if(prevClickedBlock !== clickedBlock)
			{
				SwitchChessPosition(prevClickedBlock, clickedBlock);
				prevClickedBlock = null;
			}
		}
		else
		{
			prevClickedBlock = null;
		}
	}
		
	var nIndex = 21 + clickedBlock.row * 10 + clickedBlock.col;
    CurPieceCode = (board[nIndex] ^ CurPlayer) & CONST_FIFTEEN;
    
	if (CurPieceCode > 8) {
        DstPos = nIndex;
        checkIfPieceClicked(clickedBlock);
		SrcPos=DstPos;
    } else{
		if (SrcPos && CurPieceCode<9 && curGamestate == GS_START) {
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
				setTimeout("CheckQueenState()",250);
			}
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

function writeAllChessInfo()
{
	localStorage.setItem('JsonInfo', JSON.stringify(json));
	localStorage.setItem('BoardInfo', JSON.stringify(board));
	localStorage.setItem('HistoryInfo', JSON.stringify(arrHistory));
	localStorage.setItem('HistoryIndex', nHistoryIndex);
}
function clearChessInfo()
{
	localStorage.clear();
}
function getAllChessInfo(){

	if(typeof(Storage) !== "undefined") {

		var PrevJson = localStorage.getItem('JsonInfo');
		
		if(PrevJson != null){
			json = JSON.parse(PrevJson);
			board = JSON.parse(localStorage.getItem('BoardInfo'));
			arrHistory = JSON.parse(localStorage.getItem('HistoryInfo'));
			nHistoryIndex = localStorage.getItem('HistoryIndex');
			curGamestate = GS_START;
			return;
		}
	}
	
	InitPieceInfo();
	SetupChessboard();
	
}
function draw() {
	// Main entry point got the HTML5 chess board example
	
	canvas = document.getElementById('chessboard');

	// Canvas supported?
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');

		// Calculdate the precise block size
		BLOCK_SIZE = canvas.height / NUMBER_OF_ROWS;
		
		CurPieceCode = 100;
		CurPlayer = PawnPos = 0;
		
		getAllChessInfo();
		
		// Draw pieces
		pieces = new Image();
		pieces.src = 'pieces.png';
		pieces.onload = drawPieces;
		
		canvas.addEventListener('click', board_click, false);
	} else {
		alert("Canvas not supported!");
	}
}