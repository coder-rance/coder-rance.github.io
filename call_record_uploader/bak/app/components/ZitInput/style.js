import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'row',
    alignItems:'center',
    width: '100%',
    backgroundColor: '#f7f8f8',
    paddingLeft:10,
    paddingRight:10,
    borderRadius:5,
  },
  input: {
    backgroundColor: '#f7f8f8',
    flex:1,
  },
  icon: {
    paddingLeft:10,
    paddingRight:10,
    padding:10,
  }
});
