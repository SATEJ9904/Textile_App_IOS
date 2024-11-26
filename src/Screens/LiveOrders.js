import { SafeAreaView, StyleSheet, Text, View, Modal, Pressable, StatusBar, FlatList, RefreshControl, TouchableOpacity, ImageBackground, TextInput, ScrollView, Image, Button, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderPart from './HeaderPart';



const LiveOrders = ({ navigation }) => {

    const [username, setUserName] = useState("");
    const [AppUserId, setAppUserId] = useState("")
    const [LoomOrTrader, SetLoomOrTrader] = useState("")
    const [id, setId] = useState("")
    const [showBlocks, setShowBlocks] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible4, setModalVisible4] = useState(false);
    const [loading, setLoading] = useState(true);
    const [phoneno,setPhoneNo] = useState(null)


    const getData = async () => {
        const Name = await AsyncStorage.getItem("Name");
        const AppUserId = await AsyncStorage.getItem("AppUserId");
        const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
        const Id = await AsyncStorage.getItem("Id")
        const mobile = await AsyncStorage.getItem("PrimaryContact")

        setUserName(Name)
        setAppUserId(AppUserId)
        SetLoomOrTrader(LoomOrTrader)
        setId(Id)
        setPhoneNo(mobile)
    }


    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        getData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);



    useEffect(() => {
        onRefresh(); // Or any data initialization
        fetchData();
    
        return () => {
            setOrders([]); // Clear state
            setLoading(false); // Reset loading state
            setRefreshing(false);
        };
    }, []);


    const [orders, setOrders] = useState([]);


    const fetchData = async () => {
        try {
            const userId = await AsyncStorage.getItem('Id');
            const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/loomliveorder.php?LoomTraderId=${userId}`);

            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const json = await response.json();

            const sortedOrdersJson = json.sort((a, b) => b.LoomOrderId - a.LoomOrderId);
            setOrders(sortedOrdersJson);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const startOrder = async (order) => {
        Alert.alert(
            "Confirm Order",
            "Are you sure you want to confirm this order?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Order confirmation cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            const confirmed = true;
                            const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/updateloomorder.php?LoomOrderId=${order.LoomOrderId}&Confirmed=${confirmed}`);
                            if (!response.ok) {
                                throw new Error('Something went wrong');
                            }
                            Alert.alert("Order Confirmed Successfully!");
                            navigation.navigate("LiveBooking", { OrderNoId: 478, OrderNo: "OR478" });
                            FetchTraderName(order);
                        } catch (error) {
                            console.error(error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const cancelOrder = async (order) => {
        Alert.alert(
            "Cancel Order",
            "Are you sure you want to cancel this order?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Order cancellation cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            const confirmed = false;
                            const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/updateloomorder.php?LoomOrderId=${order.LoomOrderId}&Confirmed=${confirmed}`);
                            if (!response.ok) {
                                throw new Error('Something went wrong');
                            }
                            Alert.alert("Order Cancelled Successfully!");
                        } catch (error) {
                            console.error(error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
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

    const [ModalData2, setModalData2] = useState(null)

    const ModalDataFetch2 = (Id) => {
        console.log(Id)
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=" + Id, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setModalData2(result[0]); // Assuming the result is an array and we need the first item
                setLoading(false);
                setModalVisible4(true)
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });

    }

    const FetchTraderName = (order) => {
        console.log(order.TraderId)
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=" + order.TraderId, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result)
                SendEmail(result[0],order)
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });

    }

    const SendEmail = (result,order) => {
        console.log("Email = ",result.AppUserId)
        const formdata = new FormData();
        formdata.append("AppUserId", result.AppUserId);
        formdata.append("Body", `Your OrderNo `+(order.OrderNo)+` has been Confirmed from ` + (username) + ` Looms Followings are the Loom Details  Email:- \n` + (AppUserId) +`\n  Mobile NO:- ` +(phoneno) );

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
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <HeaderPart />

            <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 50 }}>

                <TouchableOpacity
                    style={{ padding: "3%" }}
                    onPress={() => navigation.openDrawer()}
                >
                    <Image
                        source={require("../Images/drawer.png")}
                        style={{ width: 28, height: 30, marginLeft: 10 }}

                    />
                </TouchableOpacity>


                <View style={{ flex: 0.9, alignItems: 'center' }}>
                    <Text style={{ fontSize: 26, color: "white", fontWeight: 500 }}> Live Orders </Text>
                </View>

            </View>

            <ScrollView contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View>
                    <View style={styles.container}>


                        {/* FORM OPTIONS */}




                        {showBlocks ? (
                            <View style={styles.ordersContainer}>

                                {orders.map((order, index) => (
                                    order.Confirmed !== 1 && order.Completed !== 1 ? (
                                        <View key={index} style={styles.orderWrapper}>

                                            <View style={styles.orderContainer}>
                                                <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                                                    <TouchableOpacity onPress={() => ModalDataFetch(order.EnquiryId)}>
                                                        <Icon name="information-circle" size={22} color="grey" />
                                                    </TouchableOpacity>
                                                </View>

                                                <TouchableOpacity onLongPress={() => ModalDataFetch2(order.TraderId)} style={{ paddingLeft: 10, marginBottom: 10 }}>
                                                    <Text style={styles.orderText}>{`Order No : ${order.OrderNo}\nParty Name : ${order.PartyName}\nQuality : ${order.Quality}`}</Text>
                                                </TouchableOpacity>

                                                <View style={styles.buttonContainer}>
                                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                                        <TouchableOpacity
                                                            style={[styles.button, { backgroundColor: '#77B0AA' }]}
                                                            onPress={() => startOrder(order)}
                                                        >
                                                            <Text style={styles.buttonText}>Start Order</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                                        <TouchableOpacity
                                                            style={[styles.button, { backgroundColor: '#FF7722' }]}
                                                            onPress={() => setModalVisible3(true)}
                                                        >
                                                            <Text style={styles.buttonText}>Cancel Order</Text>
                                                        </TouchableOpacity>
                                                    </View>



                                                </View>

                                            </View>

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
                                                        <Text style={{ color: "#003C43", fontSize: 20, fontWeight: "600", marginTop: "5%" }}>Are You Sure To Confirm This Order</Text>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "80%", marginTop: "10%" }}>
                                                            <TouchableOpacity style={[styles.backButton, { backgroundColor: "#003C43", width: "30%", justifyContent: "center", alignItems: "center" }]} onPress={() =>{setModalVisible2(false)}}>
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
                                                        <Text style={{ color: "#003C43", fontSize: 20, fontWeight: "600", marginTop: "5%" }}>Are You Sure To Cancel This Order</Text>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "80%", marginTop: "10%" }}>
                                                            <TouchableOpacity style={[styles.backButton, { backgroundColor: "#003C43", width: "30%", justifyContent: "center", alignItems: "center" }]} onPress={() => cancelOrder(order)}>
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
                                    ) : null
                                ))}
                            </View>
                        ) : null}
                    </View>
                </View >
            </ScrollView >

            <View style={{ flexDirection: "row", borderWidth: 1, height: 50, borderColor: "#0A5D47" }}>

                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
                    <TouchableOpacity
                        style={{ width: '100%', height: '100%', backgroundColor: "#135D66", justifyContent: "center", alignItems: "center", }}

                    >
                        <Text style={{ color: "#fff", fontSize: 20 }}>Live Orders</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity
                        style={{ width: '100%', justifyContent: "center", alignItems: "center", }}

                        onPress={() => navigation.navigate("ConfirmOrds")}
                    >
                        <Text style={{ color: "#003C43", fontSize: 20, padding: 5 }}>Confirmed Orders</Text>
                    </TouchableOpacity>
                </View>

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

                <Modal visible={modalVisible4} transparent={true} animationType="slide" onRequestClose={() => {
                    setModalVisible4(!modalVisible4);
                }}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible4(!modalVisible4)}>
                                <Icon name="exit" size={32} color="red" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Trader Details</Text>
                            {loading ? (
                                <ActivityIndicator size="large" color="#003C43" />
                            ) : (
                                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                                    {ModalData2 && (
                                        <>
                                            <Image
                                                source={{ uri: ModalData2.Profilepic }}
                                                style={{ width: "18%", height: "20%", marginBottom: "10%" }}
                                            />
                                            <Text style={styles.detailText}><Text style={styles.label}>Email:</Text> {ModalData2.AppUserId}</Text>
                                            <Text style={styles.detailText}><Text style={styles.label}>Name:</Text> {ModalData2.Name}</Text>
                                            <Text style={styles.detailText}><Text style={styles.label}>Address:</Text> {ModalData2.Address}</Text>
                                            <Text style={styles.detailText}><Text style={styles.label}>State:</Text> {ModalData2.State}</Text>
                                            <Text style={styles.detailText}><Text style={styles.label}>City:</Text> {ModalData2.City}</Text>
                                            <Text style={styles.detailText}><Text style={styles.label}>Pincode:</Text> {ModalData2.Pincode}</Text>
                                            <Text style={[styles.detailText, { marginBottom: "20%" }]}><Text style={styles.label}>Mobile No.:</Text> {ModalData2.PrimaryContact}</Text>

                                        </>
                                    )}
                                </ScrollView>
                            )}
                        </View>
                    </View>
                </Modal>


            </View>

        </View>
    )
}


export default LiveOrders

const styles = StyleSheet.create({
    container: {
        padding: 15,

    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        padding: "5%"
    },

    header1: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#e5f2fe',
        borderWidth: 1,
        justifyContent: 'space-evenly'
    },
    headerText1: {
        fontWeight: 'bold',
        marginLeft: 0,
        color: "#000"
    },

    ordersContainer: {
        padding: 10,
    },
    orderWrapper: {
        marginBottom: 20,
    },
    orderContainer: {
        padding: 10,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#003C43",
    },
    startedOrder: {
        backgroundColor: '#4CAF50', // Green for started orders
    },
    cancelledOrder: {
        backgroundColor: '#F44336', // Red for cancelled orders
    },
    orderText: {
        color: 'black', // Text color for better contrast
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#4CAF50', // Green for start button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#F44336', // Red for cancel button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,

    },
    button1: {
        alignItems: "center",
        backgroundColor: '#0E8C6B',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        width: "70%",
    },

    addButton: {
        backgroundColor: '#6495ED',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 20
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: 10,
        borderBottomColor: '#000',
        width: 500
    },
    table: {
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 20,
        marginRight: 0,
        width: 1200
    },
    button: {
        width: '90%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    submitButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    rowContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    rowButtons: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 0
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    datePicker: {
        width: '100%',
        marginBottom: 10,
    },
    input: {
        width: '25%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        margin: 5
    },

    dateText: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingBottom: 5,
        marginRight: 30,
        color: "#000"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
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
    buttonClose1: {
        backgroundColor: "green",
        margin: "5%",
        width: 200,
    },
    textStyle1: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: "green"
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: "#000",
        fontSize: 17
    },
    text: {
        fontSize: 15,
        color: "#000",
        marginLeft: "18%"
    },
    tableHeader: {
        width: 400,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#0909ff',
        marginBottom: 15
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: "#fff"
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableCell: {
        flex: 1,
        fontSize: 16,
    },
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
    '@media (max-width: 768px)': {
        container: {
            padding: 10,
        },
        heading: {
            fontSize: 20,
        },
        orderContainer: {
            width: '95%',
        },
        button1: {
            width: "80%",
        },
        input: {
            width: '30%',
        },
        button: {
            fontSize: 20,
        },
        table: {
            width: '100%',
        },
        tableHeader: {
            width: '100%',
        },
        row: {
            width: '100%',
        },
    },
    '@media (max-width: 480px)': {
        heading: {
            fontSize: 18,
        },
        orderContainer: {
            width: '100%',
        },
        button1: {
            width: "100%",
        },
        input: {
            width: '40%',
        },
        button: {
            fontSize: 18,
        },
    },
    '@media (max-width: 320px)': {
        heading: {
            fontSize: 16,
        },
        orderContainer: {
            width: '100%',
        },
        button1: {
            width: "100%",
        },
        input: {
            width: '50%',
        },
        button: {
            fontSize: 16,
        },
    }


})