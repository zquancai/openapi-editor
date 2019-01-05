import * as React from 'react';
import { Tabs, Form, Select } from 'antd';
import { SchemaEditor } from './schema';
import { OpenAPIV3 } from 'openapi-types';
import { setDoc, EditableContext } from '../context';
import dialog from '../components/dialog';
import JSONSchemaEditor from '../../lib/json-schema-editor';
import NoContent from '../components/no-content';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

enum MediaTypeEnum {
  JSON = 'application/json',
  XML = 'application/xml',
  X_WWW_FORM = 'application/x-www-form-urlencoded',
  FORM_DATA = 'multipart/form-data',
}

interface Prop {
  data: {
    [media: string]: OpenAPIV3.MediaTypeObject;
  };
  docRef: string;
  setDoc: Function;
  unsetDoc: Function;
}

@setDoc
export default class Content extends React.PureComponent<Prop> {

  static contextType = EditableContext;

  state = {
    activeKey: 0,
    schema: {},
    mediaType: MediaTypeEnum.JSON,
  };

  onInputChange = key => value => {
    this.setState({ [key]: value });
  }

  add = () => {
    const { setDoc, docRef, data } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 19 },
      },
    };
    dialog({
      title: `Add a body content`,
      children: (
        <Form>
          <FormItem
            {...formItemLayout}
            label="MediaType"
          >
            <Select
              style={{ width: '100%' }}
              defaultValue={this.state.mediaType}
              onChange={this.onInputChange('mediaType')}
            >
              <Option value={String(MediaTypeEnum.JSON)}>{MediaTypeEnum.JSON}</Option>
              <Option value={String(MediaTypeEnum.XML)}>{MediaTypeEnum.XML}</Option>
              <Option value={String(MediaTypeEnum.X_WWW_FORM)}>{MediaTypeEnum.X_WWW_FORM}</Option>
              <Option value={String(MediaTypeEnum.FORM_DATA)}>{MediaTypeEnum.FORM_DATA}</Option>
            </Select>
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
        setDoc && setDoc(`${docRef}.${this.state.mediaType}`, {
          schema: this.state.schema,
        }, () => {
          const index = Object.entries(data || {}).findIndex(([mediaType]) => this.state.mediaType === mediaType);
          if (String(index)) {
            this.setState({
              activeKey: String(index < 0 ? 0 : index),
            });
          }
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

  render() {
    const { data } = this.props;
    if (!data || Object.entries(data).length === 0) {
      return (<NoContent onAdd={this.add} />);
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
          Object.entries(data || {}).map(([mediaType, item], index) => (
            <TabPane tab={mediaType} key={`${index}`}>
              <SchemaEditor
                json={item.schema}
                docRef={`${this.props.docRef}.${mediaType}.schema`}
              />
            </TabPane>
          ))
        }
      </Tabs>
    );
  }
}