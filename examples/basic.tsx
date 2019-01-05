/* tslint:disable:no-console */

import 'antd/dist/antd.css';
import './basic.less';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Editor from '../src';
const schema = require('./schema.json');

class BasicDemo extends React.Component<{}, any> {

  render() {
    return (
      <Editor doc={schema} editable={true} />
    );
  }
}

ReactDOM.render(<BasicDemo />, document.getElementById('__react-content'));
