import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
//import ExitApp from 'react-native-exit-app';

const Storage = ({ navigation }) => {
    // const route = useRoute()
    // const item = route.params.item1
    const [appUserId, setAppUserId] = useState("");
    const [name, setName] = useState('');
    const [show, setShow] = useState(false);
    const [loomOrTrader, setLoomOrTrader] = useState("");
    const [loading, setLoading] = useState(true);

    const closeApp = () => {
        Alert.alert(
            'Exit App',
            'Are you sure you want to exit the app?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => ExitApp.exitApp(),
                },
            ],
            { cancelable: false }
        );
    };

    const getData = async () => {
        const ID = await AsyncStorage.getItem("AppUserId");
        const name = await AsyncStorage.getItem("Name");
        const loomOrTrader = await AsyncStorage.getItem("LoomOrTrader");

        setAppUserId(ID);
        setName(name);
        setLoomOrTrader(loomOrTrader);
    };

    const checkLogin = async () => {
        const appUserId = await AsyncStorage.getItem('AppUserId');
        if (!appUserId) {
            navigation.navigate('Login');
        } else {
            navigation.navigate('Home');
        }
    };

    useEffect(() => {
        getData();
        setTimeout(() => {
            setLoading(false);
            setShow(true)
        }, 2000);
    }, []);

    useEffect(() => {
        checkLogin();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                show && (
                    <View>
                        <Text style={{ fontSize: 40, color: "#000" }}>Want to Exit App</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignSelf: "stretch", marginTop: "10%" }}>
                            <TouchableOpacity onPress={closeApp}>
                                <Text style={{ color: "red", fontSize: 20 }}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={{ color: "blue", fontSize: 20 }}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            )}
        </View>
    );
}

export default Storage;