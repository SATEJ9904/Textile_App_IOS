import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Animated,
  RefreshControl,
  ImageBackground,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';


const LoomBooking = ({ navigation, route }) => {

  const [loading, setLoading] = useState(true);
  const [loomNumbers, setLoomNumbers] = useState([]);
  const [selectedLoom, setSelectedLoom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [enquiryDetails, setEnquiryDetails] = useState(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [OrderNo1, setOrderNo] = useState('');
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [isBookingModalVisible2, setIsBookingModalVisible2] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0))[0];
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [bookedLoomNo, setBookedLoomNo] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartPickerVisible, setIsStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setIsEndPickerVisible] = useState(false);



  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setIsStartPickerVisible(false);
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setIsEndPickerVisible(false);
    setEndDate(currentDate);
  };

  // Helper function to format the date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (Loom) => {
console.log("Id=",Loom.Id,formatDate(startDate),formatDate(endDate))

    const formdata = new FormData();
    formdata.append("Fromdate",formatDate(startDate) );
    formdata.append("Todate",formatDate(endDate));
    formdata.append("LoomDetailId", Loom.Id);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/checkbookdate.php", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        if (result === 'Available') {
          Alert.alert("Dates Matched Proceeding To Book Your Loom")
          navigation.navigate("BookLoomForm", { LoomDetailId: Loom.Id, OrderNo: OrderNo,FromDate: formatDate(startDate),ToDate:formatDate(endDate) })
        } else {
          Alert.alert("Dates Not Matched")
        }
      })
      .catch((error) => console.error(error));
     setIsBookingModalVisible2(false);
  };


  const OrderNo = route.params?.OrderNo || OrderNo1;
  const fetchData = async () => {
    try {
      const id = await AsyncStorage.getItem("Id");
      const today = new Date().toISOString().substring(0, 10);

      const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/todayloom.php?LoomTraderId=${id}&Todaydate=${today}`);
      const data = await response.json();
      setLoomNumbers(data);
      console.log(data)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };



  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    console.log("refreshed")
    setBookedLoomNo(null)
  }, []);

  useEffect(() => {
    const filterLoomNumbers = (data) => {
      return data.map(loom => {
        if (loom.bookedToDate && loom.LoomOrderId && loom.KnottingOrderId) {
          return {
            ...loom,
            Available: 1 // Mark as available if no LoomOrderId or KnottingOrderId
          };
        }
        return loom;
      });
    };

    const fetchData = async () => {
      try {
        const id = await AsyncStorage.getItem("Id");
        const today = new Date().toISOString().substring(0, 10);

        const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/todayloom.php?LoomTraderId=${id}&Todaydate=${today}`);
        const data = await response.json();
        const filteredData = filterLoomNumbers(data);
        setLoomNumbers(filteredData);
        console.log(filteredData)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBlockPress = (loom) => {
    setSelectedLoom(loom);
    setModalVisible(true);
  };



  const handleEnquirySubmit = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      const response = await fetch("https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=LoomOrder&Colname=OrderNo&Colvalue=" + OrderNo, requestOptions);
      const result = await response.json(); // Parse the JSON response
      console.log(result); // Log the result to verify

      if (result.length > 0) {
        setEnquiryDetails(result[0]); // Set the first object in the result array
        setShowEnquiryForm(false);
      } else {
        setErrorMessage("No details found for the given Order No");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching enquiry details");
    }
  };

  const postLoomOrder = async () => {
    console.log("Data = ", selectedLoom?.BookingId, enquiryDetails.LoomOrderId, enquiryDetails.BookedDateFrom?.date?.substring(0, 10), enquiryDetails.BookedDateTo?.date?.substring(0, 10), selectedLoom?.Id, selectedLoom?.LoomNo);

    const bookedToDate = enquiryDetails.BookedDateTo?.date?.substring(0, 10);

    if (bookedToDate) {
      const date = new Date(bookedToDate);
      date.setMonth(date.getMonth() + 4);
      const loomAvailableTo = date.toISOString().substring(0, 10); // format the date as YYYY-MM-DD

      const formdata = new FormData();
      formdata.append("BookingId", selectedLoom?.BookingId);
      formdata.append("OrderNoId", enquiryDetails.LoomOrderId);
      formdata.append("BookedFromDate", enquiryDetails.BookedDateFrom?.date?.substring(0, 10));
      formdata.append("BookedToDate", bookedToDate);
      formdata.append("LoomAvailableTo", loomAvailableTo);

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };

      fetch("https://textileapp.microtechsolutions.co.in/php/updateloomavailability.php", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } else {
      console.error('BookedToDate is not defined');
    }
  };

  const handleBookLoom = () => {
    console.log("Dates = ", selectedLoom?.BookedDateTo?.date?.substring(0, 10) + "  " + enquiryDetails?.BookedDateFrom?.date?.substring(0, 10))

    if (selectedLoom?.BookedDateTo?.date?.substring(0, 10) && enquiryDetails?.BookedDateFrom?.date?.substring(0, 10)) {
      const loomBookedDateTo = new Date(selectedLoom?.BookedDateTo?.date?.substring(0, 10));
      const enquiryBookedDateTo = new Date(enquiryDetails?.BookedDateFrom?.date?.substring(0, 10));

      if (enquiryBookedDateTo > loomBookedDateTo) {
        Alert.alert("Can book loom for this order");

        // performLoomBooking();
      } else {
        Alert.alert("Cannot book loom for this order");
      }
    } else {
      performLoomBooking();
    }
  };

  const performLoomBooking = () => {
    setIsBookingModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsBookingModalVisible(false);
        setSelectedLoom(null);
        setEnquiryDetails(null);
        setOrderNo('');
        fetchData();
      });
    }, 3000);
    postLoomOrder();
    setBookedLoomNo(selectedLoom?.LoomNo);
  };

  const [modalshown,setModalShown]=useState(null)

  const handleBlockPress1 = (loom) => {
    // 
    setSelectedLoom(loom)
    setIsBookingModalVisible2(true)
  };

  const handleCloseModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      setModalVisible2(false);
      setSelectedLoom(null);
    });
  };

  const handleCloseModal2 = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      setShowEnquiryForm(true);
      setIsModalVisible(false);
      setSelectedLoom(null);
    });
  };

  const renderBlocks = () => {
    return loomNumbers.map((loom, index) => (
      <View
        key={index}
        style={[
          styles.block,
          loom.Available !== 1 && styles.unAvailableBlock,
          loom.LoomNo === bookedLoomNo && styles.bookedBlock
        ]}
      >
        <View style={styles.blockTop}>
          <Text
            style={[
              styles.blockText,
              loom.Available !== 1 && styles.unAvailableBlockText
            ]}
          >
            {loom.LoomNo}
          </Text>
          <TouchableOpacity onPress={() => handleBlockPress(loom)}>
            <Icon name="information-circle" size={22} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.blockBottom}>
          {loom.BookedToDate != null ? (
            <View>
              {(loom.LoomOrderId == null && loom.KnottingOrderId == null) ? (
                <View>
                  <Text style={styles.detailText1}>Booked</Text>
                  <Text style={styles.detailText1}>From: {loom.PartyName}</Text>
                  <Text style={styles.detailText1}>To: {loom.BookedToDate ? loom.BookedToDate.date.substring(0, 10) : 'N/A'}</Text>
                </View>
              ) : (
                // <Text style={styles.detailText1}>Available</Text>
                <View>
                  <Text style={styles.detailText1}>OR: {loom.OrderNo}</Text>
                  <Text style={styles.detailText1}>Party: {loom.PartyName}</Text>
                  <Text style={styles.detailText1}>To: {loom.BookedToDate ? loom.BookedToDate.date.substring(0, 10) : 'N/A'}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.bookButton} onPress={() => handleBlockPress1(loom)}>
                <Text style={styles.bookButtonText}>Check Dates</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={{ color: "#fff", fontSize: 15 }}>Available</Text>
              <TouchableOpacity style={styles.bookButton} onPress={() => handleBlockPress1(loom)}>
                <Text style={styles.bookButtonText}>Check Dates </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ padding: "1%",paddingTop:45 }} onPress={() => navigation.openDrawer()}>
          <ImageBackground
            source={require("../Images/drawer.png")}
            style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003c43", marginTop: 0, marginRight: 0, marginLeft: 10 }}
            imageStyle={{ borderRadius: 0 }}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Loom Booking</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.blocksContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {renderBlocks()}
        </ScrollView>
      )}
      <Modal
        visible={modalVisible2}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Loom Details</Text>
            {selectedLoom && (
              <>
                <Text style={styles.modalText}>Loom No: {selectedLoom.LoomNo}</Text>
                <Text style={styles.modalText}>Job Rate: {selectedLoom.JobRate}</Text>
                <Text style={styles.modalText}>
                  Booked Date To: {selectedLoom.BookedDateTo ? selectedLoom.BookedDateTo.date.substring(0, 10) : 'N/A'}
                </Text>
              </>
            )}
            <TouchableOpacity onPress={() => handleCloseModal()} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEnquiryForm}
        onRequestClose={() => setShowEnquiryForm(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => { setShowEnquiryForm(false); setIsModalVisible(true); }}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>Get Order No</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Order No"
              placeholderTextColor={'grey'}
              value={OrderNo}
              onChangeText={setOrderNo}
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <TouchableOpacity style={styles.submitButton} onPress={() => handleEnquirySubmit()}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {enquiryDetails && (
        <View style={styles.enquiryDetailsContainer}>
          <View style={{ flexDirection: "row", marginVertical: "5%" }}>
            <Text style={[styles.detailText, { marginRight: "45%", color: "#000", textDecorationLine: "underline", fontWeight: "500" }]}>
              Loom No: {selectedLoom?.LoomNo}
            </Text>
            <TouchableOpacity style={styles.backButton} onPress={() => setEnquiryDetails(null)}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.detailHeader}>Order Details</Text>
          <Text style={[styles.detailText, { marginLeft: "5%" }]}>OrderNo: {enquiryDetails.OrderNo}</Text>
          <Text style={[styles.detailText, { marginLeft: "5%" }]}>PartyName: {enquiryDetails.PartyName}</Text>
          <Text style={[styles.detailText, { marginLeft: "5%" }]}>JobRate: {enquiryDetails.JobRate}</Text>
          <Text style={[styles.detailText, { marginLeft: "5%" }]}>Orderdate: {enquiryDetails.Orderdate?.date?.substring(0, 10) ?? 'N/A'}</Text>
          <Text style={[styles.detailText, { marginLeft: "5%" }]}>BookedDateFrom: {enquiryDetails.BookedDateFrom?.date?.substring(0, 10) ?? 'N/A'}</Text>
          <Text style={[styles.detailText, { marginLeft: "5%" }]}>BookedDateTo: {enquiryDetails.BookedDateTo?.date?.substring(0, 10) ?? 'N/A'}</Text>
          <TouchableOpacity style={styles.bookButton} onPress={() => { handleBookLoom(); setBookedLoomNo(selectedLoom?.LoomNo) }}>
            <Text style={styles.bookButtonText}>Book Loom</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end", width: "100%" }}>
              <TouchableOpacity style={styles.backButton1} onPress={() => {
                setModalVisible(false);
                navigation.navigate("EditLooms", { selectedLoom });
              }}>
                <Text style={styles.backButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Loom Details</Text>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Loom No :</Text>
              <Text style={[styles.detailText, { marginLeft: "5%" }]}>{selectedLoom?.LoomNo}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Machine Type:</Text>
              <Text style={[styles.detailText, { marginLeft: "5%" }]}>{selectedLoom?.MachineType}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Shedding Type:</Text>
              <Text style={[styles.detailText, { marginLeft: "5%" }]}>{selectedLoom?.SheddingType}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Width:</Text>
              <Text style={[styles.detailText, { marginLeft: "5%" }]}>{selectedLoom?.Width}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>RPM:</Text>
              <Text style={[styles.detailText, { marginLeft: "5%" }]}>{selectedLoom?.RPM}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>No of Frames:</Text>
              <Text style={[styles.detailText, { marginLeft: "5%" }]}>{selectedLoom?.NoofFrames}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>No of Feeders:</Text>
              <Text style={[styles.detailText, { marginLeft: "5%" }]}>{selectedLoom?.NoofFeeders}</Text>
            </View>
            {selectedLoom?.SelvageJacquard === 1 && (
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>Selvage Jacquard:</Text>
                <Text style={[
                  styles.detailText,
                  {
                    marginLeft: "2%",
                    marginTop: "-1%",
                    color: "#003c43"
                  }
                ]}>
                  Available
                </Text>
              </View>
            )}{selectedLoom?.TopBeam === 1 && (
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>Top Beam:</Text>
                <Text style={[
                  styles.detailText,
                  {
                    marginLeft: "2%",
                    marginTop: "-1%",
                    color: "#003c43"
                  }
                ]}>
                  Available
                </Text>
              </View>
            )}

            {selectedLoom?.Cramming === 1 && (
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>Cramming:</Text>
                <Text style={[
                  styles.detailText,
                  {
                    marginLeft: "2%",
                    marginTop: "-1%",
                    color: "#003c43"
                  }
                ]}>
                  Available
                </Text>
              </View>
            )}
            {selectedLoom?.LenoDesignEquipment === 1 && (
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>Leno Design Equipment:</Text>
                <Text style={[
                  styles.detailText,
                  {
                    marginLeft: "2%",
                    marginTop: "-1%",
                    color: "#003c43"
                  }
                ]}>
                  Available
                </Text>
              </View>
            )}

          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isBookingModalVisible}
        onRequestClose={() => setIsBookingModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
              <Icon name="checkmark-circle" size={50} color="green" />
              <Text style={styles.modalText}>Loom Booked Successfully!</Text>
            </Animated.View>
          </View>
        </View>
      </Modal>
      <Modal
      animationType="fade"
      transparent={true}
      visible={isBookingModalVisible2}
      onRequestClose={() => setIsBookingModalVisible2(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Check Availability For Loom</Text>

                  <Text style={styles.modalTitle2}>Checking For : {selectedLoom?.LoomNo}</Text>


          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setIsStartPickerVisible(true)}
          >
            <Text style={styles.dateText}>
              Start Date: {formatDate(startDate)}
            </Text>
          </TouchableOpacity>
          {isStartPickerVisible && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}

          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setIsEndPickerVisible(true)}
          >
            <Text style={styles.dateText}>
              End Date: {formatDate(endDate)}
            </Text>
          </TouchableOpacity>
          {isEndPickerVisible && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}

          <TouchableOpacity style={styles.submitButton} onPress={()=>handleSubmit(selectedLoom)}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </View>
  );
};

export default LoomBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  blocksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  block: {
    backgroundColor: '#007e83',
    padding: 20,
    margin: 10,
    width: '40%',
    borderRadius: 8,
  },
  modalcontent: {
    justifyContent: "center",
    alignItems: "center"
  },
  unAvailableBlock: {
    backgroundColor: '#007e83',
  },
  blockText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
  },
  unAvailableBlockText: {
    color: 'white',
    fontWeight: 'bold',
  },
  blockTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  blockBottom: {
    marginTop: 10,
  },
  detailText: {
    color: '#000',
    fontWeight: "600",
  },
  detailText1: {
    color: '#fff',
    marginTop: "-3%"
  },
  bookButton: {
    backgroundColor: '#FF7722',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#003c43',
  },
  detailTitle: {
    color: "#000",
    fontWeight: "600",
    fontSize: 18,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginRight: 50,
    paddingTop:55
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
    modalTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    alignSelf:"flex-start",
    marginVertical:"2%",
    color:"#000"
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    width: "100%"
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    color: "#000"
  },
  submitButton: {
    backgroundColor: '#007e83',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  bookingModalContainer: {
    backgroundColor: '#007e83',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  bookingModalText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
    marginBottom: "10%",
    alignSelf: 'flex-end',
    paddingHorizontal: "8%"
  },
  backButton1: {
    backgroundColor: "#0909ff",
    padding: 10,
    borderRadius: 5,
    marginBottom: "10%",
    alignSelf: 'flex-end',
    paddingHorizontal: "8%",
    marginRight: "4%"

  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  enquiryDetailsContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -200 }],
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  detailText: {
    fontSize: 19,
    marginBottom: 10,
    color: "#666",
  },
  bookButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    elevation: 2,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  bookedBlock: {
    backgroundColor: '#ff9800',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003C43',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: '#000',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  dateText: {
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#003C43',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

