import React, { useEffect, useState } from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';



import Login from './src/Screens/Login';
import Home from './src/Screens/Home';
import CustomDrawer from './src/Screens/CustomDrawer';
import Signup from './src/Screens/Signup';
import Splash from './src/Screens/Splash';
import SignupTrader from './src/Screens/SignupTrader';
import LoginTrader from './src/Screens/LoginTrader';
import LoginOptions from './src/Screens/LoginOptions';
import Storage from './src/Screens/Storage';
import Data from './src/Screens/Data';
import Splash2 from './src/Screens/Splash2';
import JobWorkEnquires from './src/Screens/JobWorkEnquires';
import LoomBooking from './src/Screens/LoomBooking';
import CompletedOrders from './src/Screens/CompletedOrders';
import GetYarnRates from './src/Screens/GetYarnRates';
import LiveOrders from './src/Screens/LiveOrders';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Iconsn from 'react-native-vector-icons/MaterialCommunityIcons';


import AsyncStorage from '@react-native-async-storage/async-storage';
import LiveOrderstrader from './src/Screens/LiveOrderstrader';
import PlanLooms from './src/Screens/PlanLooms';
import GetYarnRatesTrader from './src/Screens/GetYarnRatesTrader';
import CalculationsTrader from './src/Screens/CalculationsTrader';
import CompletedOrdersTrader from './src/Screens/CompletedOrdersTrader';
import LoomsDetails from './src/Screens/LoomsDetails';
import ConfirmEnquires from './src/Screens/ConfirmEnquires';
import LTDIFF from './src/Screens/Difference';
import Navigator from './src/Screens/Navigator';
import ConfirmOrders from './src/Screens/ConfirmOrders';
import Profile from './src/Screens/Profile';
import GeneratedEnquires from './src/Screens/GeneratedEnquires';
import NewEnquiry from './src/Screens/NewEnquiry';
import SelfInfo from './src/Screens/SelfInfo';
import EditProfile from './src/Screens/EditProfile';
import EditLooms from './src/Screens/EditLooms';
import ContactEdit from './src/Screens/ContactEdit';
import AddContacts from './src/Screens/AddContacts';
import MyLooms from './src/Screens/MyLooms';
import YarnUsers from './src/Screens/YarnUsers';
import TraderUsers from './src/Screens/TraderUsers';
import LoomUsers from './src/Screens/LoomUsers';
import Users from './src/Screens/Users';
import KnottingOffersT from './src/Screens/KnottingOffersT';
import KnottingOffersL from './src/Screens/KnottingOffersL';
import KnottingResponses from './src/Screens/KnottingResponses';
import GenerateKnottingoffers from './src/Screens/GenerateKnottingoffers';
import KLBookings from './src/Screens/KLBookings';
import YarnMsg from './src/Screens/YarnMsg';
import YarnTmsg from './src/Screens/YarnTmsg';
import BroadCastScreen from './src/Screens/BroadCastScreen';
import LoomMsgs from './src/Screens/LoomMsgs';
import TraderMsgs from './src/Screens/TraderMsgs';
import BroadCastYarn from './src/Screens/BroadCastYarn';
import TraderChat from './src/Screens/TraderChat';
import TraderChatDisplay from './src/Screens/TraderChatDisplay';
import BroadCastTrader from './src/Screens/BroadCastTrader';
import LiveBooking from './src/Screens/LiveBooking';
import BookLoomForm from './src/Screens/BookLoomForm';
import SignUpYarn from './src/Screens/SignUpYarn';
import ProfileTrader from './src/Screens/ProfileTrader';
import ProfileYarn from './src/Screens/ProfileYarn';
import CanceledOrders from './src/Screens/CanceledOrders';
import ConfirmOrderKnotting from './src/Screens/ConfirmOrderKnotting';
import Market from './src/Screens/Market';
import GenerateOffers from './src/Screens/GenerateOffers';
import ViewOffers from './src/Screens/ViewOffers';
import Message from './src/Screens/Message';
import MessageSelections from './src/Screens/MessageSelections';
import MessageUserSelection from './src/Screens/MessageUserSelection';
import LoomDetails from './src/Screens/LoomsDetails';






//https://github.com/itzpradip/react-navigation-v6-mix/blob/master/src/navigation/AppStack.js



const Stack = createStackNavigator();


const LoomDrawer = createDrawerNavigator();
const LoomDrawerNavigator = () => (
  <LoomDrawer.Navigator initialRouteName='Storage' drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveBackgroundColor: '#033E3E',
      drawerActiveTintColor: '#FFF',
      drawerInactiveTintColor: '#033E3E',
      drawerLabelStyle: {
        marginLeft: 0,
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
      },
    }}>
    <LoomDrawer.Screen

      name="Home"
      component={Home}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'home' : 'home'} size={25} color={'grey'} />
        ),
        title: 'Home',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },


      }} />





    <LoomDrawer.Screen

      name="Live orders"
      component={LiveOrders}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'truck' : 'truck'} size={25} color={'grey'} />
        ),
        title: 'Live Orders',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />



    <LoomDrawer.Screen

      name="JobWorkEnquires"
      component={JobWorkEnquires}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'briefcase' : 'briefcase'} size={25} color={'grey'} />
        ),
        title: 'Job Work Enquires',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />


    <LoomDrawer.Screen

      name="LoomBooking"
      component={LoomBooking}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'shopping-cart' : 'shopping-cart'} size={25} color={'grey'} />
        ),
        title: 'LoomBooking',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />

    <LoomDrawer.Screen

      name="KnottingOffersL"
      component={KnottingOffersL}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icons name={focused ? 'local-offer' : 'local-offer'} size={25} color={'grey'} />
        ),
        title: 'Knotting Offers',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />

    <LoomDrawer.Screen

      name="CalculationsTrader"
      component={CalculationsTrader}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'calculator' : 'calculator'} size={25} color={'grey'} />
        ),
        title: 'Calculations',
        drawerLabelStyle: {
          marginLeft: 5,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />

    <LoomDrawer.Screen

      name="CompletedOrders"
      component={CompletedOrders}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'check' : 'check'} size={25} color={'grey'} />
        ),

        title: 'Completed Orders',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />


    <LoomDrawer.Screen

      name="CanceledOrders"
      component={CanceledOrders}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Iconsn name={focused ? 'cancel' : 'cancel'} size={25} color={'grey'} />
        ),

        title: 'Canceled Orders',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />

 
    <LoomDrawer.Screen

      name="Profile"
      component={Profile}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'user' : 'user'} size={25} color={'grey'} />
        ),
        title: 'Profile',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },


      }} />

    <LoomDrawer.Screen

      name="Storage"
      component={Storage}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'sign-out' : 'sign-out'} size={25} color={'grey'} />
        ),
        title: 'Exit',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },

      }} />

  </LoomDrawer.Navigator>
);

// Define drawer navigator for trader
const TraderDrawer = createDrawerNavigator();
const TraderDrawerNavigator = () => (


  <TraderDrawer.Navigator initialRouteName='Storage' drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveBackgroundColor: '#033E3E',
      drawerActiveTintColor: '#FFF',
      drawerInactiveTintColor: '#033E3E',
      drawerLabelStyle: {
        marginLeft: 10,
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
      },
    }}
  >

    <TraderDrawer.Screen

      name="Home"
      component={Home}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'home' : 'home'} size={25} color={'grey'} />
        ),
        title: 'Home',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />


    <TraderDrawer.Screen

      name="LiveOrderstrader"
      component={LiveOrderstrader}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'truck' : 'truck'} size={25} color={'grey'} />
        ),
        title: 'Live Orders',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="PlanLooms"
      component={PlanLooms}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'briefcase' : 'briefcase'} size={25} color={'grey'} />
        ),
        title: 'PlanLooms',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="KnottingOffersT"
      component={KnottingOffersT}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icons name={focused ? 'local-offer' : 'local-offer'} size={25} color={'grey'} />
        ),
        title: 'Knotting Offers',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="CalculationsTrader"
      component={CalculationsTrader}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'calculator' : 'calculator'} size={25} color={'grey'} />
        ),
        title: 'Calculations',
        drawerLabelStyle: {
          marginLeft: 5,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

   

    <TraderDrawer.Screen

      name="CompletedOrdersTrader"
      component={CompletedOrdersTrader}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'check-circle' : 'check-circle'} size={25} color={'grey'} />
        ),
        title: 'Completed Orders',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <TraderDrawer.Screen

      name="ProfileTrader"
      component={ProfileTrader}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'user' : 'user'} size={25} color={'grey'} />
        ),
        title: 'Profile',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },


      }} />


    <TraderDrawer.Screen

      name="Storage"
      component={Storage}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'sign-out' : 'sign-out'} size={25} color={'grey'} />
        ),
        title: 'Exit',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />
  </TraderDrawer.Navigator>
);

// Define drawer navigator for trader
const AdminDrawer = createDrawerNavigator();
const AdminDrawerNavigator = () => (

  <AdminDrawer.Navigator initialRouteName='Storage' drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveBackgroundColor: '#033E3E',
      drawerActiveTintColor: '#FFF',
      drawerInactiveTintColor: '#033E3E',
      drawerLabelStyle: {
        marginLeft: 10,
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
      },
    }}
  >

    <AdminDrawer.Screen

      name="Home"
      component={Home}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'home' : 'home'} size={25} color={'grey'} />
        ),
        title: 'Home',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />


    <AdminDrawer.Screen

      name="Users"
      component={Users}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'user' : 'user'} size={25} color={'grey'} />
        ),
        title: 'Users',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <AdminDrawer.Screen

      name="Loom Users"
      component={LoomUsers}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'gears' : 'gears'} size={25} color={'grey'} />
        ),
        title: 'Loom Users',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <AdminDrawer.Screen

      name="TraderUsers"
      component={TraderUsers}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'briefcase' : 'briefcase'} size={25} color={'grey'} />
        ),
        title: 'Trader Users',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

    <AdminDrawer.Screen

      name="YarnUsers"
      component={YarnUsers}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'user-circle' : 'user-circle'} size={25} color={'grey'} />
        ),
        title: 'Yarn Users',
        drawerLabelStyle: {
          marginLeft: 5,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />


    <AdminDrawer.Screen

      name="Storage"
      component={Storage}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'sign-out' : 'sign-out'} size={25} color={'grey'} />
        ),
        title: 'Exit',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />
  </AdminDrawer.Navigator>
);


// Define drawer navigator for trader
const DefaultDrawer = createDrawerNavigator();
const DefaultDrawerNavigator = () => (

  <DefaultDrawer.Navigator initialRouteName='Storage' drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveBackgroundColor: '#033E3E',
      drawerActiveTintColor: '#FFF',
      drawerInactiveTintColor: '#033E3E',
      drawerLabelStyle: {
        marginLeft: 10,
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
      },
    }}
  >


    <DefaultDrawer.Screen

      name="Storage"
      component={Storage}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'sign-out' : 'sign-out'} size={25} color={'grey'} />
        ),
        title: 'Exit',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />
    <DefaultDrawer.Screen

      name="Home"
      component={Home}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'home' : 'home'} size={25} color={'grey'} />
        ),
        title: 'Home',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },


      }} />
  </DefaultDrawer.Navigator>
);


// Define drawer navigator for trader
const YarnDrawer = createDrawerNavigator();
const YarnDrawerNavigator = () => (

  <YarnDrawer.Navigator initialRouteName='Storage' drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveBackgroundColor: '#033E3E',
      drawerActiveTintColor: '#FFF',
      drawerInactiveTintColor: '#033E3E',
      drawerLabelStyle: {
        marginLeft: 10,
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
      },
    }}
  >

    <YarnDrawer.Screen

      name="Home"
      component={Home}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'home' : 'home'} size={25} color={'grey'} />
        ),
        title: 'Home',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },


      }} />

    <YarnDrawer.Screen

      name="LoomMsgs"
      component={LoomMsgs}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Iconsn name={focused ? 'android-messages' : 'android-messages'} size={25} color={'grey'} />
        ),
        title: 'Loom Messages',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },


      }} />

    <YarnDrawer.Screen

      name="TraderMsgs"
      component={TraderMsgs}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Iconsn name={focused ? 'message-text-outline' : 'message-text-outline'} size={25} color={'grey'} />
        ),
        title: 'Trader Messages',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },


      }} />

    <YarnDrawer.Screen

      name="CalculationsTrader"
      component={CalculationsTrader}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'calculator' : 'calculator'} size={25} color={'grey'} />
        ),
        title: 'Calculations',
        drawerLabelStyle: {
          marginLeft: 5,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },


      }} />

    <YarnDrawer.Screen

      name="Market"
      component={Market}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Iconsn name={focused ? 'android-messages' : 'android-messages'} size={25} color={'grey'} />
        ),
        title: 'Market',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },


      }} />

    <YarnDrawer.Screen

      name="ProfileYarn"
      component={ProfileYarn}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'user' : 'user'} size={25} color={'grey'} />
        ),
        title: 'Profile',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 18,

        },


      }} />

    <YarnDrawer.Screen

      name="Storage"
      component={Storage}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'sign-out' : 'sign-out'} size={25} color={'grey'} />
        ),
        title: 'Exit',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />

  </YarnDrawer.Navigator>
);

const App = () => {



  const [AppUserId, setAppUserId] = useState("")
  const [Name, setName] = useState('')
  const [show, setShow] = useState(true)
  const [loomOrtrader, setLoomOrTrader] = useState("")



  const getData = async () => {
    const ID = await AsyncStorage.getItem("AppUserId");
    const Name = await AsyncStorage.getItem("Name");
    const LoomOrTrader = await AsyncStorage.getItem("LoomOrTrader")

    setAppUserId(ID)
    setName(Name)
    setLoomOrTrader(LoomOrTrader)
    console.log(loomOrtrader)
  }

  useEffect(() => {
    getData();
  }, [])

  const [location, setLocation] = useState(null);

  useEffect(() => {
    const hasLocationPermission = async () => {
      Geolocation.getCurrentPosition((position) => {
        setLocation(position);
      }, (error) => {
        console.log(error.code, error.message);
      }, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      });
    };
    hasLocationPermission();
  }, []);


  const DrawerNavigator = loomOrtrader == 'L' ? LoomDrawerNavigator : loomOrtrader == 'T' ? TraderDrawerNavigator: DefaultDrawerNavigator ; {/* : loomOrtrader == 'A' ? AdminDrawerNavigator : loomOrtrader == 'Y' ? YarnDrawerNavigator*/} ;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}  >
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        <Stack.Screen name="Navigator" component={Navigator} />
        <Stack.Screen name="Difference" component={LTDIFF} />
        <Stack.Screen name="LoomDetails" component={LoomDetails} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Splash2" component={Splash2} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="LoginOptions" component={LoginOptions} />
        <Stack.Screen name="SignupTrader" component={SignupTrader} />
        <Stack.Screen name="LoginTrader" component={LoginTrader} />
        <Stack.Screen name="Data" component={Data} />
        <Stack.Screen name="LoomBooking" component={LoomBooking} />
        <Stack.Screen name="ConfirmEnquires" component={ConfirmEnquires} />
        <Stack.Screen name="ConfirmOrds" component={ConfirmOrders} />
        <Stack.Screen name="Generated_Enquires" component={GeneratedEnquires} />
        <Stack.Screen name="NewEnquiry" component={NewEnquiry} />
        <Stack.Screen name="SelfInfo" component={SelfInfo} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="EditLooms" component={EditLooms} />
        <Stack.Screen name="ContactEdit" component={ContactEdit} />
        <Stack.Screen name="AddContacts" component={AddContacts} />
        <Stack.Screen name="MyLooms" component={MyLooms} />
        <Stack.Screen name="KnottingResponses" component={KnottingResponses} />
        <Stack.Screen name="GenerateKnottingoffers" component={GenerateKnottingoffers} />
        <Stack.Screen name="KLBookings" component={KLBookings} />
        <Stack.Screen name="YarnMsg" component={YarnMsg} />
        <Stack.Screen name="YarnTmsg" component={YarnTmsg} />
        <Stack.Screen name="BroadCastScreen" component={BroadCastScreen} />
        <Stack.Screen name="BroadCastYarn" component={BroadCastYarn} />
        <Stack.Screen name="TraderChat" component={TraderChat} />
        <Stack.Screen name="TraderChatDisplay" component={TraderChatDisplay} />
        <Stack.Screen name="BroadCastTrader" component={BroadCastTrader} />
        <Stack.Screen name="LiveBooking" component={LiveBooking} />
        <Stack.Screen name="BookLoomForm" component={BookLoomForm} />
        <Stack.Screen name="SignUpYarn" component={SignUpYarn} />
        <Stack.Screen name="ConfirmOrderKnotting" component={ConfirmOrderKnotting} />
        <Stack.Screen name="GenerateOffers" component={GenerateOffers} />
        <Stack.Screen name="ViewOffers" component={ViewOffers} />
        <Stack.Screen name="Message" component={Message} />
        <Stack.Screen name="MessageSelections" component={MessageSelections} />
        <Stack.Screen name="MessageUserSelection" component={MessageUserSelection} />
        <Stack.Screen name="LoomsDetails" component={LoomsDetails} />



      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;