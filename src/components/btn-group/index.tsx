import * as React from 'react';
import { Row, Button } from 'antd';

import './index.less';

interface Prop {
  type?: 'edit' | 'editing' | 'add';
  onSubmit?: any;
  onClose?: any;
  onEdit?: any;
}

export default class BtnGroup extends React.PureComponent<Prop> {

  static defaultProps = {
    type: 'editing',
    onSubmit: () => {},
    onClose: () => {},
    onEdit: () => {},
  };

  render() {
    const { type, onClose, onEdit, onSubmit } = this.props;
    if (type !== 'editing') {
      return (
        <Button type="primary" size="small" className="openapi-btn-add" icon={ type === 'add' ? 'plus' : type } onClick={onEdit} />
      );
    }
    return (
      <Row className="openapi-btn-group">
        <Button type="primary" size="small" icon="check" onClick={onSubmit} />
        <Button className="btn-close" size="small" icon="close" onClick={onClose} />
      </Row>
    );
  }
}