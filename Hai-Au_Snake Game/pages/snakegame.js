/*------Hai-Au Bui, Group 7 Game------------*/

$(document).ready(function(){	
	//declare variable canvas, context of canvas: ctx, width of canvas: w, height of canvas: h
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();	
	// declare canvas cell width and height is 10px
	var canvas_cell = 10;	
	var direction;	//variable hold direction of left, right, up or down
	var food;	//variable food hold position of vertical and horizontal of the apple
	var score;	//variable score will set to 0 and will keep trach the score each time the snake eat
	var game_loop;	//declare variable game_loop and will assign to setInterval for the game start or stop
	var snake_array;	//declare snake with the length of snake-array
	var game_sound;		//declare game sound background
	var eat_sound;		//declare sound when snake is eating
	var dead_sound;		//declare sound when the snkae  die
	
	/*
	*Sound() function will automatic preload with no control and no display property
	*only using play and pause property for background music, eating and dead sound
	*@param: game_sound, eat_sound, and dead_sound
	*the purpose of this Sound() is play the src.sound when user play, or pause the src.sound 
	*when the game end or user stop the game
	*/
		function Sound(src){
			this.sound = document.createElement("audio");
			this.sound.src = src;
			this.sound.setAttribute("preload", "auto");			
			this.sound.setAttribute("controls", "none");
			this.sound.style.display = "none";		
			this.play = function(){
				this.sound.play();
			};
			this.pause = function(){
				this.sound.pause();		
			}  
		}
			//draw the canvas in black color
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,w,h);
			
		/*
		*game_start() function will start with the snake go from the left top corner go to the right
		*on canvas has the snake with the length of 5 (canvas_cell), has red apple cell
		*start the game with the score=0 and background music playing during the game
		*set interval in 100ms
		* @purpose of this game_start() function is the all the function(create_food(),
		* create_snake(), setInterval(), Sound(), keydown.event() will be called
		* when user press the "play" button
		*/
		function game_start(){
			direction = "right";
			create_food();		
			create_snake();
			score = 0;
			game_sound = new Sound("haiau_music/gameL.mp3");
			game_sound.play();
			game_loop = setInterval(snake_ground,100); 
		}
		
		/*
		*create_snake() function creates the snake with position from x=0,1,2,3,4 and y=0
		*@param: snake_array
		*@return: snake_x and snake_y position on the canvas
		*/
		function create_snake(){
		var length = 5;
		snake_array = [];		
			for (var i=length-1; i>=0; i--){
				snake_array.push({x:i, y:0});
			}
		}
		
		/*
		*purpose of create_food() function creates red apple cell at ramdom position
		*@param: Math.random object
		*@return: ramdom vertical and horizontal position of the apple
		*/
		function create_food(){
			food = {
				x: Math.round(Math.random()*(w - canvas_cell)/canvas_cell),
				y: Math.round(Math.random()*(h - canvas_cell)/canvas_cell)
			};
		}

		/*
		*snake_ground() function has draw() function, will draw haiau_box canvas with black color with black border 
		*@param: draw_snake() and draw_food(), snake_array's vertical and horizontal position
		*@param: snake-array.unshift() whenever the snake is eating an apple then the tail will grow
		*@return: boolean result. If statement will check if the snake_array is less then left wall or greater than right wall
		*or above the top wall or below the bottom wall or check_collision is true then the game will end
		*@return false then the game is still continue
		*/
		function snake_ground(){		
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,w,h);
			ctx.strokeStyle = "black";
			ctx.strokeRect(0,0,w,h);
			draw_food(food.x, food.y);			
			var snake_x = snake_array[0].x;
			var snake_y = snake_array[0].y;
			//use if statement to increase or decrease the x position and y position of the snake
			if (direction == "right") 
				snake_x++;
			else if (direction == "left")
				snake_x--;
			else if (direction == "up")
				snake_y--;
			else if (direction == "down")
				snake_y++;
			
			//if the snake hit the left wall, or the right wall, or the top wall, or the bottom wall or touch itseft the game will end
			//background music will stop, the dead_sound will play
			//"GAME OVER" and show_score will appear after the clearInterval(game_loop), 
			if (snake_x < 0 || snake_x >= w/canvas_cell || snake_y <0 ||snake_y >= h/canvas_cell || check_collision(snake_x, snake_y, snake_array))
			{	
				var game_over = "GAME OVER!"
				var show_score = "Your score: " + score;
				ctx.font = "small-caps 40px arial";
				ctx.fillText( game_over,200,150);
				ctx.fillText( show_score,192, 200);
				clearInterval(game_loop);
				dead_sound =  new Sound("haiau_music/dead.mp3");
				dead_sound.play();
				game_sound.pause();				
			}		
			//if the user get the score of 100, the game will stop and alert user that they are the winner 
			if(score==100){
				var game_win = "YOU ARE THE WINNER!"
				var show_score = "Your score: " + score;
				ctx.font = "small-caps 30px arial";
				ctx.fillText( game_win,155,135);
				ctx.fillText( show_score,220, 200);
				clearInterval(game_loop);
				game_sound.pause();
			}
			
			//if the snake position equal the food position, use unshift() function to add one cell to the tail
			//if the snake position NOT equal the food position, use pop() function to remove the last cell of tail
			//and use unshift() function to add one cell to the head, that will create movement effect
			if (snake_x == food.x && snake_y == food.y){
				var tail = {x: snake_x, y: snake_y};
				score++;
				eat_sound =  new Sound("haiau_music/eat.mp3");
				eat_sound.play();
				create_food();			
			}else {
				var tail = snake_array.pop();
				tail.x = snake_x;
				tail.y = snake_y;
			}		
			snake_array.unshift(tail);
			
			//use for loop to draw the snake array
			for( var i=0; i<snake_array.length; i++){
				var c = snake_array[i]; //cell part			
				draw_snake(c.x, c.y);
			}	
			
			//show the score at the left bottom corner of the canvas
			var score_text = "Score: " + score;		
			ctx.font = "20px Verdana";
			ctx.fillText( score_text, 5, 345);
		}
		
		/*
		*draw_snake() function fills the snake with white color and the blue border
		*@param: vertical and horizontal position of the snake-array
		*@return: the snake_array filled with white color and blue border
		*/
		function draw_snake(x, y){					
			ctx.fillStyle = "white";			
			ctx.fillRect(x*canvas_cell, y*canvas_cell, canvas_cell, canvas_cell);
			ctx.strokeStyle = "blue";
			ctx.strokeRect(x*canvas_cell, y*canvas_cell, canvas_cell, canvas_cell);		
		}
			
		/*
		*draw_food() fills the apple with red color and red border
		*@param: vertical and horizontal position of the aple
		*@return: the apple filled with red color and red border
		*/
		function draw_food(x, y){				
			ctx.fillStyle = "red";			
			ctx.fillRect(x*canvas_cell, y*canvas_cell, canvas_cell, canvas_cell);
			ctx.strokeStyle = "red";
			ctx.strokeRect(x*canvas_cell, y*canvas_cell, canvas_cell, canvas_cell);		
		}
		
		/*
		*check_collision() function checks if position of the head is touch any part of the tail
		*@param: vertical and horizontal of the snake's head and the snake tails array
		*@return: true if the snake's head position equal to any part of the snake's tails
		*		return false if snake's head does not equal any part of snake's tails array
		*/
		function check_collision(x, y, array){
			for (var i=0; i<array.length; i++){
				if(x == array[i].x && y == array[i].y ){
					return true;
				}		
			}return false;	
		}
			
		/*
		*use keydown eventlistener to make the snake move to the right, dow, left or up
		*@param: key 37 for go left, 38 for go up, 39 for go right or 40 for go down
		*@return: the direction of the snake 
		*/
		$(document).keydown(function(event){
			event.preventDefault();
			var key = event.which;
			if( key == '37' && direction != 'right')
				direction = 'left';
			else if( key == '38' && direction != 'down')
				direction = 'up';
			else if (key == '39' && direction != 'left')
				direction = 'right';
			else if (key == '40' && direction != 'up')
				direction = 'down';
		});
	
	
	/*
	*create "play" click event, when ever play button is clicked, the game will start
	*/
	$("#play").click(function(){
		game_start();
	});	
	//end of play button click event
	
	/*
	*create "stop" click event when user click stop button, the game clearInterval and show "GAME STOPPED!"
	*@return: text of "GAME STOPPED" and the score that player has earned
	*/
	$("#stop").click(
	function (){
		clearInterval(game_loop);
		game_sound.pause();
		var stop_text = "GAME STOPPED!" ;
		var show_score = "Your score: " + score;
		ctx.font = "small-caps 50px arial";
		ctx.fillText( stop_text,120, 130);
		ctx.fillText( show_score,162, 200);
	});
	//end of stop click event
});


/*Validation logic*/
/*1. When I move the snake touch to the west, east, north or south walls, the dead sound should be played, the game must be stop, 
	the background music should be pause, and the canvas should show me the text "GAME OVER!" and the current score. Result confirm.
* 2. When the game is playing, I want it to stop, I will press the "Stop" button, the game must be stop, 
	the background music should be pause, and the canvas show the text "GAME STOPPED!", result confirm
* 3. When the snake eat the apple, the eating sound should be play, the score should be increase by 1, 
	and keep track the current score until the player is winning or the game over to show the score to the player. Result confirm.
* 4. When the snake head touch any part of ifself, the dead sound should be played, the game must be stop, the background music should be pause
*	and the canvas should show me the text "GAME OVER!" and the current score. Result confirm.
* 5. When the player get the score of 100 points, they are the winner, so the game must be stop, the background music should be pause
*	end the canvas should show me the text "YOUR ARE THE WINNER!" and the current score = 100 points. Result confirm.
* 6. When the game is ended, if player want to play again, press "Play" button, the background music playing, the game start and 5 step above 
	will follow. Result confirm.
*/
































































