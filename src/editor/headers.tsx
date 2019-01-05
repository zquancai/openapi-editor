import * as React from 'react';
import { Tabs, Form, Input } from 'antd';
import { OpenAPIV3 } from 'openapi-types';
import ListContent from './../components/list/index';
import { setDoc, EditableContext } from '../context';
import { SchemaEditor } from './schema';
import dialog from '../components/dialog';
import JSONSchemaEditor from '../../lib/json-schema-editor';
import NoContent from '../components/no-content';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

interface HeadersProp {
  data: {
    [header: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.HeaderObject;
  };
  docRef: string;
  setDoc: Function;
  unsetDoc: Function;
}

@setDoc
export default class Headers extends React.PureComponent<HeadersProp> {

  static contextType = EditableContext;

  state = {
    activeKey: 0,
    schema: {},
    name: '',
    description: '',
  };

  onChange = key => val => {
    this.props.setDoc(`${this.props.docRef}.${key}`, val);
  }

  onInputChange = key => value => {
    this.setState({ [key]: value.target ? value.target.value : value });
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
      title: `Add a header`,
      children: (
        <Form>
          <FormItem
            {...formItemLayout}
            label="Name"
          >
            <Input onChange={this.onInputChange('name')} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Description"
          >
            <Input.TextArea rows={ 4 } onChange={this.onInputChange('description')} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Schema"
          >
            <JSONSchemaEditor json={{}} onChange={this.onInputChange('schema')} />
          </FormItem>
        </Form>
      ),
      onOk: () => {
        setDoc && setDoc(`${docRef}.${this.state.name}`, {
          schema: this.state.schema,
          description: this.state.description,
        });
      },
    });
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

  onTabsChange = activeKey => {
    this.setState({ activeKey });
  }

  renderHeader(name, item) {
    const dataSource = [{
      title: 'Description',
      value: item.description,
      onChange: this.onChange(`${name}.description`),
    }, {
      title: 'Schema',
      value: item.schema,
      valueRender: value => (
        <SchemaEditor json={value} docRef={`${this.props.docRef}.${name}.schema`} />
      ),
      hideAction: true,
    }];

    return (
      <ListContent dataSource={dataSource} />
    );
  }

  render() {
    const headerArr = Object.entries(this.props.data || {});
    if (headerArr.length === 0) {
      return (<NoContent desc="No Header" onAdd={this.add} />);
    }
    return (
      <Tabs
        defaultActiveKey="0"
        activeKey={`${this.state.activeKey}`}
        tabPosition="top"
        type={this.context.editable ? 'editable-card' : 'card'}
        animated={false}
        onEdit={this.onEdit}
        onChange={this.onTabsChange}
      >
        {
          headerArr.map(([name, item], index) => (
            <TabPane tab={name} key={`${index}`}>
              {this.renderHeader(name, item)}
            </TabPane>
          ))
        }
      </Tabs>
    );
  }
}