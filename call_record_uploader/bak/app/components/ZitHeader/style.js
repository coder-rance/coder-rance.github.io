import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    height: 40
  },
  leftIcon: {
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    width: 40,
    height:40,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightIcon: {
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    width: 40,
    height:40,
  },
});
