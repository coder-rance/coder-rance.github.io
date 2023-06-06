import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'row',
    justifyContent:'space-around',
    alignItems:'center',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius:15,
    marginTop:15,
    marginBottom:15,
  },
  line: {
    height: 0.5,
    flex:1,
  },
  title: {
    fontSize:15,
    width:30,
    textAlign:'center'
  }
});
