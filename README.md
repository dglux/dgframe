dgframe (npm) (bower) (tests) (todo)
===

dgframe is a small library to interact with the DGLux platform, specifically
the iframe messaging system. Allows you to receive and update parameters that
are defined in symbols.

If you use this with Browserify or Webpack, it will work fine as a CommonJS
module. If you just include index.js into your browser, dgframe will be defined
globally.

## API

### EventEmitter (dgframe.EventEmitter)

dgframe comes with a lightweight event emitter implementation, and implements
the `emit`, `on`, and `removeListener` prototype functions from node.js with
slight variances.

Differences from [node.js](https://nodejs.org/api/events.html):

- `emit` function returns the EventEmitter instance, not a boolean value
- `on` returns a special object that has the emitter in it's prototypal chain.
This allows you to call `#removeListener` with no arguments from the returned
emitter object.
- `removeListener` function returns the listener removed instead of the
EventEmitter instance.

### dgframe

An event emitter. Parameter updates will be emitted by the parameter name.

```js
dgframe.on('test_param', function(value, isTable) {
  // value can be anything from DGLux, like false
});
```

### dgframe.params

An object that contains all of the parameters shared between the iframe and
DGLux.

```js
dgframe.params.test_param; // false
```

### dgframe#onReady

Registers a callback that will be called once DGLux has initialized itself with
the iframe.

```js
dgframe.onReady(function() {
  // do work
});
```

### dgframe#isTable

Checks the given value for DGLux's table structure. A table structure is an
object with list items `cols` and `rows`.

```js
dgframe.isTable({
  cols: [],
  rows: [];
}); // true

dgframe.isTable("false"); // false
```

### dgframe#updateParam

Update a single parameter in DGLux with the given value.

```js
// updates test_param parameter with value true
dgframe.updateParam('test_param', true, 'test_param2', false);
dgframe.params.test_param; // true
```

### dgframe#pushParams

Updates all parameters in DGLux that are defined in dgFrame.params.

```js
dgframe.params.test_param = false;
dgframe.pushParams(); // sets test_param to false in DGLux
```

### dgframe.foreign

Utilities to simulate calls sent to the iframe by DGLux in environments where
DGLux doesn't exist. Useful for mostly unit testing and development environments.
These functions should never be used in an environment where DGLux exists, which
is most use cases.

### dgframe.foreign#init

Simulates the initialization call from DGLux to the iframe. This is what will
trigger any listener of `dgframe#onReady`.

```js
dgframe.onReady(function() {
  console.log('Hello World!');
});

dgframe.foreign.init();
// Hello World!
```

### dgframe.foreign#updateParam

Simulates a parameter update from the server. Differences in behavior from using
`dgframe#updateParam` is that `dgframe`'s event emitter will be called.

```js
dgframe.on('test_param', function(param) {
  // updated from the 'server', or in this case dgframe.foreign
});

dgframe.foreign.updateParam('test_param', false);
// event emitter is called
```

### dgframe.dashboard

Utilities for generating importable DGLux dashboards through an API. Right now
these utilities focus on automating the process of creating a project from an
iframe component.

### dgframe.dashboard#exportIFrameDashboard

A function for generating the files needed to turn an iframe-ready web component
into a DGLux project. Note that projects are imported in .zip format, and
dgframe does not provide the actual zip bundling behavior.

The only parameter required for this function is an object with the following
acceptable keys.

- projectName: Name of the project to generate. If not specified, dgframe will
attempt to use symbolName.
- symbolName: Name of the symbol created for the iframe. If not specified,
dgframe will attempt to use projectName.
- indexUrl: URL of the iframe component's main page, relative to the base of
the archive, so usually following a `projectName`/assets/\* format. If not
specified, it defaults to `projectName`/assets/index.html.
- callback: Optional callback, will be called with a file's path and contents
as parameters.
- params: A list of DGLux parameters for the iframe's symbol parameters. Each
list item is an object with the following structure:

---
- name
- type
- default (default value, optional)
---

This function will return an object with the keys representing paths in the zip
file, and the values representing the contents of these files.

```js
dgframe.dashboard.exportIFrameDashboard({
  projectName: 'test_project',
  symbolName: 'symbol_name',
  params: [
    {
      name: 'a',
      type: 'string'
    }
  ]
});

/* {
  '_proj.json': '...',
  'index.dg5': '...'
} */
```

## Running Tests

To run tests for dgframe, install npm dev dependencies with `npm install`, then
run the tests (powered by Mocha and Karma) with `npm test`.
