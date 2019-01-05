import * as React from 'react';
import { Form, Switch, List, Input, Icon } from 'antd';
import BtnGroup from './../btn-group/index';

import './index.less';
import { EditableContext } from '../../context';
import NoContent from '../no-content';

export enum DescriptionTypeEnum {
  tag = 'tag',
  text = 'text',
}

interface Prop {
  title: React.ReactNode;
  key: string;
  value: any;
  valueRender: Function;
  form?: any;
  hideAction?: boolean;
  type: DescriptionTypeEnum;
  customInput?: React.ReactNode;
  onChange: Function;
}

interface State {
  isEdit: boolean;
}

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

@Form.create()
export default class ListItem extends React.PureComponent<Prop, State> {
  static contextType = EditableContext;

  static defaultProps = {
    key: 'value',
    hideAction: false,
    type: DescriptionTypeEnum.text,
    valueRender: value => value,
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isEdit: typeof props.value === 'boolean',
    };
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, value) => {
      if (!err) {
        this.handleClear();
        this.props.onChange(value.value);
      }
    });
  }

  onSwitchChange = value => {
    this.props.onChange(value);
  }

  handleClear = () => {
    this.setState({
      isEdit: false,
    });
  }

  getActions() {
    return this.context.editable && !this.props.hideAction ? (
      <BtnGroup type="edit" onEdit={ this.handleEdit } />
    ) : null;
  }

  valueRender() {
    const { value, valueRender, title } = this.props;
    const res = valueRender(value);
    if (!res || (Array.isArray(res) && res.length === 0)) {
      return (<NoContent desc={`No ${title}`} onAdd={this.handleEdit} />);
    }
    return (
      <React.Fragment>
        {res}
        {this.getActions()}
      </React.Fragment>
    );
  }

  geDescription() {
    const { isEdit } = this.state;
    return isEdit ? this.getForm() : this.valueRender();
  }

  getInput() {
    const { customInput, value, title } = this.props;
    if (customInput) {
      return customInput;
    }
    if (typeof value === 'boolean') {
      return <Switch onChange={this.onSwitchChange} />;
    }
    if (String(title).indexOf('escription') > -1) {
      return <Input.TextArea rows={ 4 } />;
    }
    return <Input />;
  }

  getFormItemInput() {
    const { value, form } = this.props;
    const { getFieldDecorator } = form;
    return getFieldDecorator('value', {
      validateTrigger: ['onChange', 'onBlur'],
      initialValue: value,
      valuePropName: typeof value === 'boolean' ? 'checked' : 'value',
    })(this.getInput());
  }

  getForm() {
    const { value } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          required={false}
        >
          {this.getFormItemInput()}
        </FormItem>
        {
          typeof value !== 'boolean' &&
          <BtnGroup onClose={this.handleClear} onSubmit={this.handleSubmit}/>
        }
      </Form>
    );
  }

  handleEdit = () => {
    this.setState({
      isEdit: true,
    });
  };

  render() {
    const { title } = this.props;
    return (
      <List.Item className="list-item">
        <List.Item.Meta
          title={title}
          description={this.geDescription()}
        />
      </List.Item>
    );
  }
}