import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderPart from './HeaderPart';

const ContactEdit = ({ navigation }) => {
    const [primaryContactNumber, setPrimaryContactNumber] = useState('');
    const [ownerContactNumber, setOwnerContactNumber] = useState('');
    const [ownerContactNumberId, setOwnerContactNumberId] = useState('');
    const [managerContactNumber, setManagerContactNumber] = useState('');
    const [managerContactNumberId, setManagerContactNumberId] = useState('');
    const [otherContactNumber, setOtherContactNumber] = useState('');
    const [otherContactNumberId, setOtherContactNumberId] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchContactDetails = async () => {
            try {
                const loomTraderDetailId = await AsyncStorage.getItem('Id');

                if (loomTraderDetailId) {
                    const contactDetailResponse = await fetch(`https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=ContactDetail&Colname=LoomTraderDetailId&Colvalue=${loomTraderDetailId}`);
                    const contactDetailJson = await contactDetailResponse.json();

                    const primaryContactResponse = await fetch(`https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${loomTraderDetailId}`);
                    const primaryContactJson = await primaryContactResponse.json();

                    primaryContactJson.map((item) => {
                        setPrimaryContactNumber(item.PrimaryContact)
                    });

                    const ownerContact = contactDetailJson.find(contact => contact.Designation === 'Owner');
                    if (ownerContact) {
                        setOwnerContactNumber(ownerContact.ContactNumber || '');
                        setOwnerContactNumberId(ownerContact.Id || '');
                    }

                    const managerContact = contactDetailJson.find(contact => contact.Designation === 'Manager');
                    if (managerContact) {
                        setManagerContactNumber(managerContact.ContactNumber || '');
                        setManagerContactNumberId(managerContact.Id || '');
                    }

                    const otherContact = contactDetailJson.find(contact => contact.Designation === 'Other');
                    if (otherContact) {
                        setOtherContactNumber(otherContact.ContactNumber || '');
                        setOtherContactNumberId(otherContact.Id || '');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchContactDetails();
    }, []);

    const handleSave = async () => {
        const loomTraderDetailId = await AsyncStorage.getItem('Id');

        const formdata = new FormData();
        formdata.append("LoomTraderDetailId", loomTraderDetailId);
        formdata.append("PrimaryContact", primaryContactNumber);
        formdata.append("OwnerNo", ownerContactNumber);
        formdata.append("OwnerNoId", ownerContactNumberId);
        formdata.append("ManagerNo", managerContactNumber);
        formdata.append("ManagerNoId", managerContactNumberId);
        formdata.append("OtherNo", otherContactNumber);
        formdata.append("OtherNoId", otherContactNumberId);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/editcontact.php", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));

        setIsEditing(false);
    };

    const handleDeleteAccount = async () => {
        // Add API call to delete account here
        console.log("Account deleted");
        navigation.navigate("Login");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
                        <HeaderPart />

            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ padding: "1%" }} onPress={() => navigation.goBack()}>
                    <ImageBackground
                        source={require("../Images/back.png")}
                        style={styles.backButtonImage}
                        imageStyle={{ borderRadius: 0 }}
                    />
                </TouchableOpacity>
                <Text style={styles.header}>Loom Booking</Text>
                <TouchableOpacity style={{ padding: "1%" }} onPress={() => setShowModal(true)}>
                    <ImageBackground
                        source={require("../Images/delete.png")}
                        style={styles.backButtonImage}
                        imageStyle={{ borderRadius: 0 }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.items}>
                <View style={styles.card}>
                    <Text style={styles.label}>Primary Contact Number</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={primaryContactNumber}
                            onChangeText={setPrimaryContactNumber}
                            />
                        ) : (
                            <Text style={styles.contactText}>{primaryContactNumber}</Text>
                        )}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Owner Contact Number</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={ownerContactNumber}
                                onChangeText={setOwnerContactNumber}
                            />
                        ) : (
                            <Text style={styles.contactText}>{ownerContactNumber}</Text>
                        )}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Manager Contact Number</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={managerContactNumber}
                                onChangeText={setManagerContactNumber}
                            />
                        ) : (
                            <Text style={styles.contactText}>{managerContactNumber}</Text>
                        )}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Other Contact Number</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={otherContactNumber}
                                onChangeText={setOtherContactNumber}
                            />
                        ) : (
                            <Text style={styles.contactText}>{otherContactNumber}</Text>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, isEditing && styles.cancelButton]} onPress={() => setIsEditing(!isEditing)}>
                            <Text style={styles.buttonText}>{isEditing ? "Cancel" : "Edit"}</Text>
                        </TouchableOpacity>
                        {isEditing && (
                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
    
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={() => {
                        setShowModal(!showModal);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
                            <View style={styles.modalButtonContainer}>
                              
                                <Pressable
                                    style={[styles.modalButton, styles.modalDeleteButton]}
                                    onPress={handleDeleteAccount}
                                >
                                    <Text style={styles.modalButtonText}>Yes</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.modalButton, styles.modalCancelButton]}
                                    onPress={() => setShowModal(!showModal)}
                                >
                                    <Text style={styles.modalButtonText}>No</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    };
    
    const styles = StyleSheet.create({
        container: {
            flexGrow: 1,
            backgroundColor: '#f5f5f5',
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            backgroundColor: '#003c43',
            width: "100%",
            marginBottom: 20,
        },
        backButtonImage: {
            width: 34,
            height: 30,
            alignSelf: 'flex-start',
            marginLeft: 10,
        },
        header: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            flex: 1,
            marginRight: 44, // Adjust margin to balance the header text
        },
        items: {
            flex: 1,
            padding: "5%"
        },
        card: {
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
        },
        label: {
            fontSize: 20,
            marginBottom: 8,
            color: '#003C43',
            fontWeight: "700",
            marginBottom: "5%"
        },
        contactText: {
            fontSize: 16,
            color: '#333',
        },
        input: {
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 4,
            paddingHorizontal: 10,
            fontSize: 16,
            backgroundColor: '#f9f9f9',
            color: "#333"
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
        },
        button: {
            backgroundColor: '#003C43',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginHorizontal: 10,
        },
        saveButton: {
            backgroundColor: '#003C43',
        },
        cancelButton: {
            backgroundColor: 'red',
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
        },
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22
        },
        modalView: {
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center",
            color:"#000",
            fontSize:18,
            fontWeight:"500"
        },
        modalButtonContainer: {
            width:"40%",
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
        },
        modalButton: {
            borderRadius: 20,
            padding: 10,
            elevation: 2
        },
        modalCancelButton: {
            backgroundColor: "#fff",
            borderColor: "#ddd",
            borderWidth: 1,
        },
        modalDeleteButton: {
            backgroundColor: "#FF3737",
        },
        modalButtonText: {
            color: "#000",
            fontSize: 16,
            textAlign: "center"
        }
    });
    
    export default ContactEdit;    