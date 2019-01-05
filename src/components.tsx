import * as React from 'react';
import { List } from 'antd';
import { OpenAPIV3 } from 'openapi-types';
import { dispatch, TypeEnum } from './context';

interface Prop {
  doc?: OpenAPIV3.ComponentsObject;
  dispatch: Function;
}

const componentsMap = {
  schemas: TypeEnum.SCHEMA,
  responses: TypeEnum.RESPONSE,
  parameters: TypeEnum.PARAMETER,
  // examples:
  requestBodies: TypeEnum.REQUEST_BODY,
  // securitySchemes: 
  headers: TypeEnum.HEADER,
};

@dispatch
export default class Components extends React.PureComponent<Prop> {
  onClick = key => () => {
    this.props.dispatch({
      type: componentsMap[key],
      docRef: `components.${key}`,
    });
  }

  render() {
    const componentKeys = Object.keys(this.props.doc || {});
    return (
      <List
        itemLayout="horizontal"
        dataSource={componentKeys}
        renderItem={key => (
          <List.Item onClick={this.onClick(key)}>{key}</List.Item>
        )}
      />
    );
  }
};
