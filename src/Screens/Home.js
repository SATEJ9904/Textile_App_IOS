import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, SafeAreaView, StyleSheet, Text, View, Image, StatusBar, RefreshControl, ScrollView, ImageBackground } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient'; // For gradient backgrounds
import * as Animatable from 'react-native-animatable'; // For animations
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // For modern icons
import Icons from 'react-native-vector-icons/FontAwesome';


const Home = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [ProfilePic, setProfilePic] = useState(null);
  const [name, setName] = useState('');
  const [appUserId, setAppUserId] = useState('');
  const [loomOrTrader, setLoomOrTrader] = useState('');

  const isMounted = useRef(true);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getData = async () => {
    try {
      const Name = await AsyncStorage.getItem("Name");
      const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader");
      const appUserId = await AsyncStorage.getItem("AppUserId");
      const Profilepic = await AsyncStorage.getItem('Profilepic');

      if (isMounted.current) {
        setName(Name || '');
        setLoomOrTrader(LoomOrTrader || '');
        setAppUserId(appUserId || '');
        setProfilePic(Profilepic || '');
      }
      console.log('Data = ', Name, LoomOrTrader);
    } catch (error) {
      console.error('Failed to load data from AsyncStorage', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData(); // Refresh the data on pull down
    setTimeout(() => {
      if (isMounted.current) {
        setRefreshing(false);
      }
    }, 2000);
    console.log("refreshed");
  }, []);

  // Navigation based on loomOrTrader value
  const handleCardPress = () => {
    if (loomOrTrader === 'L') {
      navigation.navigate('Profile');
    } else if (loomOrTrader === 'T') {
      navigation.navigate('ProfileTrader');
    } else if (loomOrTrader === 'Y') {
      navigation.navigate('ProfileYarn');
    }
  };

  const handleCardPress2 = () => {
    if (loomOrTrader === 'L') {
      navigation.navigate('LoomDetails');
    } else if (loomOrTrader === 'Y') {
      navigation.navigate('market');
    }
  };

  return (
    <View style={styles.container}>

      {/* Gradient Header */}
      <LinearGradient colors={['#003C43', '#135D66']} style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.openDrawer()}
        >
          <Icon name="menu" size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
         // onPress={() => navigation.navigate("LiveBooking", { OrderNoId: 478, OrderNo: "OR478"  }) }
          style={{ justifyContent: "center", width: "80%" }}>
          <View style={{ flex: 0.9, alignItems: 'center' }}>
            <Text style={styles.headerTitle}> Home </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Welcome Message with Animation */}
      <Animatable.Text animation="slideInLeft" delay={100} style={styles.welcomeText}>
        Welcome
      </Animatable.Text>

      {/* Profile Section with Animation */}
      <Animatable.View animation="zoomInRight" delay={200} style={styles.profileContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("SelfInfo")}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <ImageBackground source={{ uri: ProfilePic }} style={styles.profileImage}>
                {/* Add the profile picture here */}
              </ImageBackground>
            </View>

            <View style={{ flex: 2, justifyContent: 'center', marginLeft: "10%" }}>
              <Text style={styles.nameText}>{name}</Text>
              <Text style={styles.userIdText}>{appUserId}</Text>
            </View>

            <View style={styles.traderInfo}>
              <TouchableOpacity onPress={() => navigation.navigate("SelfInfo")} style={styles.traderButton}>
                <Text style={styles.traderText}>{loomOrTrader}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>

      {/* Cards Section with Animation - only render if loomOrTrader is not 'A' */}
      {loomOrTrader !== 'A' && (
        <View style={styles.cardContainer}>
          <TouchableOpacity style={{ width: "45%" }} onPress={handleCardPress}>
            <Animatable.View animation="fadeInUp" delay={800} style={styles.card}>
              <Icon name="account-circle" size={36} color="#FFF" />
              <Text style={styles.cardText}> Profile </Text>
            </Animatable.View>
          </TouchableOpacity>
          {
            loomOrTrader == 'L' ?
              <TouchableOpacity style={{ width: "45%" }} onPress={handleCardPress2}>
                <Animatable.View animation="fadeInUp" delay={1000} style={styles.card}>
                  <Icons name="address-card" size={36} color="#FFF" />
                  <Text style={styles.cardText}> Loom Details </Text>
                </Animatable.View>
              </TouchableOpacity> :
              null
          }
        </View>
      )}

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',  // Light background for modern look
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,  // Increased height for better visibility
    elevation: 5,
    borderBottomLeftRadius: 20,  // Rounded bottom corners for modern look
    borderBottomRightRadius: 20,
  },
  drawerButton: {
    padding: 10,
    paddingTop: 45
  },
  headerTitle: {
    fontSize: 28,  // Increased font size
    color: "#FFF",
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,  // Added letter spacing for clean font
    paddingTop: 55
  },
  welcomeText: {
    fontSize: 32,  // Larger, bold welcome message
    color: "#000",
    marginTop: 40,
    marginLeft: 25,
    fontWeight: '600',  // Stronger weight for emphasis
  },
  profileContainer: {
    marginTop: 30,
    marginHorizontal: 20,
    borderRadius: 25,  // Rounded corners for modern profile card
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,  // Smooth shadow for depth
    elevation: 8,  // Shadow on Android
  },
  btn: {
    height: 150,  // Larger button height for more space
    backgroundColor: 'white',
    padding: 20,  // Increased padding for comfort
    borderRadius: 20,  // Rounded corners for modern look
    elevation: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
  profileImage: {
    width: 100,  // Larger image size for profile
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#CCCCCC',
  },
  nameText: {
    fontSize: 22,  // Bigger name text
    color: "#000",
    marginBottom: 8,  // More margin for spacing
    fontWeight: 'bold',
  },
  userIdText: {
    fontSize: 18,  // Bigger user ID text
    color: "#666",  // Softer color for less emphasis
  },
  traderInfo: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#135D66',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  traderButton: {
    padding: 15,  // Increased padding
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  traderText: {
    fontSize: 26,  // Slightly smaller, but bold text
    color: "white",
    fontWeight: '600',
  },
  cardContainer: {
    marginTop: 60,  // Adjusted for better spacing
    alignItems: 'center',
    flexDirection: "column",  // Column alignment for cards
    justifyContent: "center",
    flexDirection: "row"
  },
  card: {
    width: "90%",  // Full-width card style
    height: "40%",  // Increased card height for better visibility
    backgroundColor: "#135D66",
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    flexDirection: 'column',  // Horizontal alignment for card content
    marginVertical: 15,  // Vertical margin between cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardText: {
    fontSize: 22,  // Larger text for card
    color: "white",
    marginLeft: 15,
    fontWeight: '600',
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,  // Padding for content within scroll
  },
});