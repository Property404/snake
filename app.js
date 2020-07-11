"use strict";
import {Food, Direction, Snake} from './classes.js'
import {SnakeAI} from './ai.js';
const GRID_SIZE = 50;
const MIN_DELAY = 30;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
let enter_pressed;
let current_direction = null;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setHighScore(score)
{
	localStorage["snake-highscore"] = score;
}

function getHighScore(score)
{
	return localStorage["snake-highscore"]||0;
}

function displayScore(score)
{
	document.getElementById("score").textContent =
		"Score: "+score;
}

function displayHighScore()
{
	document.getElementById("highscore").textContent =
		"High Score: "+getHighScore();
}

function displayText(text)
{
	document.getElementById("text-overlay").innerHTML=text;
}

function clearAll()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	displayText("");
}

async function countDown()
{
	clearAll();
	for(let i=3;i>=0;i--)
	{
		displayText(i?i:"Get Ready");
		await sleep(300);
	}
	displayText("");
}

async function startGame()
{
		let snake = new Snake(ctx, GRID_SIZE/2,GRID_SIZE/2,GRID_SIZE);
		snake.extend(7);
		snake.color="rgb(000,200,000)";


		const food = new Food(ctx, GRID_SIZE);
		food.color="rgb(200,200,50)";

		let ai = new SnakeAI(snake, food, GRID_SIZE);
		ai.forethought = 3;

		let score = 0;
		let delay = 30;
		let snake_slowdown = 2;

		let slowdown_timer = 0;

		food.draw();
		displayScore(score);
		displayHighScore();

		await countDown();

		while(true)
		{
			food.clear();
			switch(current_direction)
			{
				case Direction.UP:
					food.y = (food.y - 1)%GRID_SIZE;
					break;
				case Direction.DOWN:
					food.y = (food.y + 1)%GRID_SIZE;
					break;
				case Direction.LEFT:
					food.x = (food.x - 1)%GRID_SIZE;
					break;
				case Direction.RIGHT:
					food.x = (food.x + 1)%GRID_SIZE;
					break;
			}
			while(food.x<0)food.x+=GRID_SIZE;
			while(food.y<0)food.y+=GRID_SIZE;
			food.draw();

			slowdown_timer++;
			if(slowdown_timer%snake_slowdown === 0)
				snake.update();

			// Check if the snake dies
			if(snake.headMeetsSnake(snake))
			{
				// Game over!
				let text = "Game Over";
				if(score > getHighScore())
				{
					setHighScore(score);
					text += "<br>New High Score!";
				}
				text+= "<br>Press &lt;enter&gt; to play again";
				displayText(text);
				displayHighScore();
				break;
			}

			// Pass through walsl
			if(snake.head.x<0)
				snake.head.x = GRID_SIZE-1;
			if(snake.head.x>=GRID_SIZE)
				snake.head.x = 0;
			if(snake.head.y<0)
				snake.head.y = GRID_SIZE-1;
			if(snake.head.y>=GRID_SIZE)
				snake.head.y = 0;

			// Check if the snake ate something
			if(snake.intersectsPoint(food))
			{
				score+=1;
				displayScore(score);

				// Get longer
				snake.extend(1);

				// Make new food
				while(snake.intersectsPoint(food))
					food.placeRandomly();
				food.draw();
			}

			// Prepare the snake for updating
			ai.moveSnake();
			await sleep(delay);
			await ai.wait();
		}
}

async function main()
{
	while(true)
	{
		await startGame()
		enter_pressed = false;
		while(!enter_pressed)
		{
			await sleep(50);
		}
	}
}

window.onkeyup = function(e){
	const key = e.key;
	if(key === "ArrowUp" && current_direction===Direction.UP)
	{
		current_direction = null;
	}
	else if(key === "ArrowDown" && current_direction===Direction.DOWN)
	{
		current_direction = null;
	}
	else if(key === "ArrowLeft" && current_direction===Direction.LEFT)
	{
		current_direction = null;
	}
	else if(key === "ArrowRight" && current_direction===Direction.RIGHT)
	{
		current_direction = null;
	}
}
window.onkeydown = function(e)
{
	const key = e.key;
	if(key.includes("Arrow"))
	{
		e.preventDefault();
		if(key === "ArrowUp")
		{
			current_direction = Direction.UP;
		}
		else if(key === "ArrowDown")
		{
			current_direction = Direction.DOWN;
		}
		else if(key === "ArrowLeft")
		{
			current_direction = Direction.LEFT;
		}
		else if(key === "ArrowRight")
		{
			current_direction = Direction.RIGHT;
		}
	}else if(key === "Enter")
	{
		enter_pressed = true;
	}
}
main();
