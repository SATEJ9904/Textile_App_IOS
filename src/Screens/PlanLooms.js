import { SafeAreaView, StyleSheet, Text, View, StatusBar, Image, ImageBackground, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, FlatList, Button, ScrollView, Alert, Pressable, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import HeaderPart from './HeaderPart';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const fontSize = (size) => Math.round(size * scaleWidth);
const baseWidth = 360; // Assuming 360 is the base width you are designing for
const scaleWidth = width / baseWidth;
const PlanLooms = ({ navigation, focused }) => {
  const [showTable, setShowTable] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [Name, setName] = useState("");
  const [AppUserId, setAppUserId] = useState("")
  const [LoomOrTrader, SetLoomOrTrader] = useState("")
  const [id, setId] = useState("")
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  useEffect(() => {
    fetchselectedEnquiryId();
    const callfuns = () => {
      fetch("")
        .then(getData())
    }
    callfuns();

    const getTodaysDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(today.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    const todaysDate = getTodaysDate();
    setTodaysDate(todaysDate);
    console.log(todaysDate)

  }, [])

  const [TodaysDate, setTodaysDate] = useState(null)

  const fetchselectedEnquiryId = async () => {
    try {
      const response = await axios.get('https://textileapp.microtechsolutions.co.in/php/getidenquiry.php?Colname=TraderId&Colvalue=' + id);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getData = async () => {
    const Name = await AsyncStorage.getItem("Name");
    const AppUserId = await AsyncStorage.getItem("AppUserId");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
    const Id = await AsyncStorage.getItem("Id")

    setName(Name)
    setAppUserId(AppUserId)
    SetLoomOrTrader(LoomOrTrader)
    setId(Id)

  }

  const yesbutton = () => {
    setShowForm(false)
    setShowTable(true)
    setModalVisible2(false)
    setModalVisible(false)

    setDesignPaper(null)
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
     <HeaderPart />
      <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 50 }}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
        >
          <Image
            source={require("../Images/drawer1.png")}
            style={{ width: 28, height: 22, marginLeft: 10, }}
          />
        </TouchableOpacity>

        <View style={{ flex: 0.9, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, color: "white", fontWeight: 500 }}>  Plan Looms </Text>
        </View>

      </View>

      {selectedItem ? (
        <View>
          <TouchableOpacity onPress={() => setSelectedItem(null)} style={{ padding: 10, backgroundColor: 'lightgray', alignItems: 'center' }}>
            <Text>Back to List</Text>
          </TouchableOpacity>
          <View style={{ marginVertical: 10, marginHorizontal: 20, padding: 10, backgroundColor: '#eee', borderRadius: 5 }}>
            <Text>ID: {selectedItem.EnquiryId}</Text>
            <Text>EnquiryNo: {selectedItem.EnquiryNo}</Text>
            <Text>EnquiryDate: {selectedItem.EnquiryDate.date.substring(0, 10)}</Text>
            <Text>TraderId: {selectedItem.TraderId}</Text>
            <Text>BookingFrom: {selectedItem.BookingFrom.date.substring(0, 10)}</Text>
            <Text>BookingTo: {selectedItem.BookingTo.date.substring(0, 10)}</Text>
            <Text>FabricQuality: {selectedItem.FabricQuality}</Text>
            <Text>LoomRequired: {selectedItem.LoomRequired}</Text>
            <Text>AgentName: {selectedItem.AgentName}</Text>
            <Text>OfferedJobRate: {selectedItem.OfferedJobRate}</Text>

          </View>
        </View>
      ) : (
        <ScrollView>
          {
            showTable ? <View style={styles.container}>

              <TouchableOpacity
                onPress={() => navigation.navigate("NewEnquiry")}
                style={styles.btn}
              >
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={require('../Images/assignment.png')}
                    style={{ width: 100, height: 100 }}
                  />
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
                  <Text style={{ fontSize: 22, color: '#003C43', fontWeight: '500', marginTop: "5%" }}> Generate Enquiry </Text>
                  <Text style={{ fontSize: 15, color: '#003C43', fontWeight: '500' }}> Easy create the Enquires for Looms </Text>

                </View>

              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("ConfirmEnquires")}
                style={styles.btn}
              >
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={require('../Images/daily-tasks.png')}
                    style={{ width: 100, height: 100 }}
                  />
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
                  <Text style={{ fontSize: 22, color: '#003C43', fontWeight: '500', marginTop: "8%" }}> Enquiry Response </Text>
                  <Text style={{ fontSize: 15, color: '#003C43', fontWeight: '500' }}> Track responses from loom providers  </Text>

                </View>

              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Generated_Enquires")}
                style={styles.btn}
              >
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={require('../Images/accountability.png')}
                    style={{ width: 100, height: 100 }}
                  />
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
                  <Text style={{ fontSize: 22, color: '#003C43', fontWeight: '500', marginTop: "8%" }}> Your Enquires </Text>
                  <Text style={{ fontSize: 15, color: '#003C43', fontWeight: '500' }}> History of your past inquiries and follow up. </Text>

                </View>

              </TouchableOpacity>

            </View> : null

          }
        </ScrollView>
      )}

      {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View> : null}

    </View>
  )
}

export default PlanLooms

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 30,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5', // Light background for contrast
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: "#003C43", // Brand color
    fontSize: fontSize(24), // Dynamic font size for more emphasis
  },
  headerText1: {
    color: "#003C43", // Use brand color for smaller text
    fontSize: fontSize(15),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  cell: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    color: "#000",
    borderColor: '#ddd', // Use lighter borders for better readability
    borderRadius: 5, // Slight rounding of corners for modern look
  },
  fabricQuality: {
    width: '100%',
    flexDirection: "row",
    marginBottom: 10, // Add space between rows
  },
  fabricDetails: {
    height: height * 0.05,
    width: width * 0.15,
    borderColor: '#003C43', // Darker border for better visibility
    borderBottomWidth: 1.5, // Thicker border for emphasis
    marginBottom: height * 0.02,
    fontSize: fontSize(12), // Slightly larger font for readability
    color: "#003C43", // Use a dark color for text
    fontWeight: "700", // Heavier font for important details
  },
  flatList: {
    marginTop: 10,
    color: "#000",
  },
  containerform: {
    padding: 20,
    color: "#000",
    width: '100%',
    backgroundColor: '#fff', // White background for form
    borderRadius: 10, // Round the corners for a clean look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Subtle shadow for a floating effect
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#003C43', // Use brand color for input borders
    borderRadius: 10, // Softer rounding for input fields
    padding: 12, // Increase padding for a spacious feel
    marginBottom: 15,
    fontSize: fontSize(17), // Dynamic font size for readability
    color: "#000",
    fontWeight: "500",
    backgroundColor: '#fff', // White background for inputs
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Subtle shadow for inputs
  },
  button: {
    backgroundColor: '#003C43', // Brand color for buttons
    padding: 15,
    borderRadius: 10, // Rounded button corners
    alignItems: 'center',
    marginTop: 10,
    width: '100%', // Full-width buttons for balance
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5, // Shadow to give button a floating effect
  },
  buttonText: {
    color: 'white', // White text for contrast
    fontWeight: 'bold',
    fontSize: fontSize(18), // Larger text for emphasis
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: "3%",
  },
  dropdown: {
    height: 50,
    borderColor: '#003C43', // Darker border for dropdown
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff', // White background for dropdown
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // Shadow for dropdown
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white', // White background for modal
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Slightly more elevation for modals
  },
  button1: {
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: '#003C43', // Brand color for modal buttons
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "red", // Red for destructive actions
  },
  textStyle: {
    color: 'white', // White text for contrast
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: "red", // Red background for emphasis
  },
  btn: {
    height: "28%",
    width: width * 0.8,
    padding: 15, // Increase padding for touchable buttons
    borderRadius: 15,
    borderWidth: 2,
    marginBottom: 30,
    borderColor: '#003C43', // Brand color for button borders
    alignItems: 'center',
    backgroundColor: '#fff', // White background with border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 6, // Subtle shadow for card effect
  },
});