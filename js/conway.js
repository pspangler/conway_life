/** conway.js **/

function LifeBoard(size_x, size_y) {

	var board;

	this.initializeBoard = function(x_size, y_size) {
		this.max_x = x_size;
		this.max_y = y_size;

		this.board = new Array(y_size);
		for (i=0; i<this.max_y; i++) {
			this.board[i] = new Array(x_size);

			for (j=0; j<this.max_x; j++) {
				this.board[i][j] = 0;
			}
		}
	}

	this.resetBoard = function() {
		for (i=0; i<this.max_y; i++) {
			for (j=0; j<this.max_x; j++) {
				this.board[i][j] = 0;
			}
		}
	}

	this.setCellState = function(x, y, state) {
		this.board[y][x] = state;
	}

	this.grab_mouse_click_position = function(e) {
		var x;
		var y;
		
		if (e.pageX || e.pageY) {
			x = e.pageX;
			y = e.pageY;
		} else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		/* Compensate for where the canvas actually is on the page. */
		// For some reason I can't use the this variable here.
		var life_canvas = document.getElementById("lifeboard_canvas");
		x -= life_canvas.offsetLeft;
		y -= life_canvas.offsetTop;

		x = Math.round(x / 10);
		y = Math.round(y / 10);
		
		/* Now convert this to regular grid coordinates. */
		/*  if x is 78, then we want (for now) to call this '7' */
		
		LifeBoard.toggleCell(x, y);
	}

	this.setCanvasElement = function(x_size, y_size, c) {
		this.canvas_board = c;
		this.canvas_x     = x_size;
		this.canvas_y     = y_size;

		this.canvas_board.addEventListener("click", this.grab_mouse_click_position, false);
	}

	this.toString = function() {
		board_string = "";
		for (i=0; i<this.max_y; i++) {
			for (j=0; j<this.max_x; j++) {
				board_string = board_string + this.board[j][i] + " ";
			}
			board_string = board_string + "\n";
		}
		return board_string;
	}

	this.countLivingCells = function() {
		living_counter = 0;
		for (i=0; i<this.max_y; i++) {
			for (j=0; j<this.max_x; j++) {
				if (this.board[j][i] == 1) {
					living_counter++;
				}
			}
		}
		return living_counter;
	}

	this.life = function() {

		tempBoard = new Array(this.max_y);
		for (i=0; i<this.max_y; i++) {
			tempBoard[i] = new Array(this.max_x);
			for (j=0; j<this.max_x; j++) {
				tempBoard[i][j] = 0;
			}
		}

		for (i=0; i<this.max_y; i++) {
			tempBoard[i] = new Array(this.max_x);

			for (j=0; j<this.max_x; j++) {

				numNeighbors = this.getLivingNeighborsCount(j, i);

				// set up the new state in our temp board array.
				if (this.board[i][j] == 1) {
					if ( (numNeighbors >= 2) && (numNeighbors <= 3) ) {
						tempBoard[i][j] = 1;
					} else {
						// Death from isolation or overcrowding.
						tempBoard[i][j] = 0;
					}

				} else {
					if (numNeighbors == 3) {
						// Birth!
						tempBoard[i][j] = 1;
					} else {
						tempBoard[i][j] = 0;
					}
				}
			}
		}

		// Now update the actual board.
		for (i=0; i<this.max_y; i++) 
			for (j=0; j<this.max_x; j++) 
				this.board[i][j] = tempBoard[i][j];
	}

	this.renderBoard = function() { 
		var context = this.canvas_board.getContext("2d");
		context.fillStyle = "#000000";
		context.fillRect(0, 0, this.canvas_x, this.canvas_y);

		context.fillStyle = "#ffffff";

		for (i=0; i<this.max_y; i++) {
			for (j=0; j<this.max_x; j++)  {
				sx = j*10;
				sy = i*10;

				if (this.board[j][i] == 1) {
					context.fillStyle = "#ffffff";
					context.fillRect(sx, sy, 10, 10);
				} else {
					context.fillStyle = "#0F17FA";
					context.fillRect(sx, sy, 10, 10);
				}
			}
		}

	}

	this.getLivingNeighborsCount = function(x, y) {
		livingNeighborCount=0;

		for (dy=y-1; dy<=y+1; dy++) {
			if (dy < 0) { continue; }

			if (dy >= this.max_y) { continue; }

			for (dx=x-1; dx<=x+1; dx++) {
				if (dx < 0) { continue; }

				if (dx >= this.max_x) { continue; }

				if (this.board[dy][dx] == 1) {
					livingNeighborCount++;
				}
			}
		}
		// Decrement the living neighbor count by 1 since
		// we counted the cell at x,y
		if (this.board[y][x] == 1)
			livingNeighborCount = livingNeighborCount-1;
		return livingNeighborCount;
	}

	this.toggleCell = function(x, y) {
		var context = this.canvas_board.getContext("2d");
		sx = x*10;
		sy = y*10;

		if (LifeBoard.board[x][y] == 1) {
			LifeBoard.board[x][y] = 0;
			context.fillStyle = "#0F17FA";
			context.fillRect(sx, sy, 10, 10);			
		} else {
			LifeBoard.board[x][y] = 1;
			context.fillStyle = "#ffffff";
			context.fillRect(sx, sy, 10, 10);
		}
	}

	this.initializeBoard(size_x, size_y);
}







