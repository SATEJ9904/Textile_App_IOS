import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, ImageBackground, ScrollView, FlatList, Pressable, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderPart from './HeaderPart';


const { width, height } = Dimensions.get('window');


const ConfirmEnquires = ({ navigation }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiryDetails, setEnquiryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showE, setShowE] = useState(true);
  const [showEC, setShowEC] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [confirmed, setConfirmed] = useState(new Set());
  const [AppUserId, setAppUserId] = useState("")
  const [Name, setName] = useState('')
  const [show, setShow] = useState(true);
  const [Id, setId] = useState("");
  const [LoomOrTrader, setLoomOrTrader] = useState("");
  const [mobileno, setMobileNo] = useState("");
  const [gstno, setGSTNO] = useState("")
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);


  const getData = async () => {
    const Email = await AsyncStorage.getItem("AppUserId");
    const Name = await AsyncStorage.getItem("Name");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
    const Id = await AsyncStorage.getItem("Id")
    const PrimaryContact = await AsyncStorage.getItem("PrimaryContact")
    const GSTNumber = await AsyncStorage.getItem("GSTNumber")


    console.log("ID = ", Id)

    setAppUserId(Email)
    setName(Name)
    setLoomOrTrader(LoomOrTrader)
    setId(Id)
    setMobileNo(PrimaryContact)
    setGSTNO(GSTNumber)
  }


  useEffect(() => {
    getData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://textileapp.microtechsolutions.co.in/php/getjoin.php?TraderId=' + await AsyncStorage.getItem("Id"));
        const sortedData = response.data.sort((a, b) => b.EnquiryId - a.EnquiryId); // Sort in descending order
        setEnquiries(sortedData);
        console.log(sortedData)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };


    fetchData();
  }, []);

  const fetchEnquiryDetails = async (EnquiryId) => {
    try {
      const response = await axios.get('https://textileapp.microtechsolutions.co.in/php/getjoin2.php?EnquiryId=' + EnquiryId);
      setEnquiryDetails(response.data);
    } catch (error) {
      console.error('Error fetching enquiry details: ', error);
    }
  };

  const [enquiryDetailsmodal, setEnquiryDetailsModal] = useState([])
  const [FQ,setFQ]=useState(null)

  const fetchEnquiryDetails1 = async (EnquiryId) => {
    try {
      const response = await axios.get('https://textileapp.microtechsolutions.co.in/php/getjoin.php?EnquiryId=' + EnquiryId);
      setEnquiryDetailsModal(response.data);
      setFQ(response.data[0].FabricQuality)
    } catch (error) {
      console.error('Error fetching enquiry details: ', error);
    }
    setShowEnquiryForm(true)
  };

  const confirmEnquiry = () => {
    setShowModal(false);
    setShowConfirmModal(true);
  };

  const postLoomOrder = async () => {

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://textileapp.microtechsolutions.co.in/php/postloomorder.php',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'EnquiryConfirmId': selectedData?.Id,
        'PartyName': Name,
        'JobRate': selectedData?.JobRateExp,
        'Quality': selectedData?.FabricQuality,
        'Orderdate': new Date().toISOString().split('T')[0],
        'BookedDateFrom': selectedData?.DatePossibleFrom.date.substring(0, 10),
        'BookedDateTo': selectedData?.DatePossibleTo.date.substring(0, 10)
      }
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        SendEmail(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const UpdateEnquiryConfirm = () => {

    console.log("Got ID = ", selectedData?.Id)

    const formdata = new FormData();
    formdata.append("Status", true);
    formdata.append("Id", selectedData?.Id);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/updateenquiryconfirm.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    postLoomOrder();

  }

  const yesbutton2 = () => {
    UpdateEnquiryConfirm();
    setShowConfirmModal(false);
    navigation.navigate("PlanLooms");
  }
  const [quality, setQuality] = useState("")

  const selectEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    fetchEnquiryDetails(enquiry.EnquiryId);
    setQuality(enquiry.FabricQuality)
    setShowE(false);
    setShowEC(true);
  };

  const renderEnquiries = () => (
    enquiries.map((item, index) => (
      <TouchableOpacity key={index} onPress={() => selectEnquiry(item)}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>Enquiry No: {item.EnquiryNo}</Text>
          <TouchableOpacity style={{ padding: "2%", marginTop: "-2%" }} onPress={() => fetchEnquiryDetails1(item.EnquiryId)}>
            <Icon name="information-circle" size={22} color="grey" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ))
  );

  const [Email, setEmail] = useState("")

  const handleLoomDetails = (item) => {
    setEmail(item.AppUserId)
    setConfirmed((prev) => {
      const newConfirmed = new Set(prev);
      if (newConfirmed.has(item.LoomTraderId)) {
        newConfirmed.delete(item.LoomTraderId);
      } else {
        newConfirmed.add(item.LoomTraderId);
      }
      return newConfirmed;
    });

    const selectedItem = enquiryDetails.find((i) => i.LoomTraderId === item.LoomTraderId);
    setSelectedData(selectedItem);
    setShowModal(true);
  }


  const SendEmail = (OrderNo) => {
    console.log("OrderNo = ", OrderNo)
    const formdata = new FormData();
    formdata.append("AppUserId", Email);
    formdata.append("Body", 'Your ' + (selectedData?.LoomPossible) + ' Looms are booked from ' + (selectedData?.DatePossibleFrom.date.substring(0, 10)) + ' to ' + (selectedData?.DatePossibleTo.date.substring(0, 10)) + ' is placed with ' + Name + '  Traders,with job rate of ' + (selectedData?.JobRateExp) + ' Paise Your OrderNo is ' + OrderNo + ' please Proceed for Contact Formation ' + `\n` + 'Contact Details of Trader:- ' + `\n` + ' Name : ' + Name + `\n` + 'Contact No. : ' + mobileno + `\n` + 'E-mail : ' + AppUserId + `\n`);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/sendemail.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }


  return (
    <View style={styles.container}>
      <HeaderPart />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {showE ? (
            <View style={{ width: "100%" }}>
              <View style={{ flexDirection: "row", backgroundColor: "#003C43", width: "100%", marginBottom: "5%" }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ImageBackground
                    source={require("../Images/back.png")}
                    style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003C43", marginTop: 8, marginRight: 0, marginLeft: 10 }}
                    imageStyle={{ borderRadius: 0 }}
                  />
                </TouchableOpacity>
                <Text style={styles.detailsTitle}>Enquiry List </Text>

              </View>
              <ScrollView>

                {renderEnquiries()}
                <Text style={{ marginTop: "50%" }}></Text>
              </ScrollView>
            </View>
          ) : null}
          {showEC ? (
            <View>
              <View>
                {
                  showE ?
                    <View style={{ flexDirection: "row", backgroundColor: "#003C43" }}>
                      <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <ImageBackground
                          source={require("../Images/drawer.png")}
                          style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003C43", marginTop: 15, marginRight: 0, marginLeft: 10 }}
                          imageStyle={{ borderRadius: 0 }}
                        />
                      </TouchableOpacity>

                    </View> :
                    <View style={{ flexDirection: "row", backgroundColor: "#003C43", width: "120%", marginLeft: "-8%", marginTop: "-5%" }}>
                      <TouchableOpacity onPress={() => { setShowE(true); setShowEC(false); }}>
                        <ImageBackground
                          source={require("../Images/back.png")}
                          style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003C43", marginTop: 15, marginRight: 0, marginLeft: 20 }}
                          imageStyle={{ borderRadius: 0 }}
                        />
                      </TouchableOpacity>


                      {
                        enquiryDetails.map((item, index) => (
                          <Text style={styles.detailsTitle}>Response for {item.EnquiryNo}</Text>

                        ))
                      }


                    </View>
                }
              </View>
              <ScrollView>
                <View>
                <Text style={{color:"#000",fontSize:20,marginTop:"5%",fontWeight:"600"}}>Fabric Quality : <Text style={{fontWeight:"400"}}>{FQ}</Text></Text>
                </View>
                <View style={styles.detailsHeaderContainer}>
                  <ScrollView horizontal>
                    <Text style={[styles.detailsHeaderText]}>Loom</Text>
                    <Text style={[styles.detailsHeaderText, { marginLeft: 60 }]}>Date Possible</Text>
                    <Text style={[styles.detailsHeaderText, { marginLeft: 50 }]}>Job Rate Exp</Text>

                  </ScrollView>
                </View>
                <View>
                  {
                    enquiryDetails.map((item, index) => (
                      <ScrollView key={index} horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View >
                          {/* Name Column */}

                          <TouchableOpacity style={[styles.detailsItemContainer, index % 2 === 0 ? styles.rowColor1 : styles.rowColor2]} onPress={() => handleLoomDetails(item)}>
                            <Text style={[styles.detailsItemText, styles.column1]}>{item.Name}</Text>

                            {/* Date Range Column */}
                            <View style={{ flexDirection: "column", marginLeft: 20 }}>
                              <Text style={[styles.detailsItemText, styles.column2]}>
                                {item.DatePossibleFrom.date.substring(0, 10)}
                              </Text>
                              <Text style={[styles.detailsItemText, styles.column2]}>
                                {item.DatePossibleTo.date.substring(0, 10)}
                              </Text>
                            </View>

                            {/* Job Rate Expected Column */}
                            <Text style={[styles.detailsItemText, styles.column3]}>{item.JobRateExp}</Text>

                            {/* Icon Button */}
                          </TouchableOpacity>
                        </View>
                      </ScrollView>
                    ))
                  }
                </View>

              </ScrollView>
            </View>
          ) : null}

          {
            enquiryDetailsmodal.map((item, index) => (
              <Modal
                animationType="slide"
                transparent={true}
                visible={showEnquiryForm}
                onRequestClose={() => setShowEnquiryForm(false)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => { setShowEnquiryForm(false) }}>
                      <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <View>
                      <Text style={{ fontWeight: "600", fontSize: 20, color: "#000", marginBottom: "10%" }}>Enquiry Details</Text>
                    </View>
                    <Text style={styles.modalText}>Enquiry No: {item.EnquiryNo}</Text>
                    <Text style={styles.modalText}>Enquiry Date: {item.EnquiryDate.date.substring(0, 10)}</Text>
                    <Text style={styles.modalText}>Fabric Quality: {item.FabricQuality}</Text>
                    <Text style={styles.modalText}>Fabric Length: {item.FabricLength}</Text>
                    <Text style={styles.modalText}>Booking From: {item.BookingFrom.date.substring(0, 10)}</Text>
                    <Text style={styles.modalText}>Booking To: {item.BookingTo.date.substring(0, 10)}</Text>
                    <Text style={styles.modalText}>Offered Job Rate: {item.OfferedJobRate}</Text>
                    <Text style={styles.modalText}>Delivery Date: {item.DeliveryDate.date.substring(0, 10)}</Text>
                  </View>
                </View>
              </Modal>
            ))
          }



          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
              setShowModal(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ justifyContent: "space-between", flexDirection: "row", width: "100%" }}>
                  <Text style={styles.modalTitle}>Details</Text>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require("../Images/cross.png")}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalText}>Enquiry No: {selectedData?.EnquiryNo}</Text>
                <Text style={styles.modalText}>Loom Possible To Assign: {selectedData?.LoomPossible}</Text>
                <Text style={styles.modalText}>Company Name: {selectedData?.Name}</Text>
                <Text style={styles.modalText}>Jobrate (In Paise): {selectedData?.JobRateExp}</Text>
                <Text style={styles.modalText}>From Date: {selectedData?.DatePossibleFrom.date.substring(0, 10)}</Text>
                <Text style={styles.modalText}>To Date: {selectedData?.DatePossibleTo.date.substring(0, 10)}</Text>
                <Text style={styles.modalText}>Email: {selectedData?.AppUserId}</Text>
                <Text style={styles.modalText}>Contact Number: {selectedData?.PrimaryContact}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => confirmEnquiry()}
                >
                  <Text style={styles.buttonText}>Confirm Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showConfirmModal}
            onRequestClose={() => {
              setShowConfirmModal(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Congratulations !!! {Name}</Text>
                <Text style={styles.modalText}>
                  Your order number {selectedData?.EnquiryId} of {selectedData?.LoomPossible} Looms is confirmed with {selectedData?.Name}.{`\n`}
                  with the job rate of {selectedData?.JobRateExp} paise {`\n`} from {selectedData?.DatePossibleFrom.date.substring(0, 10)} to {selectedData?.DatePossibleTo.date.substring(0, 10)}.{`\n`}
                  Please proceed for contract formation. Contact details of ({selectedData?.AppUserId}, {selectedData?.PrimaryContact}, {selectedData?.AppUserId})
                  Dalal/Agent Name & Contact No.
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose1]}
                  onPress={() => yesbutton2()}
                >
                  <Text style={[styles.textStyle1, { margin: -10 }]}>OKAY</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flatList: {
    width: width * 0.9,
    marginBottom: height * 0.02,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: width * 0.04,
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.02,
    borderRadius: width * 0.02,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: height * 0.005,
    },
    shadowOpacity: 0.23,
    shadowRadius: height * 0.005,
    elevation: 4,
    flexDirection: "row"
  },
  itemText: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    color: '#2c3e50',
  },
  detailsHeaderContainer: {
    width: width * 1,
    flexDirection: 'row',
    backgroundColor: '#003C43',
    marginBottom: height * 0.01,
    alignItems: 'center',
    height: height * 0.06,
    marginTop: "5%"
  },
  detailsHeaderText: {
    flex: 1,
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    paddingHorizontal: width * 0.02,
    width: width * 0.2
  },
  detailsItemContainer: {
    flexDirection: "row",
    alignItems: "center",  // Ensures vertical alignment of text and buttons
    paddingVertical: 10,   // Padding for better row spacing
    paddingHorizontal: 15, // Space on the left and right
  },
  rowColor1: {
    backgroundColor: "#f9f9f9", // Alternating row color 1
  },
  rowColor2: {
    backgroundColor: "#e0e0e0", // Alternating row color 2
  },
  detailsItemText: {
    fontSize: 16, // General text size
    color: "#333", // Text color
  },
  column1: {
    width: 120, // Fixed width for Name column
    paddingHorizontal: 10, // Padding for spacing
  },
  column2: {
    width: 160, // Fixed width for Date columns
    paddingHorizontal: 10, // Padding for spacing
  },
  column3: {
    width: 100, // Fixed width for JobRate column
    paddingHorizontal: 10, // Padding for spacing
  },
  iconButton: {
    marginLeft: "auto", // Align the button to the right
    paddingHorizontal: 10, // Space for button
    paddingVertical: 5,
  },


  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "500",
    marginTop: "7%",
    color: "#000"
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    width: "100%"
  },
  detailsTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    paddingTop: height * -0.01,
    marginTop: height * 0.012,
    marginBottom: height * 0.01,
    color: '#fff',
    marginLeft: "25%",
    height: height * 0.035,
    width: width * 1
  },
  rowColor1: {
    backgroundColor: '#f9f9f9',
  },
  rowColor2: {
    backgroundColor: '#ffffff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  container: {
    backgroundColor: '#F5FCFF',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 60,
  },
  dateColumn: {
    flexDirection: "column",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
    color: "#000",
    fontFamily: 'Courier',
  },
  backButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: '#0909ff',
    padding: 8,
    borderRadius: 4,
    marginLeft: "-20%",
    marginRight: "15%"
  },
  confirmedButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Courier',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    marginBottom: 15,
    fontWeight: '600',
    color: "#000",
    fontSize: 20,
    fontFamily: 'Courier',
  },

  button: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonClose1: {
    backgroundColor: "green",
    margin: 20,
    width: 200,
    height: 30,
    alignItems: 'center',
  },
  textStyle1: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Courier',
  },
});

export default ConfirmEnquires;