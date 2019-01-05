import * as React from 'react';
import { getData } from './util';
import { OpenAPIV3 } from 'openapi-types';
import { setDocByDocRef, unsetDocByDocRef } from './util';
import { any } from 'prop-types';

export enum TypeEnum {
  INFO = 'INFO',
  METHOD = 'METHOD',
  SCHEMA = 'SCHEMA',
  REQUEST_BODY = 'REQUEST_BODY',
  RESPONSE = 'RESPONSE',
  PARAMETER = 'PARAMETER',
  HEADER = 'HEADER',
}

export interface EditableContextType {
  editable: boolean;
}

export const EditableContext = React.createContext({
  editable: true,
} as EditableContextType);

export interface EditorContextType {
  type: TypeEnum;
  doc: OpenAPIV3.Document | null;
  docRef: string;
  dispatch(context: Partial<EditorContextType>, callback?: Function);
}

export const EditorContext = React.createContext({
  type: TypeEnum.INFO,
  data: null,
  docRef: 'info',
  doc: null,
  dispatch: () => {},
} as EditorContextType);

export const dispatch = (Target: React.ComponentClass<{ dispatch: Function }>): any =>
  class extends React.PureComponent {
    render() {
      return (
        <EditorContext.Consumer>
          {
            context => (
              <Target
                {...this.props}
                dispatch={context.dispatch}
              />
            )
          }
        </EditorContext.Consumer>
      );
    }
  };

export const setDoc = (Target: React.ComponentClass<{ setDoc?: Function, unsetDoc?: Function }>): any =>
  class extends React.PureComponent {
    render() {
      return (
        <EditorContext.Consumer>
          {
            context => (
              <Target
                {...this.props}
                setDoc={(docRef, data, callback?) => context.dispatch({
                  doc: setDocByDocRef(context.doc, docRef, data),
                }, callback)}
                unsetDoc={docRef => context.dispatch({
                  doc: unsetDocByDocRef(context.doc, docRef),
                })}
              />
            )
          }
        </EditorContext.Consumer>
      );
    }
  };

export interface TargetProp extends Partial<EditorContextType> {
  data: any;
  setDoc: Function;
}
export const consumer = (mapToProps: Function = context => any) => (Target: React.ComponentClass<TargetProp>): any =>
  class extends React.PureComponent {

    renderChild = context => {
      const contextProps = {};
      Object.keys(mapToProps(context)).forEach(key => {
        contextProps[key] = context[key];
      });
      return (
        <Target
          {...this.props}
          {...contextProps}
          data={getData(context.doc, context.docRef)}
          docRef={context.docRef}
          setDoc={(docRef, data, callback?) => context.dispatch({
            doc: setDocByDocRef(context.doc, docRef, data),
          }, callback)}
          dispatch={context.dispatch}
        />
      );
    }

    render() {
      return (
        <EditorContext.Consumer>
          { this.renderChild }
        </EditorContext.Consumer>
      );
    }
  };
