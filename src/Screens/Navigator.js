import React, { useEffect, useState } from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';



import Login from '../Screens/Login';
import CustomDrawer from '../Screens/CustomDrawer';
import Signup from '../Screens/Signup';
import Splash from '../Screens/Splash';
import SignupTrader from '../Screens/SignupTrader';
import LoginTrader from '../Screens/LoginTrader';
import LoginOptions from '../Screens/LoginOptions';
import Storage from '../Screens/Storage';
import Data from '../Screens/Data';
import Splash2 from '../Screens/Splash2';
import JobWorkEnquires from '../Screens/JobWorkEnquires';
import LoomBooking from '../Screens/LoomBooking';
import CompletedOrders from '../Screens/CompletedOrders';
import GetYarnRates from '../Screens/GetYarnRates';
import LiveOrders from '../Screens/LiveOrders';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Iconsn from 'react-native-vector-icons/MaterialCommunityIcons';


import AsyncStorage from '@react-native-async-storage/async-storage';
import LiveOrderstrader from '../Screens/LiveOrderstrader';
import PlanLooms from '../Screens/PlanLooms';
import CalculationsTrader from '../Screens/CalculationsTrader';
import CompletedOrdersTrader from '../Screens/CompletedOrdersTrader';
import IncompleteOrders from '../Screens/IncompleteOrders';
import LoomsDetails from '../Screens/LoomsDetails';
import ConfirmEnquires from '../Screens/ConfirmEnquires';
import LTDIFF from '../Screens/Difference';
import ConfirmOrders from './ConfirmOrders';
import GeneratedEnquires from './GeneratedEnquires';
import NewEnquiry from './NewEnquiry';
import Profile from './Profile';
import SelfInfo from './SelfInfo';
import EditProfile from './EditProfile';
import EditLooms from './EditLooms';
import ContactEdit from './ContactEdit';
import AddContacts from './AddContacts';
import MyLooms from './MyLooms';
import YarnUsers from './YarnUsers';
import TraderUsers from './TraderUsers';
import LoomUsers from './LoomUsers';
import Users from './Users';
import Home from './Home';
import KnottingOffersL from './KnottingOffersL';
import KnottingOffersT from './KnottingOffersT';
import KnottingResponses from './KnottingResponses';
import GenerateKnottingoffers from './GenerateKnottingoffers';
import KLBookings from './KLBookings';
import YarnMsg from './YarnMsg';
import YarnTmsg from './YarnTmsg';
import BroadCastScreen from './BroadCastScreen';
import TraderMsgs from './TraderMsgs';
import LoomMsgs from './LoomMsgs';
import BroadCastYarn from './BroadCastYarn';
import TraderChat from './TraderChat';
import TraderChatDisplay from './TraderChatDisplay';
import BroadCastTrader from './BroadCastTrader';
import LiveBooking from './LiveBooking';
import BookLoomForm from './BookLoomForm';
import SignUpYarn from './SignUpYarn';
import ProfileYarn from './ProfileYarn';
import CanceledOrders from './CanceledOrders';
import Market from './Market';
import GenerateOffers from './GenerateOffers';
import ViewOffers from './ViewOffers';
import Message from './Message';
import MessageSelections from './MessageSelections';
import MessageUserSelection from './MessageUserSelection';





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

      name="Market Offers"
      component={Market}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'rupee' : 'rupee'} size={25} color={'grey'} />
        ),
        title: 'Market Offers',
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

      name="GetYarnRates"
      component={GetYarnRates}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'rupee' : 'rupee'} size={25} color={'grey'} />
        ),
        title: 'Get Yarn Rates',
        drawerLabelStyle: {
          marginLeft: 10,
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
          <Icon name={focused ? 'briefcase' : 'briefcase'} size={25} color={'grey'} />
        ),
        title: 'Knotting Offers',
        drawerLabelStyle: {
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,

        },

      }} />


    <TraderDrawer.Screen

      name="Market"
      component={Market}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'rupee' : 'rupee'} size={25} color={'grey'} />
        ),
        title: 'Market',
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

      name="IncompleteOrders"
      component={IncompleteOrders}
      options={{
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerIcon: ({ focused }) => (
          <Icon name={focused ? 'exclamation-circle' : 'exclamation-circle'} size={25} color={'grey'} />
        ),
        title: 'Incomplete Orders',
        drawerLabelStyle: {
          marginLeft: 10,
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
)



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
          <Icon name={focused ? 'home' : 'home'} size={25} color={'grey'} />
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

const Navigator = () => {

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



  const DrawerNavigator = loomOrtrader == 'L' ? LoomDrawerNavigator : loomOrtrader == 'T' ? TraderDrawerNavigator : loomOrtrader == 'A' ? AdminDrawerNavigator : loomOrtrader == 'Y' ? YarnDrawerNavigator : DefaultDrawerNavigator;

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}  >
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        <Stack.Screen name="Navigator" component={Navigator} />
        <Stack.Screen name="Difference" component={LTDIFF} />
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
        <Stack.Screen name="GenerateOffers" component={GenerateOffers} />
        <Stack.Screen name="ViewOffers" component={ViewOffers} />
        <Stack.Screen name="Message" component={Message} />
        <Stack.Screen name="MessageSelections" component={MessageSelections} />
        <Stack.Screen name="MessageUserSelection" component={MessageUserSelection} />

      </Stack.Navigator>
  );
}

export default Navigator;