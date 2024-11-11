import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity, TextInput, Image, RefreshControl, Platform, ImageBackground, Modal, Animated, Easing, Alert } from 'react-native';
import axios from 'axios';
import DatePicker from '@react-native-community/datetimepicker'; // Import the DatePicker component
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const JobWorkEnquires = ({ navigation }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showED, setShowED] = useState(false);
  const [showE, setShowE] = useState(true);
  const [loomPossible, setLoomPossible] = useState('');
  const [counterOffer, setCounterOffer] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false); // State for showing From DatePicker
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false); // State for showing To DatePicker
  const [AppUserId, setAppUserId] = useState("")
  const [Name, setName] = useState('')
  const [show, setShow] = useState(true);
  const [Id, setId] = useState("");
  const [LoomOrTrader, setLoomOrTrader] = useState("");
  const [mobileno, setMobileNo] = useState("");
  const [gstno, setGSTNO] = useState("")

  const tableHead = ['Enquiry No', 'Date', 'Party Name'];



  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchEnquiries();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  const getData = async () => {
    const Email = await AsyncStorage.getItem("AppUserId");
    const Name = await AsyncStorage.getItem("Name");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
    const Id = await AsyncStorage.getItem("Id")
    const PrimaryContact = await AsyncStorage.getItem("PrimaryContact")
    const GSTNumber = await AsyncStorage.getItem("GSTNumber")


    setAppUserId(Email)
    setName(Name)
    setLoomOrTrader(LoomOrTrader)
    setId(Id)
    setMobileNo(PrimaryContact)
    setGSTNO(GSTNumber)
  }


  useEffect(() => {
    getData();
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get('https://textileapp.microtechsolutions.co.in/php/getenquirybymachine.php?LoomTraderId=' + await AsyncStorage.getItem("Id"));
      // Sort the enquiries by Enquiry ID in descending order
      const sortedEnquiries = response.data.sort((a, b) => b.EnquiryId - a.EnquiryId);
      setEnquiries(sortedEnquiries);
    } catch (error) {
      Alert.alert('Error fetching data');
    }
  };

  const fetchEnquiryDetails = async (enquiryId) => {
    try {
      const response = await axios.get(`https://textileapp.microtechsolutions.co.in/php/getjoin.php?EnquiryId=${enquiryId}`);
      setSelectedEnquiry(response.data[0]);
      response.data.map((item) => {
        console.log("FQ = ", item.FabricQuality)
        console.log("Image", item.Photopath)
        calculatePPI(item.FabricQuality)
      })
    } catch (error) {
      alert('Error fetching enquiry details');
    }
    setShowED(true);
    setShowE(false);

  };

  const formatDate = (date) => {
    // Format date as YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  const handleFromDateChange = (event, selectedDate) => {
    console.log("Selected date for fromDate:", selectedDate);
    setFromDatePickerVisible(Platform.OS === 'ios');
    if (selectedDate) {
      console.log("Updating fromDate state:", formatDate(selectedDate));
      setFromDate(formatDate(selectedDate));
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    console.log("Selected date for toDate:", selectedDate);
    setToDatePickerVisible(Platform.OS === 'ios');
    if (selectedDate) {
      console.log("Updating toDate state:", formatDate(selectedDate));
      setToDate(formatDate(selectedDate));
    }
  };

  const [loomdata, setLoomdata] = useState([])


  const postLoomData = async () => {

    console.log(Id, selectedEnquiry.MachineType, selectedEnquiry.Width, selectedEnquiry.RPM, selectedEnquiry.SheddingType, selectedEnquiry.NoofFrame, selectedEnquiry.NoofFeedero, selectedEnquiry.SelvageJacquard, selectedEnquiry.TopBeam, selectedEnquiry.Cramming, selectedEnquiry.LenoDesignEquipment, fromDate, toDate)


    console.log(fromDate, toDate)
    console.log("ID = ", Id)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://textileapp.microtechsolutions.co.in/php/postloom.php',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'LoomDetailId': Id,
        'MachineType': selectedEnquiry.MachineType,
        'Width': selectedEnquiry.Width,
        'RPM': selectedEnquiry.RPM,
        'SheddingType': selectedEnquiry.SheddingType,
        'NoofFrames': selectedEnquiry.NoofFrame,
        'NoofFeeders': selectedEnquiry.NoofFeedero,
        'SelvageJacquard': selectedEnquiry.SelvageJacquard,
        'TopBeam': selectedEnquiry.TopBeam,
        'Cramming': selectedEnquiry.Cramming,
        'LenoDesignEquipment': selectedEnquiry.LenoDesignEquipment,
        'FromDate': fromDate,
        'ToDate': toDate
      }
    };

    axios.request(config)
      .then(response => {
        console.log("Looms Available = ", response.data)
        let temp = JSON.stringify(response.data);
        setLoomdata(response.data)
      })
      .catch((error) => {
        console.log(error);
        setLoomdata(null)
      });
  };




  const CheckLoomAvailability = () => {
    console.log(updatedDateFrom, updatedDateTo)
    console.log("ID = ", Id)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://textileapp.microtechsolutions.co.in/php/postloom.php',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'LoomDetailId': Id,
        'MachineType': selectedEnquiry.MachineType,
        'Width': selectedEnquiry.Width,
        'RPM': selectedEnquiry.RPM,
        'SheddingType': selectedEnquiry.SheddingType,
        'NoofFrames': selectedEnquiry.NoofFrame,
        'NoofFeeders': selectedEnquiry.NoofFeedero,
        'SelvageJacquard': selectedEnquiry.SelvageJacquard,
        'TopBeam': selectedEnquiry.TopBeam,
        'Cramming': selectedEnquiry.Cramming,
        'LenoDesignEquipment': selectedEnquiry.LenoDesignEquipment,
        'FromDate': fromDate,
        'ToDate': toDate
      }
    };

    axios.request(config)
      .then(response => {
        console.log("Looms Available = ", response.data)
        let temp = JSON.stringify(response.data);
        setLoomdata(response.data)
      })
      .catch((error) => {
        console.log(error);
        setLoomdata(null)
      });
  }

  const EnquiryConfirm = () => {
    if (!fromDate) {
      Alert.alert("Please Select The Dates Properly")
    } else if (!toDate) {
      Alert.alert("Please Select The Dates Properly")
    } else if (!loomPossible) {
      Alert.alert("Please Enter The Looms Possible To Assign")
    } else if (!counterOffer) {
      Alert.alert("Please Enter The Value Of Counter Offer")
    } else {
      //const qs = require('qs');
      let data = qs.stringify({
        'EnquiryId': selectedEnquiry.EnquiryId,
        'LoomTraderId': Id,
        'DatePossibleFrom': fromDate,
        'DatePossibleTo': toDate,
        'JobRateExp': counterOffer,
        'Status': false,
        'LoomPossible': loomPossible,
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://textileapp.microtechsolutions.co.in/php/postenquiryconfirm.php',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          'EnquiryId': selectedEnquiry.EnquiryId,
          'LoomTraderId': Id,
          'DatePossibleFrom': fromDate,
          'DatePossibleTo': toDate,
          'JobRateExp': counterOffer,
          'Status': false,
          'LoomPossible': loomPossible,
        }
      };

      axios.request(config)
        .then(response => {
          console.log(fromDate, toDate, loomPossible, counterOffer, selectedEnquiry.EnquiryId, Id)
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error);
        });
      Alert.alert("Data Submitted Successfully")
      setShowED(false);
      setShowE(true)
      setModalVisible2(false)
    }
  }





  const [showlooms, setShowLooms] = useState(false)


  const calculatePPI = (fabricQuality) => {
    // Assuming fabric quality is in the format: EPI*PPI/WC*WC:Width
    const parts = fabricQuality.split('*');
    if (parts.length >= 2) {
      // Extract PPI from the second part of the string
      const secondPart = parts[1].split('/');
      if (secondPart.length >= 2) {
        return secondPart[0];
      }
    }
    return 'N/A'; // Return N/A if PPI cannot be extracted
  };


  const renderHeader = () => {
    return (
      <View style={styles.header}>
        {tableHead.map((item, index) => (
          <Text key={index} style={[styles.headerText, { width: index === 0 ? width * 0.3 : width * 0.35 }]}>
            {item}
          </Text>
        ))}
      </View>
    );
  };

  const NotInterested = () => {
    setShowE(true);
    setShowED(false)
    setModalVisible3(false)
  }

  const handleBlockPress = (enquiries) => {
    setSelectedLoom(enquiries);
    setModalVisible(true);
    console.log(selectedLoom)
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [selectedLoom, setSelectedLoom] = useState(null);


  const renderRows = () => {
    return enquiries.map((enquiry, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
        onPress={() => {
          fetchEnquiryDetails(enquiry.EnquiryId);
        }}>
        <Text style={[styles.text, styles.cell, { width: width * 0.25 }]}>{enquiry.EnquiryNo}</Text>
        <Text style={[styles.text, styles.cell, { width: width * 0.43 }]}>{enquiry.EnquiryDate.date.substring(0, 10)}</Text>
        <Text style={[styles.text, styles.cell, { width: width * 0.20 }]}>{enquiry.Name}</Text>
        <TouchableOpacity style={{ width: width * 0.10 }} onPress={() => handleBlockPress(enquiry)}>
          <Icon name="information-circle" size={22} color="grey" />
        </TouchableOpacity>

      </TouchableOpacity>
    ));
  };

  const renderEnquiryDetails = () => {
    if (!selectedEnquiry) return null;

    const isFieldNotProvided = (field) => field === 0 || field === undefined || field === null || field === '';

    return (
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Enquiry No</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.EnquiryNo) ? "Field not provided" : selectedEnquiry.EnquiryNo}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Enquiry Date</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.EnquiryDate.date) ? "Field not provided" : selectedEnquiry.EnquiryDate.date.substring(0, 10)}</Text>
          </View>
        </View>
        {/* <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Booking From</Text>
            <Text style={styles.detailValue">{isFieldNotProvided(selectedEnquiry.BookingFrom.date) ? "Field not provided" : selectedEnquiry.BookingFrom.date.substring(0, 10)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Booking To</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.BookingTo.date) ? "Field not provided" : selectedEnquiry.BookingTo.date.substring(0, 10)}</Text>
          </View>
        </View> */}
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Fabric Quality</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.FabricQuality) ? "Field not provided" : selectedEnquiry.FabricQuality}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Fabric Length</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.FabricLength) ? "Field not provided" : selectedEnquiry.FabricLength}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Loom Required</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.LoomNo) ? "Field not provided" : selectedEnquiry.LoomNo}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Agent Name</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.AgentName) ? "Field not provided" : selectedEnquiry.AgentName}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Loom Type</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.MachineType) ? "Field not provided" : selectedEnquiry.MachineType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Loom Width</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.Width) ? "Field not provided" : selectedEnquiry.Width}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>RPM</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.RPM) ? "Field not provided" : selectedEnquiry.RPM}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Shedding Type</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.SheddingType) ? "Field not provided" : selectedEnquiry.SheddingType}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>No of Frame</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.NoofFrame) ? "Field not provided" : selectedEnquiry.NoofFrame}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>No of Feeder</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.NoofFeedero) ? "Field not provided" : selectedEnquiry.NoofFeedero}</Text>
          </View>
        </View>
        <View style={styles.detailGroup}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>On Table Fabric Width</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.FabricWidth) ? "Field not provided" : selectedEnquiry.FabricWidth}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Delivery Date</Text>
            <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.DeliveryDate.date) ? "Field not provided" : selectedEnquiry.DeliveryDate.date.substring(0, 10)}</Text>
          </View>
        </View>
        <View style={[styles.detailItem, { marginLeft: "10%" }]}>
          <Text style={styles.detailLabel}>Description</Text>
          <Text style={styles.detailValue}>{isFieldNotProvided(selectedEnquiry.Description) ? "Field not provided" : selectedEnquiry.Description}</Text>
        </View>
        <View style={[styles.detailItem, { marginLeft: "10%", margin: "5%" }]}>
          <Text style={styles.detailLabel}>Design </Text>
          {
            selectedEnquiry.Photopath ? <Image
              source={{ uri: selectedEnquiry.Photopath }}
              style={{
                marginTop: 10,
                width: 200,
                height: 200,
              }}
            /> : <Text style={{ color: "orange", fontSize: 17, marginTop: "3%", fontWeight: "500" }}>! Design not provided</Text>
          }
        </View>

        <View style={{ flex: 1, justifyContent: "center", width: width * 0.99, marginLeft: width * -0.05 }}>
          <View style={[styles.detailGroup, { flexDirection: "column", borderWidth: 1.5, borderColor: "#000", marginRight: "6%" }]}>
            <Text style={{ color: "#003C43", fontSize: 20, fontWeight: "600", margin: "5%" }}>Other Loom Attachments</Text>

            {
              selectedEnquiry.SelvageJacquard === 0 && selectedEnquiry.TopBeam === 0 && selectedEnquiry.Cramming === 0 && selectedEnquiry.LenoDesignEquipment === 0 ?
                <Text style={{ color: "orange", fontSize: 17, marginTop: "3%", fontWeight: "500", margin: "5%" }}>! Other Loom Attachments not provided</Text> : null

            }

            {
              selectedEnquiry.SelvageJacquard === 1 ? (
                <View style={[styles.detailItem, { flexDirection: "row", marginLeft: "5%", marginBottom: "5%", width: width * 0.7 }]}>
                  <Text style={styles.detailLabel}>Selvadge Jacquard</Text>
                  <Text style={[styles.detailValue, { color: '#007bff', marginLeft: width * 0.10 }]}>Required</Text>
                </View>
              ) : null
            }
            {
              selectedEnquiry.TopBeam === 1 ? (
                <View style={[styles.detailItem, { flexDirection: "row", marginLeft: "5%", marginBottom: "5%", width: width * 0.7 }]}>
                  <Text style={styles.detailLabel}>Top Beam</Text>
                  <Text style={[styles.detailValue, { color: '#007bff', marginLeft: width * 0.10 }]}>Required</Text>
                </View>
              ) : null
            }
            {
              selectedEnquiry.Cramming === 1 ? (
                <View style={[styles.detailItem, { flexDirection: "row", marginLeft: "5%", marginBottom: "5%", width: width * 0.7 }]}>
                  <Text style={styles.detailLabel}>Cramming</Text>
                  <Text style={[styles.detailValue, { color: '#007bff', marginLeft: width * 0.10 }]}>Required</Text>
                </View>
              ) : null
            }
            {
              selectedEnquiry.LenoDesignEquipment === 1 ? (
                <View style={[styles.detailItem, { flexDirection: "row", marginLeft: "5%", marginBottom: "5%", width: width * 0.7 }]}>
                  <Text style={styles.detailLabel}>Leno Design Equipment</Text>
                  <Text style={[styles.detailValue, { color: '#007bff', marginLeft: width * 0.10 }]}>Required</Text>
                </View>
              ) : null
            }

          </View>
        </View>
        <View style={[styles.detailItem, { borderWidth: 1, marginTop: "6%", margin: "3%", width: width * 0.90, }]}>
          <Text style={{ color: "#003C43", fontSize: 18, fontWeight: "600", margin: "5%", width: width * 0.60 }}>Check Loom Availability</Text>

          <View style={{ marginHorizontal: "5%", marginVertical: "5%" }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flexDirection: "column", width: "100%" }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "grey" }}>From Date</Text>
                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    style={[styles.textInput, { borderWidth: 1, width: width * 0.60, borderColor: "#000", height: height * 0.06 }]}
                    value={fromDate}
                    onChangeText={setFromDate}
                    keyboardType="numeric"
                    placeholderTextColor={'#000'}
                    placeholder='YYYY-MM-DD'
                  />
                  <TouchableOpacity onPress={() => setFromDatePickerVisible(true)}>
                    <ImageBackground
                      source={require('../Images/calendar.png')}
                      style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#006A4E", marginLeft: "20%", marginTop: "2%" }}
                      imageStyle={{ borderRadius: 0 }}
                    />

                  </TouchableOpacity>
                </View>
                {fromDatePickerVisible && (
                  <DatePicker
                    value={fromDate ? new Date(fromDate) : new Date()} // Initialize with fromDate state value, default to current date if fromDate is not set
                    mode="date"
                    display="default"
                    onChange={handleFromDateChange}
                  />
                )}
              </View>

            </View>
            <View style={{ flexDirection: "column", marginTop: "5%" }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "grey" }}>To Date</Text>

              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={[styles.textInput, { borderWidth: 1, width: width * 0.60, borderColor: "#000", height: height * 0.06 }]}
                  value={toDate}
                  onChangeText={setToDate}
                  keyboardType="numeric"
                  placeholderTextColor={'#000'}
                  placeholder='YYYY-MM-DD'
                />
                <TouchableOpacity onPress={() => setToDatePickerVisible(true)}>
                  <ImageBackground
                    source={require('../Images/calendar.png')}
                    style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#006A4E", marginLeft: "20%", marginTop: "2%" }}
                    imageStyle={{ borderRadius: 0 }}
                  />
                </TouchableOpacity>
              </View>
              {toDatePickerVisible && (
                <DatePicker
                  value={toDate ? new Date(toDate) : new Date()} // Initialize with toDate state value, default to current date if toDate is not set
                  mode="date"
                  display="default"
                  onChange={handleToDateChange}
                />
              )}
            </View>
            <TouchableOpacity style={styles.checkAvailabilityButton} onPress={() => { postLoomData(); setShowLooms(true) }}>
              <Text style={styles.checkAvailabilityText}>Check Availability</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'column', marginTop: 20, width: "50%", marginBottom: 20 }}>
              <Text style={{ fontSize: 16, color: "#000" }}>Available Loom No : </Text>

              {
                showlooms ?

                  loomdata.length ?
                    loomdata.map((item, index) => (
                      <View key={index} >
                        <Text style={{ fontSize: 17, fontWeight: 500, color: "#000" }}> {item.LoomNo} </Text>
                      </View>
                    )) : <Text style={{ fontSize: 17, fontWeight: 500, color: "#000" }}> No Loom Available </Text>

                  : null}
            </View>
          </View>
        </View>
        <View style={[styles.detailItem, { marginTop: "7%", width: width * 0.5, marginLeft: 15 }]}>
          <Text style={styles.detailLabel}>Loom Possible To Assign</Text>
          <TextInput
            style={[styles.textInput, { borderWidth: 1, borderColor: "#000", marginTop: "5%", width: width * 0.7, height: height * 0.05, }]}
            value={loomPossible}
            onChangeText={setLoomPossible}
            keyboardType="numeric"
            placeholderTextColor={"grey"}
            placeholder='Loom possible To Assign'
          />
        </View>

        <View style={[styles.detailItem, { marginTop: "7%", marginLeft: 15 }]}>
          <Text style={styles.detailLabel}>Offered Job Rate:</Text>
          <Text style={styles.detailValue}>{selectedEnquiry.OfferedJobRate}</Text>
        </View>

        <View style={[styles.detailItem, { marginTop: "7%", width: "100%", marginLeft: 15 }]}>
          <Text style={styles.detailLabel}>Send Counter Offer</Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={[styles.textInput, { borderWidth: 1, borderColor: "#000", width: width * 0.6, height: height * 0.05, marginTop: "5%" }]}
              value={counterOffer}
              onChangeText={setCounterOffer}
              keyboardType="numeric"
              placeholderTextColor={"grey"}
              placeholder='counterOffer'
            />
            <Text style={[styles.detailLabel, { marginLeft: "5%", marginTop: "5%" }]}>In Paise</Text>

          </View>
        </View>

        <View style={styles.buttonContainer}>

          <TouchableOpacity
            style={[styles.checkAvailabilityButton, { backgroundColor: "#135D66", borderWidth: 0, height: height * 0.06, width: width * 0.45 }]}
            onPress={() => { setModalVisible2(true) }}
          >
            <Text style={styles.checkAvailabilityText1}> Submit </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.checkAvailabilityButton, { backgroundColor: "#FF7722", borderColor: '#FF7722', height: height * 0.06, width: width * 0.45 }]}
            onPress={() => setModalVisible3(true)}
          >
            <Text style={styles.checkAvailabilityText1}> Not Interested </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    );
  };

  return (

    <View>

      <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 100 }}>
        {
          showE ?
            <TouchableOpacity style={{ padding: "2%" ,paddingTop:45}}
              onPress={() => navigation.openDrawer()}
            >
              <Image
                source={require("../Images/drawer1.png")}
                style={{ width: 28, height: 22, marginLeft: 10, padding: "5%" }}

              />
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ padding: "2%",paddingTop:45 }} onPress={() => { setShowE(true); setShowED(false); setLoomdata([]) }}>
              <ImageBackground
                source={require("../Images/back.png")}
                style={{ width: 32, height: 32, alignSelf: 'flex-start', marginLeft: 10, padding: "5%",}}
                imageStyle={{ borderRadius: 0 }}
              />
            </TouchableOpacity>
        }

        <View style={{ flex: 0.9, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, color: "white", fontWeight: 500, paddingTop:55 }}> Job Enquiry </Text>
        </View>

      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {showE ? (
          <>
            {renderHeader()}
            <ScrollView style={styles.dataWrapper}>{renderRows()}</ScrollView>
          </>

        ) : null}
        {showED ? (
          <View style={styles.dataWrapper}>{renderEnquiryDetails()}</View>

        ) : null}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            {selectedLoom && (
              <View style={{ margin: "10%" }}>
                <Text style={styles.modalText}>Loom Details</Text>
                <View style={styles.detailContainer}>
                  <Text style={styles.detailTitle}>Owner name:</Text>
                  <Text style={[styles.detailText, { marginLeft: "5%" }]}>{selectedLoom.OwnerName}</Text>
                </View>
                <View style={styles.detailContainer}>
                  <Text style={styles.detailTitle}>Address:</Text>
                  <Text style={[styles.detailText, { marginLeft: "5%" }]}>{selectedLoom.Address}</Text>
                </View>
                <View style={styles.detailContainer}>
                  <Text style={styles.detailTitle}>City:</Text>
                  <Text style={[styles.detailText, { marginLeft: "5%" }]}>{selectedLoom.City}</Text>
                </View>
                <View style={styles.detailContainer}>
                  <Text style={styles.detailTitle}>Pincode:</Text>
                  <Text style={[styles.detailText, { marginLeft: "5%" }]}>{selectedLoom.Pincode}</Text>
                </View>
              </View>
            )}

          </View>
        </View>
      </Modal>


      <Modal
        visible={modalVisible2}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible2(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible2(false)}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={{ color: "#003C43", fontSize: 20, fontWeight: "600", marginTop: "5%" }}>Are You Sure To Submit The Request</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "80%", marginTop: "10%" }}>
              <TouchableOpacity style={[styles.backButton, { backgroundColor: "#003C43", width: "30%", justifyContent: "center", alignItems: "center" }]} onPress={() => EnquiryConfirm()}>
                <Text style={styles.backButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.backButton, { width: "30%", justifyContent: "center", alignItems: "center" }]} onPress={() => setModalVisible2(false)}>
                <Text style={styles.backButtonText}>NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <Modal
        visible={modalVisible3}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible3(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible3(false)}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={{ color: "#003C43", fontSize: 20, fontWeight: "600", marginTop: "5%" }}>Are You Sure To Cancel</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "80%", marginTop: "10%" }}>
              <TouchableOpacity style={[styles.backButton, { backgroundColor: "#003C43", width: "30%", justifyContent: "center", alignItems: "center" }]} onPress={() => NotInterested()}>
                <Text style={styles.backButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.backButton, { width: "30%", justifyContent: "center", alignItems: "center" }]} onPress={() => setModalVisible3(false)}>
                <Text style={styles.backButtonText}>NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 16 },
  header: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#007bff', paddingBottom: 10, marginBottom: 10 },
  headerText: { fontWeight: 'bold', textAlign: 'center', color: '#333', fontSize: 16, marginTop: "5%" },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingTop: 10, paddingBottom: 10 },
  rowEven: { backgroundColor: '#EAEEE9' },
  rowOdd: { backgroundColor: '#fff' },
  text: { textAlign: 'center', color: '#333', fontSize: 14 },
  cell: { padding: 5 },
  dataWrapper: { marginTop: 10 },
  detailsContainer: { paddingHorizontal: 5, paddingTop: 20, backgroundColor: 'white', flex: 1 },
  detailGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginLeft: "10%" },
  detailItem: { flex: 1, marginTop: "2%" },
  detailLabel: { fontWeight: 'bold', color: '#555', fontSize: 16 },
  detailValue: { color: '#333', fontSize: 16 },
  textInput: { borderColor: '#ccc', paddingLeft: 10, fontSize: 16, borderRadius: 5, height: 40, color: "#000" },
  buttonContainer: { flexDirection: 'row', justifyContent: "space-evenly", marginTop: 20, marginBottom: "40%" },
  checkAvailabilityButton: { backgroundColor: '#003C43', padding: height * 0.01, alignItems: 'center', borderRadius: 10, marginTop: 20, marginBottom: 10, borderColor: '#003C43', borderWidth: 2, width: width * 0.80, height: height * 0.06 },
  checkAvailabilityText: { color: '#fff', fontSize: 20, },
  checkAvailabilityText1: { color: '#fff', fontSize: 20, fontWeight: '500' },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
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
    fontSize: 22,
    marginBottom: "15%",
    color: "#000",
    fontWeight: "600",

  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    width: "100%"
  },
  detailTitle: {
    color: "#000",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 15
  },
  detailText: {
    color: '#000',
    fontWeight: "400",
    fontSize: 18
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
});

export default JobWorkEnquires;
