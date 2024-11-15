import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Animated, SafeAreaView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { AntDesign } from '@expo/vector-icons';
import HeaderPart from './HeaderPart';


const LoomDetails = ({ navigation }) => {
    const [loomNo, setLoomNo] = useState('');
    const [machineType, setMachineType] = useState([]);
    const [width, setWidth] = useState('');
    const [rpm, setRPM] = useState('');
    const [sheddingType, setSheddingType] = useState('');
    const [noOfFrames, setNoOfFrames] = useState([]);
    const [noOfFeeders, setNoOfFeeders] = useState([]);
    const [noOfLooms, setNoOfLooms] = useState('');
    const [selvageJacquard, setSelvageJacquard] = useState(false);
    const [topBeam, setTopBeam] = useState(false);
    const [cramming, setCramming] = useState(false);
    const [lenoDesignEquipment, setLenoDesignEquipment] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isFocus3, setIsFocus3] = useState(false);
    const [isFocus4, setIsFocus4] = useState(false);
    const [isFocus5, setIsFocus5] = useState(false);
    const [isFocus6, setIsFocus6] = useState(false);
    const [LoomOrTrader, SetLoomOrTrader] = useState("")
    const [currentDate, setCurrentDate] = useState('');
    const [sixMonthsLaterDate, setSixMonthsLaterDate] = useState('');

    const getData = async () => {
        const Name = await AsyncStorage.getItem("Name");
        const AppUserId = await AsyncStorage.getItem("AppUserId");
        const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
        const Id = await AsyncStorage.getItem("Id")

        setName(Name)
        setAppUserId(AppUserId)
        SetLoomOrTrader(LoomOrTrader)
        setId(Id)

    }



    const animationValueSelvage = useState(new Animated.Value(0))[0];
    const animationValueTopBeam = useState(new Animated.Value(0))[0];
    const animationValueCramming = useState(new Animated.Value(0))[0];
    const animationValueLenoDesign = useState(new Animated.Value(0))[0];

    const toggleSelvageCheckbox = () => {
        setIsSelvageChecked(!isSelvageChecked);
        Animated.timing(animationValueSelvage, {
            toValue: isSelvageChecked ? 0 : 1,
            duration: 300,
        }).start();
    };

    const toggleTopBeamCheckbox = () => {
        setIsTopBeamChecked(!isTopBeamChecked);
        Animated.timing(animationValueTopBeam, {
            toValue: isTopBeamChecked ? 0 : 1,
            duration: 300,
        }).start();
    };

    const toggleCrammingCheckbox = () => {
        setIsCrammingChecked(!isCrammingChecked);
        Animated.timing(animationValueCramming, {
            toValue: isCrammingChecked ? 0 : 1,
            duration: 300,
        }).start();
    };

    const toggleLenoDesignCheckbox = () => {
        setIsLenoDesignChecked(!isLenoDesignChecked);
        Animated.timing(animationValueLenoDesign, {
            toValue: isLenoDesignChecked ? 0 : 1,
            duration: 300,
        }).start();
    };

    const boxInterpolationSelvage = animationValueSelvage.interpolate({
        inputRange: [0, 1],
        outputRange: ['black', 'blue'],
    });

    const boxInterpolationTopBeam = animationValueTopBeam.interpolate({
        inputRange: [0, 1],
        outputRange: ['black', 'blue'],
    });

    const boxInterpolationCramming = animationValueCramming.interpolate({
        inputRange: [0, 1],
        outputRange: ['black', 'blue'],
    });

    const boxInterpolationLenoDesign = animationValueLenoDesign.interpolate({
        inputRange: [0, 1],
        outputRange: ['black', 'blue'],
    });

    const checkInterpolationSelvage = animationValueSelvage.interpolate({
        inputRange: [0, 1],
        outputRange: ['black', 'blue'],
    });

    const checkInterpolationTopBeam = animationValueTopBeam.interpolate({
        inputRange: [0, 1],
        outputRange: ['black', 'blue'],
    });

    const checkInterpolationCramming = animationValueCramming.interpolate({
        inputRange: [0, 1],
        outputRange: ['black', 'blue'],
    });

    const checkInterpolationLenoDesign = animationValueLenoDesign.interpolate({
        inputRange: [0, 1],
        outputRange: ['black', 'blue'],
    });


    const [isSelvageChecked, setIsSelvageChecked] = useState(false);
    const [isTopBeamChecked, setIsTopBeamChecked] = useState(false);
    const [isCrammingChecked, setIsCrammingChecked] = useState(false);
    const [isLenoDesignChecked, setIsLenoDesignChecked] = useState(false);

    const postAPI = async () => {
        if (!loomNo || !machineType || !width || !rpm || !sheddingType || !noOfFrames || !noOfFeeders || !noOfLooms) {
            Alert.alert("Please Insert The Form Properly")
        } else {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://textileapp.microtechsolutions.co.in/php/postloomdetail.php',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    'LoomTraderId': await AsyncStorage.getItem("Id"),
                    'LoomNo': loomNo,
                    'MachineType': machineType,
                    'Width': width,
                    'RPM': rpm,
                    'SheddingType': sheddingType,
                    'NoofFrames': noOfFrames,
                    'NoofFeeders': noOfFeeders,
                    'SelvageJacquard': isSelvageChecked,
                    'TopBeam': isTopBeamChecked,
                    'Cramming': isCrammingChecked,
                    'LenoDesignEquipment': isLenoDesignChecked,
                    'NoOfLooms': noOfLooms,
                    'Available': 'True',
                    'LoomAvailableFrom': currentDate,
                    'LoomAvailableTo': sixMonthsLaterDate,

                }
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    Alert.alert("Data Submitted Successfully")
                })
                .catch((error) => {
                    console.log(error);
                });
                clear();

            console.log('Form submitted:', await AsyncStorage.getItem("Id"), loomNo, machineType, width, rpm, sheddingType, noOfFrames, noOfFeeders, isSelvageChecked, isTopBeamChecked, isCrammingChecked, isLenoDesignChecked, noOfLooms, currentDate, sixMonthsLaterDate);
        }


    }

    const clear = () => {
        setLoomNo("")
        setMachineType("")
        setWidth("")
        setRPM("")
        setSheddingType("")
        setNoOfFrames("")
        setNoOfFeeders("")
        setNoOfLooms("")
        setIsSelvageChecked(false)
        setIsTopBeamChecked(false)
        setIsCrammingChecked(false)
        setIsLenoDesignChecked(false)
    }


    // Machine Type Data Fetching

    const [machineData, setMachineData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const mactype = () => {
        fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=MachineType')
            .then(response => response.json())
            .then(jsonData => {
                setMachineData(jsonData); // Update state with fetched data
                setIsLoading(false); // Update loading state to false
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Update loading state to false even in case of error
            });
    }

    const machineDataType = machineData.map(item => ({ label: item.Name, value: item.Name }));


    //   Shedding Type Fetching

    const [shedding, setShedding] = useState([]);

    const Shedd = () => {
        fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=SheddingType')
            .then(response => response.json())
            .then(jsonData => {
                setShedding(jsonData); // Update state with fetched data
                setIsLoading(false); // Update loading state to false
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Update loading state to false even in case of error
            });
    }

    const sheddingData = shedding.map(item => ({ label: item.Name, value: item.Name }));


    //  No Of Frames Data Fetching 

    const [numofframes, setNumofFrames] = useState([]);


    const NOFRs = () => {
        fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=NoOfFrame')
            .then(response => response.json())
            .then(jsonData => {
                setNumofFrames(jsonData); // Update state with fetched data
                setIsLoading(false); // Update loading state to false
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Update loading state to false even in case of error
            });
    }

    const numofFramesData = numofframes.map(item => ({ label: item.Range.toString(), value: item.Range }));



    // No Of Feeders Data Fetching


    const [nooffeeders, setNumOFFeeders] = useState([]);


    const NOFds = () => {
        fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=NoOfFeeders')
            .then(response => response.json())
            .then(jsonData => {
                setNumOFFeeders(jsonData); // Update state with fetched data
                setIsLoading(false); // Update loading state to false
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Update loading state to false even in case of error
            });
    }

    const nooffeedersdata = nooffeeders.map(item => ({ label: item.Range.toString(), value: item.Range }));



    useEffect(() => {
        const callfuns = () => {
            fetch("")
                .then(getData())
                .then(NOFds())
                .then(NOFRs())
                .then(Shedd())
                .then(mactype())
            const today = moment().format('YYYY-MM-DD');
            setCurrentDate(today);

            // Setting date six months later
            const sixMonthsLater = moment().add(6, 'months').format('YYYY-MM-DD');
            setSixMonthsLaterDate(sixMonthsLater);
        }

        callfuns();
    }, [])

    return (


        <View style={{flex:1,backgroundColor:"#fff"}}>
          <HeaderPart />
            <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 50 }}>

                <TouchableOpacity
                 style={{padding:"3%"}}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={require("../Images/back.png")}
                        style={{ width: 28, height: 22, marginLeft: 10, }}

                    />
                </TouchableOpacity>


                <View style={{ flex: 0.9, alignItems: 'center' }}>
                    <Text style={{ fontSize: 26, color: "white", fontWeight: 500 }}> Loom Details </Text>
                </View>

            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Loom Details Form</Text>
                </View>

                {/* Input fields */}
                {/* LoomNo */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Loom No</Text>
                    <TextInput
                        style={styles.input}
                        value={loomNo}
                        onChangeText={setLoomNo}
                    />
                </View>



                {/* MachineType */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Machine Type</Text>
                    <Dropdown
                        style={[styles.input, isFocus3 && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={machineDataType}
                        search
                        itemTextStyle={{ color: "#000" }}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus3 ? 'Select Machine Type' : '...'}
                        searchPlaceholder="Search..."
                        value={machineType}
                        onFocus={() => setIsFocus3(true)}
                        onBlur={() => setIsFocus3(false)}
                        onChange={item => {
                            setMachineType(item.value);
                            setIsFocus3(false);
                        }} />
                </View>

                {/* SheddingType */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Shedding Type</Text>
                    <Dropdown
                        style={[styles.input, isFocus4 && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={sheddingData}
                        search
                        itemTextStyle={{ color: "#000" }}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus4 ? 'Select shedding Type' : '...'}
                        searchPlaceholder="Search..."
                        value={sheddingType}
                        onFocus={() => setIsFocus4(true)}
                        onBlur={() => setIsFocus4(false)}
                        onChange={item => {
                            setSheddingType(item.value);
                            setIsFocus4(false);
                        }} />
                </View>

                {/* Width */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Width</Text>
                    <TextInput
                        style={styles.input}
                        value={width}
                        onChangeText={setWidth}
                    />
                </View>

                {/* RPM */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>RPM</Text>
                    <TextInput
                        style={styles.input}
                        value={rpm}
                        onChangeText={setRPM}
                    />
                </View>



                {/* NoofFrames */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>No of Frames</Text>
                    <Dropdown
                        style={[styles.input, isFocus5 && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={numofFramesData}
                        search
                        itemTextStyle={{ color: "#000" }}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus5 ? 'Select No. of Frames' : '...'}
                        searchPlaceholder="Search..."
                        value={noOfFrames}
                        onFocus={() => setIsFocus5(true)}
                        onBlur={() => setIsFocus5(false)}
                        onChange={item => {
                            setNoOfFrames(item.value);
                            setIsFocus5(false);
                        }} />
                </View>

                {/* NoofFeeders */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>No of Feeders</Text>
                    <Dropdown
                        style={[styles.input, isFocus6 && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={nooffeedersdata}
                        search
                        itemTextStyle={{ color: "#000" }}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus6 ? 'Select No. of Feeders' : '...'}
                        searchPlaceholder="Search..."
                        value={noOfFeeders}
                        onFocus={() => setIsFocus6(true)}
                        onBlur={() => setIsFocus6(false)}
                        onChange={item => {
                            setNoOfFeeders(item.value);
                            setIsFocus6(false);
                        }} />
                </View>

                {/* NoOfLooms */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>No of Looms</Text>
                    <TextInput
                        style={styles.input}
                        value={noOfLooms}
                        onChangeText={setNoOfLooms}
                    />
                </View>

                <View style={styles.OLA}>
                    <Text style={{ color: "#003c43", fontSize: 20, fontWeight: "600", marginTop: "6%", marginLeft: "4%" }}>Other Loom Attachments</Text>
                    {/* Selvage Jacquard Checkbox */}
                    <View style={[styles.checkboxContainer, { marginTop: "8%" }]}>
                        <Text style={[styles.label, { marginRight: "20%" }]}>Selvage Jacquard</Text>
                        <TouchableOpacity onPress={toggleSelvageCheckbox}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "15%" }}>
                                <Animated.View
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 4,
                                        borderWidth: 2,
                                        borderColor: boxInterpolationSelvage,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Animated.View
                                        style={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: 2,
                                            backgroundColor: checkInterpolationSelvage,
                                            transform: [{ scale: animationValueSelvage }],
                                        }}
                                    />
                                </Animated.View>
                                {/* Add label text here if needed */}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.label1}>Available</Text>
                    </View>

                    {/* Top Beam Checkbox */}
                    <View style={styles.checkboxContainer}>
                        <Text style={[styles.label, { marginRight: "36%" }]}>Top Beam</Text>
                        <TouchableOpacity onPress={toggleTopBeamCheckbox}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "15%" }}>
                                <Animated.View
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 4,
                                        borderWidth: 2,
                                        borderColor: boxInterpolationTopBeam,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Animated.View
                                        style={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: 2,
                                            backgroundColor: checkInterpolationTopBeam,
                                            transform: [{ scale: animationValueTopBeam }],
                                        }}
                                    />
                                </Animated.View>
                                {/* Add label text here if needed */}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.label1}>Available</Text>
                    </View>

                    {/* Cramming Checkbox */}
                    <View style={styles.checkboxContainer}>
                        <Text style={[styles.label, { marginRight: "35%" }]}>Cramming</Text>
                        <TouchableOpacity onPress={toggleCrammingCheckbox}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "15%" }}>
                                <Animated.View
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 4,
                                        borderWidth: 2,
                                        borderColor: boxInterpolationCramming,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Animated.View
                                        style={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: 2,
                                            backgroundColor: checkInterpolationCramming,
                                            transform: [{ scale: animationValueCramming }],
                                        }}
                                    />
                                </Animated.View>
                                {/* Add label text here if needed */}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.label1}>Available</Text>
                    </View>

                    {/* Leno Design Equipment Checkbox */}
                    <View style={styles.checkboxContainer}>
                        <Text style={styles.label}>Leno Design Equipment</Text>
                        <TouchableOpacity onPress={toggleLenoDesignCheckbox}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "15%" }}>
                                <Animated.View
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 4,
                                        borderWidth: 2,
                                        borderColor: boxInterpolationLenoDesign,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Animated.View
                                        style={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: 2,
                                            backgroundColor: checkInterpolationLenoDesign,
                                            transform: [{ scale: animationValueLenoDesign }],
                                        }}
                                    />
                                </Animated.View>
                                {/* Add label text here if needed */}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.label1}>Available</Text>
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={() => postAPI()}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f8f9fa',
    },
    headerContainer: {
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#003C43',
        marginTop: "6%"
    },
    inputContainer: {
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginLeft: "7%"
    },
    OLA: {
        borderWidth: 1,
        borderRadius: 30,
        marginBottom: "5%"
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
        marginRight: "8%"
    },
    label1: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
        marginLeft: "-10%"
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        color: "#000"
    },
    error: {
        fontSize: 12,
        color: 'red',
        marginTop: 5,
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#003C43',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 60
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    icon: {
        marginRight: 5,
    },

    placeholderStyle: {
        fontSize: 17,
        color: "grey"
    },
    selectedTextStyle: {
        fontSize: 17,
        color: "#000"
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 17,
    },
});

export default LoomDetails;
