const {AsyncSeriesBailHook, AsyncParallelBailHook, SyncHook,SyncWaterfallHook, SyncBailHook,SyncLoopHook  } = require('tapable');
const assert = require('node:assert');

class Car {
	constructor() {
		this.speed = 0;
		this.color = 'red';
		this.fuelAmount = 0;

		this.hooks = {
			accelerate: new AsyncSeriesBailHook(['newSpeed']),
			paint: new AsyncParallelBailHook(['newColor']),
			refuel: new SyncWaterfallHook (['fuelContext'])
		}
	}

	accelerate(newSpeed, cb) {
		this.hooks.accelerate.callAsync(newSpeed, (err, newValue) => {
			if (err) {
				this.speed = 0;
				cb();
				return;
			}
			// Если newValue определен (был возвращен из хука), используем его
			// В противном случае используем исходную newSpeed
			this.speed = newValue
		});
	}

	paint(newColor, cb) {
			this.hooks.paint.callAsync(newColor, (err, newValue) => {
				this.color = newValue;
				cb();
			});

	}

	refuel(amount) {
		const fuelContext = { fuelAmount: amount };
		const modifiedContext = this.hooks.refuel.call(fuelContext);
		this.fuelAmount = modifiedContext.fuelAmount;
		console.log(`Refueled to: ${this.fuelAmount}`);
	}
}

const car = new Car();


car.hooks.accelerate.tapAsync('Accelerate', (newSpeed, cb) => {
	cb(null, newSpeed + 100);
});

car.hooks.accelerate.tapAsync('AccelerateThreshold', (newSpeed, cb) => {
	if (newSpeed > 300) {
		cb('error');
	} else {
		cb(null, newSpeed);
	}
});

car.accelerate(100, () => {
	assert.equal(car.speed, 200);
});

car.accelerate(250, () => {
	assert.equal(car.speed, 0);
});


car.hooks.paint.tapAsync('Paint', (newColor, cb) => {
	console.log('red 1');
	setTimeout(() => {
		cb(null, 'red');
	}, 2000);
});

car.hooks.paint.tapAsync('Paint', (newColor, cb) => {
	console.log('black 1');
	setTimeout(() => {
		cb(null, 'black');
	}, 2000);
});

car.paint('white', () => {
	assert.equal(car.color, 'red');
});


car.hooks.refuel.tap('Refuel', function(context) {
	console.log(context,'context hook');
	if (context.fuelAmount > 400) {
		context.fuelAmount = 400;
	}
});

car.refuel(500);
assert.equal(car.fuelAmount, 400);
