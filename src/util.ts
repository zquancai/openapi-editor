import { set, get, unset } from 'lodash';

const arrReg = /(.*)\[\d+]$/g;

export const setDocByDocRef = (doc, docRef, data) => {
  const newDoc = Object.assign({}, doc);
  set(newDoc, docRef, data);
  console.log(newDoc, docRef, data);
  return newDoc;
};

export const unsetDocByDocRef = (doc, docRef) => {
  const newDoc = Object.assign({}, doc);
  unset(newDoc, docRef);
  if (arrReg.test(docRef)) {
    const arrDocRef = docRef.replace(arrReg, '$1');
    const data = getData(newDoc, arrDocRef);
    set(newDoc, arrDocRef, data.filter(d => !!d));
  }
  return newDoc;
};

export const getData = (doc, docRef) => {
  if (docRef === 'info') {
    return doc;
  }
  const data = get(doc, docRef, undefined);
  if (!data) {
    throw new Error(`can not found ${docRef} from doc`);
  }
  return data;
};
