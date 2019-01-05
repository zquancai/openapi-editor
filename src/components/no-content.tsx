import * as React from 'react';
import { Tooltip } from 'antd';
import { EditableContext } from '../context';
import BtnGroup from '../components/btn-group';

interface Prop {
  onAdd: Function;
  title: string;
  desc: string;
  showAddBtn: boolean;
}

export default class NoContent extends React.PureComponent<Prop> {
  static contextType = EditableContext;

  static defaultProps = {
    onAdd: () => {},
    title: 'Please click button to add',
    desc: 'No Content',
    showAddBtn: true,
  };

  render() {
    const { onAdd, title, desc, showAddBtn } = this.props;
    const { editable } = this.context;
    if (!editable) {
      return desc;
    }
    return (
      <React.Fragment>
        <Tooltip title={title}>
          {desc}
        </Tooltip>
        {
          showAddBtn && <BtnGroup type="add" onEdit={onAdd} />
        }
      </React.Fragment>
    );
  }
}