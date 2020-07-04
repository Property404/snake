"use strict";

function clearBlock(ctx, x, y, grid_size)
{
	drawBlock(ctx,x,y,grid_size);
}

function drawBlock(ctx, x, y, grid_size, color)
{
	x = x*ctx.canvas.width/grid_size;
	y = y*ctx.canvas.height/grid_size;

	ctx.save();
	ctx.fillStyle = color;
	//(color?ctx.fillRect:ctx.clearRect)
	ctx.fillRect
		(x,y,ctx.canvas.width/grid_size,ctx.canvas.height/grid_size);
	ctx.restore()
}

export const Direction = Object.freeze({
    UP:   Symbol("up"),
    DOWN:  Symbol("down"),
    LEFT: Symbol("left"),
    RIGHT: Symbol("right")
});

class Point
{
	constructor(x,y)
	{
		this.place(x,y);
	}

	equals(point)
	{
		return this.x === point.x && this.y === point.y;
	}

	place(x,y)
	{
		if(
			typeof x !== "number"||
			typeof y !== "number"
		)
			throw("Can't place point at non-numeric position");
		this.x = x;
		this.y = y;
	}
}

export class Food extends Point
{
	color = "yellow";

	constructor(context, grid_size)
	{
		super(0,0);
		this.context = context;
		this.grid_size = grid_size;
		this.placeRandomly();
	}

	draw()
	{
		drawBlock(this.context, this.x, this.y, this.grid_size, this.color)
	}

	placeRandomly()
	{
		this.place(
			Math.floor(Math.random()*this.grid_size),
			Math.floor(Math.random()*this.grid_size)
		);
	}
}




export class Snake
{
	_parts = []
	_direction = Direction.UP;
	color = "white";
	
	constructor(context, initial_x, initial_y, grid_size)
	{
		this.context = context;
		this.grid_size = grid_size;
		this._parts.push(new Point(initial_x, initial_y));

		if(!context || !grid_size)
			throw("Snake constructor incomplete arguments");

		if(context.canvas.width%grid_size)
			throw("Snake created with invalid grid size");
	}

	set direction(new_direction)
	{
		const opposing_directions =
			[
				[Direction.UP, Direction.DOWN],
				[Direction.DOWN, Direction.UP],
				[Direction.RIGHT, Direction.LEFT],
				[Direction.LEFT, Direction.RIGHT]
			];
		for(const od of opposing_directions)
		{
			if(this._direction === od[0] &&
				new_direction === od[1])
				return;
		}
		this._direction = new_direction;
	}

	get head()
	{
		return this._parts[0];
	}

	get tail()
	{
		return this._parts[this._parts.length-1];
	}

	printSelf()
	{
		let text = "[";
		for(const part of this._parts)
		{
			if(part)
				text += ` (${part.x}, ${part.y})`
			else
				text+= ' -'
		}
		text+=" ]";
		console.log(text);
	}

	update()
	{
		// Clear tail
		if (this.tail)
		{
			clearBlock(this.context,
				this.tail.x,
				this.tail.y,
				this.grid_size
			);
		}
		
		// Shift snake up
		for(let i=this._parts.length-1;i>0;i--)
		{
			if(this._parts[i])

				this._parts[i].place(
					this._parts[i-1].x,
					this._parts[i-1].y);
			else
			{
				if(this._parts[i-1])
					this._parts[i] = new Point(this._parts[i-1].x,this._parts[i-1].y);
			}
		}
		switch(this._direction)
		{
			case Direction.UP:
				this.head.y--;
				break;
			case Direction.DOWN:
				this.head.y++;
				break;
			case Direction.LEFT:
				this.head.x--;
				break;
			case Direction.RIGHT:
				this.head.x++;
				break;
			default:
				throw "eh";
		}
		
		for(let part of this._parts)
		{
			if(part)
			{
				drawBlock(this.context,
					part.x,
					part.y,
					this.grid_size,
					this.color);
			}

		}
	}

	// Increase snake length
	extend(value=1)
	{
		if(typeof value !== "number" || value <1)
			throw("Snake.extend: invalid value");
		for(let i=0;i<value;i++)
			this._parts.push(null);
	}

	// Check if we intersect with another snake (including ourself)
	// Though, that is a special case
	headMeetsSnake(snake)
	{
		if(this !== snake)
		{
			if(this.head.equals(snake.head))
				return true;
		}
		for(let i=1;i<snake._parts.length;i++)
		{
			const part = snake._parts[i];
			if(!part)break;
			if(this.head.equals(part))
				return true;
		}
		return false;
	}

	intersectsPoint(point)
	{
		console.log(point.x,point.y);
		return this.intersects(point.x, point.y);
	}

	intersects(x,y)
	{
		for(const part of this._parts)
		{
			if(part)
			{
				console.log("part:",part.x, part.y);
				if(part.x === x && part.y === y)
				{
					return true;
				}
			}
		}
		return false;
	}
}