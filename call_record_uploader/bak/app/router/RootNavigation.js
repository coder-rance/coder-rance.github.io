import {createRef} from 'react';

export const navigationRef = createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function dispatch(resetAction) {
  navigationRef.current?.dispatch(resetAction);
}



