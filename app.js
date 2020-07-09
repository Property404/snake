"use strict";
import {Food, Direction, Snake} from './classes.js'
const GRID_SIZE = 50;
const MIN_DELAY = 30;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
let enter_pressed;
let snake;

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
		// Event loop
		snake = new Snake(ctx, GRID_SIZE/2,GRID_SIZE/2,GRID_SIZE);
		snake.extend(4);
		snake.color="rgb(000,200,000)";
		const food = new Food(ctx, GRID_SIZE);
		food.color="rgb(200,200,50)";
		let score = 0;
		let delay = 50;
		displayScore(score);
		displayHighScore();
		await countDown();
		food.draw();
		while(true)
		{
			snake.update();
			if(snake.headMeetsSnake(snake))
			{
				// Game over!
				let text = "Game Over";
				if(score > getHighScore())
				{
					setHighScore(score);
					text += "<br>New High Score!";
				}
				text+= "<br>Play again?";
				displayText(text);
				displayHighScore();
				break;
			}
			if(snake.head.x<0)
				snake.head.x = GRID_SIZE-1;
			if(snake.head.x>=GRID_SIZE)
				snake.head.x = 0;
			if(snake.head.y<0)
				snake.head.y = GRID_SIZE-1;
			if(snake.head.y>=GRID_SIZE)
				snake.head.y = 0;
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

				if(score%10===0 && delay>MIN_DELAY)
					delay--;
			}
			await sleep(delay);
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

window.onkeydown = function(e)
{
	const key = e.key;
	if(key.includes("Arrow"))
	{
		e.preventDefault();
		if(key === "ArrowUp")
		{
			snake.direction = Direction.UP;
		}
		else if(key === "ArrowDown")
		{
			snake.direction = Direction.DOWN;
		}
		else if(key === "ArrowLeft")
		{
			snake.direction = Direction.LEFT;
		}
		else if(key === "ArrowRight")
		{
			snake.direction = Direction.RIGHT;
		}
	}else if(key === "Enter")
	{
		enter_pressed = true;
	}
}
main();
