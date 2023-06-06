import Toast from 'react-native-simple-toast';

export const showTopMessage = (msg)=> Toast.showWithGravity(msg, Toast.SHORT, Toast.TOP);
export const showTopMessageLong = (msg)=> Toast.showWithGravity(msg, Toast.LONG, Toast.TOP);
export const showBottomMessage = (msg)=> Toast.showWithGravity(msg, Toast.SHORT, Toast.BOTTOM);
export const showBottomMessageLong = (msg)=> Toast.showWithGravity(msg, Toast.LONG, Toast.BOTTOM);