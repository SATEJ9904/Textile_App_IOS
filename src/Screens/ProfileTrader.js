import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ImageBackground, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderPart from './HeaderPart';
// import ImagePicker from 'react-native-image-crop-picker';

const { width, height } = Dimensions.get('window');

const ProfileTrader = ({ navigation }) => {
  const [username, setUserName] = useState('');
  const [AppUserId, setAppUserId] = useState('');
  const [LoomOrTrader, SetLoomOrTrader] = useState('');
  const [id, setId] = useState('');
  const [ProfilePic, setProfilePic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(false);
  const [totalLooms, setTotalLooms] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [displayedLooms, setDisplayedLooms] = useState(0);
  const [displayedOrders, setDisplayedOrders] = useState(0);
  const [machineTypeCounts, setMachineTypeCounts] = useState([]);


  useEffect(() => {
    getData();
    fetchLoomsData();
    fetchOrdersData();
  }, []);

  useEffect(() => {
    animateCount(totalLooms, setDisplayedLooms);
  }, [totalLooms]);

  useEffect(() => {
    animateCount(totalOrders, setDisplayedOrders);
  }, [totalOrders]);

  const getData = async () => {
    const Name = await AsyncStorage.getItem('Name');
    const AppUserId = await AsyncStorage.getItem('AppUserId');
    const LoomOrTrader = await AsyncStorage.getItem('LoomOrTrader');
    const Id = await AsyncStorage.getItem('Id');
    const Profilepic = await AsyncStorage.getItem('Profilepic');

    setUserName(Name);
    setAppUserId(AppUserId);
    SetLoomOrTrader(LoomOrTrader);
    setId(Id);
    setProfilePic(Profilepic);
  };

  const fetchLoomsData = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getbyid.php?Table=Enquiry&Colname=TraderId&Colvalue=' + await AsyncStorage.getItem("Id"));
      const data = await response.json();
      const uniqueLooms = new Set(data.map(item => item.EnquiryId)).size;
      setTotalLooms(uniqueLooms);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrdersData = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/userenquirycount.php?LoomTraderId=' + await AsyncStorage.getItem("Id"));
      const data = await response.json();
      setMachineTypeCounts(data);
    } catch (error) {
      console.error(error);
    }

  };

  const navigateToCompanyInfo = () => {
    navigation.navigate('SelfInfo');
  };

  const navigateToContactInfo = () => {
    navigation.navigate('ContactEdit');
  };

  const openImagePicker = () => {
    setModalVisible(true);
  };

  const captureImage = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      setProfilePic(image.path);
      updateProfilePic(image.path);
      setModalVisible(false);
    });
  };

  const selectFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      setProfilePic(image.path);
      updateProfilePic(image.path);
      setModalVisible(false);
    });
  };

  const updateProfilePic = async (imagePath) => {
    const formdata = new FormData();
    formdata.append('Id', await AsyncStorage.getItem('Id'));
    formdata.append('Profilepic', {
      uri: imagePath,
      type: 'image/jpeg',
      name: 'profilepic.jpg',
    });

    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch('https://textileapp.microtechsolutions.co.in/php/updateprofile.php', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        AsyncStorage.setItem('Profilepic', imagePath);
      })
      .catch(error => console.error(error));
  };

  const animateCount = (totalCount, setDisplayedCount) => {
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setDisplayedCount(count);
      if (count >= totalCount) {
        clearInterval(interval);
      }
    }, 25); // Adjust the interval duration for desired speed
  };

  return (
    <View style={styles.container}>
      <HeaderPart />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.drawerButton}>
          <Image source={require('../Images/drawer.png')} style={styles.drawerIcon} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>User Profile</Text>
        </View>
      </View>

      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={() => setEnlargedImage(true)}
        >
          <ImageBackground source={{ uri: ProfilePic }} style={styles.profileImage}>
            {/* Add the profile picture here */}
          </ImageBackground>
          <View style={styles.addIconContainer}>
            <Text style={styles.addIcon} onPress={openImagePicker}>+</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome, {username}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionCard} onPress={navigateToCompanyInfo}>
          <Text style={styles.optionText}>Company Info</Text>
          <Image source={require('../Images/rightarrow.png')} style={styles.optionIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionCard} onPress={navigateToContactInfo}>
          <Text style={styles.optionText}>Contact Info</Text>
          <Image source={require('../Images/rightarrow.png')} style={styles.optionIcon} />
        </TouchableOpacity>
        {LoomOrTrader === 'L' ? (
          <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('MyLooms')}>
            <Text style={styles.optionText}>My Looms</Text>
            <Image source={require('../Images/rightarrow.png')} style={styles.optionIcon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('Generated_Enquires')}>
            <Text style={styles.optionText}>My Enquiries</Text>
            <Image source={require('../Images/rightarrow.png')} style={styles.optionIcon} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryTitle}>Total Enquires</Text>
            <Text style={styles.summaryCount}>{displayedLooms}</Text>
          </View>
          {machineTypeCounts.map((machine, index) => (
            <View style={styles.summaryBlock} key={index}>
              <Text style={styles.summaryTitle}>Enquires Of {machine.MachineType}</Text>
              <Text style={styles.summaryCount}>{machine.Count}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>
            <TouchableOpacity style={styles.modalOption} onPress={captureImage}>
              <Text style={styles.modalOptionText}>Capture Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={selectFromGallery}>
              <Text style={styles.modalOptionText}>Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={enlargedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEnlargedImage(false)}
      >
        <TouchableOpacity style={styles.enlargedImageContainer} onPress={() => setEnlargedImage(false)}>
          <Image source={{ uri: ProfilePic }} style={styles.enlargedImage} />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#003C43',
      height: 60,
      paddingHorizontal: 20,
    },
    drawerButton: {
      padding: 10,
    },
    drawerIcon: {
      width: 24,
      height: 24,
    },
    headerTextContainer: {
      flex: 1,
      alignItems: 'center',
    },
    headerText: {
      fontSize: 24,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    profileContainer: {
      alignItems: 'center',
      padding: 20,
    },
    profileImageContainer: {
      marginBottom: 20,
      position: 'relative',
    },
    profileImage: {
      width: width * 0.4,
      height: width * 0.4,
      borderRadius: width * 0.2,
      overflow: 'hidden',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      backgroundColor: '#CCCCCC', // Placeholder color for the image
    },
    addIconContainer: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#003C43',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addIcon: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
    welcomeText: {
      fontSize: 22,
      fontWeight: '600',
      color: '#333333',
    },
    optionsContainer: {
      paddingHorizontal: 20,
      marginTop: "15%"
    },
    optionCard: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    optionText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
    },
    optionIcon: {
      width: 24,
      height: 24,
      tintColor: '#003C43',
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 20,
      marginTop: "5%",
      flexWrap:"wrap",
    },
    summaryBlock: {
      backgroundColor: '#003C43',
      padding: 20,
      borderRadius: 10,
      width: width * 0.4,
      alignItems: 'center',
      marginBottom:"10%",
    },
    summaryTitle: {
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 10,
      fontWeight:"500"
    },
    summaryCount: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: '#FFF',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    modalOption: {
      paddingVertical: 10,
    },
    modalOptionText: {
      fontSize: 16,
      color: '#003C43',
    },
    enlargedImageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
    },
    enlargedImage: {
      width: width * 0.8,
      height: width * 0.8,
      resizeMode: 'contain',
    },
});

export default ProfileTrader;