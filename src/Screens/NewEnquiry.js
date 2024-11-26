import { SafeAreaView, StyleSheet, Text, View, StatusBar, Image, ImageBackground, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, FlatList, Button, ScrollView, Alert, Pressable, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import HeaderPart from './HeaderPart';
import ImagePicker from 'react-native-image-crop-picker';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


const NewEnquiry = ({ navigation }) => {


  const [isFocus3, setIsFocus3] = useState(false);
  const [isFocus4, setIsFocus4] = useState(false);
  const [isFocus5, setIsFocus5] = useState(false);
  const [isFocus6, setIsFocus6] = useState(false);
  const [showDateFrom, setShowDateFrom] = useState(false)
  const [showDateTo, setShowDateTo] = useState(false)
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [datefrom, setDateFrom] = useState(new Date());
  const [dateto, setDateTo] = useState(new Date());
  const [updatedDateFrom, setUpdatedDateFrom] = useState("")
  const [updatedDateTo, setUpdatedDateTo] = useState("")
  const [modefrom, setModeFrom] = useState("date");
  const [modeto, setModeTo] = useState("date");
  const [fabricLength, setFabricLength] = useState('');
  const [dalalAgent, setDalalAgent] = useState('');
  const [loomNo, setLoomNo] = useState('');
  const [machineType, setMachineType] = useState('');
  const [width, setWidth] = useState('');
  const [rpm, setRpm] = useState('');
  const [sheddingType, setSheddingType] = useState('');
  const [numFrames, setNumFrames] = useState('');
  const [numFeeders, setNumFeeders] = useState('');
  const [selvadgeJacquard, setSelvadgeJacquard] = useState(false);
  const [topBeam, setTopBeam] = useState(false);
  const [cramming, setCramming] = useState(false);
  const [lenoDesign, setLenoDesign] = useState(false);
  const [availableLoomDates, setAvailableLoomDates] = useState('');
  const [numLoomsRequired, setNumLoomsRequired] = useState('');
  const [numLoomsPossible, setNumLoomsPossible] = useState('');
  const [jobRateOffered, setJobRateOffered] = useState('');
  const [counterOffer, setCounterOffer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [Name, setName] = useState("");
  const [AppUserId, setAppUserId] = useState("")
  const [LoomOrTrader, SetLoomOrTrader] = useState("")
  const [id, setId] = useState("")
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDeliveryDate, setShowDeliveryDate] = useState(false);
  const [designPaper, setDesignPaper] = useState(null);
  const [fabricWidth, setFabricWidth] = useState("");
  const [description, setDescription] = useState("")
  const [modalVisible2, setModalVisible2] = useState(false);
  const [date, setDate] = useState(null)
  const width1 = Dimensions.get('window');


  const handleDeliveryDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deliveryDate;
    setShowDeliveryDate(false);
    setDeliveryDate(currentDate);
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setDesignPaper(image);
    }).catch(error => {
      console.log('ImagePicker Error: ', error);
    });
  };

  // Open Gallery
  const openGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setDesignPaper(image);
    }).catch(error => {
      console.log('ImagePicker Error: ', error);
    });
  };

  // Provide option to choose Camera or Gallery
  const chooseImageOption = () => {
    Alert.alert(
      "Upload Design Paper",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: openCamera
        },
        {
          text: "Gallery",
          onPress: openGallery
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };


  // Format date in 'YYYY-MM-DD' format
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;

  };

  useEffect(() => {
    fetchselectedEnquiryId();
    const callfuns = () => {
      fetch("")
        .then(getData())
    }
    callfuns();

    const getTodaysDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(today.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    const todaysDate = getTodaysDate();
    setTodaysDate(todaysDate);
    console.log(todaysDate)

  }, [])

  const [TodaysDate, setTodaysDate] = useState(null)


  const fetchselectedEnquiryId = async () => {
    try {
      const response = await axios.get('https://textileapp.microtechsolutions.co.in/php/getidenquiry.php?Colname=TraderId&Colvalue=' + id);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };



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
        .then(NOFds())
        .then(NOFRs())
        .then(Shedd())
        .then(mactype())
    }

    callfuns();
  }, [])

  const handleItemPress = (item) => {
    setSelectedItem(item);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={[styles.cell, { flex: 1 }]}>
        <Text style={{ color: '#000' }}>{item.srNo}</Text>
      </View>
      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={{ color: '#000' }}>{item.enquiryNo}</Text>
      </View>
      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={{ color: '#000' }}>{item.date}</Text>
      </View>
      <View style={[styles.cell, { flex: 3 }]}>
        <Text style={{ color: '#000' }}>{item.traderName}</Text>
      </View>
    </View>
  );



  const showModefrom = (currentMode) => {
    setShowDateFrom(true);
    setModeFrom(currentMode);

  }

  const showModeto = (currentMode) => {
    setShowDateTo(true);
    setModeTo(currentMode)
  }


  const yesbutton = () => {
    setModalVisible2(false)
    setModalVisible(false)
    navigation.goBack()
    setDesignPaper(null)
  }


  const DateFrom = (event, selectedDate) => {
    const currentDate = selectedDate || datefrom;
    setShowDateFrom(Platform.OS == 'ios');
    setDateFrom(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    setUpdatedDateFrom(fDate)

    console.log(fDate)
  }

  const DateTo = (event, selectedDate) => {
    const currentDate = selectedDate || dateto;
    setShowDateTo(Platform.OS == 'ios');
    setDateTo(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    setUpdatedDateTo(fDate)

    console.log(fDate)
  }

  const current = (event, selectedDate) => {
    const currentDate = selectedDate || dateto;
    setShowDateTo(Platform.OS == 'ios');
    setDateTo(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    setUpdatedDateTo(fDate)

    console.log(fDate)
  }

  const [showDate, setShowDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');

  const showDatePicker = () => {
    setShowDate(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDate(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    setFormattedDate(formattedDate);
  };


  const [EnquiryId, setEnquiryId] = useState("")

  const handleSubmit = (calculatedResult) => {
    if (!calculatedResult || !fabricLength || !machineType || !numFrames) {
      Alert.alert("Please insert all fields");
    } else {
      console.log("Fabric Quality = ", calculatedResult);

      const formdata = new FormData();
      formdata.append("EnquiryDate", TodaysDate || '0');
      formdata.append("TraderId", id || '0');
      formdata.append("BookingFrom", updatedDateFrom || '0');
      formdata.append("BookingTo", updatedDateTo || '0');
      formdata.append("FabricQuality", calculatedResult || '0');
      formdata.append("FabricLength", fabricLength || '0');
      formdata.append("LoomRequired", numLoomsRequired || '0');
      formdata.append("AgentName", dalalAgent || '0');
      formdata.append("OfferedJobRate", jobRateOffered || '0');
      formdata.append("FabricWidth", fabricWidth || '0');
      formdata.append("DeliveryDate", formattedDate || '0');
      formdata.append("Description", description || '0');
      formdata.append("Date", date || '0');


      if (designPaper && designPaper.path) {
        formdata.append('Photopath', {
          uri: designPaper.path,
          type: "image/jpg",
          name: "designPaper.jpg",
        });
      } else {
        formdata.append('Photopath', '0'); // Change from null to '0'
      }

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };

      fetch("https://textileapp.microtechsolutions.co.in/php/postenquiry.php", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          SubmitEnquiryDetails(result);
        })
        .catch((error) => console.error(error));
    }
  };

  const SubmitEnquiryDetails = (result) => {
    const formdata = new FormData();
    formdata.append("EnquiryId", result || '0');
    formdata.append("LoomNo", numLoomsRequired || '0');
    formdata.append("MachineType", machineType || '0');
    formdata.append("Width", width || '0');
    formdata.append("RPM", rpm || '0');
    formdata.append("SheddingType", sheddingType || '0');
    formdata.append("NoofFrame", numFrames || '0');
    formdata.append("NoofFeedero", numFeeders || '0');
    formdata.append("SelvageJacquard", selvadgeJacquard || '0');
    formdata.append("TopBeam", topBeam || '0');
    formdata.append("Cramming", cramming || '0');
    formdata.append("LenoDesignEquipment", lenoDesign || '0');

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/postenquirydetail.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    setModalVisible2(true);
    ClearData();
  };

  const ClearData = () => {
    setNumLoomsRequired("")
    setMachineType("")
    setWidth("")
    setRpm("")
    setSheddingType("")
    setNumFrames("")
    setNumFeeders("")
    setSelvadgeJacquard("")
    setTopBeam("")
    setCramming("")
    setLenoDesign("")
    setJobRateOffered("")
    setUpdatedDateFrom("")
    setUpdatedDateTo("")
    setEpi("")
    setPpi("")
    setWarpCount("")
    setWeftCount("")
    setPanna("")
    setFabricLength("")
    setDalalAgent("")
    setFormattedDate("")
    setDescription("")
    setDesignPaper(null)
  }


  const [epi, setEpi] = useState('');
  const [ppi, setPpi] = useState('');
  const [warpCount, setWarpCount] = useState('');
  const [weftCount, setWeftCount] = useState('');
  const [panna, setPanna] = useState('');
  const [result, setResult] = useState('');

  const calculateResult = () => {

    if (!epi || !ppi || !warpCount || !weftCount || !panna) {
      Alert.alert("Set The Value Of Fabric Quality")
    } else {
      const epiValue = epi;
      const ppiValue = ppi;
      const warpCountValue = warpCount;
      const weftCountValue = weftCount;
      const pannaValue = panna;

      if (epiValue && ppiValue && warpCountValue && weftCountValue && pannaValue) {
        const calculatedResult = (epiValue + "*" + ppiValue + "/" + warpCountValue + "*" + weftCountValue + ":" + pannaValue);
        handleSubmit(calculatedResult)
      } else {
        setResult('Invalid input in fabric quality');
      }
    }


  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

     <HeaderPart />
      <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 50 }}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../Images/back.png")}
            style={{ width: 28, height: 22, marginLeft: 10, }}

          />
        </TouchableOpacity>


        <View style={{ flex: 0.9, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, color: "white", fontWeight: 500 }}>  Plan Looms </Text>
        </View>

      </View>
      <ScrollView>
        <View style={styles.containerform}>

          {/* Date Fields */}
          <View style={{ flexDirection: "column", justifyContent: "space-evenly" }}>
            <Text style={{ marginTop: "3%", fontSize: 20, marginLeft: "0%", color: "#000", fontWeight: "500" }}>Date : {TodaysDate}</Text>

            <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500", marginTop: "5%" }}>Expected Delivery Date :- </Text>
            <View style={{ flexDirection: "row", marginTop: "2%" }}>

              <TextInput
                style={[styles.input, { width: "100%" }]}
                value={date}
                onChangeText={setDate}
                placeholder="DD-MM-YYYY"
                keyboardType="numeric"
                placeholderTextColor={"grey"}
              />
            </View>


          </View>

          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500" }}>
            Fabric Quality :- <Text style={styles.redText}>*</Text>
          </Text>

          <View style={styles.fabricQuality}>
            <TextInput
              style={styles.fabricDetails}
              placeholder="Reed"
              keyboardType="default"
              placeholderTextColor={"grey"}
              value={epi}
              onChangeText={setEpi}
            />
            <Text style={styles.operatorText}> * </Text>
            <TextInput
              style={styles.fabricDetails}
              placeholder="PPI"
              keyboardType="default"
              placeholderTextColor={"grey"}
              value={ppi}
              onChangeText={setPpi}
            />
            <Text style={styles.operatorText}> / </Text>
            <TextInput
              style={styles.fabricDetails}
              placeholder={`Warp\nCount`}
              keyboardType="default"
              placeholderTextColor={"grey"}
              value={warpCount}
              onChangeText={setWarpCount}
            />
            <Text style={styles.operatorText}> * </Text>
            <TextInput
              style={styles.fabricDetails}
              placeholder={`Weft\nCount`}
              keyboardType="default"
              placeholderTextColor={"grey"}
              value={weftCount}
              onChangeText={setWeftCount}
            />
            <Text style={styles.operatorText}> : </Text>
            <TextInput
              style={styles.fabricDetails}
              placeholder={`Reed\nSpace`}
              keyboardType="default"
              placeholderTextColor={"grey"}
              value={panna}
              onChangeText={setPanna}
            />
          </View>



          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500" }}>Fabric Length :- <Text style={styles.redText}>*</Text> </Text>
          <TextInput

            style={styles.input}
            value={fabricLength}
            onChangeText={setFabricLength}
            placeholder="Total Fabric Length (in meters)"
            keyboardType="numeric"
            placeholderTextColor={"grey"}

          />
          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500" }}>Fabric Width :- </Text>
          <View style={{ flexDirection: "row", marginTop: "2%" }}>

            <TextInput
              style={[styles.input, { width: "100%" }]}
              value={fabricWidth}
              onChangeText={setFabricWidth}
              placeholder="Fabric Width (In inches)"
              keyboardType="numeric"
              placeholderTextColor={"grey"}
            />
          </View>

          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500", fontWeight: "500" }}>Agent Name :-</Text>
          <TextInput
            style={[styles.input, { width: "100%" }]}
            value={dalalAgent}
            onChangeText={(txt) => setDalalAgent(txt)}
            placeholder="Dalal / Agent Name"
            keyboardType='default'
            placeholderTextColor={"grey"}
          />


          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500" }}>Machine Type :- <Text style={styles.redText}>*</Text> </Text>
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

          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500" }}>Machine Width :- </Text>
          <View style={{ flexDirection: "row", marginTop: "2%" }}>
            <TextInput
              style={[styles.input, { width: "100%" }]}
              value={width}
              onChangeText={setWidth}
              placeholder="Machine Width In CM"
              keyboardType="numeric"
              placeholderTextColor={"grey"}

            />
          </View>


          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500" }}>RPM:-</Text>
          <TextInput
            style={styles.input}
            value={rpm}
            onChangeText={setRpm}
            placeholder="RPM"
            keyboardType="numeric"
            placeholderTextColor={"grey"}

          />

          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500" }}>Shedding Type :- </Text>
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

          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500" }}>No Of Feeders :- </Text>
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
            value={numFeeders}
            onFocus={() => setIsFocus6(true)}
            onBlur={() => setIsFocus6(false)}
            onChange={item => {
              setNumFeeders(item.value);
              setIsFocus6(false);
            }} />


          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500" }}>No Of Frames :-<Text style={styles.redText}> *</Text></Text>
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
            value={numFrames}
            onFocus={() => setIsFocus5(true)}
            onBlur={() => setIsFocus5(false)}
            onChange={item => {
              setNumFrames(item.value);
              setIsFocus5(false);
            }} />


          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500" }}>No Of Looms Required :- </Text>
          <TextInput
            style={styles.input}
            value={numLoomsRequired}
            onChangeText={setNumLoomsRequired}
            placeholder="No. of Looms Required"
            keyboardType="numeric"
            placeholderTextColor={"grey"}

          />


          <Text style={{ color: "#000", fontSize: 18, marginLeft: "1%", fontWeight: "500" }}>Job Rate:-</Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={[styles.input, { width: "100%" }]}
              value={jobRateOffered}
              onChangeText={setJobRateOffered}
              placeholder="Job Rate Offered (In Paisa)"
              placeholderTextColor={"grey"}
            />
          </View>


          <View style={{
            borderWidth: 1.5,
            borderColor: "#000",
            margin: "2%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10

          }}>
            <Text style={styles.loomAttachmentsTitle}>Other Loom Attachments</Text>

            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxLabel}>Selvadge Jacquard</Text>
              <View style={styles.checkboxBorder}>
                <Checkbox
                  status={selvadgeJacquard ? 'checked' : 'unchecked'}
                  color="blue"
                  uncheckedColor="black"
                  onPress={() => setSelvadgeJacquard(!selvadgeJacquard)}
                />
              </View>
              <Text style={styles.requiredText}>Required</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxLabel}>Top Beam</Text>
              <View style={styles.checkboxBorder}>
                <Checkbox
                  status={topBeam ? 'checked' : 'unchecked'}
                  color="blue"
                  uncheckedColor="black"
                  onPress={() => setTopBeam(!topBeam)}
                />
              </View>
              <Text style={styles.requiredText}>Required</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxLabel}>Cramming</Text>
              <View style={styles.checkboxBorder}>
                <Checkbox
                  status={cramming ? 'checked' : 'unchecked'}
                  color="blue"
                  uncheckedColor="black"
                  onPress={() => setCramming(!cramming)}
                />
              </View>
              <Text style={styles.requiredText}>Required</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxLabel}>Leno Design Equipment</Text>
              <View style={styles.checkboxBorder}>
                <Checkbox
                  status={lenoDesign ? 'checked' : 'unchecked'}
                  color="blue"
                  uncheckedColor="black"
                  onPress={() => setLenoDesign(!lenoDesign)}
                />
              </View>
              <Text style={styles.requiredText}>Required</Text>
            </View>

          </View>

          <View style={{ marginTop: "0%" }}>
            <Text style={{ marginRight: "3%", fontSize: 17, color: "#000", marginBottom: "2%", marginVertical: "3%", fontWeight: "600" }}>Description (Optional)</Text>

            <TextInput
              style={[styles.input, { width: "100%" }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              keyboardType='default'
              placeholderTextColor={"grey"}
              multiline={true} // Allows multiple lines of input
              numberOfLines={5}
            />
          </View>



          <View style={{ flexDirection: "column", marginVertical: "5%", marginTop: "5%" }}>
            <Text style={{ color: "#000", fontSize: 18, fontWeight: "500" }}>Upload Design Paper</Text>
            <View style={{ flexDirection: "row" }}>
              {designPaper && (
                <ImageBackground
                  source={{ uri: designPaper.path }}
                  style={{ width: 100, height: 100, margin: 10, marginTop: "10%" }}
                />
              )}
              {!designPaper && (
                <TouchableOpacity onPress={chooseImageOption}>
                  <ImageBackground
                    source={require('../Images/camera.png')}
                    style={{ width: 34, height: 30, alignSelf: 'flex-start', marginLeft: "30%", marginTop: "15%" }}
                    imageStyle={{ borderRadius: 0 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: "5%" }}>
            <TouchableOpacity style={[styles.button]} onPress={() => { calculateResult() }}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.notInterestedButton]} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

          </View>
          <Text style={{ marginTop: "20%" }}></Text>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible2(!modalVisible2);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Data Submitted Successfully</Text>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Image
                style={{ width: 50, height: 50 }}
                source={require("../Images/success.png")}
              />
              <Pressable
                style={[styles.button1, styles.buttonClose1]}
                onPress={() => yesbutton(!modalVisible2)}>
                <Text style={styles.textStyle1}>Close</Text>
              </Pressable>

            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are You Sure To Cancel This Offer ?</Text>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button1, styles.buttonClose1]}
                onPress={() => yesbutton(!modalVisible)}>
                <Text style={styles.textStyle1}>Yes</Text>
              </Pressable>
              <Pressable
                style={[styles.button1, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default NewEnquiry

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 30,
    alignItems: 'center',
    width: width * 1,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    //   borderWidth: 1,
    borderColor: '#000',
  },

  headerText: {
    fontWeight: 'bold',
    color: "#000",
    fontSize: 15
  },
  headerText1: {
    color: "#000",
    fontSize: 15
  },
  row: {
    flexDirection: 'row',
    //   borderWidth: 1,
    borderColor: '#000',
  },
  cell: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    color: "#000"
  },
  fabricQuality: {
    width: width * 0.90,
    flexDirection: "row",
    marginLeft: "-1%",
  },
  fabricDetails: {
    flex: 1,
    height: height * 0.055,
    width: width * 0.19,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: height * 0.02,
    fontSize: 14,
    color: "#000",
    fontWeight: "800",
  },
  flatList: {
    marginTop: 10,
    color: "#000"
  },
  containerform: {
    padding: 20,
    color: "#000",
    width: width * 0.99,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 17,
    color: "#000",
    fontWeight: "500"
  },
  input1: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 20,
    color: "#000"
  },
  button: {
    backgroundColor: '#003C43',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  redText: {
    color: 'red',
    fontSize: 24, // You can adjust the size as needed
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notInterestedButton: {
    backgroundColor: 'red',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
},
checkboxLabel: {
    fontSize: 16,
    marginRight: 10,
},
requiredText: {
    marginLeft: 10,
    fontSize: 12,
    color: 'red',
},
checkboxBorder: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    padding: 0, // Optional: adjust padding to fit the checkbox snugly within the border
},
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 16,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
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
  button1: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    paddingHorizontal: 15
  },
  buttonOpen: {
    backgroundColor: "red",
  },
  buttonClose: {
    backgroundColor: "red",
    margin: "5%"
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: "red"
  },
  buttonOpen1: {
    backgroundColor: "#003C43",
  },
  buttonClose1: {
    backgroundColor: "#003C43",
    margin: "5%"
  },
  textStyle1: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: "#003C43"
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: "#000",
    fontSize: 17
  },
  btn: {
    height: 150,
    width: width * 0.8,
    padding: 10,
    borderRadius: 15,
    borderWidth: 3,
    marginBottom: 30,
    borderColor: '#003C43',
    alignItems: 'center'
  },
  fabricQuality: {
    width: '100%', // Ensure it uses full width of the screen
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between inputs for better layout
    alignItems: 'center',
    marginVertical: 10, // Add vertical margin for better spacing on different screens
  },
  fabricDetails: {
    flex: 1, // Each input takes up equal width
    height: height * 0.07, // Responsive height based on screen height
    marginHorizontal: 5, // Adjusts horizontal margin between inputs
    borderColor: '#000',
    borderWidth: 1.2,
    borderRadius: 8, // Rounded corners for a better look
    paddingHorizontal: 8, // Adds padding inside input
    textAlign: 'center', // Center text in input fields
    fontSize: 13, // Responsive font size
    color: "#000",
  },
  operatorText: {
    fontSize: 20, // Ensure the operator signs (*, /, :) are large enough
    color: "#000",
  },
  redText: {
    color: 'red',
    fontSize: 20, // Highlight the red asterisk for required fields
  },
  loomAttachmentsTitle: {
    color: "#003C43",
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10, // Adjusted for better vertical spacing
    textAlign: "center", // Centers the title on the screen
  },
  checkboxContainer: {
    flexDirection: "row", // Row direction to keep the checkbox and label in line
    alignItems: "center", // Centers items vertically
    width: "100%", // Full width of the screen
    marginVertical: 10, // Vertical margin between checkboxes
    paddingHorizontal: 10, // Padding inside for better alignment on all screens
  },
  checkboxLabel: {
    fontSize: 17, // Responsive font size
    color: "#000",
    fontWeight: "500",
    flex: 1, // The label will expand to fill the available space
  },
  requiredText: {
    fontSize: 17, // Keep the same font size as the label
    color: "#000",
    flex: 0.5, // The "Required" text will take up less space
    textAlign: "right", // Align it to the right
  },
})