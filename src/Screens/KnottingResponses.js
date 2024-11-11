import React, { useEffect, useState, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    RefreshControl,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native'; // Import LottieView
import axios from 'axios';
import HeaderPart from './HeaderPart';

const KnottingResponses = ({ navigation }) => {
    const [username, setUserName] = useState('');
    const [AppUserId, setAppUserId] = useState('');
    const [LoomOrTrader, SetLoomOrTrader] = useState('');
    const [id, setId] = useState('');
    const [showBlocks, setShowBlocks] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [traderNames, setTraderNames] = useState({}); // State to store trader names
    const [showLottie, setShowLottie] = useState(false); // State to manage Lottie animation visibility
    const [lottieMessage, setLottieMessage] = useState(''); // State to manage Lottie animation message

    useEffect(() => {
        getData();
    }, []);

   
    const getData = async () => {
        const Name = await AsyncStorage.getItem('Name');
        const AppUserId = await AsyncStorage.getItem('AppUserId');
        const LoomOrTrader = await AsyncStorage.getItem('LoomOrTrader');
        const Id = await AsyncStorage.getItem('Id');

        setUserName(Name);
        setAppUserId(AppUserId);
        SetLoomOrTrader(LoomOrTrader);
        setId(Id);

        // Fetch orders and trader names
        fetchData();
    };

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        onRefresh();
        fetchData();
    }, []);

    const [orders, setOrders] = useState([]);

    const fetchData = async () => {
        try {
            const userId = await AsyncStorage.getItem('Id');
            const response = await fetch(
                'https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=KnottingOffer&Colname=LoomId&Colvalue=' + await AsyncStorage.getItem('Id')
            );

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const json = await response.json();

            // Apply filters: AsyncStorage Id should be the same and ConfirmTrader = 1
            const filteredJson = json.filter(order => order.LoomId == userId && order.ConfirmTrader == 1);

            // Fetch trader names for each order
            await Promise.all(
                filteredJson.map(async (order) => {
                    const traderId = order.TraderId;
                    if (traderId) { // Check if TraderId is not null
                        const traderNameResponse = await fetch(
                            'https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=' + traderId
                        );

                        if (!traderNameResponse.ok) {
                            throw new Error(
                                `Error fetching trader name for TraderId ${traderId}`
                            );
                        }

                        const traderNameJson = await traderNameResponse.json();
                        const traderName = traderNameJson.map(item => item.Name); // Assuming Name is the property to fetch

                        // Update traderNames state with fetched trader name
                        setTraderNames(prevState => ({
                            ...prevState,
                            [traderId]: traderName || 'N/A'
                        }));
                    }
                })
            );

            const sortedOrdersJson = filteredJson.sort(
                (a, b) => b.LoomOrderId - a.LoomOrderId
            );
            setOrders(sortedOrdersJson);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const startOrder = async (order) => {
        setShowLottie(true);
        setLottieMessage('Processing Your Order To Start...');


        const confirmed = true;
        try {
            const response = await fetch(
                `https://textileapp.microtechsolutions.co.in/php/confirmknottingoffer.php?Id=${order.OfferNo}&ConfirmLoom=${confirmed}`
            );

            if (!response.ok) {
                throw new Error('Something went wrong');
            } else {
                Alert.alert('Order Confirmed Successfully !!!');

                console.log('Order updated successfully');
                setShowLottie(false); // Hide the Lottie animation
                navigation.navigate('LoomBooking', { OrderNo: order.KnottingId });
            }


        } catch (error) {
            console.error(error);
            setShowLottie(false); // Hide the Lottie animation in case of an error
        }

        setShowLottie(false); // Hide the Lottie animation

    };

    const cancelOrder = async (order) => {
        setShowLottie(true);
        setLottieMessage('Canceling Your Order...');
        const confirmed = false;
        try {
            const response = await fetch(
                `https://textileapp.microtechsolutions.co.in/php/confirmknottingoffer.php?Id=${order.OfferNo}&ConfirmLoom=${confirmed}`
            );

            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            Alert.alert('Order Cancelled Successfully !!!');

            console.log('Order updated successfully');
            setShowLottie(false); // Hide the Lottie animation
        } catch (error) {
            console.error(error);
            // setShowLottie(false); // Hide the Lottie animation in case of an error
        }
    };

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
          <HeaderPart />
            {showLottie && (
                <View style={styles.lottieContainer}>
                    <LottieView
                        source={require('../Animation/car_animation.json')} // Provide the path to your Lottie JSON file
                        autoPlay
                        loop
                    />
                    <Text style={styles.lottieText}>{lottieMessage}</Text>
                </View>
            )}
            <View
                style={{
                    backgroundColor: '#003C43',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 50,
                }}
            >
                <TouchableOpacity
                    style={{ padding: '3%' }}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={require('../Images/back.png')}
                        style={{ width: 28, height: 30, marginLeft: 10 }}
                    />
                </TouchableOpacity>

                <View style={{ flex: 0.9, alignItems: 'center' }}>
                    <Text style={{ fontSize: 26, color: 'white', fontWeight: '500' }}>
                        {' '}
                        Live Orders{' '}
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View>
                    <View style={styles.container}>
                        {showBlocks ? (
                            <View style={styles.ordersContainer}>
                                {orders.map((order, index) =>
                                    order.ConfirmLoom !== 1 ? (
                                        <View key={index} style={styles.orderWrapper}>
                                            <View style={styles.orderContainer}>
                                                <View style={{ paddingLeft: 10, marginBottom: 10 }}>
                                                    <Text style={styles.orderText}>
                                                        {`Order No : ${order.OfferNo}\nParty Name : ${traderNames[order.TraderId]?.join(', ') || 'N/A'}\nQuality : ${order.Reed}/${order.ReedSpace}`}
                                                    </Text>
                                                </View>

                                                <View style={styles.buttonContainer}>
                                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                                        <TouchableOpacity
                                                            style={[
                                                                styles.button,
                                                                { backgroundColor: '#77B0AA' },
                                                            ]}
                                                            onPress={() => startOrder(order)}
                                                        >
                                                            <Text style={styles.buttonText}>
                                                                Start Order
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                                        <TouchableOpacity
                                                            style={[
                                                                styles.button,
                                                                { backgroundColor: '#FF7722' },
                                                            ]}
                                                            onPress={() => cancelOrder(order)}
                                                        >
                                                            <Text style={styles.buttonText}>
                                                                Cancel Order
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ) : null
                                )}
                            </View>
                        ) : null}
                    </View>
                </View>
            </ScrollView>

            <View
                style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    height: 50,
                    borderColor: '#0A5D47',
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#135D66',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 20 }}>Live Orders</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigation.navigate('ConfirmOrderKnotting')}
                    >
                        <Text style={{ color: '#003C43', fontSize: 20, padding: 5 }}>
                            Confirmed Orders
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


export default KnottingResponses;

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        padding: '5%',
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
        borderColor: '#003C43',
    },
    orderText: {
        color: 'black',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: '90%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    scrollView: {
        flexGrow: 1,
    },
    lottieContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    lottieText: {
        marginTop: 20,
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
    },
});