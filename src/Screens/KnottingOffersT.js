import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Image, Modal, Pressable, Alert, RefreshControl } from 'react-native';
import { TextInput, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import HeaderPart from './HeaderPart';

const KnottingOffersT = ({ navigation }) => {
    const [reed, setReed] = useState('');
    const [reedSpace, setReedSpace] = useState('');
    const [date, setDate] = useState(null);
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [isAllOffersActive, setIsAllOffersActive] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loomNames, setLoomNames] = useState({});
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        fetchData();
        return () => { isMounted.current = false; };
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=KnottingOffer');
            const result = await response.json();
            const initialFilterData = result.filter(item => !item.ConfirmTrader);
            setFilteredData(initialFilterData);
            setData(initialFilterData);
            fetchLoomNames(initialFilterData.map(item => item.LoomId));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchLoomNames = async (loomIds) => {
        try {
            const uniqueLoomIds = [...new Set(loomIds)];
            const loomNamePromises = uniqueLoomIds.map(id =>
                fetch(`https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${id}`)
                    .then(response => response.json())
                    .catch(error => {
                        console.error(`Error fetching loom name for ID ${id}:`, error);
                        return { Name: 'Unknown' };
                    })
            );

            const loomNameResults = await Promise.all(loomNamePromises);
            const loomNameMap = loomNameResults.reduce((map, result, index) => {
                result.map((item) => {
                    if (item && item.Name) {
                        map[uniqueLoomIds[index]] = item.Name;
                    } else {
                        map[uniqueLoomIds[index]] = 'Unknown';
                    }
                })
                return map;
            }, {});

            setLoomNames(loomNameMap);
        } catch (error) {
            console.error('Error fetching loom names:', error);
        }
    };

    useEffect(() => {
        const filtered = data.filter(item =>
            (reed ? item.Reed.toLowerCase().includes(reed.toLowerCase()) : true) &&
            (reedSpace ? item.ReedSpace.toLowerCase().includes(reedSpace.toLowerCase()) : true) &&
            (date ? new Date(item.AvailableFrom.date) >= date : true)
        );
        setFilteredData(filtered);
    }, [reed, reedSpace, date, data]);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setIsAllOffersActive(false);
    };

    const handleSubmit = async (offerId) => {
        let Id = await AsyncStorage.getItem("Id")
        console.log(offerId,Id)
      

        setLoading(true);
        const formdata = new FormData();
        formdata.append("Id", offerId);
        formdata.append("TraderId",  Id);
        
        const requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow"
        };
        
        fetch("https://textileapp.microtechsolutions.co.in/php/updateknottingoffer.php", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            setLoading(false);
            Alert.alert("Knotting Order Confirmed");
            fetchData();
        })
        .catch((error) => {
            console.error(error);
            setLoading(false);
            Alert.alert("Knotting Order not Confirmed");
        });
    };

    const handleAllOffersClick = () => {
        if (isAllOffersActive) {
            const filtered = data.filter(item =>
                (reed ? item.Reed.toLowerCase().includes(reed.toLowerCase()) : true) &&
                (reedSpace ? item.ReedSpace.toLowerCase().includes(reedSpace.toLowerCase()) : true) &&
                (date ? new Date(item.AvailableFrom.date) >= date : true)
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data.filter(item => item.ConfirmTrader === null));
            setDate(null);
        }
        setIsAllOffersActive(!isAllOffersActive);
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        setTimeout(() => {
            if (isMounted.current) {
                setRefreshing(false);
            }
        }, 2000);
    }, []);

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image source={require('../Images/drawer.png')} style={styles.drawerIcon} />
                </TouchableOpacity>
                <View style={{ justifyContent: "center", alignItems: "center", width: "90%" }}>
                    <Text style={styles.headerText}>Knotting Offers</Text>
                </View>
            </View>

            <View style={styles.content}>
                <TextInput
                    label="Reed"
                    value={reed}
                    onChangeText={setReed}
                    style={styles.input}
                    theme={{ colors: { primary: '#003C43' } }}
                />
                <TextInput
                    label="Reed Space"
                    value={reedSpace}
                    onChangeText={setReedSpace}
                    style={styles.input}
                    theme={{ colors: { primary: '#003C43' } }}
                />
                <View style={styles.dateContainer}>
                    <TextInput
                        label="Date"
                        value={date ? date.toDateString() : ''}
                        style={[styles.input, { flex: 1 }]}
                        editable={false}
                        theme={{ colors: { primary: '#003C43' } }}
                    />
                    
                    <IconButton
                        icon="calendar"
                        size={30}
                        color="#003C43"
                        onPress={() => setShow(true)}
                        style={styles.calendarIcon}
                    />
                     {show && (
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}
                </View>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, isAllOffersActive && styles.activeTab]}
                        onPress={handleAllOffersClick}
                    >
                        <Text style={[styles.tabText, isAllOffersActive && styles.activeTabText]}>All Offers</Text>
                    </TouchableOpacity>
                </View>
               
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
          <HeaderPart />
            {loading ? (
                <View style={styles.animationContainer}>
                    <LottieView
                        source={require('../Animation/car_animation.json')}
                        autoPlay
                        loop
                    />
                    <Text style={styles.redirectText}>Processing Your Order...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.KnottingId.toString()}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.cardTitle}>Offer No: {item.KnottingId}</Title>
                            <Paragraph style={styles.cardText}>Loom Unit: {loomNames[item.LoomId]}</Paragraph>
                            <Paragraph style={styles.cardText}>Reed: {item.Reed}</Paragraph>
                            <Paragraph style={styles.cardText}>Draft: {item.Draft}</Paragraph>
                            <Paragraph style={styles.cardText}>Reed Space: {item.ReedSpace}</Paragraph>
                            <Paragraph style={styles.cardText}>No of Looms: {item.NoofLooms}</Paragraph>
                            <Paragraph style={styles.cardText}>Available From: {new Date(item.AvailableFrom.date).toDateString()}</Paragraph>
                            <View style={styles.button}>
                                <TouchableOpacity
                                    style={styles.buttonContainer}
                                    onPress={() => handleSubmit(item.KnottingId)}
                                >
                                    <Text style={styles.buttonText}>Book Offer</Text>
                                </TouchableOpacity>
                            </View>
                        </Card.Content>
                    </Card>
                    )}
                    ListHeaderComponent={renderHeader}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#003C43",
    },
    drawerIcon: {
        width: 30,
        height: 30,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    content: {
        padding: 10,
    },
    input: {
        marginBottom: 10,
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    calendarIcon: {
        marginLeft: 10,
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
    },
    tab: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#003C43",
        marginHorizontal: 5,
    },
    activeTab: {
        backgroundColor: "#003C43",
    },
    tabText: {
        color: "#003C43",
    },
    activeTabText: {
        color: "#fff",
    },
    card: {
        marginBottom: 10,
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cardText: {
        fontSize: 14,
    },
    button: {
        alignItems: "center",
        marginTop: 10,
    },
    buttonContainer: {
        backgroundColor: "#003C43",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    noDataContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    noDataText: {
        fontSize: 18,
        color: "#aaa",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: "#003C43",
        padding: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    animationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    redirectText: {
        marginTop: 20,
        fontSize: 16,
        color: '#003C43',
    },
});

export default KnottingOffersT;