import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ImageBackground, SafeAreaView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderPart from './HeaderPart';

const MyLoom = ({ navigation }) => {
    const [loomList, setLoomList] = useState([]);
    const [selectedLoom, setSelectedLoom] = useState(null);

    useEffect(() => {
        const fetchLoomList = async () => {
            try {
                const LoomTraderId = await AsyncStorage.getItem("Id");
                if (LoomTraderId) {
                    const response = await axios.get(`https://textileapp.microtechsolutions.co.in/php/bookingjoin.php?LoomTraderId=${LoomTraderId}`);
                    if (response.data) {
                        // Filter out duplicates based on LoomNo
                        const uniqueLoomList = response.data.filter((loom, index, self) =>
                            index === self.findIndex((t) => t.LoomNo === loom.LoomNo)
                        );
                        setLoomList(uniqueLoomList);
                    }
                } else {
                    console.error('No LoomTraderId found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error fetching loom list:', error);
            }
        };

        fetchLoomList();
    }, []);

    const handleLoomClick = (loom) => {
        setSelectedLoom(loom);
    };

    const renderLoomDetails = () => {
        if (!selectedLoom) return null;

        return (
            <SafeAreaView>
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailsTitle}>Details for Loom No:  {selectedLoom.LoomNo}</Text>
                    <Text style={styles.detailText}>Machine Type:   {selectedLoom.MachineType}</Text>
                    <Text style={styles.detailText}>Width:   {selectedLoom.Width}</Text>
                    <Text style={styles.detailText}>RPM:   {selectedLoom.RPM}</Text>
                    <Text style={styles.detailText}>Shedding Type:   {selectedLoom.SheddingType}</Text>
                    <Text style={styles.detailText}>No of Frames:   {selectedLoom.NoofFrames}</Text>
                    <Text style={styles.detailText}>No of Feeders:   {selectedLoom.NoofFeeders}</Text>
                    <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditLooms", { selectedLoom })}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.historyContainer}>
                    <Text style={styles.historyHeader}>History of Loom No :- {selectedLoom.LoomNo}</Text>

                    <View style={styles.historyItem}>
                        <Text style={styles.historyText}>OrderNo:   {selectedLoom.OrderNo}</Text>
                        <Text style={styles.historyText}>PartyName:   {selectedLoom.PartyName}</Text>
                        <Text style={styles.historyText}>BookedDateFrom:   {selectedLoom.BookedDateFrom ? selectedLoom.BookedDateFrom.date.substring(0, 10) : 'N/A'}</Text>
                        <Text style={styles.historyText}>BookedDateTo:   {selectedLoom.BookedDateTo ? selectedLoom.BookedDateTo.date.substring(0, 10) : 'N/A'}</Text>
                    </View>

                </View>
            </SafeAreaView>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
        
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ padding: "1%",paddingTop:45 }} onPress={() => navigation.goBack()}>
                    <ImageBackground
                        source={require("../Images/back.png")}
                        style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003c43", marginTop: 0, marginRight: 0, marginLeft: 10 }}
                        imageStyle={{ borderRadius: 0 }}
                    />
                </TouchableOpacity>
                <Text style={styles.header}>Loom Booking</Text>
            </View>
            {!selectedLoom && loomList.map((loom) => (

                <TouchableOpacity key={loom.LoomNo} style={styles.loomButton} onPress={() => handleLoomClick(loom)}>
                    <Text style={styles.loomText}>Loom No: {loom.LoomNo}</Text>
                </TouchableOpacity>

            ))}
            {selectedLoom && renderLoomDetails()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#E5E5E5',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#003c43',
        width: "100%",
        marginBottom: "15%"
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        textAlign: 'center',
        marginRight: "5%", // Adjust margin to balance the header text
        paddingTop:55
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#003C43',
        marginBottom: 20,
    },
    loomButton: {
        width: '90%',
        padding: 15,
        borderColor: '#003C43',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

    },
    loomText: {
        fontSize: 18,
        color: '#003C43',
    },
    detailsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003C43',
        marginVertical: 20,
        alignSelf: 'center',
    },
    detailsContainer: {
        width: '90%',
        padding: 20,
        borderColor: '#003C43',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        alignItems: 'flex-start',
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 20,
    },
    detailText: {
        fontSize: 16,
        color: '#003C43',
        marginBottom: 10,
    },
    editButton: {
        backgroundColor: '#FF7722',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'center',
        width: '50%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    historyContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    historyHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#003C43',
        textAlign: 'center',
    },
    historyItem: {
        marginBottom: 10,
    },
    historyText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
});

export default MyLoom;