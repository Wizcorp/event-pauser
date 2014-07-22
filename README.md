# event-pauser

A little pauser that wait a specific event's end to execute.

## require
```javascript
var pauser = require('EventPauser');
```

## Methods
### wait

Wait the end of a specific context (id) to execute. 

```javascript
pauser.wait('animation', function () {
	// update my score when pauser.end('animation') has been called
});
```

Also possible to set multiples contexts. The pauser will wait all the contexts finish before execute.

```javascript
pauser.wait(['animation1', 'animation2'], function () {
	// update my score when pauser.end('animation1') AND pauser.end('animation2') has been called
});
```

Then a timeout can be specify to execute even if the context is not finish (in milliseconds).

```javascript
pauser.wait('animation', function () {
	// update my score even is the pauser is not finish after 5 secs
}, 5000);
```

### start

Start the pauser with a given context (id). All the pauser.wait will wait the end of that context to execute.

```javascript
pauser.start('animation');
// code to start the animation

```

### end

End the pauser with a given context. All the pauser, who are waiting for that context, execute.

```javascript
// animation end
pauser.end('animation');
```

## Last notes
Be careful to correctly end the pauser (or use timeout). If a pauser never end the wait function will never execute.

```javascript
var pauser = require('EventPauser');
pauser.start('animation');

pauser.wait('animation', function () {
	// update my score
});

// code to start the animation
// ...

// the animation end
// end the pauser to execute the update
pauser.end('animation');

// All the pauser.wait was executed
```