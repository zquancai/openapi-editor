import * as React from 'react';
import ListContent from '../components/list/index';
import Content from './content';
import { OpenAPIV3 } from 'openapi-types';
import { setDoc } from '../context';

interface Prop {
  data: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject;
  docRef: string;
  setDoc: Function;
}

@setDoc
export default class HttpBody extends React.PureComponent<Prop> {

  onChange = key => val => {
    this.props.setDoc(`${this.props.docRef}.${key}`, val);
  }

  render() {
    const { $ref } = this.props.data as OpenAPIV3.ReferenceObject;
    if ($ref) {
      return (
        <div>{$ref}</div>
      );
    }

    const { description, content, required } = this.props.data as OpenAPIV3.RequestBodyObject;
    const dataSource = [{
      title: 'Description',
      value: description,
      onChange: this.onChange('description'),
    }, {
      title: 'Required',
      value: !!required,
      onChange: this.onChange('required'),
    }, {
      title: 'Content',
      value: content,
      valueRender: value => (
        <Content data={value} docRef={`${this.props.docRef}.content`} />
      ),
      hideAction: true,
    }];

    return (
      <ListContent dataSource={dataSource} />
    );
  }
}