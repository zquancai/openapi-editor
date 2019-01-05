import * as React from 'react';
import { List } from 'antd';
import ListItem from './../list-item/index';

import './index.less';
import { ListProps } from 'antd/lib/list';

interface Prop extends Partial<ListProps> {
}

export default class ListContent extends React.PureComponent<Prop> {
  render() {
    return (
      <List
        itemLayout="horizontal"
        split={false}
        {...this.props}
        renderItem={item => (
          <ListItem {...item} />
        )}
      />
    );
  }
}