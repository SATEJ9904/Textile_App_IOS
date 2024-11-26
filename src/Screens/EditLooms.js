import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, ScrollView } from 'react-native';
import { Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox } from 'react-native-paper';
import HeaderPart from './HeaderPart';

const EditLooms = ({ navigation, route }) => {

  const { selectedLoom } = route.params;


  const [editedLoom, setEditedLoom] = useState(selectedLoom);
  const [machineData, setMachineData] = useState([]);
  const [sheddingData, setSheddingData] = useState([]);
  const [frameData, setFrameData] = useState([]);
  const [feederData, setFeederData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMachineData();
    fetchSheddingData();
    fetchFrameData();
    fetchFeederData();
  }, []);

  const fetchMachineData = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=MachineType');
      const jsonData = await response.json();
      setMachineData(jsonData);
    } catch (error) {
      console.error('Error fetching machine data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSheddingData = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=SheddingType');
      const jsonData = await response.json();
      setSheddingData(jsonData);
    } catch (error) {
      console.error('Error fetching shedding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFrameData = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=NoOfFrame');
      const jsonData = await response.json();
      setFrameData(jsonData);
    } catch (error) {
      console.error('Error fetching frame data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeederData = async () => {
    try {
      const response = await fetch('https://textileapp.microtechsolutions.co.in/php/gettable.php?table=NoOfFeeders');
      const jsonData = await response.json();
      setFeederData(jsonData);
    } catch (error) {
      console.error('Error fetching feeder data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLoom = async () => {
    const formdata = new FormData();
    formdata.append("Id", editedLoom.Id);
    formdata.append("LoomNo", editedLoom.LoomNo);
    formdata.append("MachineType", editedLoom.MachineType);
    formdata.append("Width", editedLoom.Width);
    formdata.append("RPM", editedLoom.RPM);
    formdata.append("SheddingType", editedLoom.SheddingType);
    formdata.append("NoofFrames", editedLoom.NoofFrames);
    formdata.append("NoofFeeders", editedLoom.NoofFeeders);
    formdata.append("SelvageJacquard", editedLoom.SelvageJacquard);
    formdata.append("TopBeam", editedLoom.TopBeam);
    formdata.append("Cramming", editedLoom.Cramming);
    formdata.append("LenoDesignEquipment", editedLoom.LenoDesignEquipment);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://textileapp.microtechsolutions.co.in/php/updateloomdetail.php", requestOptions);
      const result = await response.text();
      console.log(result);
      Alert.alert("Loom Updated Successfully");
      navigation.goBack();
    } catch (error) {
      console.error('Error updating loom details:', error);
      Alert.alert("Error", "Failed to update loom details.");
    }
  };


  const DeleteLoom = () => {
    console.log(editedLoom.Id);


    const formdata = new FormData();
    formdata.append("Id", editedLoom.Id);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://textileapp.microtechsolutions.co.in/php/delloom.php", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    Alert.alert("Loom Deleted Successfully")
    navigation.navigate("Profile")
  };

  const handleChange = (key, value) => {
    setEditedLoom({ ...editedLoom, [key]: value });
  };

  return (
    <View style={styles.container}>
      <HeaderPart />
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.goBack()}>
          <Image source={require("../Images/back.png")} style={styles.menuIconImage} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Loom {editedLoom.LoomNo}</Text>
      </View>
      <ScrollView>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Machine Type:</Text>
            <Dropdown
              style={styles.input}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={machineData.map(item => ({ label: item.Name, value: item.Name }))}
              search
              itemTextStyle={{ color: "#000" }}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder='Select Machine Type'
              searchPlaceholder="Search..."
              value={editedLoom.MachineType}
              onFocus={() => console.log('Machine Type onFocus')}
              onBlur={() => console.log('Machine Type onBlur')}
              onChange={item => handleChange('MachineType', item.value)}
            />
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Width:</Text>
            <TextInput
              style={styles.input}
              value={editedLoom.Width}
              onChangeText={(text) => handleChange('Width', text)}
            />
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>RPM:</Text>
            <TextInput
              style={styles.input}
              value={editedLoom.RPM}
              onChangeText={(text) => handleChange('RPM', text)}
            />
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Shedding Type:</Text>
            <Dropdown
              style={styles.input}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={sheddingData.map(item => ({ label: item.Name, value: item.Name }))}
              search
              itemTextStyle={{ color: "#000" }}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder='Select Shedding Type'
              searchPlaceholder="Search..."
              value={editedLoom.SheddingType}
              onFocus={() => console.log('Shedding Type onFocus')}
              onBlur={() => console.log('Shedding Type onBlur')}
              onChange={item => handleChange('SheddingType', item.value)}
            />
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>No of Frames:</Text>
            <Dropdown
              style={styles.input}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={frameData.map(item => ({ label: item.Range.toString(), value: item.Range }))}
              search
              itemTextStyle={{ color: "#000" }}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder='Select No of Frames'
              searchPlaceholder="Search..."
              value={editedLoom.NoofFrames}
              onFocus={() => console.log('No of Frames onFocus')}
              onBlur={() => console.log('No of Frames onBlur')}
              onChange={item => handleChange('NoofFrames', item.value)}
            />
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>No of Feeders:</Text>
            <Dropdown
              style={styles.input}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={feederData.map(item => ({ label: item.Range.toString(), value: item.Range }))}
              search
              itemTextStyle={{ color: "#000" }}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder='Select No of Feeders'
              searchPlaceholder="Search..."
              value={editedLoom.NoofFeeders}
              onFocus={() => console.log('No of Feeders onFocus')}
              onBlur={() => console.log('No of Feeders onBlur')}
              onChange={item => handleChange('NoofFeeders', item.value)}
            />
          </View>
          <View style={{ margin: "5%", borderWidth: 1, borderRadius: 30 }}>
            <View style={{ margin: "10%" }}>
              <Text style={{ color: "#003c43", fontSize: 20, fontWeight: "700", marginTop: "6%", marginLeft: "4%", marginBottom: "15%", width: "120%" }}>Other Loom Attachments</Text>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Selvage Jacquard:</Text>
              <View style={styles.checkboxBorder}>
              <Checkbox
                  status={editedLoom.SelvageJacquard === 1 ? 'checked' : 'unchecked'}
                  onPress={() => handleChange('SelvageJacquard', editedLoom.SelvageJacquard === 1 ? 0 : 1)}
                  color="blue" // Color of the checkbox when checked
                  uncheckedColor="black" // Color when unchecked
                />
              </View>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Top Beam:</Text>
              <View style={styles.checkboxBorder}>
              <Checkbox
                  status={editedLoom.TopBeam === 1 ? 'checked' : 'unchecked'}
                  onPress={() => handleChange('TopBeam', editedLoom.TopBeam === 1 ? 0 : 1)}
                  color="blue"
                  uncheckedColor="black"
                />
              </View>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Cramming:</Text>
              <View style={styles.checkboxBorder}>
              <Checkbox
                  status={editedLoom.Cramming === 1 ? 'checked' : 'unchecked'}
                  onPress={() => handleChange('Cramming', editedLoom.Cramming === 1 ? 0 : 1)}
                  color="blue"
                  uncheckedColor="black"
                />
              </View>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Leno Design Equipment:</Text>
               <View style={styles.checkboxBorder}>
               <Checkbox
                  status={editedLoom.LenoDesignEquipment === 1 ? 'checked' : 'unchecked'}
                  onPress={() => handleChange('LenoDesignEquipment', editedLoom.LenoDesignEquipment === 1 ? 0 : 1)}
                  color="blue"
                  uncheckedColor="black"
                />
               </View>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditLoom}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: "red", marginTop: "-5%" }]} onPress={DeleteLoom}>
            <Text style={styles.editButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: "#003C43",
    flexDirection: "row",
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 20,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuIconImage: {
    width: 28,
    height: 22,
  },
  headerText: {
    fontSize: 26,
    color: "white",
    fontWeight: 'bold',
    marginLeft: "20%"
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: "15%",
  },
  detailItem: {
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: "#555"
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#555"
  },
  editButton: {
    backgroundColor: '#007e83',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginTop: 20,
    alignSelf: 'center',
    width: "70%",
    marginBottom: "15%",
    justifyContent: "center",
    alignItems: "center"
  },
  editButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkbox: {
    alignSelf: 'center',
    marginLeft: 'auto',

  },
  placeholderStyle: {
    color: 'grey',
  },
  selectedTextStyle: {
    color: 'black',
  },
  inputSearchStyle: {
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  checkboxBorder: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    padding: -2,
    margin:5 // Adjust as needed for spacing
},
});

export default EditLooms;