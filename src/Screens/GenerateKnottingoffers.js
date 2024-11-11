import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Image, ScrollView, Dimensions } from 'react-native';
import { TextInput, Button, IconButton, Snackbar, Card, Title } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
//import ImagePicker from 'react-native-image-crop-picker';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const GenerateKnottingoffers = ({ navigation }) => {
    const [reed, setReed] = useState('');
    const [draft, setDraft] = useState('');
    const [reedSpace, setReedSpace] = useState('');
    const [noOfLooms, setNoOfLooms] = useState('');
    const [jobRateRequired, setJobRateRequired] = useState('');
    const [availableFrom, setAvailableFrom] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [designPaper, setDesignPaper] = useState(null);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || availableFrom;
        setShowDatePicker(false);
        setAvailableFrom(currentDate);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const handleSubmit = async () => {

        console.log(await AsyncStorage.getItem("Id"), reed, draft, reedSpace, noOfLooms, formatDate(availableFrom), jobRateRequired)

        const formdata = new FormData();
        formdata.append("Reed", reed);
        formdata.append("Draft", draft);
        formdata.append("ReedSpace", reedSpace);
        formdata.append("NoofLooms", noOfLooms);
        formdata.append("AvailableFrom", formatDate(availableFrom));
        formdata.append("JobRateRequired", jobRateRequired);
        formdata.append("LoomId", await AsyncStorage.getItem("Id"));
        if (designPaper) {
            formdata.append("DesignPaper", {
                uri: designPaper.path,
                type: "image/jpg",
                name: "Designpaper.jpg",
            });
        }

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch("https://textileapp.microtechsolutions.co.in/php/postknottingoffer.php", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                setSnackbarVisible(true);
            })
            .catch(error => console.error(error));
    };

    const handleImagePicker = () => {
        setModalVisible(true);
    };

    const pickFromGallery = () => {
        ImagePicker.openPicker({
            cropping: true,
            includeBase64: true,
        }).then(image => {
            setDesignPaper(image);
            setModalVisible(false);
        }).catch(error => {
            console.log(error);
            setModalVisible(false);
        });
    };

    const pickFromCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
            includeBase64: true,
        }).then(image => {
            setDesignPaper(image);
            setModalVisible(false);
        }).catch(error => {
            console.log(error);
            setModalVisible(false);
        });
    };

    const [enlargeImage, setEnlargeImage] = useState(false);
    const [enlargedImage, setEnlargedImage] = useState(null);

    const handleEnlargeImage = (image) => {
        setEnlargeImage(true);
        setEnlargedImage(image);
    };

    const handleExitEnlargeImage = () => {
        setEnlargeImage(false);
    };



    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={{padding:"2%", paddingTop:45}} onPress={() => navigation.goBack()}>
                    <Image source={require("../Images/back.png")} style={styles.drawerIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Generate Knotting Offers</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.content}>
                    <View style={styles.formSection}>
                        <Text style={styles.formTitle}>Knotting Offer Details</Text>
                        <TextInput
                            label="Reed"
                            value={reed}
                            onChangeText={setReed}
                            style={styles.input}
                            theme={{ colors: { primary: '#003C43' } }}
                            keyboardType="numeric"
                        />
                        <TextInput
                            label="Draft"
                            value={draft}
                            onChangeText={setDraft}
                            style={styles.input}
                            theme={{ colors: { primary: '#003C43' } }}
                        />
                        <TextInput
                            label="Reed Space"
                            value={reedSpace}
                            onChangeText={setReedSpace}
                            style={styles.input}
                            theme={{ colors: { primary: '#003C43' } }}
                            keyboardType="numeric"
                        />
                        <TextInput
                            label="No of Looms"
                            value={noOfLooms}
                            onChangeText={setNoOfLooms}
                            style={styles.input}
                            theme={{ colors: { primary: '#003C43' } }}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.formSection}>
                        <Text style={styles.formTitle}>Availability</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                            <TextInput
                                label="Available From"
                                value={availableFrom.toDateString()}
                                style={[styles.input, { flex: 1 }]}
                                editable={false}
                                theme={{ colors: { primary: '#003C43' } }}
                            />
                            <IconButton
                                icon="calendar"
                                size={30}
                                color="#003C43"
                                onPress={() => setShowDatePicker(true)}
                            />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={availableFrom}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}
                    </View>
                    <View style={styles.formSection}>
                        <Text style={styles.formTitle}>Job Rate Required</Text>
                        <TextInput
                            label="Job Rate Required"
                            value={jobRateRequired}
                            onChangeText={setJobRateRequired}
                            style={styles.input}
                            theme={{ colors: { primary: '#003C43' } }}
                            keyboardType="numeric"
                        />
                    </View>
                    <TouchableOpacity onPress={handleImagePicker} style={styles.uploadButton}>
                        <Text style={styles.uploadButtonText}>Upload Design Paper</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', marginTop: '-5%', marginBottom: '5%' }}>
                        <Icon name="information-circle" size={22} color="red" />
                        <Text style={{ color: 'red' }}>! Not Complusary</Text>
                    </View>
                    {designPaper && (
                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.cardTitle}>Design Paper Uploaded</Title>
                                <TouchableOpacity onPress={() => handleEnlargeImage(designPaper.path)}>
                                    <Image
                                        source={{ uri: designPaper.path }}
                                        style={styles.cardImage}

                                    />
                                </TouchableOpacity>
                            </Card.Content>
                        </Card>
                    )}

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={enlargeImage}
                        onRequestClose={handleExitEnlargeImage}
                    >
                        <View style={styles.enlargeImageContainer}>
                            <Image
                                source={{ uri: enlargedImage }}
                                style={styles.enlargeImage}
                            />
                            <TouchableOpacity onPress={handleExitEnlargeImage} style={styles.exitButton}>
                            <Icon name="exit" size={38} color="red" />
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
                        Submit
                    </Button>
                </View>
            </ScrollView>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={styles.snackbar}
            >
                Data submitted successfully
            </Snackbar>
            {snackbarVisible && (
                <LottieView
                    source={require('../Animation/success-animation.json')}
                    autoPlay
                    loop={false}
                    style={styles.animation}
                />
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Upload Design Paper</Text>
                        <TouchableOpacity onPress={pickFromGallery} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Pick from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickFromCamera} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Take a Photo</Text>
                        </TouchableOpacity>
                        <Button onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                            Cancel
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: "#003C43",
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        flexDirection: "row",
        elevation: 5,
    },
    drawerIcon: {
        width: 28,
        height: 22,
    },
    headerText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: "10%",
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        paddingTop:55
    },
    scrollViewContent: {
        paddingHorizontal: '5%',
        paddingVertical: '10%',
    },
    content: {
        padding: '5%',
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    formSection: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#f8f8f8',
        borderRadius: 15,
        elevation: 5,
    },
    formTitle: {
        fontSize: 18,
        color: '#003C43',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    uploadButton: {
        backgroundColor: '#003C43',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
    },
    uploadButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#003C43',
        paddingVertical: 15,
        borderRadius: 10,
        elevation: 5,
    },
    snackbar: {
        flex: 1,
        backgroundColor: '#FF7722',
        borderRadius: 10,
    },
    animation: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginTop: -100,
    },
    card: {
        marginBottom: 20,
        borderRadius: 15,
        elevation: 5,
        backgroundColor: '#f8f8f8',
        padding: 10,
    },
    cardTitle: {
        color: '#003C43',
        fontWeight: 'bold',
    },
    cardImage: {
        width: 40,
        height: 45,
        marginTop: "5%",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: width * 0.8,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        color: '#003C43',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#003C43',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalCloseButton: {
        borderColor: '#003C43',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    enlargeImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    enlargeImage: {
        width: width * 0.8,
        height: height * 0.8,
        resizeMode: 'contain',
    },
    exitButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },
    exitButtonText: {
        fontSize: 16,
        color: 'black',
    },
});

export default GenerateKnottingoffers;