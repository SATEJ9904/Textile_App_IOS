import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderPart from './HeaderPart';

const { width, height } = Dimensions.get('window');

const LoginOptions = ({ navigation }) => {
    const [show, setShow] = useState(false);

    return (
        <View style={styles.container}>
          <HeaderPart />
            <LinearGradient style={styles.gradient} colors={["#003C43", "#135D66", "#77B0AA", "#FF7722"]}>
                <View style={styles.logoContainer}>
                    <TouchableOpacity style={styles.btn1}>
                        <Image
                            source={require("../Images/company.png")}
                            style={styles.logo}
                        />
                    </TouchableOpacity>
                </View>
                {show && <ActivityIndicator size="large" color="green" style={styles.activityIndicator} />}
                <View style={styles.roleContainer}>
                    <View style={styles.roleTextContainer}>
                        <Text style={styles.roleText}>Select Your Role</Text>
                    </View>
                    <View style={styles.roles}>
                        <View style={styles.role}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => navigation.navigate("Signup")}
                            >
                                <Image
                                    style={styles.roleImage}
                                    source={require("../Images/loom.png")}
                                />
                                <Text style={styles.txt}>Loom Unit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.role}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => navigation.navigate("SignupTrader")}
                            >
                                <Image
                                    style={styles.roleImage}
                                    source={require("../Images/trader_.png")}
                                />
                                <Text style={styles.txt}>Trader Unit</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.role}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => navigation.navigate("SignUpYarn")}
                            >
                                <Image
                                    style={[styles.roleImage,{width:"80%"}]}
                                    source={require("../Images/thread.png")}
                                />
                                <Text style={[styles.txt,{marginTop:"5%"}]}>Yarn Unit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        height: "100%",
        width: "100%",

    },
    logoContainer: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center",
    },
    btn1: {
        height: width * 1,
        width: width * 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: (width * 0.6) / 2,
    },
    logo: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
    roleContainer: {
        flex: 1,
        alignItems: "center",
    },
    roleTextContainer: {
        marginBottom: 20,
    },
    roleText: {
        fontSize: 26,
        fontWeight: "600",
        color: "#fff",
        textAlign: 'center',
    },
    roles: {
        flex: 1,
        justifyContent: "space-around",
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    role: {
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: 20,
    },
    btn: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderColor: '#003C43',
        margin: 10,
        borderRadius: 20,
        overflow: 'hidden',
        width: width * 0.4,
        height: width * 0.4 + 50,
        borderWidth: 2,
    },
    roleImage: {
        height: '70%',
        width: '100%',
        resizeMode: 'contain',
        marginTop: 10,
    },
    txt: {
        fontSize: 18,
        fontWeight: "400",
        color: "#fff",
        backgroundColor: '#003C43',
        padding: 5,
        width: '100%',
        textAlign: 'center',
    },
    activityIndicator: {
        marginVertical: 20,
    },
});

export default LoginOptions;