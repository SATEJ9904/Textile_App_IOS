import { StyleSheet, TextInput, Text, View, SafeAreaView, Modal, RefreshControl, StatusBar, Pressable, Dimensions, TouchableOpacity, ImageBackground, ScrollView, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderPart from './HeaderPart';



const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const LiveOrderstrader = ({ navigation }) => {

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOrders();
    fetchDataWEFT();
    fetchDataDI();
    fetchDataBG();
    fetchDataFD();
    fetchDataFPAD();
    fetchDataRGR();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  const [orders, setOrders] = useState([]);


  useEffect(() => {

    onRefresh();
    fetchOrders();
    handleButtonPress();
  }, []);


  useEffect(() => {
    fetchOrders();
  }, []);


  const fetchNames = async (loomTraderIds) => {
    try {
      const names = await Promise.all(
        loomTraderIds.map(async (loomTraderId) => {
          const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=${loomTraderId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const json = await response.json();

          return { loomTraderId, Name: json[0].Name };
        })
      );
      return names;
    } catch (error) {
      console.error('Error fetching names:', error);
      return [];
    }
  };

  const fetchOrders = async () => {
    try {
      const id = await AsyncStorage.getItem('Id');
      if (!id) {
        console.error('No ID found in AsyncStorage');
        return;
      }

      const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/traderliveorder.php?LoomTraderId=${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const ordersJson = await response.json();

      // Sort orders by OrderId in descending order
      const sortedOrdersJson = ordersJson.sort((a, b) => b.LoomOrderId - a.LoomOrderId);

      const loomTraderIds = sortedOrdersJson.map(order => order.LoomTraderId);
      const names = await fetchNames(loomTraderIds);

      const updatedOrders = sortedOrdersJson.map(order => {
        const nameObj = names.find(name => name.loomTraderId === order.LoomTraderId);
        return { ...order, Name: nameObj ? nameObj.Name : null };
      });

      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };






  const [orderBeam, setOrderBeam] = useState([]);
  const [dateBeamIn, setDateBeam] = useState(null);

  useEffect(() => {


    callfuns();

  }, []);

  const callfuns = () => {
    fetch("")
      .then(fetchData())
      .then(fetchDataWEFT())
      .then(fetchDataDI())
      .then(fetchDataBG())
      .then(fetchDataFD())

  }
  useEffect(() => {
    fetch("")
      .then(fetchData())
      .then(fetchDataWEFT())
      .then(fetchDataDI())
      .then(fetchDataBG())
      .then(fetchDataFD())


  }, []);


  const fetchData = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderBeam&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOrderBeam(data);
      data.map((item) => {
        setDateBeam(item.UpdatedOn.date.substring(0, 10))
      })

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [orderYarn, setOrderYarn] = useState([]);
  const [dateWEFT, setDatWEFT] = useState(null);
  const [show, setShow] = useState(false)

  const fetchDataWEFT = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderWeftYarn&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      const json = await response.json();
      json.map((item, index) => {
        key = { index }
        setDatWEFT(item.UpdatedOn.date.substring(0, 10))
      })
      setOrderYarn(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };





  const [req, setreq] = useState([])
  const [dateDI, setdateDI] = useState(null)



  const fetchDataDI = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderDrawingIn&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) {
        setreq(0);
      }
      else {
        data.map((item) => {
          setdateDI(item.UpdatedOn.date.substring(0, 10))
          setreq(item.Status)
        })
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const [reqBG, setreqBG] = useState([])
  const [dateBG, setdateBG] = useState(null)


  const fetchDataBG = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderBeamGetting&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) {
        setreqBG(0);
      }
      else {
        data.map((item) => {
          setdateBG(item.UpdatedOn.date.substring(0, 10))
          setreqBG(item.Status)
        })
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const [orderfd, setOrderFD] = useState([]);
  const [imageSourceFD, setImageSourceFD] = useState(null);
  const [dateFD, setDateFD] = useState(null);


  const fetchDataFD = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderFabric&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOrderFD(data);
      data.map((item) => {
        setDateFD(item.UpdatedOn.date.substring(0, 10))

        setImageSourceFD(item.Photopath);
      })

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const [RGR, setOrderRGR] = useState([]);
  const [dateRGR, setDateRGR] = useState(null);


  const fetchDataRGR = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=OrderGoodRemain&Colname=OrderNoId&Colvalue=' + selectedOrderID);
      const json = await response.json();
      setOrderRGR(json);
      json.map((item) => {
        setDateRGR(item.UpdatedOn.date.substring(0, 10))
      })

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  // First Piece Approval sending

  const [dateFPA, setdateFPA] = useState(null)


  const [first_piece_approval, setFirst_Piece_Approval] = useState("")


  const SubmitFPA = async () => {
    console.log("Started", await AsyncStorage.getItem("Id"))

    const formdata = new FormData();
    formdata.append("LoomTraderId", await AsyncStorage.getItem("Id"));
    formdata.append("OrderNoId", selectedOrderID);
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
      json.map((item) => {
        setdateFPA(item.UpdatedOn.date.substring(0, 10))
      })

    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };


  const [enlargedImage, setEnlargedImage] = React.useState(null);


  const handleImagePress = (image) => {
    setEnlargedImage(image);
    console.log("Selected Image = ", enlargedImage)
    setShow(true);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [contractsigned, setCOtractSigned] = useState(false);
  const [Name, setName] = useState("");
  const [AppUserId, setAppUserId] = useState("");
  const [showBlocks, setShowBlocks] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [Beaminform, setBeamInForm] = useState(false)
  const [weftform, setWeftform] = useState(false)
  const [fdFrom, setFdForm] = useState(false)
  const [remaining_goods_returnform, setremaining_Goods_ReturnForm] = useState(false)
  const [DrawingInForm, setDrawingInForm] = useState(false);
  const [beamGettingForm, setBeamGettingForm] = useState(false);
  const [fpaform, setFPAForm] = useState(false)


  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const Name = await AsyncStorage.getItem("Name");
    const AppUserId = await AsyncStorage.getItem("AppUserId");
    const Id = await AsyncStorage.getItem("Id")


    setName(Name)
    setAppUserId(AppUserId)
    setShowBlocks(true)
  }

  const [selectedOrderID, setSelectedOrderID] = useState('')
  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setShowBlocks(false)
    setSelectedOrderID(order.LoomOrderId)
    fetchDataFPAD(order)
    callfuns();
    setShopwForms(true)
  };

  const handleOrderPressModal = (order) => {
    ModalDataFetch2(order.Id);
    setModalVisible4(true);
  };

  const yesbutton2 = () => {
    setModalVisible(false)
  }

  const yesbutton = () => {
    setShowBlocks(true)
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
    setShow(false);
  }

  const FalseOthersWeft = () => {
    setBeamInForm(false);
    setWeftform(true);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)
    setShow(false);
  }

  const FalseOthersFD = () => {
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(true);
    setremaining_Goods_ReturnForm(false);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)
    setShow(false);
  }

  const FalseOthersrgr = () => {
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(true);
    setDrawingInForm(false)
    setBeamGettingForm(false)
    setFPAForm(false)
    setShow(false);
  }

  const FalseOthersDI = () => {
    setDrawingInForm(true)
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setBeamGettingForm(false)
    setFPAForm(false)
    setShow(false);
  }

  const FalseOthersBG = () => {
    setBeamGettingForm(true)
    setDrawingInForm(false)
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setFPAForm(false)
    setShow(false);
  }

  const FalseOthersFPA = () => {
    setFPAForm(true)
    setBeamGettingForm(false)
    setDrawingInForm(false)
    setBeamInForm(false);
    setWeftform(false);
    setFdForm(false);
    setremaining_Goods_ReturnForm(false);
    setShow(false);
  }

  const [Action, setAction] = useState("")

  const [getOrderNo, setGetOrderNo] = useState("")

  const handleButtonPress = (action) => {
    if (selectedOrder) {
      console.log(`Order No: ${selectedOrder.OrderNo}, Party Name: ${selectedOrder.Name}, Action: ${action}`);
      setAction("Order No. : " + selectedOrder.OrderNo + "\nParty Name : " + selectedOrder.Name + "\nQuality : " + selectedOrder.Quality)
    }
    callfuns();
  };

  const ToggleScreens = () => {
    setSelectedOrder(false)
    setShowBlocks(true)
    setBeamInForm(false)
    setWeftform(false)
    setFdForm(false)
    setremaining_Goods_ReturnForm(false)

  }
  const [showforms, setShopwForms] = useState(false)

  const handlecontent = () => {
    setShowBlocks(true)
    setShopwForms(false)
  }


  const [ModalData2, setModalData2] = useState(null)

  const ModalDataFetch2 = (Order) => {
    console.log("Id = ", Order.Id)
    Id = Order.Id
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/getiddetail.php?Id=" + Id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setModalData2(result[0]); // Assuming the result is an array and we need the first item
        setModalVisible4(true)
        console.log(result[0])
      })
      .catch((error) => {
        console.error(error);
      });

  }


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderPart />
      <View style={{ backgroundColor: "#003C43", flexDirection: "row" }}>
        {
          showBlocks ?
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <ImageBackground
                source={require("../Images/drawer.png")}
                style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003C43", marginTop: 15, marginRight: 0, marginLeft: 10 }}
                imageStyle={{ borderRadius: 0 }}
              />
            </TouchableOpacity> : <TouchableOpacity onPress={() => handlecontent()}>
              <ImageBackground
                source={require("../Images/back.png")}
                style={{ width: 34, height: 30, alignSelf: 'flex-start', backgroundColor: "#003C43", marginTop: 15, marginRight: 0, marginLeft: 10 }}
                imageStyle={{ borderRadius: 0 }}
              />
            </TouchableOpacity>
        }
        <Text style={{ fontSize: 25, color: "white", margin: "2.5%", marginLeft: "25%" }}>Live Orders</Text>
      </View>
      <ScrollView style={{ marginTop: "5%" }} contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>


        {showBlocks ? (
          <View style={styles.ordersContainer}>
            {orders.map((order, index) => (
              order.Confirmed === 1 ? (
                <View key={index} style={styles.orderWrapper}>
                  <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => ModalDataFetch2(order)}>
                    <Icon name="information-circle" size={22} color="grey" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.orderContainer} onPress={() => handleOrderPress(order)}>
                    <View style={{ paddingLeft: 10, marginBottom: 10 }}>

                      <Text style={styles.orderText}>{`Order No : ${order.OrderNo}\nName : ${order.Name}\nQuality : ${order.Quality}`}</Text>
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
                  <View style={{ marginLeft: "5%" }}>
                    <Text style={{ color: "#FF7722", fontSize: 20, fontWeight: "600", marginBottom: "2.5%" }}>Order Details</Text>
                    <Text style={{ color: "#000", fontSize: 16, fontWeight: "600", marginBottom: "2%", marginTop: "1%" }}>Order No : {selectedOrder.OrderNo}</Text>
                    <Text style={{ color: "#000", fontSize: 16, fontWeight: "600", marginBottom: "2%", marginTop: "0%" }}>Party Name : {selectedOrder.Name}</Text>
                    <Text style={{ color: "#000", fontSize: 16, fontWeight: "600", marginBottom: "2%", marginTop: "0%" }}>Quality : {selectedOrder.Quality}</Text>

                  </View>
                  <View style={styles.Card}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: "8%" }}>
                      <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Beam in'); FalseOthersBeamIn(); fetchData(); }}>
                        <Text style={[styles.buttonText, styles.BeamInCss]}>Beam in   <Text style={{ color: "#003C43", textDecorationLine: "underline", marginLeft: "-10%" }}>{dateBeamIn}</Text></Text>
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

                    </View>

                    {Beaminform ? <View style={{ width: width * 0.99, }}>

                      <View style={styles.table}>
                        <View style={styles.header1}>

                          <Text style={{ color: "#000", fontSize: 18, fontWeight: "600" }}>Beam in</Text>
                        </View>




                        {/* BEAM IN FORM  */}






                        <View>

                          {
                            show ?

                              <View style={{ flex: 0.4, width: width * 0.7, height: height * 0.4 }}>
                                <TouchableOpacity onPress={() => setShow(false)}>
                                  <Image
                                    source={require('../Images/cross.png')}
                                    style={{ width: 27, height: 27, alignSelf: 'flex-start', backgroundColor: "#DADBDD", borderRadius: 50, marginLeft: width * 0.75, marginTop: 0, zIndex: 0 }}
                                    imageStyle={{ borderRadius: 0 }}
                                  />
                                </TouchableOpacity>
                                <Image
                                  source={{ uri: enlargedImage }}
                                  style={{
                                    marginTop: 20,
                                    width: width * 0.75,
                                    height: 300,
                                  }}
                                />
                              </View>
                              : null
                          }


                          {orderBeam.map((item, index) => (
                            <View style={{ borderBottomWidth: 2, width: width * 0.85 }}>

                              <View key={index} style={{ flexDirection: "column", justifyContent: 'space-between', marginLeft: "5%" }}>
                                <View style={{ flexDirection: "row", marginTop: 20 }}>
                                  <Text style={styles.headerText1}>Date : </Text>
                                  <Text style={{ color: "#000", marginHorizontal: 50, marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.Date.date.substring(0, 10)}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "5%" }}>
                                  <Text style={[styles.headerText1]}>Sizing Tippan Number : </Text>
                                  <Text style={{ color: "#000", marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.SizingTippanNo}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "5%" }}>
                                  <Text style={styles.headerText1}>Image </Text>
                                  <TouchableOpacity onPress={() => handleImagePress(item.PhotoPath)}>
                                    <Image
                                      source={{ uri: item.PhotoPath }} // or require('path/to/img.jpeg')
                                      style={{ width: 40, height: 40, marginRight: 60, backgroundColor: '#A8A9AD', marginLeft: 30, marginBottom: "15%" }}
                                    />
                                  </TouchableOpacity>

                                </View>



                              </View>

                            </View>
                          ))}
                        </View>

                      </View>
                    </View> : null}

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: "2%" }}>
                      <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('WEFT yarn in'); FalseOthersWeft(); fetchDataWEFT(); }}>
                        <Text style={[styles.buttonText, styles.BeamInCss]}>Weft yarn in  <Text style={{ color: "#003C43", textDecorationLine: "underline", marginLeft: "-10%" }}>{dateWEFT}</Text></Text>
                        {weftform ? (
                          <TouchableOpacity onPress={() => Initialstage()}>
                            <Image
                              source={require("../Images/downarrow.png")}
                              style={{ width: 25, height: 20, tintColor: "#848482" }}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => { handleButtonPress('WEFT yarn in'); FalseOthersWeft(); }}>
                            <Image
                              source={require("../Images/rightarrow.png")}
                              style={{ width: 25, height: 20, tintColor: "#848482" }}
                            />
                          </TouchableOpacity>
                        )}

                      </TouchableOpacity>

                    </View>

                    {weftform ? <View style={{ width: "100%" }}>

                      <View style={styles.table}>
                        <View style={styles.header1}>

                          <Text style={{ color: "#000", fontSize: 18, fontWeight: "600" }}>Weft yarn in</Text>
                        </View>




                        {/* BEAM IN FORM  */}






                        <View>

                          {
                            show ?

                              <View style={{ flex: 0.4, width: width * 0.7, height: height * 0.4 }}>
                                <TouchableOpacity onPress={() => setShow(false)}>
                                  <Image
                                    source={require('../Images/cross.png')}
                                    style={{ width: 27, height: 27, alignSelf: 'flex-start', backgroundColor: "#DADBDD", borderRadius: 50, marginLeft: width * 0.8, marginTop: 10, zIndex: 0 }}
                                    imageStyle={{ borderRadius: 0 }}
                                  />
                                </TouchableOpacity>
                                <Image
                                  source={{ uri: enlargedImage }}
                                  style={{
                                    marginTop: 20,
                                    width: width * 0.85,
                                    height: 300,
                                  }}
                                />
                              </View>
                              : null
                          }

                          {orderYarn.map((item, index) => (
                            <View style={{ borderBottomWidth: 2, width: width * 0.85 }}>

                              <View key={index} style={{ flexDirection: "column", justifyContent: 'space-between', marginLeft: "5%" }}>
                                <View style={{ flexDirection: "row", marginTop: 20 }}>
                                  <Text style={styles.headerText1}>Date : </Text>
                                  <Text style={{ color: "#000", marginHorizontal: 50, marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.Date.date.substring(0, 10)}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "8%" }}>
                                  <Text style={[styles.headerText1]}>Gate Pass Number : </Text>
                                  <Text style={{ color: "#000", marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.GatePassNo}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "8%" }}>
                                  <Text style={styles.headerText1}>Image </Text>
                                  <TouchableOpacity onPress={() => handleImagePress(item.PhotoPath)} >
                                    <Image
                                      source={{ uri: item.PhotoPath }}
                                      style={{ width: 40, height: 40, marginRight: 60, backgroundColor: "grey", margin: 10 }}
                                    />

                                  </TouchableOpacity>

                                </View>



                              </View>
                              <View>

                              </View>
                            </View>
                          ))}
                        </View>

                      </View>
                    </View> : null}










                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Drawing in'), FalseOthersDI(); fetchDataDI(); }}>
                        <Text style={styles.buttonText}>Drawing in   <Text style={{ color: "#003C43", textDecorationLine: "underline", marginLeft: "5%" }}>{dateDI}</Text>
                        </Text>
                        {
                          req === 1 ? <Text style={{ color: '#0909ff', fontSize: 16, fontWeight: "500" }}>Done</Text > : null
                        }
                      </TouchableOpacity>
                    </View>
                    {DrawingInForm ? <View style={{ width: "100%" }}>
                      <ScrollView horizontal={true} vertical={true}>
                        <View style={[{ marginLeft: 100 }, styles.table]}>
                          <View style={styles.header1}>
                            <Text style={styles.headerText1}>Drawing In</Text>

                          </View>





                          {/*DrawingIn FORM  */}












                          <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center" }}>


                          </View>
                        </View>
                      </ScrollView>

                    </View> : null}


                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Beam Getting'), FalseOthersBG(); fetchDataBG(); }}>
                        <Text style={styles.buttonText}>Beam getting    <Text style={{ color: "#003C43", textDecorationLine: "underline", marginLeft: "5%" }}>{dateBG}</Text></Text>

                        {
                          reqBG === 1 ? <Text style={{ color: '#0909ff', fontSize: 16, fontWeight: "500" }}>Done</Text > : null
                        }
                      </TouchableOpacity>
                    </View>

                    {beamGettingForm ? <View style={{ width: "100%" }}>
                      <ScrollView horizontal={true} vertical={true}>
                        <View style={[{ marginLeft: 100 }, styles.table]}>
                          <View style={styles.header1}>
                            <Text style={styles.headerText1}>Beam getting</Text>

                          </View>











                          {/* BEAM Getting FORM  */}











                          <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center" }}>

                          </View>
                        </View>
                      </ScrollView>

                    </View> : null}


                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('First Piece Approval'); FalseOthersFPA() }}>
                        <Text style={styles.buttonText}>First piece approval   <Text style={{ color: "#003C43", textDecorationLine: "underline", marginLeft: "5%" }}>{dateFPA}</Text></Text>
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
                    </View>

                    {fpaform ?
                      <View style={{ borderWidth: 1, width: width * 0.858, marginBottom: 20 }}>
                        <View style={styles.tableHeader}>
                          <Text style={styles.headerText}>Messages</Text>
                        </View>


                        {FPAD.map((item, index) => (
                          <View key={index} style={{ padding: 10, alignItems: "flex-start", justifyContent: "center", width: width * 0.85, borderBottomWidth: 1 }}>
                            <Text style={{ color: "#000" }}>{item.UpdatedOn.date.substring(0, 10)}</Text>
                            <Text style={{ color: "#000" }}>{item.Name} : {item.Comment}</Text>
                          </View>
                        ))}


                        <View style={{ width: "100%", marginTop: 15 }}>
                          <View style={[styles.table1]}>




                            {/*First Piece Approval FORM  */}






                            <View style={{ flexDirection: "row", width: width * 0.75, }}>
                              <TextInput
                                style={{ width: width * 0.80, borderRadius: 15, color: "#000" }}
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


                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: "2%" }}>
                      <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('FabricDispatch'), FalseOthersFD(); fetchDataFD(); }}>
                        <Text style={[styles.buttonText, styles.BeamInCss]}>Fabric dispatch  <Text style={{ color: "#003C43", textDecorationLine: "underline", marginLeft: "-10%" }}>{dateFD}</Text></Text>
                        {fdFrom ? (
                          <TouchableOpacity onPress={() => Initialstage()}>
                            <Image
                              source={require("../Images/downarrow.png")}
                              style={{ width: 25, height: 20, tintColor: "#848482" }}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => { handleButtonPress('FabricDispatch'), FalseOthersFD(); }}>
                            <Image
                              source={require("../Images/rightarrow.png")}
                              style={{ width: 25, height: 20, tintColor: "#848482" }}
                            />
                          </TouchableOpacity>
                        )}

                      </TouchableOpacity>

                    </View>

                    {fdFrom ? <View style={{ width: "100%" }}>

                      <View style={styles.table}>
                        <View style={styles.header1}>

                          <Text style={{ color: "#000", fontSize: 18, fontWeight: "600" }}>Fabric dispatch</Text>
                        </View>




                        {/* BEAM IN FORM  */}






                        <View>

                          {
                            show ?

                              <View style={{ flex: 0.4, width: width * 0.7, height: height * 0.4 }}>
                                <TouchableOpacity onPress={() => setShow(false)}>
                                  <Image
                                    source={require('../Images/cross.png')}
                                    style={{ width: 27, height: 27, alignSelf: 'flex-start', backgroundColor: "#DADBDD", borderRadius: 50, marginLeft: width * 0.8, marginTop: 10, zIndex: 0 }}
                                    imageStyle={{ borderRadius: 0 }}
                                  />
                                </TouchableOpacity>
                                <Image
                                  source={{ uri: enlargedImage }}
                                  style={{
                                    marginTop: 20,
                                    width: width * 0.85,
                                    height: 300,
                                  }}
                                />
                              </View>
                              : null
                          }

                          {orderfd.map((item, index) => (
                            <View style={{ borderBottomWidth: 2, width: width * 0.85 }}>

                              <View key={index} style={{ flexDirection: "column", justifyContent: 'space-between', marginLeft: "5%" }}>
                                <View style={{ flexDirection: "row", marginTop: 20 }}>
                                  <Text style={styles.headerText1}>Date : </Text>
                                  <Text style={{ color: "#000", marginHorizontal: 50, marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.Date.date.substring(0, 10)}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "8%" }}>
                                  <Text style={[styles.headerText1]}>Dispatch No. : </Text>
                                  <Text style={{ color: "#000", marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.DispatchNo}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "8%" }}>
                                  <Text style={[styles.headerText1]}>Meter : </Text>
                                  <Text style={{ color: "#000", marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.Meter}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "8%" }}>
                                  <Text style={[styles.headerText1]}>Weight : </Text>
                                  <Text style={{ color: "#000", marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.Weight}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "8%" }}>
                                  <Text style={styles.headerText1}>Image </Text>
                                  <TouchableOpacity onPress={() => handleImagePress(item.Photopath)} >
                                    <Image
                                      style={{ width: 40, height: 40, marginHorizontal: 10, margin: 10, marginRight: 60 }}
                                      source={{ uri: item.Photopath }}
                                    />

                                  </TouchableOpacity>


                                </View>



                              </View>
                              <View>

                              </View>
                            </View>
                          ))}
                        </View>

                      </View>
                    </View> : null}



                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: "2%" }}>
                      <TouchableOpacity style={styles.button1} onPress={() => { handleButtonPress('Remaining Goods Return'), FalseOthersrgr(); fetchDataRGR(); }}>
                        <Text style={[styles.buttonText, styles.BeamInCss]}>Remaining good return <Text style={{ color: "#003C43", textDecorationLine: "underline", marginLeft: "-10%" }}>{dateRGR}</Text></Text>
                        {remaining_goods_returnform ? (
                          <TouchableOpacity onPress={() => Initialstage()}>
                            <Image
                              source={require("../Images/downarrow.png")}
                              style={{ width: 25, height: 20, tintColor: "#848482" }}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => { handleButtonPress('Remaining Goods Return'), FalseOthersrgr(); }}>
                            <Image
                              source={require("../Images/rightarrow.png")}
                              style={{ width: 25, height: 20, tintColor: "#848482" }}
                            />
                          </TouchableOpacity>
                        )}

                      </TouchableOpacity>

                    </View>

                    {remaining_goods_returnform ? <View style={{ width: "100%" }}>

                      <View style={styles.table}>
                        <View style={styles.header1}>

                          <Text style={{ color: "#000", fontSize: 18, fontWeight: "600" }}>Remaining good return</Text>
                        </View>




                        {/* BEAM IN FORM  */}






                        <View>

                          {
                            show ?

                              <View style={{ flex: 0.4, width: width * 0.7, height: height * 0.4 }}>
                                <TouchableOpacity onPress={() => setShow(false)}>
                                  <Image
                                    source={require('../Images/cross.png')}
                                    style={{ width: 27, height: 27, alignSelf: 'flex-start', backgroundColor: "#DADBDD", borderRadius: 50, marginLeft: width * 0.8, marginTop: 10, zIndex: 0 }}
                                    imageStyle={{ borderRadius: 0 }}
                                  />
                                </TouchableOpacity>
                                <Image
                                  source={{ uri: enlargedImage }}
                                  style={{
                                    marginTop: 20,
                                    width: width * 0.85,
                                    height: 300,
                                  }}
                                />
                              </View>
                              : null
                          }

                          {RGR.map((item, index) => (
                            <View style={{ borderBottomWidth: 2, width: width * 0.85 }}>

                              <View key={index} style={{ flexDirection: "column", justifyContent: 'space-between', marginLeft: "5%" }}>
                                <View style={{ flexDirection: "row", marginTop: 20 }}>
                                  <Text style={styles.headerText1}>GP. NO. : </Text>
                                  <Text style={{ color: "#000", marginHorizontal: 50, marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.GpNo}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "8%" }}>
                                  <Text style={[styles.headerText1]}>Yarn Count : </Text>
                                  <Text style={{ color: "#000", marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.YarnCount}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "8%" }}>
                                  <Text style={[styles.headerText1]}>Weight : </Text>
                                  <Text style={{ color: "#000", marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.Weight}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "8%" }}>
                                  <Text style={[styles.headerText1]}>Cut Piece : </Text>
                                  <Text style={{ color: "#000", marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.CutPiece}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "8%" }}>
                                  <Text style={styles.headerText1}>Meter </Text>
                                  <Text style={{ color: "#000", marginLeft: 0, fontSize: 15, fontWeight: "500" }}>{item.Meter}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: "8%" }}>
                                  <Text style={styles.headerText1}>Image </Text>
                                  <TouchableOpacity onPress={() => handleImagePress(item.Photopath)} >
                                    <Image
                                      source={{ uri: item.Photopath }} // or require('path/to/img.jpeg')
                                      style={{ width: 40, height: 40, marginRight: 60, backgroundColor: '#A8A9AD', marginLeft: 30, marginBottom: "15%" }}
                                    />
                                  </TouchableOpacity>

                                </View>



                              </View>
                              <View>

                              </View>
                            </View>
                          ))}
                        </View>

                      </View>
                    </View> : null}







                  </View>
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
                            onPress={() => yesbutton2(!modalVisible)}>
                            <Text style={styles.textStyle1}>close</Text>
                          </Pressable>

                        </View>
                      </View>
                    </View>
                  </Modal>



                </View>

              )}

            </View> : null
        }

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible4}
          onRequestClose={() => {
            setModalVisible4(!modalVisible4);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => setModalVisible4(!modalVisible4)}>
                <Icon name="exit" size={32} color="red" />
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: "600", color: "#003C43" }}>Loom Details</Text>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>

                {ModalData2 && (
                  <>
                    <Image
                      source={{ uri: ModalData2.Profilepic }}
                      style={{ width: "35%", height: "18%", marginBottom: "10%", marginTop: "15%", borderRadius: 50 }}
                    />
                    <Text style={styles.modalText}><Text style={styles.modalText}>Email:</Text> {ModalData2.AppUserId}</Text>
                    <Text style={styles.modalText}><Text style={styles.modalText}>Name:</Text> {ModalData2.Name}</Text>
                    <Text style={styles.modalText}><Text style={styles.modalText}>Address:</Text> {ModalData2.Address}</Text>
                    <Text style={styles.modalText}><Text style={styles.modalText}>State:</Text> {ModalData2.State}</Text>
                    <Text style={styles.modalText}><Text style={styles.modalText}>City:</Text> {ModalData2.City}</Text>
                    <Text style={styles.modalText}><Text style={styles.modalText}>Pincode:</Text> {ModalData2.Pincode}</Text>
                    <Text style={[styles.modalText, { marginBottom: "20%" }]}><Text style={styles.modalText}>Mobile No.:</Text> {ModalData2.PrimaryContact}</Text>

                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>


        <Text style={{ marginTop: "18%" }}></Text>
      </ScrollView>
    </View>
  )
}

export default LiveOrderstrader

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    padding: "5%"
  },
  ordersContainer: {
    padding: 10,
  },
  orderWrapper: {
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#003C43",
  },
  orderContainer: {
    padding: 10,

  },
  orderText: {
    color: 'black', // Text color for better contrast
    fontSize: 16,
    fontWeight: "600"
  },
  Card: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "6%",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "grey",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    margin: "3%"
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
    marginRight: 80,
    justifyContent: 'center',
    alignItems: "center",
    width: width * 0.90,
    marginLeft: 10
  },
  table1: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
    marginRight: 80,
    justifyContent: 'center',
    alignItems: "center",
    width: width * 0.80,
    marginLeft: 10
  },
  header1: {
    width: width * 0.90,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FF7722',
    borderWidth: 1,
    justifyContent: "center"
  },
  headerText1: {
    fontWeight: 'bold',
    marginLeft: 0,
    color: "#000",
    paddingRight: "5%",
    fontSize: 16
  },
  orderText1: {
    fontSize: 16,
    borderWidth: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: "#000"
  },
  buttonsContainer: {
    marginTop: 10,
  },
  button1: {
    alignItems: 'flex-start',
    justifyContent: "space-between",
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: "90%",
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
  buttonText: {
    color: '#000',
    fontSize: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    borderBottomColor: '#000',
  },

  submitButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20
  },
  modalText: {
    fontSize: 18,
    marginBottom: 5,
  },
  datePicker: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '25%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    margin: 5
  },
  button: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
  dateText: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: 5,
    marginRight: 30,
    color: "#000"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dark semi-transparent background for focus on modal
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 30,  // More rounded corners for a modern look
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,  // Taller shadow for depth
    },
    shadowOpacity: 0.3,  // Lighter shadow for subtle effect
    shadowRadius: 20,  // Softer shadow edges
    elevation: 10,  // Higher elevation for pronounced shadow effect
  },
  buttonClose1: {
    backgroundColor: "#ff6347",  // Tomato color for a vibrant button
    borderRadius: 25,  // Rounded button
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '80%',  // Full-width button for modern look
    justifyContent: "center",
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },  // Button shadow for 3D effect
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  textStyle1: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 1.2,  // Spacing for modern typography feel
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    color: "#003C43",  // Dark teal color for contrast
    fontSize: 18,
    fontWeight: '600',  // Bolder font for emphasis
    letterSpacing: 0.8,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 30,  // Extra padding for better scrolling UX
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,  // Full-circle profile picture
    marginBottom: 30,
    borderWidth: 4,  // Thick border for standout look
    borderColor: '#ff6347',  // Border color matching close button
  },

  tableHeader: {
    width: width * 0.85,
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
})