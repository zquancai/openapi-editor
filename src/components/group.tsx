import * as React from 'react';
import { Collapse } from 'antd';
import { consumer, TargetProp } from '../context';

const Panel = Collapse.Panel;

interface Prop extends TargetProp {
  renderEditor(docRef: string, name: string, item: any);
}

@consumer()
export default class Group extends React.PureComponent<Prop> {

  renderEditor(name, item) {
    return this.props.renderEditor(`${this.props.docRef}.${name}`, name, item);
  }

  render() {
    const groupArr = Object.entries(this.props.data || {});
    const child = groupArr.map(([name, item], index) => (
      <Panel header={name} key={`${index}`}>
        {this.renderEditor(name, item)}
      </Panel>
    ));
    return (
      <Collapse bordered={false} defaultActiveKey={['0']}>
        {child}
      </Collapse>
    );
  }
}