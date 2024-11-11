import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert, Modal, ActivityIndicator, ToastAndroid, Dimensions, Linking } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { getAllCountries, getStatesOfCountry, getCitiesOfState, Country, State, City } from 'country-state-city';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox } from 'react-native-paper';
import HeaderPart from './HeaderPart';

const { width, height } = Dimensions.get('window');

const SignUpYarn = ({ navigation }) => {

  const [Email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [UserId, setUserId] = useState("");
  const [Password, setPassword] = useState('');
  const [loomShade, setLoomShade] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [ownercontactDetails, setOwnerContactDetails] = useState('');
  const [managercontactDetails, setManagerContactDetails] = useState('');
  const [otherscontactDetails, setOthersContactDetails] = useState('');
  const [primaryContactNo, setPrimaryContactNo] = useState('');
  const [TotalNoOfLooms, setTotalNoOfLooms] = useState("");
  const [LoomOrTrader, setLoomOrTrader] = useState(null);
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [value3, setValue3] = useState(null);
  const [isFocus, setIsFocus] = useState("")
  const [isFocus2, setIsFocus2] = useState("")
  const [isFocus3, setIsFocus3] = useState("")
  const [selectedOption, setSelectedOption] = useState('');
  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [show3, setShow3] = useState(true)
  const [show4, setShow4] = useState(false)
  const [show2, setShow2] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);

  const showToast = () => {
    ToastAndroid.show("Account Created Successfully", ToastAndroid.SHORT);
  };

  const showToast1 = () => {
    ToastAndroid.show("Details Inserted Successfully", ToastAndroid.SHORT);
  };

  const showToast2 = () => {
    ToastAndroid.show("Data Inserted Successfully", ToastAndroid.SHORT);
  };


  const dataArray = [ownercontactDetails, managercontactDetails, otherscontactDetails];

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setEmail("");
    setShow4(false)
    setShow3(true)
  };

  const validateFields = () => {
    if (
      !Email ||
      !Password ||
      !loomShade
    ) {
      Alert.alert("Please fill in all the required fields");
      return false;
    }
    // You can add additional validation checks here if needed
    return true;
  };

  const validateFields2 = () => {
    if (
      !ownerName ||
      !address ||
      !gstNo ||
      !value ||
      !value2 ||
      !value3 ||
      !registrationNo ||
      !primaryContactNo
    ) {
      Alert.alert("Please fill in all the required fields");
      return false;
    }
    // You can add additional validation checks here if needed
    return true;
  };


  const validateFields3 = () => {
    if (
      !dataArray ||
      !selectedOption
    ) {
      Alert.alert("Please fill in all the required fields");
      return false;
    }
    // You can add additional validation checks here if needed
    return true;
  };


  const postAPI = () => {

    console.log("PostApi called")




    const formdata = new FormData();
    formdata.append("AppUserId", Email);
    formdata.append("Name", loomShade);
    formdata.append("Password", Password);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/postappuser.php", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log("PostApi called 2")
        console.log(result)
        showToast();
        postDetails();

      })
      .catch((error) => {
        console.error(error)
        if (error.response && error.response.status === 500) {
          toggleModal()
        } else {
          console.log(error);
        }
      });

  };


  const sendOTP = () => {

    const formdata = new FormData();
    formdata.append("Email", Email);
    formdata.append("Name", loomShade);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/sendemailotp.php", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        setShow3(false)
        setShow4(true)
        setShow2(false);
      })
      .catch((error) => {
        Alert.alert("Some Error Occured while submitting Data Please Try Again")
        console.error(error)
      });
  }


  const verifyotp = async () => {



    setShow2(true)
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://textileapp.microtechsolutions.co.in/php/verifyotp.php?otp=' + otp,
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        showToast();
        postAPI();
        setShow2(false);
      })
      .catch((error) => {
        console.log(error);
        setShow2(false);
      });




  }


  const postDetails = () => {

    console.log("PostDetails called")
    setShow2(true)
    console.log(Email, loomShade, ownerName, gstNo, address, pincode, value, value2, value3, registrationNo, primaryContactNo, "Total no", TotalNoOfLooms)
    try {
      const formdata = new FormData();
      formdata.append("AppUserId", Email);
      formdata.append("Name", loomShade);
      formdata.append("OwnerName", ownerName);
      formdata.append("GSTNumber", gstNo);
      formdata.append("Address", address);
      formdata.append("Pincode", pincode);
      formdata.append("Country", value);
      formdata.append("State", value2);
      formdata.append("City", value3);
      formdata.append("RegistrationNumber", "YR");
      formdata.append("PrimaryContact", primaryContactNo);
      formdata.append("TotalLooms", TotalNoOfLooms);
      formdata.append("LoomOrTrader", "Y");

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };

      fetch("https://textileapp.microtechsolutions.co.in/php/postdetail.php", requestOptions)
        .then((response) => response.text())
        .then((result) => getContact(result))
        .catch((error) => { console.error(error); });


      console.log("UserId : ", UserId)
    } catch (err) {
      console.log("Error : ", err)
    }



  }




  const getContact = (result) => {

    console.log("GetContact called")

    if (validateFields()) {


      try {
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://textileapp.microtechsolutions.co.in/php/postcontact.php',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            "LoomTraderDetailId": result,
            "OwnerNo": ownercontactDetails,
            'ManagerNo': managercontactDetails,
            'OtherNo': otherscontactDetails
          }
        };

        axios.request(config)
          .then((response) => {
            navigation.navigate("Login")
            console.log(JSON.stringify(response.data));
            console.log(ownercontactDetails, managercontactDetails, otherscontactDetails)
            showToast2();
            setEmail("");
            setPassword("")
            setLoomShade("");
            setOwnerName("");
            setAddress("");
            setValue("");
            setValue2("");
            setValue3("");
            setPincode("");
            setPrimaryContactNo("");
            setGstNo("")
            setOwnerContactDetails("");
            setManagerContactDetails("");
            setOthersContactDetails("");
          })
          .catch((error) => {
            console.log(error);

          });

        setShow(false)
        setShow4(false)
        setShow3(true)
        setShow2(false);
        console.log("Contact Number", dataArray, "Designation", selectedOption, "LoomTraderDetailId", UserId)
      } catch (err) {
        console.log("Error :", err)
      }
    }


  }



  const send = () => {

    if (!Email,
      !Password,
      !value,
      !value3,
      !value2,
      !loomShade,
      !ownerName,
      !address,
      !gstNo,
      !selectedOption,
      !registrationNo,
      !contactDetails,
      !primaryContactNo) {
      handleEmailChange()
      Alert.alert("Please Insert Details Properly")

    } else {
      let data = JSON.stringify({
        "AppUserId": Email,
        "Password": Password,
        "Name": loomShade,
        "OwnerName": ownerName,
        "GSTNumber": gstNo,
        "Address": address,
        "Pincode": pincode,
        "Country": value,
        "State": value2,
        "City": value3,
        "RegistrationNumber": registrationNo,
        "contactDetails": contactDetails,
        "PrimaryContact": primaryContactNo
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://textileapp.microtechsolutions.co.in/php/postdetail.php',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    }

  };


  const [isSelected, setSelection] = useState(false);

  const handlePrivacyPolicy = () => {
    const privacyUrl = "https://textileapp.microtechsolutions.co.in/file/privacypolicy.html"; // Replace with your Privacy Policy URL
    Linking.canOpenURL(privacyUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(privacyUrl);
        } else {
          Alert.alert("Error", "Unable to open the privacy policy.");
        }
      })
      .catch(() => Alert.alert("Error", "An unexpected error occurred."));
  };


  const countries = Country.getAllCountries().map(Country => ({ label: Country.name, value: Country.isoCode }));
  const states = State.getAllStates().map(State => ({ label: State.name, value: State.name }));
  const cities = City.getAllCities().map(City => ({ label: City.name, value: City.name }));



  return (
    <View style={styles.container}>
<HeaderPart />

      {/* https://textileapp.microtechsolutions.co.in/php/getappuser.php */}

      {show3 ?
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: 'center', height: 50, backgroundColor: '#003C43' }}>

            <TouchableOpacity
              //onPress={() => { setShow(true), setShow1(false), setShow2(false), setShow3(false) }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" color="white" size={30} padding={6} />

            </TouchableOpacity>

            <View style={{ flex: 0.9, alignItems: 'center' }}>
              <Text style={{ fontSize: 26, color: "white", fontWeight: "500" }}> Kapada Banao </Text>

            </View>

          </View>
          <ScrollView >
            <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>


              <Image
                source={require('../Images/img2.jpg')}
                style={{
                  width: '65%', height: 200,
                }}

              />
              <View style={{ alignItems: 'center', marginTop: '10%', marginBottom: 20 }}>
                <Text style={{ fontSize: 28, color: "#003C43", fontWeight: "500" }}> Sign </Text>
              </View>


              <View style={{ borderBottomWidth: 3, marginBottom: "5%", borderColor: "#003C43", width: "90%", justifyContent: "center", alignItems: "center" }}>
                <View style={styles.input}>


                  <Icon name="email-outline" color="#003C43" size={32} padding={8} marginLeft={8} />

                  <TextInput
                    style={{ marginLeft: "5%", color: "black", width: "70%" }}
                    placeholder='Email'
                    placeholderTextColor={"#003C43"}
                    onChangeText={(txt) => setEmail(txt)}
                    value={Email}

                  />
                </View>

                <View style={styles.input}>


                  <Icon name="lock-open-outline" color="#003C43" size={32} padding={8} marginLeft={8} />

                  <TextInput
                    style={{ marginLeft: "5%", color: "black", width: "70%" }}
                    placeholder='Password'
                    placeholderTextColor={"#003C43"}
                    onChangeText={(txt) => setPassword(txt)}
                    value={Password}
                  />



                </View>
                <View style={styles.input}>


                  <Icon name="account" color="#003C43" size={32} padding={8} marginLeft={8} />


                  <TextInput
                    placeholder='Name of Company / User'
                    placeholderTextColor={"#003C43"}
                    style={{ marginLeft: "5%", color: "black", width: "70%"}}
                    onChangeText={(txt) => setLoomShade(txt)}
                    value={loomShade}
                  />

                </View>
              </View>


              <View style={{ borderBottomWidth: 3, marginBottom: "5%", borderColor: "#003C43", width: "90%", justifyContent: "center", alignItems: "center" }}>
                <View style={styles.input}>

                  <TextInput
                    style={{ marginLeft: "5%", color: "black", width: "70%",padding:"5%" }}
                    placeholder='Promoter/ Owner Name'
                    placeholderTextColor={"#003C43"}
                    onChangeText={(txt) => setOwnerName(txt)}
                    value={ownerName}

                  />
                </View>


                <View style={styles.input}>
                  <TextInput
                    placeholder=' GST No.'
                    placeholderTextColor={"#003C43"}
                    style={{ marginLeft: "5%", color: "black", width: "70%",padding:"5%" }}
                    onChangeText={(txt) => setGstNo(txt)}
                    value={gstNo}
                  />
                </View>

                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={countries}
                  search
                  itemTextStyle={{ color: "black" }}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select Country' : '...'}
                  searchPlaceholder="Search..."
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                  }} />

                <Dropdown
                  style={[styles.dropdown, isFocus2 && { borderColor: 'blue' }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={states}
                  search
                  itemTextStyle={{ color: "#000" }}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus2 ? 'Select State' : '...'}
                  searchPlaceholder="Search..."
                  value={value2}
                  onFocus={() => setIsFocus2(true)}
                  onBlur={() => setIsFocus2(false)}
                  onChange={item => {
                    setValue2(item.value);
                    setIsFocus2(false);
                  }} />

                <Dropdown
                  style={[styles.dropdown, isFocus3 && { borderColor: 'blue' }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={cities}
                  search
                  itemTextStyle={{ color: "#000" }}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus3 ? 'Select City' : '...'}
                  searchPlaceholder="Search..."
                  value={value3}
                  onFocus={() => setIsFocus3(true)}
                  onBlur={() => setIsFocus3(false)}
                  onChange={item => {
                    setValue3(item.value);
                    setIsFocus3(false);
                  }} />


                <View style={styles.input}>
                  <TextInput
                    placeholder=' Address'
                    placeholderTextColor={"#003C43"}
                    style={{ marginLeft: "5%", color: "black", width: "70%",padding:"5%" }}
                    onChangeText={(txt) => setAddress(txt)}
                    value={address}
                  />
                </View>
                <View style={styles.input}>
                  <TextInput
                    placeholder=' Pincode'
                    placeholderTextColor={"#003C43"}
                    style={{ marginLeft: "5%", color: "black", width: "70%" ,padding:"5%"}}
                    onChangeText={(txt) => setPincode(txt)}
                    value={pincode}
                  />
                </View>


                <View style={styles.input}>
                  <TextInput
                    placeholder=' WhatsApp No.'
                    placeholderTextColor={"#003C43"}
                    style={{ marginLeft: "5%", color: "black", width: "70%" ,padding:"5%"}}
                    onChangeText={(txt) => setPrimaryContactNo(txt)}
                    value={primaryContactNo}
                  />
                </View>

              </View>

              <View style={{ borderBottomWidth: 3, marginBottom: "5%", borderColor: "#003C43", width: "90%", justifyContent: "center", alignItems: "center" }}>
                <View style={[styles.input, { marginTop: 30 }]}>

                  <Icon name="account-tie" color="#003C43" size={32} padding={8} />

                  <TextInput
                    style={{ marginLeft: "5%", color: "black", width: "70%" }}
                    placeholder='Owner Contact Details'
                    placeholderTextColor={"#003C43"}
                    onChangeText={(txt) => setOwnerContactDetails(txt)}
                    value={ownercontactDetails}

                  />
                </View>

                <View style={styles.input}>


                  <Icon name="account-star" color="#003C43" size={32} padding={8} />

                  <TextInput
                    style={{ marginLeft: "5%", color: "black", width: "70%" }}
                    placeholder='Manager Contact Details'
                    placeholderTextColor={"#003C43"}
                    onChangeText={(txt) => setManagerContactDetails(txt)}
                    value={managercontactDetails}

                  />
                </View>

                <View style={styles.input}>


                  <Icon name="account-plus" color="#003C43" size={32} padding={8} />

                  <TextInput
                    style={{ marginLeft: "5%", color: "black", width: "70%" }}
                    placeholder='Others Contact Details'
                    placeholderTextColor={"#003C43"}
                    onChangeText={(txt) => setOthersContactDetails(txt)}
                    value={otherscontactDetails}

                  />
                </View>

              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkboxBorder}>
                  <Checkbox
                    status={isSelected ? 'checked' : 'unchecked'}
                    onPress={() => setSelection(!isSelected)}
                    color="#2F539B" // Color when checked
                    uncheckedColor="#666" // Color when unchecked
                  />
                </View>
                <Text style={styles.label}>I accept the </Text>
                <TouchableOpacity onPress={handlePrivacyPolicy}>
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={styles.label}> and Terms and Conditions</Text>
              </View>


              <TouchableOpacity
                style={[styles.button, isSelected ? styles.buttonEnabled : styles.buttonDisabled]}
                disabled={!isSelected} // Disable button if checkbox is not selected
                onPress={() => { sendOTP() }}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                {
                  show2 ? <ActivityIndicator size={70} color="green" /> : null
                }
              </View>


            </View>
          </ScrollView>
        </View>
        : null}


      {show4 ?
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: 'center', height: 50, backgroundColor: '#003C43' }}>

            <TouchableOpacity
              //onPress={() => { setShow(true), setShow1(false), setShow2(false), setShow3(false) }}
              onPress={() => { setShow3(true), setShow4(false) }}
            >
              <Icon name="arrow-left" color="white" size={30} padding={6} />

            </TouchableOpacity>

            <View style={{ flex: 0.9, alignItems: 'center' }}>
              <Text style={{ fontSize: 26, color: "white", fontWeight: "500" }}> Kapada Banao </Text>

            </View>

          </View>

          <View style={{ flex: 1, alignItems: 'center', marginTop: '10%', }}>


            <Image
              source={require('../Images/img2.jpg')}
              style={{
                width: '65%', height: 200,
              }}

            />
            <View style={{ alignItems: 'center', marginTop: '10%', marginBottom: 20 }}>
              <Text style={{ fontSize: 28, color: "#003C43", fontWeight: "500" }}> Verify OTP </Text>
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






            <TouchableOpacity style={styles.loginButton} onPress={() => verifyotp()}>
              <Text style={styles.loginText}> Verify </Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              {
                show2 ? <ActivityIndicator size={70} color="green" /> : null
              }
            </View>

          </View>
        </View>
        : null}


      {/* https://textileapp.microtechsolutions.co.in/php/getdetail.php */}


      {/* https://textileapp.microtechsolutions.co.in/php/getcontact.php */}


    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    width: width * 0.83,  // 83% of screen width
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#003C43",
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    padding: 2
  },
  loginButton: {
    width: width * 0.5,  // 50% of screen width
    height: 50,
    backgroundColor: '#003C43',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: height * 0.1,  // 10% of screen height
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  dropdown: {
    width: width * 0.82,  // 82% of screen width
    height: 58,
    borderColor: '#003C43',
    borderWidth: 2,
    borderRadius: 18,
    paddingHorizontal: 8,
    color: "black",
    marginTop: 12,
    marginBottom: 12,
    textDecorationColor: "grey",
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'grey',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: "#003C43",
    fontSize: 15
  },
  selectedTextStyle: {
    color: "black"
  },
  iconStyle: {
    width: 35,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    width: width * 1.2,  // 120% of screen width
    color: "black"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    marginTop: height * 0.8,  // 80% of screen height
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: width * 0.4,  // 40% of screen width
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  checkboxBorder: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    marginRight:"2%",
},
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  linkText: {
    fontSize: 16,
    color: '#2F539B',
    textDecorationLine: 'underline',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    marginBottom: "5%"
  },
  buttonEnabled: {
    backgroundColor: '#003C43',
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SignUpYarn