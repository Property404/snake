import {Food, Direction, Snake} from './classes.js'
const LOW = -1000;
export class SnakeAI
{
	constructor(snake, food_array)
	{
		this._snake = snake;
		this._food_array = food_array;
	}
	
	_scoreOutcome(snake, food_array)
	{
		for(const part of snake.parts)
		{
			if(part===null)break;

			if(part === snake.head)
				continue;

			// We fucked up!
			if(part.equals(snake.head))
				return LOW;
		}

		// Ay! We got it!
		for(const food of food_array)
		{
			if(snake.head.equals(food))
			{
				return 10;
			}
		}

		// Nothing special
		return 0;
	}

	moveSnake()
	{
		const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
		let largest_score = -10000;
		let best_direction = null;
		let preferred_direction = null;
		if(this._food_array[0])
		{
			if(this._snake.head.x > this._food_array[0].x)
				preferred_direction = Direction.LEFT;
			if(this._snake.head.x < this._food_array[0].x)
				preferred_direction = Direction.RIGHT;
			if(this._snake.head.y < this._food_array[0].y)
				preferred_direction = Direction.DOWN;
			if(this._snake.head.y > this._food_array[0].y)
				preferred_direction = Direction.UP;
		}
		for(const direction of directions)
		{
			if(this._snake.direction === Direction.DOWN && direction === Direction.UP)
				continue;
			if(this._snake.direction === Direction.UP && direction === Direction.DOWN)
				continue;
			if(this._snake.direction === Direction.LEFT && direction === Direction.RIGHT)
				continue;
			if(this._snake.direction === Direction.RIGHT && direction === Direction.LEFT)
				continue;
			const new_snake = new Snake(this._snake);
			console.log(new_snake.parts);
			new_snake.direction = direction;
			let score = this._determinePathWorth(
					new_snake, [...this._food_array], 1);
			if(score>largest_score || (score===largest_score && direction == preferred_direction))
			{
				largest_score = score;
				best_direction = direction;
			}
		}
		if(!best_direction)throw("Need direction");
		this._snake.direction = best_direction;
	}

	_determinePathWorth(snake, food_array, length)
	{
		if(length<=0)
			return 0;

		snake.update();
		let value = this._scoreOutcome(snake, food_array);
		if(value <= LOW)
			return value;

		const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
		let largest_score = -10000;
		for(const direction of directions)
		{
			if(!snake.canMoveInDirection(direction))
				continue;
			const new_snake = new Snake(snake);
			new_snake.direction = direction;
			let score = this._determinePathWorth(
					new_snake, [...food_array], length-1);
			if(score>largest_score)
				largest_score = score;
		}
		value += largest_score;
		return value;
	}
}
