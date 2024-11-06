const {SyncWaterfallHook} = require('tapable');
const assert = require('node:assert');

class Car {
	constructor() {
		this.speed = 0;
		this.hooks = {
			accelerate: new SyncWaterfallHook(['newSpeed'])
		}
	}

	accelerate(newSpeed, cb) {
		this.hooks.accelerate.callAsync(newSpeed, (err, newValue) => {
			this.speed = newValue
		});
	}
}

const car = new Car();

car.hooks.accelerate.tap('accelerate plug', (newSpeed, cb) => {
	return newSpeed + 50
})

car.accelerate(100);
assert.equal(car.speed, 150);

car.accelerate(150);
assert.equal(car.speed, 200);
