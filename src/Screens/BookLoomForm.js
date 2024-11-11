import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

const BookLoomForm = ({ route, navigation }) => {
  const { LoomDetailId, OrderNo, FromDate, ToDate } = route.params;

  const [loomNo, setLoomNo] = useState('');
  const [loomAvailableFrom, setLoomAvailableFrom] = useState('N/A');
  const [loomAvailableTo, setLoomAvailableTo] = useState('N/A');
  const [bookedFromDate, setBookedFromDate] = useState(null);
  const [bookedToDate, setBookedToDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [showBookedFromDatePicker, setShowBookedFromDatePicker] = useState(false);
  const [showBookedToDatePicker, setShowBookedToDatePicker] = useState(false);
  const [orderNo, setOrderNo] = useState('N/A');
  const [newBookedFromDate, setNewBookedFromDate] = useState(null);
  const [newBookedToDate, setNewBookedToDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingId, setBookingId] = useState('');
  const [formType, setFormType] = useState(null);
  const [knottingOrderId, setKnottingOrderId] = useState('');

  useEffect(() => {
    const fetchLoomDetails = async () => {
      try {
        const response = await fetch(`https://textileapp.microtechsolutions.co.in/php/loombooking.php?LoomDetailId=${LoomDetailId}&BookedFromDate=${FromDate}&BookedToDate=${ToDate}`);
        const result = await response.json(); // Parse the response as JSON
        if (result.length > 0) { // Check if the result array is not empty
          const loomDetails = result[0]; // Access the first item in the array
          setLoomNo(loomDetails.LoomNo); // Set the LoomNo state
          setLoomAvailableFrom(loomDetails.LoomAvailableFrom.date.substring(0, 10)); // Assuming LoomAvailableFrom is a string in ISO format
          setBookingId(loomDetails.BookingId)
        } else {
          console.log('No loom details found');
        }
        setIsLoading(false);
        const bookedFromDates = result
          .filter(item => item.BookedFromDate !== null)
          .map(item => item.BookedFromDate.date);

        setBookedFromDate(bookedFromDates)
        console.log("Dates = ", bookedFromDates)

      } catch (error) {
        console.error('Error fetching loom details:', error);
        setIsLoading(false);
      }
    };

    fetchLoomDetails();
  }, [LoomDetailId, FromDate, ToDate]);


  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const checkBookingDates = async () => {

    const formData = new FormData();
    formData.append('Fromdate', newBookedFromDate.toISOString().split('T')[0]);
    formData.append('Todate', newBookedToDate.toISOString().split('T')[0]);
    formData.append('LoomDetailId', LoomDetailId);

    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };

    try {
      const response = await fetch("https://textileapp.microtechsolutions.co.in/php/checkbookdate.php", requestOptions);
      const result = await response.text();
      console.log(result);
      if (result === 'Available') {
        Alert.alert('The dates are available for booking.');
        return true;
      } else {
        Alert.alert('Error', 'The dates are not valid for booking.');
        return false;
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check booking dates.');
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (bookedFromDate !== null) {

      const isAvailable = await checkBookingDates();

      if (!isAvailable) {
        return;
      }

      setIsSubmitting(true);

      if (!bookedFromDate || !bookedToDate || (!OrderNo && !knottingOrderId)) {
        Alert.alert("Error", "Please ensure all dates and Order ID are filled.");
        setIsSubmitting(false);
        return;
      }

      const loomAvailableToDate = addMonths(bookedToDate, 4).toISOString().split('T')[0];

      // Prepare form data for submission
      const formData = new FormData();
      formData.append('LoomDetailId', LoomDetailId);
      formData.append('BookedFromDate', bookedFromDate.toISOString().split('T')[0]);
      formData.append('BookedToDate', bookedToDate.toISOString().split('T')[0]);
      formData.append('LoomAvailableTo', loomAvailableToDate);
      formData.append('BookingId', bookingId ? bookingId : null);
      formData.append('KnottingOrderId', OrderNo ? OrderNo : null);


      const requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      };

      console.log("Form Data:", {
        LoomDetailId,
        loomNo,
        Available: false,
        BookedFromDate: bookedFromDate.toISOString().split('T')[0],
        BookedToDate: bookedToDate.toISOString().split('T')[0],
        LoomAvailableTo: loomAvailableToDate,
      });

      try {
        // Send form data to the server
        const response = await fetch('https://textileapp.microtechsolutions.co.in/php/postloombooking.php', requestOptions);
        const result = await response.text();
        console.log(result);
        setIsSubmitting(false);
        if (result === "Success") {
          Alert.alert('Success', 'Knotting order booking submitted successfully');
          navigation.goBack({ BookedLoomNo: loomNo });
        } else {
          Alert.alert('Error', 'Failed to submit knotting order booking. Please check the input data and try again.');
        }
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        Alert.alert('Error', 'Failed to submit knotting order booking');
      }
    } else {

      const isAvailable = await checkBookingDates();

      if (!isAvailable) {
        return;
      }

      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('BookingId', bookingId);
      formData.append('BookedFromDate', newBookedFromDate.toISOString().split('T')[0]);
      formData.append('BookedToDate', newBookedToDate.toISOString().split('T')[0]);
      formData.append('LoomAvailableTo', addMonths(newBookedToDate, 4).toISOString().split('T')[0]);


      const requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      };

      try {
        const response = await fetch('https://textileapp.microtechsolutions.co.in/php/updateloomavailabilitynew.php', requestOptions);
        const result = await response.text();
        console.log(result);
        setIsSubmitting(false);
        Alert.alert('Success', 'Loom booking submitted successfully');
        navigation.goBack({ BookedLoomNo: loomNo });
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        Alert.alert('Error', 'Failed to submit loom booking');
      }

      console.log(bookingId, newBookedFromDate.toISOString().split('T')[0], newBookedToDate.toISOString().split('T')[0], addMonths(newBookedToDate, 4).toISOString().split('T')[0]);
    }
  }

  const handleKnottingSubmit = async () => {
    // Check if 'bookedFromDate' exists
    if (bookedFromDate.length !== 0) {
      console.log("Called when Booked From date exists");

      // Check if booking dates are available
      const isAvailable = await checkBookingDates();
      if (!isAvailable) return;

      setIsSubmitting(true);
      if (!bookedFromDate || !bookedToDate || (!OrderNo && !knottingOrderId)) {
        Alert.alert("Error", "Please ensure all dates and Order ID are filled.");
        setIsSubmitting(false);
        return;
      }

      const loomAvailableToDate = addMonths(bookedToDate, 4).toISOString().split('T')[0];
      const formData = new FormData();
      formData.append('LoomDetailId', LoomDetailId);
      formData.append('BookedFromDate', bookedFromDate.toISOString().split('T')[0]);
      formData.append('BookedToDate', bookedToDate.toISOString().split('T')[0]);
      formData.append('LoomAvailableTo', loomAvailableToDate);
      formData.append('BookingId', bookingId ? bookingId : null);
      formData.append('KnottingOrderId', OrderNo ? OrderNo : null);

      const requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      };

      try {
        // Send form data to the server
        const response = await fetch('https://textileapp.microtechsolutions.co.in/php/postloombooking.php', requestOptions);
        const result = await response.text();
        console.log(result);
        setIsSubmitting(false);
        if (result === "Success") {
          Alert.alert('Success', 'Knotting order booking submitted successfully');
          navigation.goBack({ BookedLoomNo: loomNo });
        } else {
          Alert.alert('Error', 'Failed to submit knotting order booking. Please check the input data and try again.');
        }
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        Alert.alert('Error', 'Failed to submit knotting order booking');
      }
    } else {
      console.log("Called when Booked From date does not exist");

      // Check if booking dates are available
      const isAvailable = await checkBookingDates();
      if (!isAvailable) return;

      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('BookingId', bookingId);
      formData.append('BookedFromDate', newBookedFromDate.toISOString().split('T')[0]);
      formData.append('BookedToDate', newBookedToDate.toISOString().split('T')[0]);
      formData.append('LoomAvailableTo', addMonths(newBookedToDate, 4).toISOString().split('T')[0]);
      formData.append("KnottingOrderId", OrderNo);

      const requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      };

      try {
        const response = await fetch('https://textileapp.microtechsolutions.co.in/php/updateloomavailabilitynew.php', requestOptions);
        const result = await response.text();
        console.log(result);
        setIsSubmitting(false);
        Alert.alert('Success', 'Loom booking submitted successfully');
        navigation.goBack({ BookedLoomNo: loomNo });
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        Alert.alert('Error', 'Failed to submit loom booking');
      }

      console.log(bookingId, newBookedFromDate.toISOString().split('T')[0], newBookedToDate.toISOString().split('T')[0], addMonths(newBookedToDate, 4).toISOString().split('T')[0]);
    }
  };

  const onFromDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newBookedFromDate;
    setShowFromDatePicker(false);
    setNewBookedFromDate(currentDate);
  };

  const onToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newBookedToDate;
    setShowToDatePicker(false);
    setNewBookedToDate(currentDate);
  };

  const onBookedFromDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || bookedFromDate;
    setShowBookedFromDatePicker(false);
    setBookedFromDate(currentDate);
  };

  const onBookedToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || bookedToDate;
    setShowBookedToDatePicker(false);
    setBookedToDate(currentDate);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003C43" />
      </View>
    );
  }

  const renderForm = () => {
    if (!formType) {
      return (
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={() => setFormType('knotting')}>
            <Text style={styles.optionButtonText}>Book for Knotting Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => setFormType('other')}>
            <Text style={styles.optionButtonText}>Book For Other Orders</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (formType === 'knotting') {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.headerLabel}>Knotting Order Form</Text>

              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { fontSize: 20, fontWeight: "600" }]}>Knotting Order Id = {OrderNo}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Loom No</Text>
                <Text style={styles.label}>{loomNo}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Loom Available From</Text>
                <Text style={[styles.label, { marginBottom: "10%" }]}>{loomAvailableFrom}</Text>
              </View>


              <View style={styles.formGroup}>
                <Text style={styles.label}>Booked From Date</Text>
                <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.datePickerButton}>
                  <Text style={styles.datePickerButtonText}>{newBookedFromDate ? newBookedFromDate.toISOString().split('T')[0] : null || FromDate || 'Select From Date'}</Text>
                </TouchableOpacity>
                {showFromDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={newBookedFromDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onFromDateChange}
                  />
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Booked To Date</Text>
                <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.datePickerButton}>
                  <Text style={styles.datePickerButtonText}>{newBookedToDate ? newBookedToDate.toISOString().split('T')[0] : null || ToDate || 'Select To Date'}</Text>
                </TouchableOpacity>
                {showToDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={newBookedToDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onToDateChange}
                  />
                )}
              </View>



              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                onPress={handleKnottingSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.submitButtonText}>Submit</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.headerLabel}>Other Orders Form</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Loom Detail Id</Text>
              <Text style={styles.label}>{LoomDetailId}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Loom No</Text>
              <Text style={styles.label}>{loomNo}</Text>
            </View>

            {
              orderNo ?
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Previous Order No</Text>
                  <Text style={styles.label}>{orderNo}</Text>
                </View>
                :
                null
            }

            <View style={styles.formGroup}>
              <Text style={styles.label}>Booked From Date</Text>
              <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.datePickerButton}>
                <Text style={styles.datePickerButtonText}>{newBookedFromDate ? newBookedFromDate.toISOString().split('T')[0] : 'Select From Date'}</Text>
              </TouchableOpacity>
              {showFromDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={newBookedFromDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onFromDateChange}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Booked To Date</Text>
              <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.datePickerButton}>
                <Text style={styles.datePickerButtonText}>{newBookedToDate ? newBookedToDate.toISOString().split('T')[0] : 'Select To Date'}</Text>
              </TouchableOpacity>
              {showToDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={newBookedToDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onToDateChange}
                />
              )}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.submitButtonText}>Submit</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return renderForm();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButton: {
    width: width * 0.8,
    height: 60,
    backgroundColor: '#003C43',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  optionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    width: width * 0.9,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  label: {
    fontSize: 17,
    marginBottom: 15,
    color: '#333',
    fontWeight: "500"
  },
  datePickerButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerButtonText: {
    color: '#333',
    fontSize: 16,
  },
  submitButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#003C43',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: "10%",
    marginBottom: "5%"
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerLabel: {
    fontSize: 25,
    color: "#003C43",
    fontWeight: "600",
    marginBottom: "10%",

  }
});

export default BookLoomForm;