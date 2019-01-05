import * as React from 'react';
import { Collapse, Tag } from 'antd';
import { OpenAPIV3 } from 'openapi-types';
import { dispatch, TypeEnum } from './context';

const Panel = Collapse.Panel;

enum MethodColorType {
  get = '#61affe',
  post = '#49cc90',
  put = '#fca130',
  delete = '#f93e3e',
}

const DEPRECATED = '#ebebeb';

interface Prop {
  doc: OpenAPIV3.PathObject;
  dispatch: Function;
}

interface State {
  method: string;
  schema: any;
}

@dispatch
export default class Paths extends React.PureComponent<Prop, State> {
  getMethodColor = (method, schema) => {
    return schema.deprecated ? DEPRECATED : String(MethodColorType[method]);
  }

  render() {
    const paths = this.props.doc;
    const pathArr = Object.entries(paths);
    return (
      <Collapse bordered={false} defaultActiveKey={['0']}>
        {
          pathArr.map(([url, methodGroup], index) => (
            <Panel header={url} key={`${index}`}>
              {
                Object.entries(methodGroup).map(([method, schema]: [any, OpenAPIV3.PathObject], index) => (
                  <Tag
                    key={`${index}`}
                    color={this.getMethodColor(method, schema)}
                    onClick={() => this.props.dispatch({
                      type: TypeEnum.METHOD,
                      docRef: `paths.${url}.${method}`,
                    })}
                  >
                    {method}
                  </Tag>
                ))
              }
            </Panel>
          ))
        }
      </Collapse>
    );
  }
};
