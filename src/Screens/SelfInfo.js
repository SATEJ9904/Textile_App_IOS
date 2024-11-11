import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderPart from './HeaderPart';

const SelfInfo = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState({});
    const [refreshing, setRefreshing] = useState(false);

    const getData = async () => {
        const userInfo = {
            Email: await AsyncStorage.getItem("AppUserId"),
            CompanyName: await AsyncStorage.getItem("Name"),
            OwnerName: await AsyncStorage.getItem("OwnerName"),
            Address: await AsyncStorage.getItem("Address"),
            Country: await AsyncStorage.getItem("Country"),
            State: await AsyncStorage.getItem("State"),
            City: await AsyncStorage.getItem("City"),
            Pincode: await AsyncStorage.getItem("Pincode"),
            PrimaryContact: await AsyncStorage.getItem("PrimaryContact"),
            RegistrationNumber: await AsyncStorage.getItem("RegistrationNumber"),
            GSTNumber: await AsyncStorage.getItem("GSTNumber"),
            Role: await AsyncStorage.getItem("LoomOrTrader"),
            Creation: await AsyncStorage.getItem("CreatedOn"),
            Id: await AsyncStorage.getItem("Id")

        };
        setUserInfo(userInfo);
        //console.log(userInfo)
    };

    useEffect(() => {
        getData();
        const focusListener = navigation.addListener('focus', getData);
        return focusListener;
    }, [navigation]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getData().then(() => setRefreshing(false));
    }, []);

    const roleDisplay = userInfo.Role === 'T' ? 'Trader' :userInfo.Role === "L"? 'Loom' :userInfo.Role === "Y" ? "Yarn":userInfo.Role === "A" ? "Admin":null;

    const countryFlag = (countryCode) => {
        // Return a country flag emoji based on the country code
        const countryFlags = {
            US: '🇺🇸',
            IN: '🇮🇳',
            // Add more country codes and flags as needed
        };
        return countryFlags[countryCode] || '';
    };

    return (
        <View style={styles.container}>
          <HeaderPart />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={require("../Images/back.png")}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Company Info</Text>
                </View>
            </View>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >

                <View style={{width:"100%",justifyContent:"center",alignItems:"center",marginTop:"5%"}}>
                <Text style={[styles.value,{fontWeight:"800",fontSize:28,marginBottom:"15%",color:"#003C43"}]}>{userInfo.CompanyName}</Text>

                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{userInfo.Email}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Owner Name / Promoter</Text>
                    <Text style={styles.value}>{userInfo.OwnerName}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Address</Text>
                    <Text style={styles.value}>{userInfo.Address}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>City</Text>
                    <Text style={styles.value}>{userInfo.City}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>State</Text>
                    <Text style={styles.value}>{userInfo.State}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Pincode</Text>
                    <Text style={styles.value}>{userInfo.Pincode}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Country</Text>
                    <Text style={styles.value}>{countryFlag(userInfo.Country)} {userInfo.Country}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Registration Number</Text>
                    <Text style={styles.value}>{userInfo.RegistrationNumber}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>GST Number</Text>
                    <Text style={styles.value}>{userInfo.GSTNumber}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Role</Text>
                    <Text style={styles.value}>{roleDisplay}</Text>
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate("EditProfile", { userInfo })}
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default SelfInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        backgroundColor: "#003C43",
        flexDirection: "row",
        alignItems: 'center',
        height: 50,
    },
    backButton: {
        padding: "2%",
    },
    backIcon: {
        width: 28,
        height: 22,
        marginLeft: 10,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center"
    },
    headerTitle: {
        fontSize: 26,
        color: "white",
        fontWeight: '500',
        marginLeft: "-15%"
    },
    content: {
        padding: 20,
    },
    infoSection: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        fontWeight: "600"
    },
    value: {
        fontSize: 16,
        color: '#555',
    },
    editButton: {
        backgroundColor: "#003C43",
        padding: 15,
        alignItems: 'center',
        marginTop: "15%",
        borderRadius: 5,
    },
    editButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: '500',
    }
});