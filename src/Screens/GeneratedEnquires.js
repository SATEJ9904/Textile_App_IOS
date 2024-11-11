import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ImageBackground, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderPart from './HeaderPart';

const { width, height } = Dimensions.get('window');

const GeneratedEnquires = ({ navigation }) => {
    const [enquiries, setEnquiries] = useState([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [username, setUserName] = useState("");
    const [AppUserId, setAppUserId] = useState("");
    const [LoomOrTrader, SetLoomOrTrader] = useState("");
    const [id, setId] = useState("");

    useEffect(() => {
        getData();
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://textileapp.microtechsolutions.co.in/php/getjoin.php?TraderId=' + await AsyncStorage.getItem("Id"));
            const sortedData = response.data.sort((a, b) => b.EnquiryId - a.EnquiryId); // Sort in descending order
            setEnquiries(sortedData);
            console.log(sortedData);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const renderEnquiryItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => setSelectedEnquiry(item)}>
            <Text style={styles.enquiryNumber}>Enquiry No: {item.EnquiryNo}</Text>
        </TouchableOpacity>
    );

    const getData = async () => {
        const Name = await AsyncStorage.getItem("Name");
        const AppUserId = await AsyncStorage.getItem("AppUserId");
        const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader");
        const Id = await AsyncStorage.getItem("Id");

        setUserName(Name);
        setAppUserId(AppUserId);
        SetLoomOrTrader(LoomOrTrader);
        setId(Id);
    }

    const DeleteEnq = async () => {
        const formdata = new FormData();
        formdata.append("EnquiryId", selectedEnquiry.EnquiryId);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/delenquiry.php", requestOptions)
            .then((response) => {
                response.text();
                fetchData();
            })
            .then((result) => console.log(result))
            .catch((error) => {
                console.error(error);
                Alert.alert("Enquiry Cannot Be Deleted");
            });
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <HeaderPart />
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButtonContainer} onPress={() => navigation.goBack()}>
                    <ImageBackground
                        source={require("../Images/back.png")}
                        style={styles.backButtonImage}
                        imageStyle={{ borderRadius: 0 }}
                    />
                </TouchableOpacity>
                <Text style={styles.header}>Enquires</Text>
            </View>
            <View style={styles.container}>
                {selectedEnquiry ? (
                    <ScrollView contentContainerStyle={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>EnquiryNo:</Text>
                            <Text style={styles.value}>{selectedEnquiry.EnquiryNo}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>EnquiryDate:</Text>
                            <Text style={styles.value}>{selectedEnquiry.EnquiryDate.date.substring(0, 10)}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>FabricQuality:</Text>
                            <Text style={styles.value}>{selectedEnquiry.FabricQuality}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>FabricLength:</Text>
                            <Text style={styles.value}>{selectedEnquiry.FabricLength}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>LoomRequired:</Text>
                            <Text style={styles.value}>{selectedEnquiry.LoomRequired}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>AgentName:</Text>
                            <Text style={styles.value}>{selectedEnquiry.AgentName}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>MachineType:</Text>
                            <Text style={styles.value}>{selectedEnquiry.MachineType}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Width:</Text>
                            <Text style={styles.value}>{selectedEnquiry.Width}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>RPM:</Text>
                            <Text style={styles.value}>{selectedEnquiry.RPM}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>SheddingType:</Text>
                            <Text style={styles.value}>{selectedEnquiry.SheddingType}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>NoofFrame:</Text>
                            <Text style={styles.value}>{selectedEnquiry.NoofFrame}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>NoofFeeder:</Text>
                            <Text style={styles.value}>{selectedEnquiry.NoofFeedero}</Text>
                        </View>
                        {selectedEnquiry.SelvageJacquard === 1 && (
                            <View style={styles.detailItem}>
                                <Text style={styles.label}>SelvageJacquard:</Text>
                                <Text style={styles.value}>Required</Text>
                            </View>
                        )}
                        {selectedEnquiry.TopBeam === 1 && (
                            <View style={styles.detailItem}>
                                <Text style={styles.label}>TopBeam:</Text>
                                <Text style={styles.value}>Required</Text>
                            </View>
                        )}
                        {selectedEnquiry.Cramming === 1 && (
                            <View style={styles.detailItem}>
                                <Text style={styles.label}>Cramming:</Text>
                                <Text style={styles.value}>Required</Text>
                            </View>
                        )}
                        {selectedEnquiry.LenoDesignEquipment === 1 && (
                            <View style={styles.detailItem}>
                                <Text style={styles.label}>Leno Design Equipment:</Text>
                                <Text style={styles.value}>Required</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedEnquiry(null)}>
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => DeleteEnq()}>
                            <Text style={styles.backButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </ScrollView>
                ) : (
                    <FlatList
                        data={enquiries}
                        renderItem={renderEnquiryItem}
                        keyExtractor={(item) => item.EnquiryId.toString()}
                    />
                )}
            </View>
        </View>
    );
}

export default GeneratedEnquires;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: "#003c43",
        width: "100%",
    },
    backButtonContainer: {
        width: "20%",
        padding: "2%",
    },
    backButtonImage: {
        width: 34,
        height: 30,
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        paddingVertical: "2%",
        color: "#fff",
        marginRight: "20%", // Adjust to balance the header text
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: width * 0.05,
    },
    card: {
        padding: width * 0.04,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 8,
    },
    enquiryNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#000"
    },
    detailsContainer: {
        padding: width * 0.04,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: height * 0.01,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    value: {
        fontSize: 16,
        color: '#000',
    },
    backButton: {
        marginTop: height * 0.02,
        padding: height * 0.015,
        backgroundColor: '#135D66',
        borderRadius: 8,
    },
    deleteButton: {
        marginTop: height * 0.02,
        padding: height * 0.015,
        backgroundColor: 'red',
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});