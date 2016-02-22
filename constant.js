//piece info
var PIECE_PAWN   = 0,
	PIECE_QUEEN  = 1,
	PIECE_ROOK   = 2,
	PIECE_BISHOP = 3,
	PIECE_KNIGHT = 4,
	PIECE_KING   = 5,
	IN_PLAY      = 0,
	OUT_PLAY     = 1;

//game status info	
var	GS_NONE  = 0,
	GS_START = 1,
	GS_WIN   = 2,
	GS_LOSS  = 3;
	
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
	