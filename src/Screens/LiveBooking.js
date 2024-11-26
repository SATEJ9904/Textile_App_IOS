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
import HeaderPart from './HeaderPart';

const LiveBooking = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [loomNumbers, setLoomNumbers] = useState([]);
  const [filteredLoomNumbers, setFilteredLoomNumbers] = useState([]); // State for filtered loom numbers
  const [selectedLoom, setSelectedLoom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [enquiryDetails, setEnquiryDetails] = useState(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [OrderNo1, setOrderNo] = useState('');
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0))[0];
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [bookedLoomNo, setBookedLoomNo] = useState(null);


  const OrderNoId = route.params?.OrderNoId || OrderNo1;
  const OrderNo = route.params?.OrderNo || OrderNo1;

  const fetchData = async () => {
    try {
      const id = await AsyncStorage.getItem("Id");
      console.log("Id = ", id, "OrderNoId = ", OrderNoId)

      const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/loombyorder.php?LoomTraderId=${id}&OrderNoId=${OrderNoId}`);
      const data = await response.json();
      setLoomNumbers(data);
      setFilteredLoomNumbers(data);
      console.log(data);
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
      const result = await response.json();
      console.log(result);

      if (result.length > 0) {
        setEnquiryDetails(result[0]);
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
    console.log(selectedLoom?.BookedFromDate)

    if (selectedLoom?.BookedFromDate === null) {
      const date = new Date(bookedToDate);
      date.setMonth(date.getMonth() + 4);
      const loomAvailableTo = date.toISOString().substring(0, 10);

     // console.log("Called If condition where BookedFromDate Exists with = ",selectedLoom?.BookingId,enquiryDetails.LoomOrderId,enquiryDetails.BookedDateFrom?.date?.substring(0, 10),bookedToDate,loomAvailableTo)

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
        .then((result) => {
          setBookedLoomNo(selectedLoom?.LoomNo)
          console.log(result)
        })
        .catch((error) => console.error(error));
    } else {


      const date = new Date(bookedToDate);
      date.setMonth(date.getMonth() + 4);
      const loomAvailableTo2 = date.toISOString().substring(0, 10);

      // console.log("Called Else Condition Post with ",selectedLoom?.LoomDetailId,selectedLoom?.LoomNo,loomAvailableTo2,enquiryDetails.BookedDateFrom?.date?.substring(0, 10),bookedToDate,enquiryDetails?.LoomOrderId)


      const formdata = new FormData();
      formdata.append("LoomDetailId", selectedLoom?.LoomDetailId);
      formdata.append("LoomNo", selectedLoom?.LoomNo);
      formdata.append("Available", false);
      formdata.append("LoomAvailableTo",loomAvailableTo2);
      formdata.append("BookedFromDate", enquiryDetails.BookedDateFrom?.date?.substring(0, 10));
      formdata.append("BookedToDate", bookedToDate);
      formdata.append("OrderNoId", enquiryDetails?.LoomOrderId);
      formdata.append("KnottingOrderId", null);

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };

      fetch("https://textileapp.microtechsolutions.co.in/php/postloombooking.php", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    
  };
  }

  const handleBookLoom = () => {
    console.log("Dates = ", enquiryDetails?.BookedDateTo?.date?.substring(0, 10) + "  " + enquiryDetails?.BookedDateFrom?.date?.substring(0, 10) + "  " + selectedLoom?.Id)

    const formdata = new FormData();
    formdata.append("Fromdate", enquiryDetails?.BookedDateFrom?.date?.substring(0, 10));
    formdata.append("Todate", enquiryDetails?.BookedDateTo?.date?.substring(0, 10));
    formdata.append("LoomDetailId", selectedLoom?.Id);

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
          performLoomBooking()
        } else {
          Alert.alert("Dates Not Matched")
        }
      })
      .catch((error) => console.error(error));
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

  const handleBlockPress1 = (loom) => {
    setSelectedLoom(loom);
    setShowEnquiryForm(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
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
    return filteredLoomNumbers.map((loom, index) => (
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
          {loom.Available !== 1 ? (
            <View>
              <View>
                <Text style={styles.detailText1}>OR: {loom.OrderNo}</Text>
                <Text style={styles.detailText1}>Party: {loom.PartyName}</Text>
                <Text style={styles.detailText1}>To: {loom.BookedDateTo ? loom.BookedDateTo.date.substring(0, 10) : 'N/A'}</Text>
              </View>
              <TouchableOpacity style={styles.bookButton} onPress={() => handleBlockPress1(loom)}>
                <Text style={styles.bookButtonText}>Book Loom</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={{ color: "#fff", fontSize: 15 }}>Available from : {loom.LoomAvailableFrom.date.substring(0, 10)}</Text>
              <TouchableOpacity style={styles.bookButton} onPress={() => handleBlockPress1(loom)}>
                <Text style={styles.bookButtonText}>Book Loom</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <HeaderPart />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ padding: "1%" }} onPress={() => navigation.goBack()}>
          <ImageBackground
            source={require("../Images/back.png")}
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
          <Text style={[styles.detailText, { marginLeft: "-2%" }]}>Booking From: {enquiryDetails.BookedDateFrom?.date?.substring(0, 10) ?? 'N/A'}</Text>
          <Text style={[styles.detailText, { marginLeft: "5%" }]}>Booking To: {enquiryDetails.BookedDateTo?.date?.substring(0, 10) ?? 'N/A'}</Text>
          <TouchableOpacity style={styles.bookButton} onPress={() => { handleBookLoom() }}>
            <Text style={styles.bookButtonText}>Check Dates Book</Text>
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
    </View>
  );
};


export default LiveBooking;


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
});