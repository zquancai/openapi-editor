import * as React from 'react';
import { Tabs, Select, Input } from 'antd';
import ListContent from '../components/list/index';
import { consumer, TargetProp } from '../context';

const TabPane = Tabs.TabPane;

@consumer()
export default class Info extends React.PureComponent<TargetProp> {

  renderTagEditor() {
    return (
      <Select
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Please select"
      />
    );
  }

  onInfoChange = key => value => {
    const { docRef } = this.props;
    this.props.setDoc(`${docRef}.${key}`, value);
  }

  onTagChange = key => value => {
    this.props.setDoc(`tags${key}`, value);
  }

  renderTags() {
    const { tags } = this.props.data;
    const list = (tags || []).map((tag, index) => {
      const dataSource = [{
        title: 'Name',
        value: tag.name,
        onChange: this.onTagChange(`[${index}].name`),
      }, {
        title: 'Description',
        value: tag.description,
        customInput: <Input.TextArea rows = { 4 } />,
        onChange: this.onTagChange(`[${index}].description`),
      }];
      return (
        <TabPane tab={tag.name} key={`${index}`}>
          <ListContent dataSource={dataSource}/>
        </TabPane>
      );
    });
    return (
      <Tabs
        defaultActiveKey="0"
        tabPosition="left"
      >
        {list}
      </Tabs>
    );
  }

  render() {
    const { info } = this.props.data;
    const list = [{
      title: 'Title',
      value: info.title,
      onChange: this.onInfoChange('title'),
    }, {
      title: 'Version',
      value: info.version,
        onChange: this.onInfoChange('version'),
    }, {
      title: 'Tags',
      value: this.renderTags(),
      hideAction: true,
    }, {
      key: 'description',
      title: 'Description',
      value: info.description,
      customInput: <Input.TextArea rows={4} />,
      onChange: this.onInfoChange('description'),
    }];
    return (
      <ListContent dataSource={list} />
    );
  }
};
