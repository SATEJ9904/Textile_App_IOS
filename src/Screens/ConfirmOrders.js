import { SafeAreaView, StyleSheet, Text, View, Modal, Pressable, StatusBar, FlatList, RefreshControl, Dimensions, TouchableOpacity, ImageBackground, TextInput, ScrollView, Image, Button, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox } from 'react-native-paper';
import ImageCropPicker from 'react-native-image-crop-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderPart from './HeaderPart';



const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const ConfirmOrders = ({ navigation }) => {

  const [username, setUserName] = useState("");
  const [AppUserId, setAppUserId] = useState("")
  const [LoomOrTrader, SetLoomOrTrader] = useState("")
  const [id, setId] = useState("")


  useEffect(() => {
    getData();
    console.log(username, AppUserId, LoomOrTrader, id)
  }, [])


  const getData = async () => {
    const Name = await AsyncStorage.getItem("Name");
    const AppUserId = await AsyncStorage.getItem("AppUserId");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")
    const Id = await AsyncStorage.getItem("Id")

    setUserName(Name)
    setAppUserId(AppUserId)
    SetLoomOrTrader(LoomOrTrader)
    setId(Id)

  }


  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
    getCurrentDate();
    fetchDataFPAD();
    getData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);



  useEffect(() => {
    onRefresh();
    fetchData();
    handleButtonPress();
  }, []);


  const [orders, setOrders] = useState([]);


  const fetchData = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/loomliveorder.php?LoomTraderId=' + await AsyncStorage.getItem("Id"));
      const json = await response.json();
      const sortedOrdersJson = json.sort((a, b) => b.LoomOrderId - a.LoomOrderId);
      setOrders(sortedOrdersJson);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {

    getCurrentDate();
  }, []);

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    setCurrentDate(`${year}-${month}-${day}`);
  };


  const [showBlocks, setShowBlocks] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [Beaminform, setBeamInForm] = useState(false)
  const [weftform, setWeftform] = useState(false)
  const [fdFrom, setFdForm] = useState(false)
  const [remaining_goods_returnform, setremaining_Goods_ReturnForm] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [DrawingInForm, setDrawingInForm] = useState(false);
  const [beamGettingForm, setBeamGettingForm] = useState(false);
  const [fpaform, setFPAForm] = useState(false);
  const [show1, setShow1] = useState();




  const yesbutton = () => {
    setModalVisible(false)
  }

  const Initialstage = () => {
    console.log("called close")
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)
  }

  const FalseOthersBeamIn = () => {
    setBeamInForm(true);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)
  }

  const FalseOthersWeft = () => {
    setBeamInForm(false);
    setWeftform(true);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)

  }

  const FalseOthersFD = () => {
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(true);
    setremaining_Goods_ReturnForm(false);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)

  }

  const FalseOthersrgr = () => {
    console.log("called open")
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(true);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)

  }

  const FalseOthersDI = () => {
    setDrawingInForm(true)
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setBeamGettingForm(false)
    setFPAForm(false)

  }

  const FalseOthersBG = () => {
    setBeamGettingForm(true)
    setDrawingInForm(false)
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setFPAForm(false)

  }

  const FalseOthersFPA = () => {
    setFPAForm(true)
    setBeamGettingForm(false)
    setDrawingInForm(false)
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
  }

  const [getOrderNo, setGetOrderNo] = useState(null)

  const handleOrderPress = (order) => {
    handleButtonPress()
    setGetOrderNo(order.LoomOrderId)
    console.log(order.LoomOrderId)
    setSelectedOrder(order);
    setShowBlocks(false);
    fetchDataFPAD(order)
    setShopwForms(true)
    handleButtonPress()
    LoomBookedCount(order.LoomOrderId)
  };

  const [Action, setAction] = useState("")

  const handleButtonPress = (action) => {
    if (selectedOrder) {
      console.log(`Order No: ${selectedOrder.OrderNo}, Party Name: ${selectedOrder.PartyName}, Action: ${action}`);
      setAction("Order No. :    " + selectedOrder.OrderNo + "\nParty Name :    " + selectedOrder.PartyName + "\nQuality :    " + selectedOrder.Quality)
    }
  };

  const ToggleScreens = () => {
    setSelectedOrder(false)
    setShowBlocks(true)
    setBeamInForm(false)
    setWeftform(false)
    setFdForm(false)
    setremaining_Goods_ReturnForm(false)

  }

  // Beam Form 


  const [beamIn, setBeamIn] = useState([{ date: new Date(), SizingTippanNo: null, PhotoPath: BIImage }]);

  const [showDatePickerBI, setShowDatePickerBI] = useState(false);
  const [selectedDateIndexBI, setSelectedDateIndexBI] = useState(0);


  const handleDateChangeBI = (event, date) => {
    if (date) {
      const updatedRows = [...beamIn];
      updatedRows[selectedDateIndexBI].date = date;
      setBeamIn(updatedRows);
    }
    setShowDatePickerBI(false);
  };

  const handleInputChangeBI = (text, index, field) => {
    const updatedRows = [...beamIn];
    updatedRows[index][field] = text;
    setBeamIn(updatedRows);
  };

  const BIImage = require('../Images/camera.png')

  const handleAddRowBI = () => {
    const newFormData = [...beamIn, { date: new Date(), SizingTippanNo: '', PhotoPath: BIImage }];
    setBeamIn(newFormData);
  };

  const handleRemoveRowBI = (index) => {
    const newFormData = [...beamIn];
    newFormData.splice(index, 1);
    setBeamIn(newFormData);
  };

  const HandleSubmitBeamIn1 = (item) => {

    for (let i = 0; i < beamIn.length; i++) {

      const integerNumber = parseInt(item.SizingTippanNo, 10);
      console.log("Converted to Integer", integerNumber, item.date.toISOString().split('T')[0])
      let formatteddate = item.date.toISOString().split('T')[0]

      const formdata = new FormData();
      formdata.append("OrderNoId", getOrderNo);
      formdata.append("Date", formatteddate);
      formdata.append("SizingTippanNo", integerNumber);
      if (item.PhotoPath && item.PhotoPath.uri) {
        formdata.append('PhotoPath', {
          uri: item.PhotoPath.uri,
          type: "image/jpg",
          name: "cprograming.jpg",
        });
      } else {
        formdata.append('PhotoPath', null);
      }

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };

      fetch("https://textileapp.microtechsolutions.co.in/php/postorderbeam.php", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
      setModalVisible(true)
      setBeamInForm(false)
    }
  }

  const handleImagePickerBI = async (index) => {
    try {
      const image = await ImageCropPicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      });

      const updatedRows = [...beamIn];
      updatedRows[index].PhotoPath = { uri: image.path };
      console.log({ uri: image.path })
      setBeamIn(updatedRows);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };


  const HandleSubmitBeamIn = () => {

    {
      beamIn.map((item) => {
        HandleSubmitBeamIn1(item);
      })
    }
  }

  //WEFT Yard In Form 

  const WEFTImage = require('../Images/camera.png')
  const [Weft, setWeft] = useState([{ date: new Date(), GatePassNo: '', PhotoPathweft: require("../Images/camera.png") }]);

  const [showDatePickerWEFT, setShowDatePickerWEFT] = useState(false);
  const [selectedDateIndexWEFT, setSelectedDateIndexWEFT] = useState(0);


  const handleDateChangeWEFT = (event, date) => {
    if (date) {
      const updatedRows = [...Weft];
      updatedRows[selectedDateIndexWEFT].date = date;
      setWeft(updatedRows);
    }
    setShowDatePickerWEFT(false);
  };


  const handleInputChangeWEFT = (text, index, field) => {
    const updatedRows = [...Weft];
    updatedRows[index][field] = text;
    setWeft(updatedRows);
  };

  const handleAddRowWEFT = () => {
    const newFormData = [...Weft, { date: new Date(), GatePassNo: '', PhotoPathweft: require("../Images/camera.png") }];
    setWeft(newFormData);
  };

  const handleRemoveRowWEFT = (index) => {
    const newFormData = [...Weft];
    newFormData.splice(index, 1);
    setWeft(newFormData);
  };

  const HandleSubmitWEFT1 = (itemweft) => {

    for (let i = 0; i < Weft.length; i++) {

      const integerNumber = parseInt(itemweft.GatePassNo);
      console.log("Converted to Integer = ", integerNumber)
      let formatteddate = itemweft.date.toISOString().split('T')[0]



      const formdata = new FormData();
      formdata.append("OrderNoId", getOrderNo);
      formdata.append("Date", formatteddate);
      formdata.append("GatePassNo", integerNumber);
      if (itemweft.PhotoPathweft && itemweft.PhotoPathweft.uri) {
        formdata.append('PhotoPath', {
          uri: itemweft.PhotoPathweft.uri,
          type: "image/jpg",
          name: "cprograming.jpg",
        });
      } else {
        formdata.append('PhotoPath', null);
      }

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };

      fetch("https://textileapp.microtechsolutions.co.in/php/postorderyarn.php ", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
      setModalVisible(true)
      setWeftform(false)

    }


  }

  const handleImagePickerWEFT = async (index) => {
    try {
      const image = await ImageCropPicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      });

      const updatedRows = [...Weft];
      updatedRows[index].PhotoPathweft = { uri: image.path };
      console.log({ uri: image.path })
      setWeft(updatedRows);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };


  const HandleSubmitWEFT = () => {

    {
      Weft.map((itemweft) => {
        HandleSubmitWEFT1(itemweft);
      })
    }
  }

  // Drawing In

  const [DrawingIn, setDrawingIn] = useState(false)

  const SubmitDrawingIn = () => {
    const formdata = new FormData();
    formdata.append("OrderNoId", getOrderNo);
    formdata.append("Status", DrawingIn);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/postorderdrawingin.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    setDrawingInForm(false)
    setDrawingIn(false)
    console.log(DrawingIn)
  }

  // Beam Getting

  const [beamgetting, setBeamGetting] = useState(false)

  const SubmitBeamInGetting = () => {
    const formdata = new FormData();
    formdata.append("OrderNoId", getOrderNo);
    formdata.append("Status", beamgetting);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/postorderbeamgetting.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    setBeamGettingForm(false)
    setBeamGetting(false)
    console.log(beamgetting)
  }

  // First Piece Approval sending

  const [first_piece_approval, setFirst_Piece_Approval] = useState("")


  const SubmitFPA = async () => {


    console.log("Submitted Data = ", "User Id = ", id, "Order No = ", getOrderNo, "Comment = ", first_piece_approval)

    const formdata = new FormData();
    formdata.append("LoomTraderId", id);
    formdata.append("OrderNoId", getOrderNo);
    formdata.append("Comment", first_piece_approval);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/postorderfirstpiece.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    console.log(first_piece_approval)
    setFPAForm(false)
    setFirst_Piece_Approval("")
    setModalVisible(true)
  }


  // First Piece Approval Display

  const [FPAD, setFPAD] = useState([]);


  const fetchDataFPAD = async (order) => {

    console.log("Got Id = ", order.LoomOrderId)

    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getname.php?OrderNoId=' + order.LoomOrderId);
      const json = await response.json();
      setFPAD(json);

    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };

  // Fabric Dispatch

  const [tableRows, setTableRows] = useState([{ date: new Date(), Meter: '', Weight: '', PhotoPathFFD: require("../Images/camera.png") }]);
  const [showDatePickerFD, setShowDatePickerFD] = useState(false);
  const [selectedDateIndexFD, setSelectedDateIndexFD] = useState(0);
  const FDImage = require('../Images/camera.png')



  const handleDateChangeFD = (event, date) => {
    if (date) {
      const updatedRows = [...tableRows];
      updatedRows[selectedDateIndexFD].date = date;
      setTableRows(updatedRows);
    }
    setShowDatePickerFD(false);
  };

  const handleInputChangeFD = (text, index, field) => {
    const updatedRows = [...tableRows];
    updatedRows[index][field] = text;
    setTableRows(updatedRows);
  };

  const handleAddRowFD = () => {
    const newFormData = [...tableRows, { date: new Date(), Meter: '', weight: '', PhotoPathFFD: require("../Images/camera.png") }];
    setTableRows(newFormData);
  };

  const handleRemoveRowFD = (index) => {
    const newFormData = [...tableRows];
    newFormData.splice(index, 1);
    setTableRows(newFormData);
  };

  const HandleSubmitFD1 = (item, index) => {

    let formatteddate = item.date.toISOString().split('T')[0];
    const integerNumber = parseInt(item.Meter, 10);
    const integerNumber2 = parseInt(item.Weight, 10);
    console.log("Converted to Integer", integerNumber, integerNumber2, item.PhotoPathFFD.uri);

    const formdata = new FormData();
    formdata.append("OrderNoId", getOrderNo);
    formdata.append("Date", formatteddate);
    formdata.append("Weight", integerNumber2);
    formdata.append("Meter", integerNumber);

    if (item.PhotoPathFFD && item.PhotoPathFFD.uri) {
      formdata.append('PhotoPath', {
        uri: item.PhotoPathFFD.uri,
        type: "image/jpg",
        name: "cprograming.jpg",
      });
    } else {
      formdata.append('PhotoPath', null);
    }

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/postorderfabric.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    setModalVisible(true)
    setFdForm(false)

  };

  const HandleSubmitFD = () => {
    for (let i = 0; i < tableRows.length; i++) {
      const item = tableRows[i];
      if (!HandleSubmitFD1(item, i)) {
        return;
      }
    }
    setModalVisible(true);
    setWeftform(false);
  };

  const handleImagePickerFD = async (index) => {
    try {
      const image = await ImageCropPicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      });

      const updatedRows = [...tableRows];
      updatedRows[index].PhotoPathFFD = { uri: image.path };
      console.log({ uri: image.path })
      setTableRows(updatedRows);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  //REMAINING GOODS RETURN 

  const [remaining_goods_return, setRemaining_Goods_Return] = useState([{ GpNo: '', YarnCount: '', Weight: '', CutPiece: '', Meter: '', PhotopathRGR: require("../Images/camera.png") }]);


  const handleInputChangeRGR = (text, index, field) => {
    const updatedRows = [...remaining_goods_return];
    updatedRows[index][field] = text;
    setRemaining_Goods_Return(updatedRows);
  };

  const handleAddRowRGR = () => {
    const newFormData = [...remaining_goods_return, { GpNo: '', YarnCount: '', Weight: '', CutPiece: '', Meter: '', PhotopathRGR: require("../Images/camera.png") }];
    setRemaining_Goods_Return(newFormData);
  };

  const handleRemoveRowRGR = (index) => {
    const newFormData = [...remaining_goods_return];
    newFormData.splice(index, 1);
    setRemaining_Goods_Return(newFormData);
  };


  const handleImagePickerRGR = async (index) => {
    try {
      const image = await ImageCropPicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      });

      const updatedRows = [...remaining_goods_return];
      updatedRows[index].PhotopathRGR = { uri: image.path };
      console.log({ uri: image.path })
      setRemaining_Goods_Return(updatedRows);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const HandleSubmiRGR1 = (item) => {

    const integerNumber = parseInt(item.GpNo, 10);
    const integerNumber2 = parseInt(item.YarnCount, 10);
    const integerNumber3 = parseInt(item.Weight, 10);
    const integerNumber4 = parseInt(item.CutPiece, 10);
    const integerNumber5 = parseInt(item.Meter, 10);

    console.log("Converted to Integer", integerNumber, integerNumber2, integerNumber3, integerNumber4, integerNumber5);

    const formdata = new FormData();
    formdata.append("OrderNoId", getOrderNo);
    formdata.append("GpNo", integerNumber);
    formdata.append("YarnCount", integerNumber2);
    formdata.append("Weight", integerNumber3);
    formdata.append("CutPiece", integerNumber4);
    formdata.append("Meter", integerNumber5);
    if (item.PhotopathRGR && item.PhotopathRGR.uri) {
      formdata.append('PhotoPath', {
        uri: item.PhotopathRGR.uri,
        type: "image/jpg",
        name: "cprograming.jpg",
      });
    } else {
      formdata.append('PhotoPath', null);
    }

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/postorderreturn.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    setModalVisible(true)
    setremaining_Goods_ReturnForm(false)
  };

  const HandleSubmitRGR = () => {
    for (let i = 0; i < remaining_goods_return.length; i++) {
      const item = remaining_goods_return[i];
      if (!HandleSubmiRGR1(item, i)) {
        return;
      }
    }
    setModalVisible(true);
    setWeftform(false);
  };


  const startOrder = async (order) => {
    const confirmed = true
    try {
      const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/updateloomorder.php?LoomOrderId=${order.LoomOrderId}&Confirmed=${confirmed}`);

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      console.log('Order updated successfully');
      navigation.navigate("LiveBooking")
    } catch (error) {
      console.error(error);
    }
  };

  const cancelOrder = async (order) => {
    const confirmed = false
    try {
      const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/updateloomorder.php?LoomOrderId=${order.LoomOrderId}&Confirmed=${confirmed}`);

      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      fetchData();

      console.log('Order updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const [showforms, setShopwForms] = useState(false)

  const handlecontent = () => {
    setShowBlocks(true)
    setShopwForms(false)
  }

  const OrderFinished = () => {

    console.log(selectedOrder.LoomOrderId)


    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/finishloomorder.php?LoomOrderId=" + selectedOrder.LoomOrderId, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        Alert.alert("Order Completed Successfully")
        setShowBlocks(true)
        setShopwForms(false)
        fetchData()
      })
      .catch((error) => console.error(error));
  }

  const [LoomCount, setLoomCount] = useState(null)
  const [loading, setLoading] = useState(true);


  const LoomBookedCount = async (OrderId) => {
    axios.get('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=LoomBooking&Colname=OrderNoId&Colvalue=' + OrderId)
      .then(response => {
        // console.log(response.data);
        setLoomCount(response.data.length);
        console.log(response.data.length)
      })
      .catch(error => {
        console.error(error);
      });
  };

  const [ModalData, setModalData] = useState(null)

  const ModalDataFetch = (Id) => {
    console.log(Id)
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/getjoin.php?EnquiryId=" + Id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setModalData(result[0]); // Assuming the result is an array and we need the first item
        setLoading(false);
        setModalVisible2(true)
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

  }
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <HeaderPart />



      <View style={{ backgroundColor: "#003C43", flexDirection: "row", alignItems: 'center', height: 50, }}>

        <TouchableOpacity
          onPress={() => {
            showBlocks ? navigation.goBack() : handlecontent();
          }}
          style={{ padding: "2%", }}
        >
          <Image
            source={require("../Images/back.png")}
            style={{ width: 28, height: 22, marginLeft: 10, padding: "1%" }}

          />
        </TouchableOpacity>


        <View style={{ flex: 0.9, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, color: "white", fontWeight: 500 }}> Live Orders </Text>
        </View>

      </View>


      <ScrollView contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.container}>
          <View style={{ padding: "3%" }}>


            {/* FORM OPTIONS */}



            {showBlocks ? (
              <View style={styles.ordersContainer}>
                {orders.map((order, index) => (
                  order.Confirmed === 1 ? (
                    <View key={index} style={styles.orderWrapper}>

                      <TouchableOpacity style={styles.orderContainer}
                        onPress={() => handleOrderPress(order)}
                      >

                        <View style={{ paddingLeft: 10, marginBottom: 10, flexDirection: "row", justifyContent: "space-between" }}>
                          <Text style={styles.orderText}>{`Order No : ${order.OrderNo}\nParty Name : ${order.PartyName}\nQuality : ${order.Quality}`}</Text>
                          <TouchableOpacity onPress={() => ModalDataFetch(order.EnquiryId)}>
                            <Icon name="information-circle" size={22} color="grey" />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.buttonContainer}>
                          <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity
                              style={[styles.button, { backgroundColor: '#FF7722', paddingVertical: "2%", marginTop: "5%" }]}
                              onPress={() => cancelOrder(order)}
                            >
                              <Text style={styles.buttonText}> Cancel Order </Text>
                            </TouchableOpacity>
                          </View>

                        </View>
                      </TouchableOpacity>


                    </View>
                  ) : null
                ))}
              </View>
            ) : null}




            {
              showforms ?

                <View>
                  {selectedOrder && (
                    <View>
                      <View>
                        <Text style={{ color: "#003C43", fontSize: 20, fontWeight: "600", marginBottom: "2.5%" }}>Order Details</Text>
                        <Text style={{ color: "#000", fontSize: 16, fontWeight: "600", marginBottom: "2%", marginTop: "1%" }}>Order No : {selectedOrder.OrderNo}</Text>
                        <Text style={{ color: "#000", fontSize: 16, fontWeight: "600", marginBottom: "2%", marginTop: "0%" }}>Party Name : {selectedOrder.PartyName}</Text>
                        <Text style={{ color: "#000", fontSize: 16, fontWeight: "600", marginBottom: "2%", marginTop: "0%" }}>Quality : {selectedOrder.Quality}</Text>
                        <Text style={{ color: "#000", fontSize: 16, fontWeight: "600", marginBottom: "2%", marginTop: "0%" }}>Loom Booked : {LoomCount}</Text>
                      </View>
                      <View style={styles.Card}>
                        <TouchableOpacity style={[styles.button1, { marginTop: "8%" }]} onPress={() => { handleButtonPress('Beam in'); FalseOthersBeamIn() }}>
                          <Text style={[styles.buttonText, styles.BeamInCss]}>Beam in</Text>
                          {Beaminform ? (
                            <TouchableOpacity onPress={() => Initialstage()}>
                              <Image
                                source={require("../Images/downarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => { handleButtonPress('Beam in'); FalseOthersBeamIn() }}>
                              <Image
                                source={require("../Images/rightarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                        {Beaminform ? <View style={{ width: width * 0.9 }}>
                          <View style={[styles.table, { width: width * 0.9 }]}>
                            <View style={styles.header1}>

                              <Text style={{ color: "#000", fontSize: 18, fontWeight: "600" }}>Beam In From</Text>
                            </View>





                            {/* BEAM IN FORM  */}













                            {beamIn.map((row, index) => (
                              <ScrollView>
                                <View key={index} style={styles.rowContainer}>

                                  <View style={styles.row}>
                                    <View style={{ flexDirection: "row", marginTop: "5%" }}>
                                      <Text style={styles.headerText1}>Date</Text>

                                      <Text style={styles.dateText}>{row.date.toLocaleDateString()}</Text>

                                      <TouchableOpacity onPress={() => { setShowDatePickerBI(true); setSelectedDateIndexBI(index); }}>
                                        <Image
                                          style={{ width: 30, height: 30, marginLeft: 30 }}
                                          source={require("../Images/calendar.png")}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                    {showDatePickerBI && selectedDateIndexBI === index && (
                                      <DateTimePicker
                                        value={row.date}
                                        mode="date"
                                        display="default"
                                        minimumDate={new Date()}
                                        onChange={handleDateChangeBI}
                                      />
                                    )}
                                    <View style={{ flexDirection: "row", marginTop: "10%" }}>
                                      <Text style={[styles.headerText1, { marginTop: "3%" }]}>Sizing Tippan No.</Text>
                                      <TextInput
                                        style={[styles.input, { width: width * 0.4 }]}
                                        value={row.SizingTippanNo}
                                        onChangeText={(text) => handleInputChangeBI(text, index, 'SizingTippanNo')}
                                        keyboardType="numeric"
                                        placeholderTextColor={"#000"}
                                        placeholder="sizing Tippan No."
                                      />
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: "10%" }}>
                                      <Text style={[styles.headerText1]}>Image</Text>

                                      <TouchableOpacity onPress={() => { handleImagePickerBI(index); setShow1(1) }}>


                                        {
                                          (() => {

                                            if (show1 === 1) {
                                              return (
                                                <View>
                                                  <Image
                                                    source={row.PhotoPath}
                                                    style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                  />
                                                </View>
                                              )
                                            } else {
                                              return (
                                                <Image
                                                  source={require('../Images/camera.png')}
                                                  style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                />
                                              )


                                            }

                                          })()
                                        }</TouchableOpacity>

                                    </View>
                                    <View style={styles.rowButtons}>
                                      {index !== 0 && (
                                        <TouchableOpacity style={{ backgroundColor: "#135D66", width: "25%", borderRadius: 30 }} onPress={() => handleRemoveRowBI(index)}>
                                          <Text style={styles.button}>- Row</Text>
                                        </TouchableOpacity>
                                      )}
                                      <TouchableOpacity style={{ backgroundColor: "#135D66", width: "25%", borderRadius: 30 }} onPress={handleAddRowBI}>
                                        <Text style={styles.button}>+ Row</Text>
                                      </TouchableOpacity>

                                    </View>
                                    <Text style={{ color: "#000", fontSize: 20, width: width * 1 }}>_____________________________________</Text>


                                  </View>

                                </View>
                              </ScrollView>
                            ))}
                          </View>
                          <TouchableOpacity style={styles.submitButton} onPress={() => HandleSubmitBeamIn()}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                          </TouchableOpacity>
                        </View> : null}
                        <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('WEFT yarn in'); FalseOthersWeft() }}>
                          <Text style={styles.buttonText}>Weft Yarn In</Text>
                          {weftform ? (
                            <TouchableOpacity onPress={() => Initialstage()}>
                              <Image
                                source={require("../Images/downarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => { handleButtonPress('WEFT yarn in'); FalseOthersWeft() }}>
                              <Image
                                source={require("../Images/rightarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                        {weftform ? <View style={{ width: width * 0.9 }}>
                          <ScrollView horizontal={true} vertical={true}>
                            <View style={[styles.table, { width: width * 0.9 }]}>
                              <View style={styles.header1}>
                                <Text style={{ color: "#000", fontSize: 18, fontWeight: "600" }}>Weft Yarn In Form</Text>

                              </View>


                              {/* WEFT YARN IN FORM */}








                              {Weft.map((row, index) => (
                                <ScrollView>
                                  <View key={index} style={styles.rowContainer}>

                                    <View style={styles.row}>
                                      <View style={{ flexDirection: "row", marginTop: "10%" }}>
                                        <Text style={styles.headerText1}>Date</Text>

                                        <Text style={styles.dateText}>{row.date.toDateString()}</Text>

                                        <TouchableOpacity onPress={() => { setShowDatePickerWEFT(true); setSelectedDateIndexWEFT(index); }}>
                                          <Image
                                            style={{ width: 30, height: 30, marginLeft: 30 }}
                                            source={require("../Images/calendar.png")}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                      {showDatePickerWEFT && selectedDateIndexWEFT === index && (
                                        <DateTimePicker
                                          value={row.date}
                                          mode="date"
                                          minimumDate={new Date()}
                                          display="default"
                                          placeholderTextColor={"#000"}
                                          onChange={handleDateChangeWEFT}
                                        />
                                      )}
                                      <View style={{ flexDirection: "row", marginTop: "10%" }}>
                                        <Text style={[styles.headerText1, { marginTop: "3%" }]}>Gate Pass No.</Text>
                                        <TextInput
                                          style={[styles.input, { width: 200 }]}
                                          value={row.GatePassNo}
                                          onChangeText={(text) => handleInputChangeWEFT(text, index, 'GatePassNo')}
                                          keyboardType="numeric"
                                          placeholder="gate Pass No."
                                        />
                                      </View>
                                      <View style={{ flexDirection: "row", marginTop: "10%" }}>
                                        <Text style={[styles.headerText1]}>Image</Text>

                                        <TouchableOpacity onPress={() => { handleImagePickerWEFT(index); setShow1(1) }}>


                                          {
                                            (() => {

                                              if (show1 === 1) {
                                                return (
                                                  <View>
                                                    <Image
                                                      source={row.PhotoPathweft}
                                                      style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                    />
                                                  </View>
                                                )
                                              } else {
                                                return (
                                                  <Image
                                                    source={require('../Images/camera.png')}
                                                    style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                  />
                                                )


                                              }

                                            })()
                                          }</TouchableOpacity>


                                      </View>
                                      <View style={styles.rowButtons}>
                                        {index !== 0 && (
                                          <TouchableOpacity style={{ backgroundColor: "#135D66", width: "25%", borderRadius: 30 }} onPress={() => handleRemoveRowWEFT(index)}>
                                            <Text style={styles.button}>- Row</Text>
                                          </TouchableOpacity>
                                        )}
                                        <TouchableOpacity style={{ backgroundColor: "#135D66", width: "25%", borderRadius: 30 }} onPress={handleAddRowWEFT}>
                                          <Text style={styles.button}>+ Row</Text>
                                        </TouchableOpacity>

                                      </View>
                                      <Text style={{ color: "#000", fontSize: 20 }}>______________________________________</Text>

                                    </View>

                                  </View>
                                </ScrollView>
                              ))}
                            </View>
                          </ScrollView>
                          <TouchableOpacity style={styles.submitButton} onPress={() => HandleSubmitWEFT()}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                          </TouchableOpacity>
                        </View> : null}









                        <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Drawing in'), FalseOthersDI() }}>
                          <Text style={styles.buttonText}>Drawing in</Text>
                          {DrawingInForm ? (
                            <TouchableOpacity onPress={() => Initialstage()}>
                              <Image
                                source={require("../Images/downarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => { handleButtonPress('Drawing in'), FalseOthersDI() }}>
                              <Image
                                source={require("../Images/rightarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                        {
                          DrawingInForm ? (
                            <View style={{ width: "100%" }}>
                              <View style={[styles.table, { width: 200, marginLeft: 80 }]}>
                                <View style={styles.header1}>
                                  <Text style={styles.headerText1}>Drawing In</Text>
                                </View>

                                {/* DrawingIn FORM */}
                                <Animatable.View
                                  animation="fadeIn"
                                  duration={500}
                                  style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center", color: "#000" }}
                                >
                                  <View style={styles.checkboxBorder}>
                                    <Checkbox
                                      status={DrawingIn ? 'checked' : 'unchecked'}
                                      color="blue"
                                      uncheckedColor="black"
                                      onPress={() => setDrawingIn(!DrawingIn)}
                                    />
                                  </View>
                                  <Text style={{ color: "#000", marginLeft: 15, fontSize: 20 }}>Done</Text>
                                </Animatable.View>
                                <Text style={styles.text}>{currentDate}</Text>
                              </View>
                              <TouchableOpacity style={styles.submitButton} onPress={() => SubmitDrawingIn()}>
                                <Text style={styles.submitButtonText}>Submit</Text>
                              </TouchableOpacity>
                            </View>
                          ) : null
                        }

                        <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Beam Getting'), FalseOthersBG() }}>
                          <Text style={styles.buttonText}>Beam Getting</Text>
                          {beamGettingForm ? (
                            <TouchableOpacity onPress={() => Initialstage()}>
                              <Image
                                source={require("../Images/downarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => { handleButtonPress('Beam Getting'), FalseOthersBG() }}>
                              <Image
                                source={require("../Images/rightarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                        {beamGettingForm ? <View style={{ width: "100%" }}>
                          <View style={[styles.table, { width: 200, marginLeft: 80 }]}>
                            <View style={styles.header1}>
                              <Text style={styles.headerText1}>Beam Getting</Text>
                            </View>











                            {/* BEAM Getting FORM  */}











                            <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center" }}>
                              <View style={styles.checkboxBorder}>
                                <Checkbox
                                  status={beamgetting ? 'checked' : 'unchecked'}
                                  color="blue"
                                  uncheckedColor="black"
                                  onPress={() => setBeamGetting(!beamgetting)}
                                />
                              </View>
                              <Text style={{ color: "#000", marginLeft: 15, fontSize: 20 }}>Done</Text>
                            </View>
                            <Text style={styles.text}>{currentDate}</Text>
                          </View>
                          <TouchableOpacity style={styles.submitButton} onPress={() => SubmitBeamInGetting()}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                          </TouchableOpacity>
                        </View> : null}


                        <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('First Piece Approval'); FalseOthersFPA() }}>
                          <Text style={styles.buttonText}>First Piece Approval</Text>
                          {fpaform ? (
                            <TouchableOpacity onPress={() => Initialstage()}>
                              <Image
                                source={require("../Images/downarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => { handleButtonPress('First Piece Approval'); FalseOthersFPA() }}>
                              <Image
                                source={require("../Images/rightarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                        {fpaform ?
                          <View style={{ borderWidth: 1, width: width * 0.9, marginBottom: "4%" }}>
                            <View style={styles.tableHeader}>
                              <Text style={styles.headerText}>Messages</Text>

                            </View>


                            {FPAD.map((item, index) => (
                              <View key={index} style={{ padding: 10, alignItems: "flex-start", justifyContent: "center", width: width * 0.9, borderBottomWidth: 1 }}>
                                <Text style={{ color: "#000" }}>{item.UpdatedOn.date.substring(0, 10)}</Text>
                                <Text style={{ color: "#000" }}>{item.Name} : {item.Comment}</Text>
                              </View>
                            ))}


                            <View style={{ width: width * 0.9, marginTop: 15 }}>
                              <View style={[{ marginLeft: 10, width: width * 0.9 }, styles.table]}>




                                {/*First Piece Approval FORM  */}






                                <View style={{ flexDirection: "row", width: width * 0.9 }}>
                                  <TextInput
                                    style={{ width: width * 0.9, borderRadius: 15, color: "#000",padding:"3%" }}
                                    placeholder='Any Comments....'
                                    placeholderTextColor={"#000"}
                                    value={first_piece_approval}
                                    onChangeText={(txt) => setFirst_Piece_Approval(txt)}
                                    multiline={true} // Allows multiple lines of input
                                    numberOfLines={5} // Sets the initial number of lines
                                  />
                                </View>
                              </View>
                              <TouchableOpacity style={styles.submitButton} onPress={() => SubmitFPA()}>
                                <Text style={styles.submitButtonText}>Submit</Text>
                              </TouchableOpacity>
                            </View>
                          </View> : null}
                        <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Fabric Dispatch'), FalseOthersFD() }}>
                          <Text style={styles.buttonText}>Fabric Dispatch</Text>
                          {fdFrom ? (
                            <TouchableOpacity onPress={() => Initialstage()}>
                              <Image
                                source={require("../Images/downarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => { handleButtonPress('Fabric Dispatch'), FalseOthersFD() }}>
                              <Image
                                source={require("../Images/rightarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>



                        {/*                          



                      FABRIC DISPATCH FORM 






*/}

                        {fdFrom ? <View style={{ justifyContent: "space-between", width: width * 0.9, }}>
                          <View style={[styles.table, { width: width * 0.9, justifyContent: "space-between" }]}>
                            <View style={styles.header1}>
                              <Text style={{ color: "#000", fontSize: 18, fontWeight: "600" }}>Fabric Dispatch Form</Text>
                            </View>

                            {tableRows.map((row, index) => (
                              <View key={index} style={styles.rowContainer}>
                                <View style={styles.row}>

                                  <View style={{ flexDirection: "row", marginTop: "10%" }}>
                                    <Text style={[styles.headerText1]}>Date</Text>
                                    <Text style={styles.dateText}>{row.date.toDateString()}</Text>

                                    <TouchableOpacity onPress={() => { setShowDatePickerFD(true); setSelectedDateIndexFD(index); }}>
                                      <Image
                                        style={{ width: 30, height: 30, marginLeft: 30 }}
                                        source={require("../Images/calendar.png")}
                                      />
                                    </TouchableOpacity>
                                  </View>

                                  {showDatePickerFD && selectedDateIndexFD === index && (
                                    <DateTimePicker
                                      value={row.date}
                                      mode="date"
                                      minimumDate={new Date()}
                                      display="default"
                                      onChange={handleDateChangeFD}
                                    />
                                  )}
                                  <View style={{ flexDirection: "row", marginTop: "7%" }}>
                                    <Text style={[styles.headerText1, { marginRight: 10 }]}>Meter</Text>

                                    <TextInput
                                      style={[styles.input, { width: 200 }]}
                                      value={row.Meter}
                                      onChangeText={(text) => handleInputChangeFD(text, index, 'Meter')}
                                      keyboardType="numeric"
                                      placeholderTextColor={"#000"}
                                      placeholder="Meter"
                                    />
                                  </View>
                                  <View style={{ flexDirection: "row", marginTop: "7%" }}>
                                    <Text style={[styles.headerText1, { marginLeft: 0 }]}>Weight</Text>

                                    <TextInput
                                      style={[styles.input, { width: 200 }]}
                                      value={row.Weight}
                                      onChangeText={(text) => handleInputChangeFD(text, index, 'Weight')}
                                      keyboardType="numeric"
                                      placeholderTextColor={"#000"}
                                      placeholder="Weight"
                                    />

                                  </View>
                                  <View style={{ flexDirection: "row", marginTop: "7%" }}>
                                    <Text style={[styles.headerText1]}>Image</Text>

                                    <TouchableOpacity onPress={() => { handleImagePickerFD(index); setShow1(1) }}>


                                      {
                                        (() => {

                                          if (show1 === 1) {
                                            return (
                                              <View>
                                                <Image
                                                  source={row.PhotoPathFFD}
                                                  style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                />
                                              </View>
                                            )
                                          } else {
                                            return (
                                              <Image
                                                source={require('../Images/camera.png')}
                                                style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                              />
                                            )


                                          }

                                        })()
                                      }</TouchableOpacity>

                                  </View>
                                  <View style={styles.rowButtons}>
                                    {index !== 0 && (
                                      <TouchableOpacity style={{ backgroundColor: "#135D66", width: "25%", borderRadius: 30 }} onPress={() => handleRemoveRowFD(index)}>
                                        <Text style={styles.button}>- Row</Text>
                                      </TouchableOpacity>
                                    )}
                                    <TouchableOpacity style={{ backgroundColor: "#135D66", width: "25%", borderRadius: 30 }} onPress={handleAddRowFD}>
                                      <Text style={styles.button}>+ Row</Text>
                                    </TouchableOpacity>

                                  </View>
                                  <Text style={{ color: "#000", fontSize: 20 }}>_____________________________________</Text>

                                </View>
                              </View>
                            ))}


                          </View>

                          <Text style={{ marginRight: width * 0.9 }}></Text>
                          <TouchableOpacity style={styles.submitButton} onPress={() => HandleSubmitFD()}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                          </TouchableOpacity>

                        </View> : null}

                        <TouchableOpacity style={[styles.button1, { marginBottom: "10%" }]} onPress={() => { handleButtonPress('Remaining Goods Return'); FalseOthersrgr(); }}>
                          <Text style={styles.buttonText}>Remaining Goods Return</Text>
                          {remaining_goods_returnform ? (
                            <TouchableOpacity onPress={() => Initialstage()}>
                              <Image
                                source={require("../Images/downarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => { handleButtonPress('Remaining Goods Return'); FalseOthersrgr(); }}>
                              <Image
                                source={require("../Images/rightarrow.png")}
                                style={{ width: 25, height: 20, tintColor: "#848482" }}
                              />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>




                        {/*                          



                      FABRIC DISPATCH FORM 
                    
                    
                    
                    

                      
*/}

                        {remaining_goods_returnform ? <View style={{ justifyContent: "space-evenly", width: width * 0.9, }}>
                          <View style={[styles.table, { marginLeft: 0, width: width * 0.9 }]}>
                            <View style={styles.header1}>
                              <Text style={{ color: "#000", fontSize: 18, fontWeight: "600" }}>Remaining Goods Return Form</Text>
                            </View>

                            {remaining_goods_return.map((row, index) => (
                              <View key={index} style={styles.rowContainer}>
                                <SafeAreaView style={[styles.row, { width: 600 }]}>
                                  <View style={{ flexDirection: "row", marginTop: "5%" }}>
                                    <Text style={[styles.headerText1, { marginTop: "0%" }]}>GP. NO.</Text>

                                    <TextInput
                                      style={[styles.input, { width: "30%", marginLeft: "5%", marginTop: "-2%" }]}
                                      value={row.GpNo}
                                      onChangeText={(text) => handleInputChangeRGR(text, index, 'GpNo')}
                                      keyboardType="numeric"
                                      placeholder="GP_NO"
                                      placeholderTextColor={"#000"}
                                    />
                                  </View>
                                  <View style={{ flexDirection: "row", marginTop: "3%" }}>
                                    <Text style={[styles.headerText1, { marginTop: "2%" }]}>Yarn Count</Text>


                                    <TextInput
                                      style={[styles.input, { width: "30%" }]}
                                      value={row.YarnCount}
                                      onChangeText={(text) => handleInputChangeRGR(text, index, 'YarnCount')}
                                      keyboardType="numeric"
                                      placeholder="Yarn_count"
                                      placeholderTextColor={"#000"}

                                    />
                                  </View>
                                  <View style={{ flexDirection: "row", marginTop: "3%" }}>
                                    <Text style={[styles.headerText1, { marginRight: 25, marginTop: "2%" }]}>Weight</Text>

                                    <TextInput
                                      style={[styles.input, { width: "30%" }]}
                                      value={row.Weight}
                                      onChangeText={(text) => handleInputChangeRGR(text, index, 'Weight')}
                                      keyboardType="numeric"
                                      placeholder="Weight"
                                      placeholderTextColor={"#000"}

                                    />
                                  </View>
                                  <View style={{ flexDirection: "row", marginTop: "3%" }}>
                                    <Text style={[styles.headerText1, { marginRight: 10, marginTop: "2%" }]}>Cut Piece</Text>

                                    <TextInput
                                      style={[styles.input, { width: "30%" }]}
                                      value={row.CutPiece}
                                      onChangeText={(text) => handleInputChangeRGR(text, index, 'CutPiece')}
                                      keyboardType="numeric"
                                      placeholder="Cut_piece"
                                      placeholderTextColor={"#000"}

                                    />
                                  </View>
                                  <View style={{ flexDirection: "row", marginTop: "3%" }}>
                                    <Text style={[styles.headerText1, { marginRight: 30, marginTop: "2%" }]}>Meter</Text>

                                    <TextInput
                                      style={[styles.input, { width: "30%" }]}
                                      value={row.Meter}
                                      onChangeText={(text) => handleInputChangeRGR(text, index, 'Meter')}
                                      keyboardType="numeric"
                                      placeholder="Meter"
                                      placeholderTextColor={"#000"}

                                    />
                                  </View>
                                  <View style={{ flexDirection: "row", marginTop: "3%" }}>
                                    <Text style={[styles.headerText1]}>Image</Text>

                                    <TouchableOpacity onPress={() => { handleImagePickerRGR(index); setShow1(1) }}>


                                      {
                                        (() => {

                                          if (show1 === 1) {
                                            return (
                                              <View>
                                                <Image
                                                  source={row.PhotopathRGR}
                                                  style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                                />
                                              </View>
                                            )
                                          } else {
                                            return (
                                              <Image
                                                source={require('../Images/camera.png')}
                                                style={{ width: 40, height: 40, alignSelf: 'flex-start', marginLeft: 20 }}

                                              />
                                            )


                                          }

                                        })()
                                      }</TouchableOpacity>

                                  </View>
                                  <View style={[styles.rowButtons, { marginLeft: "-10%", marginTop: "5%" }]}>
                                    {index !== 0 && (
                                      <TouchableOpacity style={{ backgroundColor: "#135D66", width: "25%", borderRadius: 30 }} onPress={() => handleRemoveRowRGR(index)}>
                                        <Text style={styles.button}>- Row</Text>
                                      </TouchableOpacity>
                                    )}
                                    <TouchableOpacity style={{ backgroundColor: "#135D66", width: "25%", borderRadius: 30, marginLeft: "1%" }} onPress={handleAddRowRGR}>
                                      <Text style={styles.button}>+ Row</Text>
                                    </TouchableOpacity>

                                  </View>
                                  <Text style={{ color: "#000", fontSize: 20 }}>_____________________________________</Text>


                                </SafeAreaView>


                              </View>

                            ))}


                          </View>

                          {/* <Text style={{ marginRight: 250 }}></Text> */}
                          <TouchableOpacity style={styles.submitButton} onPress={() => HandleSubmitRGR()}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                          </TouchableOpacity>

                        </View> : null}

                      </View>

                    </View>
                  )}
                  <View style={{ marginTop: "5%", alignItems: 'center', marginLeft: "-5%" }}>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => OrderFinished()}>
                      <Text style={styles.submitButtonText}>Order Completed</Text>
                    </TouchableOpacity>
                  </View>

                </View>
                : null
            }





          </View >


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
                <Text style={styles.modalText}>Data Submitted Successfully</Text>
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require("../Images/success.png")}
                  />
                  <Pressable
                    style={[styles.button1, styles.buttonClose1]}
                    onPress={() => yesbutton(!modalVisible)}>
                    <Text style={styles.textStyle1}>Close</Text>
                  </Pressable>

                </View>
              </View>
            </View>
          </Modal>
          <Modal visible={modalVisible2} transparent={true} animationType="slide" onRequestClose={() => {
            setModalVisible2(!modalVisible2);
          }}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible2(!modalVisible2)}>
                  <Icon name="exit" size={32} color="red" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Order Details</Text>
                {loading ? (
                  <ActivityIndicator size="large" color="#003C43" />
                ) : (
                  <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    {ModalData && (
                      <>
                        <Text style={styles.detailText}><Text style={styles.label}>Name:</Text> {ModalData.Name}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Machine Type:</Text> {ModalData.MachineType}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Width:</Text> {ModalData.Width}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Shedding Type:</Text> {ModalData.SheddingType}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>No of Frames:</Text> {ModalData.NoofFrame}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>No of Feeders:</Text> {ModalData.NoofFeedero}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Selvage Jacquard:</Text> {ModalData.SelvageJacquard ? "Yes" : "No"}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Top Beam:</Text> {ModalData.TopBeam ? "Yes" : "No"}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Cramming:</Text> {ModalData.Cramming ? "Yes" : "No"}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Leno Design Equipment:</Text> {ModalData.LenoDesignEquipment ? "Yes" : "No"}</Text>
                      </>
                    )}
                  </ScrollView>
                )}
              </View>
            </View>
          </Modal>
        </View >
      </ScrollView >



      <View style={{ flexDirection: "row", borderWidth: 1, height: 50, borderColor: "#0A5D47" }}>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: "#003C43", fontSize: 20 }}>Live Orders</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={{ width: '100%', height: '100%', backgroundColor: "#135D66", justifyContent: "center", alignItems: "center", }}

          >
            <Text style={{ color: "#fff", fontSize: 20, }}>Confirmed Orders</Text>
          </TouchableOpacity>
        </View>




      </View>
    </View >
  )
}


export default ConfirmOrders

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Card: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "6%",
    borderWidth: 1.5,
    borderRadius: 30,
    borderColor: "grey",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "#fff"
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    padding: "5%"
  },

  header1: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#e5f2fe',
    borderWidth: 1,
    justifyContent: 'space-evenly'
  },
  headerText1: {
    fontWeight: 'bold',
    marginLeft: 0,
    color: "#000",
    paddingRight: "5%"
  },

  ordersContainer: {
    padding: 10,
  },
  orderWrapper: {
    marginBottom: 20,
  },
  orderContainer: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#003C43",
  },
  startedOrder: {
    backgroundColor: '#4CAF50', // Green for started orders
  },
  cancelledOrder: {
    backgroundColor: '#F44336', // Red for cancelled orders
  },
  checkboxBorder: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    padding: -2,
    margin:5 // Adjust as needed for spacing
},
  orderText: {
    color: 'black', // Text color for better contrast
    fontSize: 16,

  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50', // Green for start button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F44336', // Red for cancel button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: "600"
  },
  button1: {
    alignItems: 'flex-start',
    justifyContent: "space-between",
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: width * 0.9,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  button: {
    width: '100%',
    color: "#fff",
    paddingVertical: "5%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "35%",
    fontSize: 18,
    fontWeight: "600"
  },
  addButton: {
    backgroundColor: '#6495ED',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 20
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'column',
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: '#000',
    width: 500
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
    marginRight: 0,
    width: width * 0.85
  },
  submitButton: {
    width: width * 0.8,
    backgroundColor: '#FF7722',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 30
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowButtons: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 0,
    flexDirection: "row",
    width: "100%",
    textDecorationLine: "underline",
    marginBottom: "5%",
    marginTop: "5%"
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  datePicker: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: width * 0.3,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "#000"
  },

  dateText: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: 5,
    marginRight: 30,
    color: "#000",
    fontWeight: "500"
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
  buttonClose1: {
    backgroundColor: "green",
    margin: "5%",
    width: 200,
    justifyContent: "center"
  },
  textStyle1: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: "green"
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: "#000",
    fontSize: 17
  },
  text: {
    fontSize: 15,
    color: "#000",
    marginLeft: "18%"
  },
  tableHeader: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#0E8C6B',
    marginBottom: 15,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: "#fff"
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003C43',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: "5%",
    fontWeight: "600",
    color: "#000",
  },
  label: {
    fontWeight: 'bold',
  },
  '@media (max-width: 768px)': {
    container: {
      padding: 10,
    },
    heading: {
      fontSize: 20,
    },
    orderContainer: {
      width: '95%',
    },
    button1: {
      width: "80%",
    },
    input: {
      width: '30%',
    },
    button: {
      fontSize: 20,
    },
    table: {
      width: '100%',
    },
    tableHeader: {
      width: '100%',
    },
    row: {
      width: '100%',
    },
  },
  '@media (max-width: 480px)': {
    heading: {
      fontSize: 18,
    },
    orderContainer: {
      width: '100%',
    },
    button1: {
      width: "100%",
    },
    input: {
      width: '40%',
    },
    button: {
      fontSize: 18,
    },
  },
  '@media (max-width: 320px)': {
    heading: {
      fontSize: 16,
    },
    orderContainer: {
      width: '100%',
    },
    button1: {
      width: "100%",
    },
    input: {
      width: '50%',
    },
    button: {
      fontSize: 16,
    },
  }


})