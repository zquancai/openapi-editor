import * as React from 'react';
import { Collapse, Tag, Select } from 'antd';
import HttpBody from './http-body';
import Responses from './responses';
import RequestParameters from './request-parameters';
import { consumer, TargetProp } from '../context';
import ListContent from '../components/list/index';

const Panel = Collapse.Panel;

@consumer()
export default class MethodEditor extends React.PureComponent<TargetProp> {

  onChange = key => value => {
    this.props.setDoc(`${this.props.docRef}.${key}`, value);
  }

  render() {
    const { data } = this.props;
    const infoList = [{
      title: 'Operation ID',
      value: data.operationId,
      onChange: this.onChange('operationId'),
    }, {
      title: 'Path',
      value: data.summary,
      onChange: this.onChange('summary'),
    }, {
      title: 'Summary',
      value: data.summary,
      onChange: this.onChange('summary'),
    }, {
      title: 'Description',
      value: data.description,
      onChange: this.onChange('description'),
    }, {
      title: 'Tags',
      value: data.tags || [],
      valueRender: value => value.map((tag, index) => (<Tag key={`${index}`}>{tag}</Tag>)),
      customInput: (<Select
        mode="tags"
        placeholder="please select tag"
        style={{ width: '100%' }}
      />),
      onChange: this.onChange('tags'),
    }];

    return (
      <Collapse bordered={false} defaultActiveKey={['INFO']}>
        <Panel header="INFO" key="INFO">
          <ListContent dataSource={infoList} />
        </Panel>
        <Panel header="REQUEST PARAMETERS" key="HEADERS BODY">
          <RequestParameters
            dataList={data.parameters || []}
            docRef={`${this.props.docRef}.parameters`}
          />
        </Panel>
        <Panel header="REQUEST BODY" key="REQUEST BODY">
          <HttpBody
            data={data.requestBody || {}}
            docRef={`${this.props.docRef}.requestBody`}
          />
        </Panel>
        <Panel header="RESPONSES" key="RESPONSES">
          <Responses
            data={data.responses || {}}
            docRef={`${this.props.docRef}.responses`}
          />
        </Panel>
        <Panel header="SERVERS" key="SERVERS" disabled />
        <Panel header="SECURITY REQUIREMENTS" key="SECURITY REQUIREMENTS" disabled />
      </Collapse>
    );
  }
};
