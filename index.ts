import xs, {Stream} from 'xstream';
const setupRegl = require('regl');

export function makeReglView<T> (view: any, makeCommands: any) {
  let state: T;
  let commands: any;

  function prepare (regl: any) {
    commands = makeCommands(regl);
  }

  function render (regl: any, context: any) {
    view(regl, context, commands, state);
  }

  (render as any).prepare = prepare;

  return function (newState: T) {
    state = newState;

    return render;
  }
}

export function makeReglDriver (options = null) {
  const regl = setupRegl(options);

  return function reglDriver (sink$: Stream<any>) {
    let viewFunction = (regl: any, context: any) => {};
    let prepared = false;

    regl.frame((context: any) => {
      viewFunction(regl, context);
    });

    sink$.addListener({
      next (view: any) {
        viewFunction = view;

        if (!prepared) {
          (viewFunction as any).prepare(regl);
          prepared = true;
        }
      },

      complete () {},

      error (err: Error) {
        throw err;
      }
    });
  }
}

