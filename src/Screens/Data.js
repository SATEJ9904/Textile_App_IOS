import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useRoute } from '@react-navigation/native'

const Data = ({ navigation }) => {

    const route = useRoute()
    const item = route.params.item1
    const [AppUserId, setAppUserId] = useState("")
    const [Name, setName] = useState('')
    const [show, setShow] = useState(true);
    const [Id, setId] = useState("");
    const [LoomOrTrader, setLoomOrTrader] = useState("");
    const [mobileno, setMobileNo] = useState("");
    const [gstno, setGSTNO] = useState("")
    const [registrationNo, setRegistrationNo] = useState("")




    const setData = async () => {

        await AsyncStorage.setItem(
            "AppUserId", item.AppUserId,
        )

        await AsyncStorage.setItem(
            "Name", item.Name,
        )

    }
    useEffect(()=>[
        getData()
    ],[])
    const getData = async () => {
        const Email = await AsyncStorage.getItem("AppUserId")
        const CompanyName = await AsyncStorage.getItem("Name")
        const OwnerName = await AsyncStorage.getItem("OwnerName")
        const Address = await AsyncStorage.getItem("Address")
        const Country = await AsyncStorage.getItem("Country")
        const State = await AsyncStorage.getItem("State")
        const City = await AsyncStorage.getItem("City")
        const Pincode = await AsyncStorage.getItem("Pincode")
        const PrimaryContact = await AsyncStorage("PrimaryContact")
        const RegistrationNumber = await AsyncStorage.getItem("RegistrationNumber")
        const GSTNumber = await AsyncStorage.getItem("GSTNumber")
        const Role = await AsyncStorage.getItem("LoomOrTrader")
        const Creation = await AsyncStorage.getItem("CreatedOn")
        const Id = await AsyncStorage.getItem("Id")
        const Profilepic = await AsyncStorage.getItem("Profilepic")

        setAppUserId(Email)
        setName(Name)
        setLoomOrTrader(LoomOrTrader)
        setId(Id)
        setMobileNo(PrimaryContact)
        setGSTNO(GSTNumber)
        setRegistrationNo(RegistrationNumber)

        console.log("Data = ",Email, Name, LoomOrTrader, Id, PrimaryContact, GSTNumber, RegistrationNumber,Profilepic)
    }

    const fetchData = async () => {
        try {
            const response = await fetch('https://textileapp.microtechsolutions.co.in/php/getuserdetail.php?AppUserId=' + item.AppUserId);
            const data = await response.json();
            console.log(data);
            {
                console.log("started")
                data.map(async item => (
                    console.log(item.LoomOrTrader),
                    await AsyncStorage.setItem(
                        "LoomOrTrader", item.LoomOrTrader,
                    ),
                    await AsyncStorage.setItem(
                        "Id", item.Id.toString(),
                    ),
                    await AsyncStorage.setItem(
                        "PrimaryContact", item.PrimaryContact.toString(),
                    ),
                    await AsyncStorage.setItem(
                        "GSTNumber", item.GSTNumber.toString(),
                    ),
                    await AsyncStorage.setItem(
                        "RegistrationNumber", item.RegistrationNumber,
                    ),
                     await AsyncStorage.setItem(
                        "Address", item.Address,
                    ),
                    await AsyncStorage.setItem(
                        "Country", item.Country,
                    ),
                    await AsyncStorage.setItem(
                        "State", item.State,
                    ),
                    await AsyncStorage.setItem(
                        "City", item.City,
                    ),
                    await AsyncStorage.setItem(
                        "Pincode", item.Pincode,
                    ),
                    await AsyncStorage.setItem(
                        "CreatedOn", item.CreatedOn.date.substring(0,10),
                    ),
                    await AsyncStorage.setItem(
                        "OwnerName", item.OwnerName,
                    ),
                    await AsyncStorage.setItem(
                        "Profilepic", item.Profilepic,
                        console.log("ProfilePic = ",item.Profilepic)
                    ),
                    await AsyncStorage.setItem(
                        "Id", item.Id.toString(),
                    ),
                   
                   
                    getData()
                ))
                console.log("Ended")
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    useEffect(() => {

        const callfuns = () => {
            fetch("")
                .then(fetchData())
                .then(setData())
                .then(setData())
                .then(getData())

            const loadUser = async () => {
                const Name = await AsyncStorage.getItem('Name');
                const LoomOrTrader = await AsyncStorage.getItem('LoomOrTrader');
                const AppUserId = await AsyncStorage.getItem('AppUserId');
                const Id = await AsyncStorage.getItem('Id');
                const PrimaryContact = await AsyncStorage.getItem('PrimaryContact');
                const GSTNumber = await AsyncStorage.getItem('GSTNumber');

                if (Name && AppUserId) {
                    setUser({
                        Name,
                        LoomOrTrader,
                        AppUserId,
                        Id,
                        PrimaryContact,
                        GSTNumber,
                    });
                }
            };

            loadUser();
        }
        callfuns();

    }, [])


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Code to be executed after the timeout
            navigation.navigate("Navigator")
        }, 1000); // Adjust the timeout duration as needed (in milliseconds)

        // Cleanup function to clear the timeout if component unmounts or if dependency changes
        return () => clearTimeout(timeoutId);
    }, [])




    const [userdata, setUserData] = useState([])




    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {
                show ? <ActivityIndicator size={70} color="green" /> : null
            }
            {/* <Text>Email : {AppUserId}</Text>
            <Text>Loom Or Trader : {LoomOrTrader}</Text>
            <Button title="Click" onPress={() => fetchData()} /> */}

        </View>
    )
}

export default Data

