import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

const CalculationScreen = () => {
    const [inputs, setInputs] = useState({
        epi: '',
        fabricWidth: '',
        warpCrimp: '',
        warpCount: '',
        warpWaste: '',
        warpYarnRate: '',
        weftYarnRate: '',
        ppi: '',
        weftCrimp: '',
        weftCount: '',
        weftWaste: '',
        sizingRate: '',
        jobWorkRate: '',
        loomSpeed: '',
        time: '',
        efficiency: '',
        orderQuantity: '',
        ppi7: '',
        ppi8: '',
    });

    const [results, setResults] = useState({
        warpWeight: '',
        weftWeight: '',
        warpCost: '',
        weftCost: '',
        sizingCost: '',
        weavingCost: '',
        totalFabricCost: '',
        jobWorkBilling: '',
        expectedProduction: '',
        expectedTime: '',
    });

    const handleChange = (name, value) => {
        setInputs({ ...inputs, [name]: value });
    };

    const showAlert = (message) => {
        Alert.alert(
            "Missing Fields",
            message,
            [{ text: "OK" }],
            { cancelable: true }
        );
    };

    const validateFields = (fields) => {
        const missingFields = fields.filter(field => !inputs[field]);
        if (missingFields.length > 0) {
            const fieldNames = missingFields.join(', ');
            showAlert(`Please fill the following fields: ${fieldNames}`);
            return false;
        }
        return true;
    };

    const calculateWarpWeight = () => {
        const requiredFields = ['epi', 'fabricWidth', 'warpCrimp', 'warpCount', 'warpWaste', 'warpYarnRate'];
        if (!validateFields(requiredFields)) return;

        const { epi, fabricWidth, warpCrimp, warpCount, warpWaste, warpYarnRate } = inputs;
        const netWarpWeight = (epi * fabricWidth * 0.59 * (100 + parseFloat(warpCrimp))) / (warpCount * 100000);
        const grossWarpWeight = netWarpWeight * (1 + parseFloat(warpWaste) / 100);
        const warpCost = grossWarpWeight * warpYarnRate;
        setResults({ ...results, warpWeight: grossWarpWeight.toFixed(2), warpCost: warpCost.toFixed(2) });
    };

    const calculateWeftWeight = () => {
        const requiredFields = ['ppi', 'fabricWidth', 'weftCrimp', 'weftCount', 'weftWaste', 'weftYarnRate'];
        if (!validateFields(requiredFields)) return;

        const { ppi, fabricWidth, weftCrimp, weftCount, weftWaste, weftYarnRate } = inputs;
        const netWeftWeight = (ppi * fabricWidth * 0.59 * (100 + parseFloat(weftCrimp))) / (weftCount * 100000);
        const grossWeftWeight = netWeftWeight * (1 + parseFloat(weftWaste) / 100);
        const weftCost = grossWeftWeight * weftYarnRate;
        setResults({ ...results, weftWeight: grossWeftWeight.toFixed(2), weftCost: weftCost.toFixed(2) });
    };

    const calculateSizingCost = () => {
        const requiredFields = ['sizingRate'];
        if (!validateFields(requiredFields)) return;

        const { sizingRate } = inputs;
        const totalSizingCost = sizingRate * parseFloat(results.warpWeight);
        setResults({ ...results, sizingCost: totalSizingCost.toFixed(2) });
    };

    const calculateWeavingCost = () => {
        const requiredFields = ['jobWorkRate', 'ppi'];
        if (!validateFields(requiredFields)) return;

        const { jobWorkRate, ppi } = inputs;
        const weavingCost = jobWorkRate * ppi;
        setResults({ ...results, weavingCost: weavingCost.toFixed(2) });
    };

    const calculateTotalFabricCost = () => {
        if (!results.warpCost || !results.weftCost || !results.sizingCost || !results.weavingCost) {
            showAlert("Please calculate Warp Weight, Weft Weight, Sizing Cost, and Weaving Cost first.");
            return;
        }

        const totalFabricCost = parseFloat(results.warpCost) + parseFloat(results.weftCost) + parseFloat(results.sizingCost) + parseFloat(results.weavingCost);
        setResults({ ...results, totalFabricCost: totalFabricCost.toFixed(2) });
    };

    const calculateJobWorkBilling = () => {
        const requiredFields = ['ppi', 'jobWorkRate'];
        if (!validateFields(requiredFields)) return;

        const { ppi, jobWorkRate } = inputs;
        const jobWorkBilling = ppi * (jobWorkRate / 100);
        setResults({ ...results, jobWorkBilling: jobWorkBilling.toFixed(2) });
    };

    const calculateExpectedProduction = () => {
        const requiredFields = ['loomSpeed', 'efficiency', 'time', 'ppi7'];
        if (!validateFields(requiredFields)) return;

        const { loomSpeed, efficiency, time, ppi7 } = inputs;
        const expectedProduction = (loomSpeed * time * 60 * (efficiency / 100)) / (ppi7 * 39.37);
        setResults({ ...results, expectedProduction: expectedProduction.toFixed(2) });
    };

    const calculateExpectedTime = () => {
        const requiredFields = ['orderQuantity', 'loomSpeed', 'efficiency', 'ppi8'];
        if (!validateFields(requiredFields)) return;

        const { orderQuantity, loomSpeed, efficiency, ppi8 } = inputs;
        const expectedTime = (orderQuantity * ppi8 * 39.37) / (loomSpeed * 60 * (efficiency / 100));
        setResults({ ...results, expectedTime: expectedTime.toFixed(2) });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Textile Cost Calculator</Text>

            {/* Warp Weight Calculation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Warp Weight Calculation</Text>
                <Text style={styles.label}>EPI</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('epi', value)} />

                <Text style={styles.label}>Fabric Width</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('fabricWidth', value)} />

                <Text style={styles.label}>Warp Crimp %</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('warpCrimp', value)} />

                <Text style={styles.label}>Warp Count</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('warpCount', value)} />

                <Text style={styles.label}>Warp Waste %</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('warpWaste', value)} />

                <Text style={styles.label}>Warp Yarn Rate</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('warpYarnRate', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateWarpWeight}>
                    <Text style={styles.buttonText}>Calculate Warp Weight</Text>
                </TouchableOpacity>
                {results.warpWeight !== '' && (
                    <View>
                        <Text style={styles.result}>Warp Weight: {results.warpWeight} KG</Text>
                        <Text style={styles.result}> Cost: {results.warpCost} ₹</Text>
                    </View>
                )}
            </View>

            {/* Weft Weight Calculation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weft Weight Calculation</Text>
                <Text style={styles.label}>PPI</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('ppi', value)} />

                <Text style={styles.label}>Fabric Width</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('fabricWidth', value)} />

                <Text style={styles.label}>Weft Crimp %</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('weftCrimp', value)} />

                <Text style={styles.label}>Weft Count</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('weftCount', value)} />

                <Text style={styles.label}>Weft Waste %</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('weftWaste', value)} />

                <Text style={styles.label}>Weft Yarn Rate</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('weftYarnRate', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateWeftWeight}>
                    <Text style={styles.buttonText}>Calculate Weft Weight</Text>
                </TouchableOpacity>
                {results.weftWeight !== '' && (
                    <View>
                        <Text style={styles.result}>Weft Weight: {results.weftWeight} KG</Text>
                        <Text style={styles.result}> Cost: {results.weftCost} ₹</Text>
                    </View>
                )}
            </View>

            {/* Sizing Cost Calculation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sizing Cost Calculation</Text>
                <Text style={styles.label}>Sizing Rate </Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('sizingRate', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateSizingCost}>
                    <Text style={styles.buttonText}>Calculate Sizing Cost</Text>
                </TouchableOpacity>
                {results.sizingCost !== '' && (
                    <View>
                        <Text style={styles.result}>Sizing Cost: {results.sizingCost} ₹</Text>
                    </View>
                )}
            </View>

            {/* Weaving Cost Calculation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weaving Cost Calculation</Text>
                <Text style={styles.label}>Job Work Rate</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('jobWorkRate', value)} />

                <Text style={styles.label}>PPI</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('ppi', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateWeavingCost}>
                    <Text style={styles.buttonText}>Calculate Weaving Cost</Text>
                </TouchableOpacity>
                {results.weavingCost !== '' && (
                    <View>
                        <Text style={styles.result}>Weaving Cost: {results.weavingCost} ₹</Text>
                    </View>
                )}
            </View>

            {/* Total Fabric Cost Calculation */}
            <TouchableOpacity style={styles.button} onPress={calculateTotalFabricCost}>
                <Text style={styles.buttonText}>Calculate Total Fabric Cost</Text>
            </TouchableOpacity>
            {results.totalFabricCost !== '' && (
                <Text style={styles.result}>Total Fabric Cost: {results.totalFabricCost} ₹</Text>
            )}

            {/* Job Work Billing Calculation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Work Billing Calculation</Text>
                <Text style={styles.label}>PPI</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('ppi', value)} />

                <Text style={styles.label}>Job Work Rate</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('jobWorkRate', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateJobWorkBilling}>
                    <Text style={styles.buttonText}>Calculate Job Work Billing</Text>
                </TouchableOpacity>
                {results.jobWorkBilling !== '' && (
                    <Text style={styles.result}>Job Work Billing: {results.jobWorkBilling} ₹</Text>
                )}
            </View>

            {/* Expected Production Calculation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Expected Production Calculation</Text>
                <Text style={styles.label}>Loom Speed</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('loomSpeed', value)} />

                <Text style={styles.label}>Efficiency (%)</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('efficiency', value)} />

                <Text style={styles.label}>Time (hours)</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('time', value)} />

                <Text style={styles.label}>PPI</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('ppi7', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateExpectedProduction}>
                    <Text style={styles.buttonText}>Calculate Expected Production</Text>
                </TouchableOpacity>
                {results.expectedProduction !== '' && (
                    <Text style={styles.result}>Expected Production: {results.expectedProduction} meters</Text>
                )}
            </View>

            {/* Expected Time Calculation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Expected Time Calculation</Text>
                <Text style={styles.label}>Order Quantity </Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('orderQuantity', value)} />

                <Text style={styles.label}>Loom Speed (picks per minute)</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('loomSpeed', value)} />

                <Text style={styles.label}>Efficiency (%)</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('efficiency', value)} />

                <Text style={styles.label}>PPI</Text>
                <TextInput style={styles.input} keyboardType="numeric" onChangeText={(value) => handleChange('ppi8', value)} />

                <TouchableOpacity style={styles.button} onPress={calculateExpectedTime}>
                    <Text style={styles.buttonText}>Calculate Expected Time</Text>
                </TouchableOpacity>
                {results.expectedTime !== '' && (
                    <Text style={styles.result}>Expected Time: {results.expectedTime} hours</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color:"#003C43",
        paddingTop:55
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color:"#555"
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color:"#333"

    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        color:"#000"
    },
    button: {
        backgroundColor: '#003C43',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    result: {
        fontSize: 18,
        marginTop: 5,
        color:"#000",
        fontWeight:"500"
    },
});

export default CalculationScreen;