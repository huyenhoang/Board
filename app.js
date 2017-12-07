/* Default Chess Piece Positions */
function InitPieceInfo() {	
    json = {
        "white":
        [
			{
				"piece": PIECE_KNIGHT,
				"row": 0,
				"col": 0,
				"status": IN_PLAY
			},
			{
				"piece": PIECE_ROOK,
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
				"piece": PIECE_ROOK,
				"row": 0,
				"col": 6,
				"status": IN_PLAY
			},
			{
				"piece": PIECE_KNIGHT,
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
				"piece": PIECE_KNIGHT,
				"row": 7,
				"col": 0,
				"status": IN_PLAY
			},
			{
				"piece": PIECE_ROOK,
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
				"piece": PIECE_ROOK,
				"row": 7,
				"col": 6,
				"status": IN_PLAY
			},
			{
				"piece": PIECE_KNIGHT,
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

/* ----- Game Constants ----- */

//piece info
var piecePawn = 0,
	pieceQueen = 1,
	pieceRook = 2,
	pieceBishop = 3,
	pieceKnight = 4,
	pieceKing = 5,
	inPlay = 0,
	outPlay = 1;

//game status info	
var	statusNone = 0,
	statuStart = 1,
	statusWin = 2,
	statusLoss = 3;
	
//block info	
var NUMBER_OF_COLS = 8,
	NUMBER_OF_ROWS = 8,
	SELECT_LINE_WIDTH = 5,
	BLOCK_SIZE = 100;
	
//game color
var BLOCK_COLOUR_1 = '#9f7119',
	BLOCK_COLOUR_2 = '#debf83',
	HIGHLIGHT_COLOUR = '#fb0006';
	BLACK_COLOUR = '#000000';

var UNDO = 0, 
	REDO = 1;
	
var	BLACK_TEAM = 0,
	WHITE_TEAM = 1;
	
//engine
var CONST_TEN = 10, 
	CONST_FIFTEEN = 15, 
	CONST_M = 10000,
	piecesCosts = [0,99,0,306,297,495,846], 
    rowsCosts = [-1,0,1,2,2,1,0,-1];	
	