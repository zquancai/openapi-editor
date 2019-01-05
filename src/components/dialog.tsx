import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Modal } from 'antd';

export default function dialog(config) {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const destroy = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  const handleCancel = e => {
    render(
      { ...initProps, visible: false, afterClose: destroy },
      () => config.onCancel && config.onCancel(e),
    );
  };

  const handleOk = e => {
    render(
      { ...initProps, visible: false, afterClose: destroy },
      () => config.onOk && config.onOk(e),
    );
  };

  const render = ({ children, ...modalProps }, callback?) => {
    ReactDOM.render(
      <Modal
        width={800}
        {...modalProps}
      >
        {children}
      </Modal>,
      div,
      callback,
    );
  };

  const initProps = {
    ...config,
    visible: true,
    onCancel: handleCancel,
    onOk: handleOk,
  };

  render(initProps);
}