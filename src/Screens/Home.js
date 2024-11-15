import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Image } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const App = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image

  // Request Camera Permission
  const requestCameraPermission = async () => {
    const result = await request(PERMISSIONS.IOS.CAMERA);
    setCameraPermission(result);

    if (result === RESULTS.GRANTED) {
      Alert.alert("Permission Granted", "You can use the camera now!");
    } else if (result === RESULTS.DENIED) {
      Alert.alert("Permission Denied", "Camera access is needed to proceed.");
    } else if (result === RESULTS.BLOCKED) {
      Alert.alert("Permission Blocked", "Please enable camera permission in settings.");
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  // Launch Camera
  const openCamera = () => {
    if (cameraPermission === RESULTS.GRANTED) {
      launchCamera(
        {
          mediaType: 'photo',
          quality: 1,
          saveToPhotos: true,
        },
        (response) => {
          if (response.didCancel) {
            Alert.alert("Cancelled", "User cancelled the camera.");
          } else if (response.errorMessage) {
            Alert.alert("Error", response.errorMessage);
          } else if (response.assets && response.assets.length > 0) {
            const image = response.assets[0];
            setSelectedImage(image.uri);
            Alert.alert("Success", "Photo captured successfully!");
          }
        }
      );
    } else {
      Alert.alert("Permission Required", "Camera permission is not granted.");
    }
  };

  // Launch Image Library
  const openImageLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          Alert.alert("Cancelled", "User cancelled the image picker.");
        } else if (response.errorMessage) {
          Alert.alert("Error", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const image = response.assets[0];
          setSelectedImage(image.uri);
          Alert.alert("Success", "Image selected successfully!");
        }
      }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Camera Permission: {cameraPermission}</Text>
      <Button title="Request Camera Permission" onPress={requestCameraPermission} />
      <Button title="Open Camera" onPress={openCamera} />
      <Button title="Open Image Library" onPress={openImageLibrary} />

      {/* Display the selected image */}
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{
            width: 300,
            height: 300,
            marginTop: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ccc',
          }}
        />
      )}
    </View>
  );
};

export default App;
