var waiters = [];
var started = {};

function isWaitRequired(contexts) {
	for (var i = 0, len = contexts.length; i < len; i += 1) {
		if (started[contexts[i]]) {
			return true;
		}
	}
	return false;
}


function Waiter(contexts, fn, timeout) {
	this._contexts = contexts;
	this._fn = fn;

	if (typeof timeout === 'number') {
		var that = this;

		this._timer = setTimeout(function () {
			that.trigger();
		}, timeout);
	}
}


Waiter.prototype.trigger = function () {
	if (this._fn) {
		this._fn();
		this._fn = null;

		// remove the timer

		if (this._timer) {
			clearTimeout(this._timer);
			this._timer = null;
		}

		// remove from waiters list

		var index = waiters.indexOf(this);
		if (index !== -1) {
			waiters.splice(index, 1);
		}
	}
};


Waiter.prototype.contextEnded = function (name) {
	var len = this._contexts.length;

	if (len === 1 && this._contexts[0] === name) {
		// hot path: context was the only one

		this.trigger();
	} else if (!isWaitRequired(this._contexts)) {
		// none of the contexts we're waiting for has been started

		this.trigger();
	}
};


exports.start = function (context) {
	started[context] = true;
};


exports.end = function (context) {
	started[context] = false;

	// since waiters can unregister themselves, we need to make a copy of the array for safe iteration

	var list = waiters.slice(0);

	for (var i = 0, len = list.length; i < len; i += 1) {
		list[i].contextEnded(context);
	}
};


exports.wait = function (contexts, fn, timeout) {
	if (!Array.isArray(contexts)) {
		contexts = [contexts];
	}

	if (!isWaitRequired(contexts)) {
		fn();
	} else {
		waiters.push(new Waiter(contexts, fn, timeout));
	}
};
