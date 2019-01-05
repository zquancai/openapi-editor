import * as React from 'react';
import JSONSchemaEditor from '../../lib/json-schema-editor';
import { setDoc, EditableContext } from '../context';
import { Table } from 'antd';
import BtnGroup from './../components/btn-group/index';
import { OpenAPIV3 } from '_openapi-types@1.3.2@openapi-types';

interface Prop {
  json: {
    [key: string]: any;
  };
  docRef?: string;
  editable?: boolean;
  setDoc?: Function;
  rootKeyName: string;
}

interface State {
  isEdit: boolean;
}

const columns = [
  {
    title: '变量名',
    dataIndex: 'name',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '默认值',
    dataIndex: 'default',
    render: (v, record) => v || record.defaultValue,
  },
];

@setDoc
export class SchemaEditor extends React.PureComponent<Prop, State> {
  static contextType = EditableContext;

  static defaultProps = {
    editable: false,
    rootKeyName: 'root',
  };

  protected json = {};

  state = {
    isEdit: false,
  };

  onChange = json => {
    this.json = json;
  }

  onEdit = () => {
    this.setState({
      isEdit: true,
    });
  }

  onSubmit = () => {
    this.props.setDoc(this.props.docRef, this.json);
    this.onClear();
  }

  onClear = () => {
    this.setState({
      isEdit: false,
    });
  }

  getAdditionalPropertiesType(additionalProperties: any) {
    if (typeof additionalProperties === 'boolean') {
      return 'ALL';
    }
    if (additionalProperties.$ref) {
      return additionalProperties.$ref;
    }
    return `string-to-${additionalProperties.type} [free-dom-object]`;
  }

  formatJSONSchema(schema: OpenAPIV3.SchemaObject) {
    let data = [] as any[];
    if (!schema) {
      return [];
    }
    if (schema.type === 'object') {
      if (schema.hasOwnProperty('additionalProperties')) {
        data.push({
          name: '',
          description: schema.description,
          type: this.getAdditionalPropertiesType(schema.additionalProperties),
          default: schema.default,
        });
      }
      if (schema.properties) {
        Object.entries(schema.properties).forEach(([name, childSchema]) => {
          if (childSchema.$ref) {
            data.push({
              name: '',
              description: childSchema.description,
              type: childSchema.$ref,
            });
          } else {
            const children = this.formatJSONSchema(childSchema);
            data.push({
              name: name,
              description: childSchema.description,
              type: childSchema.type,
              ...(children.length > 0 ? { children } : {}),
            });
          }
        });
      }
    } else if (schema.type === 'array') {
      if (schema.items.$ref) {
        data.push({
          name: '',
          description: schema.description,
          type: `${schema.items.$ref} [array-item]`,
        });
      } else {
        const children = this.formatJSONSchema(schema.items || {});
        data.push({
          name: '',
          description: schema.description,
          type: `${schema.items.type} [array-item-type]`,
          ...(children.length > 0 ? { children } : {}),
        });
      }
    }
    return data;
  };

  renderJSON(jsonSchema) {
    const { editable } = this.context;

    if (jsonSchema.$ref) {
      return jsonSchema.$ref;
    }

    const children = this.formatJSONSchema(jsonSchema);
    const dataSource = {
      name: '',
      ...jsonSchema,
      ...(children.length > 0 ? { children } : {}),
    };
    return (
      <React.Fragment>
        <Table
          bordered
          columns={columns}
          dataSource={[dataSource]}
          pagination={false}
          rowKey={({ name, type, description }) => `${name}-${type}-${description}`}
        />
        {
          editable && <BtnGroup type="edit" onEdit={this.onEdit} />
        }
      </React.Fragment>
    );
  }

  render() {
    const json = this.props.json || {};
    if (json.$ref) {
      return json.$ref;
    }

    if (!this.state.isEdit || !this.context.editable) {
      return this.renderJSON(json);
    }

    return (
      <React.Fragment>
        <JSONSchemaEditor
          json={this.props.json}
          onChange={this.onChange}
        />
        <BtnGroup onEdit={this.onEdit} onSubmit={this.onSubmit} onClose={this.onClear}/>
      </React.Fragment>
    );
  }
}
