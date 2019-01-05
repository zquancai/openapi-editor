import * as React from 'react';
import { Tabs, Input, Form } from 'antd';
import { OpenAPIV3 } from 'openapi-types';
import { SchemaEditor } from './schema';
import ListContent from '../components/list';
import { setDoc, EditableContext } from '../context';
import JSONSchemaEditor from '../../lib/json-schema-editor';
import dialog from './../components/dialog';
import NoContent from '../components/no-content';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

interface Prop {
  dataList: OpenAPIV3.ParameterObject[];
  docRef: string;
  setDoc: Function;
}

interface ParametersProp {
  dataList: (OpenAPIV3.ParameterObject & { docRef: string })[];
  setDoc?: Function;
  unsetDoc?: Function;
  docRef2Add: string;
  parameterIn: string;
  title: string;
}

@setDoc
class Parameters extends React.PureComponent<ParametersProp> {

  static contextType = EditableContext;

  static defaultProps = {
    data: [],
  };

  state = {
    activeKey: 0,
    name: '',
    description: '',
    schema: {},
  };

  onChange = docRef => val => {
    this.props.setDoc && this.props.setDoc(docRef, val);
  }

  onTabsChange = activeKey => {
    this.setState({ activeKey });
  }

  onInputChange = key => e => {
    this.setState({ [key]: e.target ? e.target.value : e });
  }

  add = () => {
    const { setDoc, docRef2Add, parameterIn } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 19 },
      },
    };
    dialog({
      title: `Add a ${parameterIn} parameter`,
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
            <Input.TextArea onChange={this.onInputChange('description')} rows={ 3 } />
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
        setDoc && setDoc(docRef2Add, {
          in: parameterIn,
          name: this.state.name,
          description: this.state.description,
          schema: this.state.schema,
        });
      },
    });
  }

  onEdit = (targetKey, action) => {
    if (action === 'remove') {
      const data = this.props.dataList.find((d, index) => String(index) === targetKey);
      if (data) {
        this.props.unsetDoc && this.props.unsetDoc(data.docRef);
      }
    }
    if (action === 'add') {
      this.add();
    }
  }

  renderList = data => {
    const docRef = data.docRef;
    const list = [{
      title: 'Name',
      value: data.name,
      onChange: this.onChange(`${docRef}.name`),
    }, {
      title: 'Description',
      value: data.description,
      onChange: this.onChange(`${docRef}.description`),
    }, {
      title: 'Schema',
      value: (
        <SchemaEditor
          rootKeyName={data.name}
          json={data.schema}
          docRef={`${docRef}.schema`}
        />
      ),
      hideAction: true,
    }];
    return (
      <ListContent dataSource={list} />
    );
  }

  render() {
    const { dataList, title } = this.props;
    if (dataList.length === 0) {
      return (<NoContent desc={`No ${title}`} onAdd={this.add}/>);
    }
    return (
      <Tabs
        activeKey={`${this.state.activeKey}`}
        tabPosition="left"
        type={this.context.editable ? 'editable-card' : 'card'}
        animated={false}
        onEdit={this.onEdit}
        onChange={this.onTabsChange}
      >
        {
          (dataList || []).map((parameter, index) => (
            <TabPane tab={parameter.name} key={`${index}`}>
              {this.renderList(parameter)}
            </TabPane>
          ))
        }
      </Tabs>
    );
  }
};

@setDoc
export default class RequestParameters extends React.PureComponent<Prop> {
  insetDocTypeToParameter() {
    const { docRef, dataList } = this.props;
    return (dataList || []).map((parameter, index) => ({
      ...parameter,
      docRef: `${docRef}[${index}]`,
    }));
  }

  getParameters(parameters, inType: string) {
    return parameters.filter(param => param.in === inType);
  }

  renderTitle(item) {
    const length = item.dataList.length;
    if (length > 0) {
      return `${item.title}(${length})`;
    }
    return `${item.title}`;
  }

  render() {
    const parameters = this.insetDocTypeToParameter();
    const list = [
      { title: 'Header', parameterIn: 'header', dataList: this.getParameters(parameters, 'header') },
      { title: 'Path', parameterIn: 'path', dataList: this.getParameters(parameters, 'path') },
      { title: 'Query', parameterIn: 'query', dataList: this.getParameters(parameters, 'query') },
    ];
    return (
      <Tabs
        defaultActiveKey="0"
        tabPosition="top"
        animated={false}
      >
        {
          list.map((item, index) => (
            <TabPane tab={this.renderTitle(item)} key={`${index}`}>
              <Parameters {...item} docRef2Add={`${this.props.docRef}[${parameters.length}]`} />
            </TabPane>
          ))
        }
      </Tabs>
    );
  }
}