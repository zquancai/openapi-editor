import * as React from 'react';
import { Tabs, Form, Select, Input } from 'antd';
import { OpenAPIV3 } from 'openapi-types';
import Content from './content';
import ListContent from './../components/list/index';
import { setDoc, EditableContext } from '../context';
import Headers from './headers';
import dialog from '../components/dialog';
import { STATUS_CODE } from '../constant';
import NoContent from '../components/no-content';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

interface Prop {
  data: OpenAPIV3.ResponseObject;
  docRef: string;
  setDoc: Function;
  unsetDoc: Function;
};

@setDoc
export default class Responses extends React.PureComponent<Prop> {
  static contextType = EditableContext;

  state = {
    activeKey: 0,
    statusCode: 200,
    description: '',
  };

  onChange = key => val => {
    this.props.setDoc(`${this.props.docRef}.${key}`, val);
  }

  onTabsChange = activeKey => {
    this.setState({ activeKey });
  }

  onInputChange = key => e => {
    this.setState({ [key]: e.target ? e.target.value : e });
  }

  onEdit = (targetKey, action) => {
    const { data, docRef } = this.props;
    if (action === 'remove') {
      const dataArr = Object.entries(data || {}).find((item, index) => String(index) === targetKey);
      if (dataArr) {
        this.props.unsetDoc && this.props.unsetDoc(`${docRef}.${dataArr[0]}`);
      }
    }
    if (action === 'add') {
      this.add();
    }
  }

  add = () => {
    const { setDoc, docRef } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 3 },
      },
      wrapperCol: {
        sm: { span: 21 },
      },
    };
    dialog({
      title: `Add a response`,
      children: (
        <Form>
          <FormItem
            {...formItemLayout}
            label="StatusCode"
          >
            <Select onChange={this.onInputChange('statusCode')}>
            {
              Object.entries(STATUS_CODE).map(([statusCode, text], index) => (
                <Option value={statusCode} key={`${index}`}>{text}</Option>
              ))
            }
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Description"
          >
            <Input.TextArea onChange={this.onInputChange('description')} rows={3} />
          </FormItem>
        </Form>
      ),
      onOk: () => {
        setDoc && setDoc(`${docRef}.${this.state.statusCode}`, {
          description: this.state.description,
        });
      },
    });
  }

  renderReosponse(statusCode, response) {
    const { description, headers, content  } = response;
    const dataSource = [{
      title: 'Description',
      value: description,
      onChange: this.onChange(`${statusCode}.description`),
    }, {
      title: 'Header',
      value: headers,
      valueRender: value => (
        <Headers data={value} docRef={`${this.props.docRef}.${statusCode}.headers`} />
      ),
      hideAction: true,
    }, {
      title: 'Content',
      value: content,
      valueRender: value => (
        <Content data={value} docRef={`${this.props.docRef}.${statusCode}.content`} />
      ),
      hideAction: true,
    }];

    return (
      <ListContent dataSource={dataSource} />
    );
  }

  render() {
    const dataArr = Object.entries(this.props.data || {});
    if (dataArr.length === 0) {
      return (<NoContent desc="No Response" onAdd={this.add}/>);
    }

    const list = dataArr.map(([statusCode, response], index) => (
      <TabPane tab={statusCode} key={`${index}`}>
        {this.renderReosponse(statusCode, response)}
      </TabPane>
    ));

    return (
      <Tabs
        activeKey={`${this.state.activeKey}`}
        tabPosition="left"
        type={this.context.editable ? 'editable-card' : 'card'}
        animated={false}
        onEdit={this.onEdit}
        onChange={this.onTabsChange}
      >
        {list}
      </Tabs>
    );
  }
}