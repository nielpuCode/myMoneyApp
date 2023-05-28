import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#b4cd89',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginTop: 20,
  },
  TitleDate: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ActionDate: {
    flexDirection: 'row',
  },
  ActionText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10
  },

  // Part of The Adding New page Listpage.js

  newBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: 30,

    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    width: '100%',
    elevation: 20,
    shadowColor: '#000000',
  },
  newButton: {
    fontWeight: 'bold',
    backgroundColor: '#b4cd89',
    padding: 10,
    borderRadius: 30,
    fontSize: 20,
    marginBottom: 25,
  },
  amountMoney: {
    flexDirection: 'row',
    backgroundColor: '#b4cd89',
    alignItems: 'center',
    borderRadius: 30,
    paddingRight: 15,
    marginBottom: 25,
  },
  listExpense: {
    // height: 750,
    marginBottom: '9%',
    
  },

  Peoplecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b4cd89',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginTop: 20,
  },

  ViewList: {
    alignItems: 'center',
  },

  inputIncomeNominal: { 
    flexDirection: 'row',
    backgroundColor: '#b4cd89',
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 25,
    fontWeight: 'bold', 
    marginLeft: 10, 
    fontSize: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  //This is Addnew.js page
  addExpenses: {
    borderWidth: 5,
    borderColor: '#b4cd89',
    backgroundColor: 'none',
    height: 500,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  ExpenseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexWrap: 'wrap',
    
    backgroundColor: '#b4cd89',
    margin: 10
  },
  itemDetail: {
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '93%',
  },
  viewInput: {
    borderWidth: 5,
    borderColor: '#b4cd89',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  inputAddnew: {
    borderWidth: 2,
    borderColor: '#b4cd89',
    borderRadius: 30,
    padding: 5,
    paddingHorizontal: 15,
    width: '90%',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    height: 50
  },
  actionAdd: {
    // borderWidth: 1,
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  // This is page Detaillist.js for detail view

  finalMoney: {
    borderRadius: 30,
    backgroundColor: '#b4cd89',
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    margin: 10,

    elevation: 20,
    shadowColor: '#000000',
  },
  scrolllist: {
    borderWidth: 5,
    borderColor: '#b4cd89',
    borderRadius: 20,
    height: '89%'
  },
  detailView: {
    backgroundColor: '#b4cd89',
    margin: 10,
    borderRadius: 30,
    padding: 5,
    paddingHorizontal: 15,
  },
  finalIncome: {
    borderRadius: 30,
    backgroundColor: '#b4cd89',
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    margin: 10,
    elevation: 20,
    shadowColor: '#000000',
  },

  IncomeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexWrap: 'wrap',    
    backgroundColor: '#b4cd89',
    margin: 10
  }

});

export default styles;