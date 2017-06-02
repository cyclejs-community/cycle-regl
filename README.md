# cycle-regl

> A Cycle.js driver for regl, a declarative and functional interface to WebGL

cycle-regl is a driver that allows Cycle.js applications to render WebGL via [regl](https://github.com/regl-project/regl).

regl is an abstraction over WebGL that provides a functional interface and minimises shared state.

You could use this driver to make games, data visualizations, video processing and anything else you can do with WebGL.

This library has minimal documentation as it is a simple wrapper around regl. Read the [regl API documentation](https://github.com/regl-project/regl/blob/gh-pages/API.md).

Also have a look at the [regl examples](http://regl.party/examples). They can all be simply translated to cycle-regl.

**[Click here to see a pretty bunny 🐰](https://cyclejs-community.github.io/cycle-regl/)**

## Usage

```js
import {makeReglDriver, makeReglView} from 'cycle-regl';
import {run} from '@cycle/run';

const drivers = {
  Regl: makeReglDriver()
};

function commands (regl) {
  const drawTriangle = regl({
    // Shaders in regl are just strings.  You can use glslify or whatever you want
    // to define them.  No need to manually create shader objects.
    frag: `
      precision mediump float;
      uniform vec4 color;
      void main() {
        gl_FragColor = color;
      }`,

    vert: `
      precision mediump float;
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0, 1);
      }`,

    // Here we define the vertex attributes for the above shader
    attributes: {
      // regl.buffer creates a new array buffer object
      position: regl.buffer([
        [-1, 0],
        [0, -1],
        [1, 1]
      ])
      // regl automatically infers sane defaults for the vertex attribute pointers
    },

    uniforms: {
      // This defines the color of the triangle to be a dynamic variable
      color: regl.prop('color')
    },

    // This tells regl the number of vertices to draw in this command
    count: 3
  });

  return {
    drawTriangle
  }
}

function render (regl, context, commands, state) {
  const {time} = context;
  const {drawTriangle} = commands;

  // clear contents of the drawing buffer
  regl.clear({
    color: [0, 0, 0, 0],
    depth: 1
  })

  // draw a triangle using the command defined above
  drawTriangle({
    color: [
      Math.sin(time * 0.08),
      Math.cos(time * 0.1),
      Math.cos(time * 0.3),
      1
    ]
  })
}

function main (sources) {
  const state$ = xs.of({});

  const view = makeReglView(render, commands);

  const regl$ = state$.map(view);

  return {
    Regl: regl$
  }
}

run(main, drivers);
```

This renders a triangle that changes color over time. You can see the output [here](http://regl.party/examples/?basic).

## API

```js
import {makeReglDriver, makeReglView} from 'cycle-regl';
```
To reiterate, you should read the [regl documentation](https://github.com/regl-project/regl/blob/gh-pages/API.md).

### makeReglDriver(reglOptions = null)

`reglOptions` are passed to the `regl` constructor. If you pass nothing, a full screen canvas will be created to render in.

You can also pass an element, a canvas element or a gl context for headless rendering.

For specifics, see the [regl documentation](https://github.com/regl-project/regl/blob/gh-pages/API.md#quick-start).

### makeReglView(renderFn, commandsFn)

Returns a function that takes in state and returns the render function to be passed to the driver.

`renderFn` takes the following arguments:

- `regl` - the `regl` instance, useful for things like `regl.clear()`
- `context` - the `regl` context, with information about time and screen size - [regl context documentation](https://github.com/regl-project/regl/blob/gh-pages/API.md#context)
- `commands` - the return value of `commandsFn`
- `state` - the latest value of the stream used to invoke the view


`commandsFn` takes the following argument:
- `regl` - the `regl` instance, to be used to create commands - [regl command documentation](https://github.com/regl-project/regl/blob/gh-pages/API.md#command)

Your `commandsFn` should return an object containing commands to be used in the `renderFn`. It will be called once when the view is created.

This might seem like a strange API compared to say `@cycle/dom` but it is deliberately designed to avoid creating any new functions while rendering, as this is very slow.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install cycle-regl
```

## Acknowledgments

cycle-regl is a tiny wrapper around regl. Thanks to the creators of regl 😄

## License

MIT

