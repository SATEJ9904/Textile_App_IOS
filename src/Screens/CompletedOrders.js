import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Ionicons';


const CompletedOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State to manage refresh
  const [modalVisible, setModalVisible] = useState(false);


  const fetchOrders = async () => {
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
      const filteredOrders = result.filter((order) => order.Completed === 1);
  
      setOrders(filteredOrders);
      setLoading(false);
      setRefreshing(false); // Stop refreshing
    } catch (error) {
      console.error(error);
      setLoading(false);
      setRefreshing(false); // Stop refreshing in case of error
    }
  };

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(); // Fetch orders again
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderBlock}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderText}>Order No: {item.OrderNo}</Text>
        <Text style={styles.orderText}>Party: {item.PartyName}</Text>
      </View>
      <TouchableOpacity onPress={() => ModalDataFetch(item.EnquiryId)}>
        <Icon name="information-circle" size={22} color="grey" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#003C43" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={{padding:"2%",paddingTop:45}} onPress={() => navigation.openDrawer()}>
          <Image
            source={require('../Images/drawer1.png')}
            style={styles.drawerIcon}
          />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Orders</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#003C43" style={styles.loader} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.OrderNo}
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
  );
};

export default CompletedOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#003C43',
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    paddingHorizontal: 10,
  },
  drawerIcon: {
    width: 28,
    height: 22,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    color: 'white',
    fontWeight: '500',
    paddingTop:55
  },
  loader: {
    marginTop: 20,
  },
  orderList: {
    padding: 10,
  },
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
});