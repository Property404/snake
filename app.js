import {Food, Direction, Snake} from './classes.js'
const GRID_SIZE = 50;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const snake = new Snake(ctx, GRID_SIZE/2,GRID_SIZE/2,GRID_SIZE);
snake.extend(1);

const food = new Food(ctx, GRID_SIZE);
food.draw();

async function main()
{
	while(true)
	{
		snake.update();
		if(snake.headMeetsSnake(snake))
			throw("HIT");
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
			snake.extend(10);
			while(snake.intersectsPoint(food))
				food.placeRandomly();
			food.draw();
			console.log("GOBBLE");
		}
		await sleep(50);
		
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
	}
}
main();
