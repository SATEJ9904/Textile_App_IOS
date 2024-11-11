import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Modal, ActivityIndicator, ScrollView, FlatList, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/Ionicons';

const CanceledOrders = ({ navigation }) => {

  const [modalVisible2, setModalVisible2] = useState(false)

  useEffect(() => {
    FetchCancelOrders();
    Getdata();
  }, [])

  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State to manage refresh


  const onRefresh = () => {
    setRefreshing(true);
    FetchCancelOrders(); // Fetch orders again
  };

  const Getdata = async () => {
    const Id = AsyncStorage.getItem("Id")
    console.log("Id From Getdata Function", Id)
  }


  const FetchCancelOrders = async () => {

    const Id = await AsyncStorage.getItem("Id");
    console.log(Id);
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        "https://textileapp.microtechsolutions.co.in/php/loomliveorder.php?LoomTraderId=" + Id,
        requestOptions
      );
      const result = await response.json();
      console.log(result);

      // Filter orders where Completed is 1
      const filteredOrders = result.filter((order) => order.Confirmed === 0);

      setData(filteredOrders);
      setLoading(false);
      setRefreshing(false); // Stop refreshing
    } catch (error) {
      console.error(error);
      setLoading(false);
      setRefreshing(false); // Stop refreshing in case of error
    }
  }

  const [ModalData, setModalData] = useState(null)

  const ModalDataFetch = (Id) => {
    console.log(Id)
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/getjoin.php?EnquiryId=" + Id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setModalData(result[0]); // Assuming the result is an array and we need the first item
        setLoading(false);
        setModalVisible(true)
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }

  const startOrder = async (order) => {

    try {
        const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/updateloomorder.php?LoomOrderId=${order.LoomOrderId}`);

        if (!response.ok) {
            throw new Error('Something went wrong');
        } else {
            Alert.alert("Order Confirmed Successfully !!!")

            console.log('Order updated successfully');
        }


    } catch (error) {
        console.error(error);
    }
};


  const renderOrderItem = ({ item }) => (
    <View style={styles.orderBlock}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderText}>Order No: {item.OrderNo}</Text>
        <Text style={styles.orderText}>Party: {item.PartyName}</Text>
        {
          item.Completed === 1 ?
            <Text style={styles.orderText}>Status:  <Text style={{
              color: "#003C43", fontSize: 16,
              fontWeight: '500',
            }}>Complete</Text></Text>
            : <Text style={styles.orderText}>Status: <Text style={{ color: "#003C43" }}>Incomplete</Text></Text>

        }

        <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity style={{ width: "90%", backgroundColor: "#FF7722", justifyContent: "center", alignItems: "center", marginTop: "5%", borderRadius: 15 }} onPress={() => setModalVisible2(true)}>
            <Text style={{ color: "#fff", padding: "3%" }}>Restart Order</Text>
          </TouchableOpacity>
        </View>

      </View>
      <TouchableOpacity onPress={() => ModalDataFetch(item.EnquiryId)}>
        <Icon name="information-circle" size={22} color="grey" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible2}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible2(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible2(!modalVisible2)}>
              <Icon name="exit" size={32} color="red" />
            </TouchableOpacity>
            <Text style={{ color: "#003C43", fontSize: 20, fontWeight: "600", marginTop: "5%" }}>Are You Sure To Confirm This Order</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", marginTop: "10%" }}>
              <TouchableOpacity style={[styles.backButton, { backgroundColor: "#003C43", width: "30%", justifyContent: "center", alignItems: "center" }]} onPress={() => startOrder(item)}>
                <Text style={styles.backButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.backButton, { width: "30%", justifyContent: "center", alignItems: "center" }]} onPress={() => setModalVisible2(false)}>
                <Text style={styles.backButtonText}>NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );


  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 100 }}>

        <TouchableOpacity
        style={{padding:"2%",paddingTop:45}}
          onPress={() => navigation.openDrawer()}
        >
          <Image
            source={require("../Images/drawer1.png")}
            style={{ width: 28, height: 22, marginLeft: 10, }}

          />
        </TouchableOpacity>


        <View style={{ flex: 0.9, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, color: "white", fontWeight: 500, paddingTop:55 }}>  Cancel Orders </Text>
        </View>

      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#003C43" style={styles.loader} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.Id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.orderList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh} // Trigger onRefresh when pulled
              colors={['#003C43']} // Custom color for the refresh indicator
            />
          }
        />
      )}

      <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(!modalVisible)}>
              <Icon name="exit" size={32} color="red" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Order Details</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#003C43" />
            ) : (
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {ModalData && (
                  <>
                    <Text style={styles.detailText}><Text style={styles.label}>Name:</Text> {ModalData.Name}</Text>
                    <Text style={styles.detailText}><Text style={styles.label}>Machine Type:</Text> {ModalData.MachineType}</Text>
                    <Text style={styles.detailText}><Text style={styles.label}>Width:</Text> {ModalData.Width}</Text>
                    <Text style={styles.detailText}><Text style={styles.label}>Shedding Type:</Text> {ModalData.SheddingType}</Text>
                    <Text style={styles.detailText}><Text style={styles.label}>No of Frames:</Text> {ModalData.NoofFrame}</Text>
                    <Text style={styles.detailText}><Text style={styles.label}>No of Feeders:</Text> {ModalData.NoofFeedero}</Text>
                    <Text style={styles.detailText}><Text style={styles.label}>Selvage Jacquard:</Text> {ModalData.SelvageJacquard ? "Yes" : "No"}</Text>
                    <Text style={styles.detailText}><Text style={styles.label}>Top Beam:</Text> {ModalData.TopBeam ? "Yes" : "No"}</Text>
                    <Text style={styles.detailText}><Text style={styles.label}>Cramming:</Text> {ModalData.Cramming ? "Yes" : "No"}</Text>
                    <Text style={styles.detailText}><Text style={styles.label}>Leno Design Equipment:</Text> {ModalData.LenoDesignEquipment ? "Yes" : "No"}</Text>
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>


    </View>
  )
}

export default CanceledOrders

const styles = StyleSheet.create({
  orderBlock: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  orderInfo: {
    flex: 1,
  },
  orderText: {
    fontSize: 16,
    color: '#003C43',
    fontWeight: '500',
  },
  infoButton: {
    backgroundColor: '#003C43',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003C43',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: "5%",
    fontWeight: "600",
    color: "#000",
  },
  label: {
    fontWeight: 'bold',
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
})