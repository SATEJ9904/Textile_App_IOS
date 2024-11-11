import React, { useState, useEffect } from 'react';
import { ToastAndroid, Text, ActivityIndicator, TextInput, Alert, StyleSheet, Image, View, TouchableOpacity, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderPart from './HeaderPart';

const Login = ({ navigation, route }) => {
    const { email = '', password = '' } = route.params || {};

    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(0);
    const [visible, setVisible] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [response, setResponse] = useState([]);
    const [otp, setOtp] = useState('');
    const [newpassword, setNewpassword] = useState('');

    useEffect(() => {
        if (email) setEmail(email);
        if (password) setPassword(password);
    }, [email, password]);

    const validateInputs = () => {
        setShowAnimation(true)
        if (!Email || !Password) {
            Alert.alert("Please fill in all the fields");
            return false;
        } else {
            NewLogin();
        }
        return true;
    }

    const clear = () => {
        setEmail("");
        setPassword("");
    }

    const getAPIData = async () => {
        try {
            const url = "https://textileapp.microtechsolutions.co.in/php/getappuser.php";
            let result = await fetch(url);
            result = await result.json();

            result.length ? result.map((item) => {
                if (Email === item.AppUserId && Password === item.Password) {
                    console.log("successful");
                    console.log(item.id);
                    showRedirectAnimation(item);
                    clear();
                }
            }) : null;
        } catch (error) {
            console.log("Error", error);
        }
        setShow(false);
    }

    const showRedirectAnimation = (item) => {
        setShowAnimation(true);
        setTimeout(() => {

            navigation.navigate("Data", { item1: item });
            setShowAnimation(false);
        }, 3000); // Adjust the timeout as needed
    };

    const NewLogin = () => {
        //const qs = require('qs');
        // let data = qs.stringify({
        //     'AppUserId': Email,
        //     'Password': Password,
        // });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://textileapp.microtechsolutions.co.in/php/postlogin.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                'AppUserId': Email,
                'Password': Password,
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(response.data.Name);
                let item = response.data;
                showRedirectAnimation(item);
            })
            .catch((error) => {
                console.log(error);
                setShowAnimation(false);
                Alert.alert("Please Check The Crediantials Again")
            });
    }


    const ResetPassword = async () => {
        if (!Email) {
            Alert.alert("Please Insert only Email to Continue")
        } else {
            const formdata = new FormData();
            formdata.append("AppUserId", Email);

            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };

            fetch("https://textileapp.microtechsolutions.co.in/php/forgotpassword.php", requestOptions)
                .then((response) => response.text())
                .then((result) => { console.log(result); Alert.alert("OTP sent to Email please Check"); setVisible(true) })
                .catch((error) => console.error(error));
        }
    }




    const verifyotp = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://textileapp.microtechsolutions.co.in/php/verifyotp.php?otp=' + otp,
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setShow1(2);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleLogin = () => {
        setShow(true);
        if (!Email) {
            Alert.alert("Please Insert Your Email");
            setShow(false);
        } else if (!Password) {
            Alert.alert("Please Insert Your Password");
            setShow(false);
        } else {
            getAPIData();
        }
    };

    const reset = () => {
        // const qs = require('qs');
        // let data = qs.stringify({
        //     'AppUserId': Email,
        //     'Password': newpassword,
        // });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://textileapp.microtechsolutions.co.in/php/updatepassword.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                'AppUserId': Email,
                'Password': newpassword,
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(response.data);
                setShow1(0);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleBackPress=()=>{
    setShow1(0);
    }

    return (
        <View style={styles.container}>
            <HeaderPart />
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.8 }}
                style={{ flex: 1 }}
                colors={["#003C43", "#77B0AA"]}>
                <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>

                    <Image
                        style={{ height: "100%", width: "120%", marginLeft: 20 }}
                        source={require("../Images/company.png")}
                    />
                    {
                        show ? <ActivityIndicator size="large" color="#FFF" /> : null
                    }
                </View>
                <View style={{ flex: 1.5, backgroundColor: 'white', borderTopLeftRadius: 60, borderTopRightRadius: 60 }}>
                    {(() => {
                        if (show1 === 1) {
                            return (
                                <View>
                                    <View style={{ alignItems: 'center' }}>
                                            <TouchableOpacity onPress={handleBackPress} style={{alignSelf:"flex-start"}}> {/* Replace with your back navigation function */}
                                                <Image
                                                    source={require("../Images/back.png")}
                                                    style={{ width:40, height:40 ,tintColor:"black",marginTop:"5%"}}
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.title}> Verify OTP </Text>
                                        <View style={styles.inputContainer}>
                                            <Icon name="email-outline" color="#003C43" size={32} padding={8} marginLeft={8} />
                                            <TextInput
                                                style={styles.inputField}
                                                placeholder='Email'
                                                placeholderTextColor={"#003C43"}
                                                onChangeText={(txt) => setEmail(txt)}
                                                value={Email}
                                            />
                                        </View>
                                        <View style={styles.input}>
                                            <Icon name="form-textbox-password" color="#003C43" size={32} padding={8} marginLeft={8} />
                                            <TextInput
                                                style={{ marginLeft: "5%", color: "black", width: "70%" }}
                                                placeholder='OTP'
                                                placeholderTextColor={"#003C43"}
                                                onChangeText={(txt) => setOtp(txt)}
                                                value={otp}
                                            />
                                        </View>
                                        {visible ?
                                            <TouchableOpacity
                                                style={styles.verifyButton}
                                                onPress={() => verifyotp()}>
                                                <Text style={styles.buttonText}> Verify </Text>
                                            </TouchableOpacity>

                                            :

                                            <TouchableOpacity
                                                style={styles.verifyButton}
                                                onPress={() => ResetPassword()}>
                                                <Text style={styles.buttonText}> submit </Text>
                                            </TouchableOpacity>



                                        }

                                    </View>
                                </View>
                            )
                        }
                        if (show1 === 2) {
                            return (
                                <View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={styles.title}> Reset Password </Text>
                                        <View style={styles.input}>
                                            <Icon name="email" color="#003C43" size={32} padding={8} marginLeft={8} />
                                            <TextInput
                                                style={{ marginLeft: "5%", color: "black", width: "70%" }}
                                                placeholder='New password'
                                                placeholderTextColor={"#003C43"}
                                                onChangeText={(txt) => setNewpassword(txt)}
                                                value={newpassword}
                                            />
                                        </View>
                                        <TouchableOpacity
                                            style={styles.resetButton}
                                            onPress={() => reset()}>
                                            <Text style={styles.buttonText}> Confirm </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                        else {
                            return (
                                <ScrollView>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={styles.title}> Login </Text>
                                        <View style={styles.inputContainer}>
                                            <Icon name="email-outline" color="#003C43" size={32} padding={8} marginLeft={8} />
                                            <TextInput
                                                style={styles.inputField}
                                                placeholder='Email'
                                                placeholderTextColor={"#003C43"}
                                                onChangeText={(txt) => setEmail(txt)}
                                                value={Email}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Icon name="lock-open-outline" color="#003C43" size={30} padding={8} marginLeft={8} />
                                            <TextInput
                                                style={styles.inputField}
                                                placeholder='Password'
                                                placeholderTextColor={"#003C43"}
                                                onChangeText={(txt) => setPassword(txt)}
                                                value={Password}
                                                secureTextEntry={true}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.forgotPasswordContainer}>
                                        <TouchableOpacity onPress={() => setShow1(1)}>
                                            <Text style={styles.forgotPasswordText}> Forgot password ? </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={styles.loginButton}
                                            onPress={() => validateInputs()}
                                        >
                                            <Text style={styles.buttonText}>Log In</Text>
                                        </TouchableOpacity>
                                        <View style={styles.signUpContainer}>
                                            <Text style={styles.signUpText}> Don't have an account ? </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.signUpButton}
                                            onPress={() => navigation.navigate("LoginOptions")}>
                                            <Text style={styles.signUpButtonText}>Sign Up</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            );
                        }
                    })()}
                </View>
            </LinearGradient>
            {showAnimation && (
                <View style={styles.animationContainer}>
                    <LottieView
                        source={require('../Animation/car_animation.json')}
                        autoPlay
                        loop
                    />
                    <Text style={styles.redirectText}>Authenticanting User...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, // Adjust spacing as needed
    },
    title: {
        fontSize: 35,
        color: "#003C43",
        marginTop: '15%',
        fontWeight: "700",
    },
    input: {
        width: "83%",
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "#003C43",
        borderRadius: 20,
        marginTop: '10%',
        marginBottom: 10,
        padding: 2,
    },
    verifyButton: {
        width: "70%",
        marginTop: "8%",
        borderRadius: 20,
        backgroundColor: "#003C43",
        justifyContent: "center",
        alignItems: "center",
    },
    resetButton: {
        width: "70%",
        marginTop: "10%",
        borderRadius: 20,
        backgroundColor: "#FF7722",
        justifyContent: "center",
        alignItems: "center",
    },
    loginButton: {
        width: "70%",
        marginTop: "8%",
        borderRadius: 20,
        backgroundColor: "#003C43",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 25,
        padding: 8,
        marginLeft: "3%",
        fontWeight: "500",
    },
    inputContainer: {
        width: "85%",
        flexDirection: "row",
        borderWidth: 1.5,
        borderColor: "#003C43",
        borderRadius: 20,
        marginTop: "5%",
    },
    inputField: {
        marginLeft: "5%",
        color: "black",
        width: "70%",
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginTop: 2,
        paddingRight: 45,
    },
    forgotPasswordText: {
        color: "#FF7722",
        fontSize: 15,
        fontWeight: "500",
    },
    signUpContainer: {
        marginTop: "20%",
        marginBottom: 10,
    },
    signUpText: {
        color: "#FF7722",
        fontSize: 15,
        fontWeight: "500",
    },
    signUpButton: {
        width: "70%",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#003C43",
    },
    signUpButtonText: {
        color: "#003C43",
        fontSize: 25,
        padding: 7,
        marginLeft: "3%",
        fontWeight: "500",
    },
    animationContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    redirectText: {
        marginTop: 20,
        fontSize: 20,
        color: "#003C43",
        fontWeight: "bold",
    },
});

export default Login;