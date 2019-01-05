import * as React from 'react';
import { Collapse, Row, Col } from 'antd';
import { OpenAPIV3 } from 'openapi-types';

import { EditorContext, EditorContextType, TypeEnum, EditableContext } from './context';
import Paths from './paths';
import Components from './components';
import InfoEditor from './editor/info';
import MethodEditor from './editor/method';
import HttpBodyEditor from './editor/http-body';
import ResponseEditor from './editor/responses';
import HeaderEditor from './editor/headers';
import ParamteerEditor from './editor/request-parameters';
import Group from './components/group';
import { SchemaEditor } from './editor/schema';

const Panel = Collapse.Panel;

interface Prop {
  doc: OpenAPIV3.Document;
  editable: boolean;
}

interface State extends Partial<EditorContextType> {
  doc: OpenAPIV3.Document;
}

class Editor extends React.PureComponent<Prop, State> {
  constructor(props) {
    super(props);
    this.state = {
      type: TypeEnum.INFO,
      doc: props.doc,
      docRef: 'info',
      dispatch: this.dispatch,
    };
  }

  dispatch = (context, callback?) => {
    if (context.dispatch) {
      throw new Error('dispatch is protected');
    }
    this.setState(context, callback);
  }

  getEditor() {
    const type = this.state.type;
    switch (type) {
      case TypeEnum.INFO:
        return (<InfoEditor />);
      case TypeEnum.METHOD:
        return (<MethodEditor />);
      case TypeEnum.SCHEMA:
        return (
          <Group
            renderEditor={(docRef, name, value) => (
              <SchemaEditor json={value} docRef={docRef} />
            )}
          />
        );
      case TypeEnum.REQUEST_BODY:
        return (
          <Group
            renderEditor={(docRef, name, value) => (
              <HttpBodyEditor data={value} docRef={docRef} />
            )}
          />
        );
      case TypeEnum.RESPONSE:
        return (
          <Group
            renderEditor={(docRef, name, value) => (
              <ResponseEditor data={value} docRef={docRef} />
            )}
          />
        );
      case TypeEnum.PARAMETER:
        return (
          <Group
            renderEditor={(docRef, name, value) => (
              <ParamteerEditor data={value} docRef={docRef} />
            )}
          />
        );
      case TypeEnum.HEADER:
        return (
          <Group
            renderEditor={(docRef, name, value) => (
              <HeaderEditor data={value} docRef={docRef} />
            )}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const {
      paths,
      components,
    } = this.state.doc;
    const {
      editable,
    } = this.props;
    return (
      <EditableContext.Provider value={{ editable }}>
        <EditorContext.Provider value={ this.state }>
          <Row type="flex">
            <Col span={6}>
              <Collapse defaultActiveKey={['1']}>
                <Panel header="Paths" key="1">
                  <Paths doc={paths} />
                </Panel>
                <Panel header="Componentsm" key="2">
                  <Components doc={components} />
                </Panel>
              </Collapse>
            </Col>
            <Col offset={1} span={16}>
              {this.getEditor()}
            </Col>
          </Row>
        </EditorContext.Provider>
      </EditableContext.Provider>
    );
  }
};

export default Editor;
