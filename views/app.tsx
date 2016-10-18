/**
 * views/app.tsx
 * Defines the application entrypoint component(if using React).
 * Delete and uninstall ReactJS otherwise.
 * References:
 * https://basarat.gitbooks.io/typescript/content/docs/jsx/tsx.html
 * http://blog.wolksoftware.com/working-with-react-and-typescript
 * @author zixian92
 */

import * as React from 'react';
import {render} from 'react-dom';

interface AppProps {}
interface AppState {}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>Hello</div>
    );
  }
}

render(<App />, document.getElementById('app'));
