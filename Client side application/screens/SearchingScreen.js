import { View, Button, Text, StyleSheet, Image, Alert, ScrollView } from "react-native";
import { getRecommendationsList } from "../models/idea";
import { useState } from "react"
import LoadingOverlay from '../components/Loading';
import { useNavigation } from "@react-navigation/native"
import { Picker } from '@react-native-picker/picker';
import SelectMultiple from 'react-native-select-multiple';
import { launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, useMediaLibraryPermissions, PermissionStatus } from 'expo-image-picker';

const types = ["Replacement", "Fun", "Art"]
const materialNeeds = [{ label: "Yes", value: true }, { label: "No", value: false }]
const imageOption = {
    allowsEditing: true,
    base64: true,
    quality: 0.5,
};

function SearchingScreen({ route }) {
    const username = route.params.globalUsername;
    const navigation = useNavigation();
    const [searchingImage, setSearchingImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedMaterialNeeds, setSelectedMaterialNeeds] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [cameraPermissionInformation, requestCameraPermission] = useCameraPermissions();
    const [mediaLibraryPermissionInformation, requestMediaLibraryPermission] = useMediaLibraryPermissions();

    async function search() {
        setLoading(true);
        const types = selectedTypes.map(item => item.value);
        const needs = selectedMaterialNeeds.map(item => item.value);
        const result = await getRecommendationsList(searchingImage, types,
            needs, username, quantity);
        if (!result) {
            setErrorMessage("Image has not taken!")
        }
        else if (!result.status.success) {
            setErrorMessage(result.status.reason)
        } else {
            navigation.navigate('Recommendation', {
                ideas: result.ideas,
                imageName: result.image_name,
                globalUsername: route.params.globalUsername
            })
        }
        setLoading(false);
    }

    async function verifyCameraPermissions() {
        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestCameraPermission();

            return permissionResponse.granted;
        }
        if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Lack Permission',
                'You need to accept camera permissions to use this feature.'
            );
            return false;
        }
        return true;
    }

    async function verifyCameraPermissions() {
        if (mediaLibraryPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestMediaLibraryPermission();

            return permissionResponse.granted;
        }
        if (mediaLibraryPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Lack Permission',
                'You need to accept photo permissions to use this feature.'
            );
            return false;
        }
        return true;
    }

    async function takeImage() {
        const hasPermission = await verifyCameraPermissions();

        if (!hasPermission) {
            return;
        }
        const image = await launchCameraAsync(imageOption);
        setSearchingImage(image.base64);
    }

    async function getImage() {
        const hasPermission = await verifyCameraPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await launchImageLibraryAsync(imageOption);
        setSearchingImage(image.base64);
    }

    if (loading) {
        return (
            <LoadingOverlay />
        );
    }
    let imageComponent = <Text style={styles.label}>Image has not taken </Text>;
    if (searchingImage) {
        imageComponent = <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${searchingImage}` }} />
    }

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                    <Text>Type</Text>
                    <SelectMultiple
                        rowStyle={styles.checkBoxRowStyle}
                        style={styles.checkBox}
                        items={types}
                        selectedItems={selectedTypes}
                        onSelectionsChange={setSelectedTypes} />
                </View>
                <View style={styles.columnContainer}>
                    <Text>Other material need</Text>
                    <SelectMultiple
                        rowStyle={styles.checkBoxRowStyle}
                        style={styles.checkBox}
                        items={materialNeeds}
                        selectedItems={selectedMaterialNeeds}
                        onSelectionsChange={setSelectedMaterialNeeds} />
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.imageRowContainer}>
                    <Text style={styles.label}>Image: </Text>
                    <View style={styles.imageButtonContainer}>
                        <Button
                            title="Take Image" onPress={takeImage}
                        />
                    </View>
                    <View style={styles.imageButtonContainer}>
                        <Button
                            title="Get Image" onPress={getImage}
                        />
                    </View>
                </View>
                <View style={styles.imageRowContainer}>
                    {imageComponent}
                </View>

                <View style={styles.quantityRowContainer}>
                    <Text style={styles.label}>Quantity: </Text>
                    <View style={styles.pickerContainer}>
                        <Picker style={styles.picker}
                            selectedValue={quantity}
                            itemStyle={styles.pcikerItem}
                            onValueChange={(itemValue, itemIndex) => setQuantity(itemValue)}
                        >
                            {[...Array(31).keys()].map((item) =>
                                <Picker.Item key={item} label={"" + item} value={item} />
                            )}
                        </Picker>
                    </View>
                </View>

                <View style={styles.searchButton}>
                    <Button title='Search' onPress={search} />
                </View>

                <View style={styles.errorMessagecontainer}>
                    {errorMessage.length ?
                        <Text style={[styles.label, styles.errorMessage]}>
                            {errorMessage}
                        </Text>
                        : null
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default SearchingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        backgroundColor: "#FFD59E",
        paddingTop: 10
    },
    scrollContainer: {
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        backgroundColor: "#FFD59E",
    },
    columnContainer: {
        width: "50%",
        alignItems: "center",
        borderWidth: 1
    },
    imageRowContainer: {
        flexDirection: "row",
        marginHorizontal: 10,
        borderWidth: 1,
        alignItems: 'center'
    },
    label: {
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        marginStart: 5
    },
    imageButtonContainer: {
        margin: 5
    },
    image: {
        flex: 1,
        height: 200,
        width: "100%",
        resizeMode: "contain"
    },
    rowContainer: {
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "96%",
    },
    quantityRowContainer: {
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
        borderWidth: 1,
        marginVertical:10
    },
    checkBoxRowStyle: {
        backgroundColor: "#FFD59E"
    },
    checkBox: {
        width: "90%",
        borderTopWidth: 1
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        flex: 1,
        margin: 5,
        justifyContent: "center"
    },

    picker: {
        height: 30,
        flex: 1,
    },
    pcikerItem: {
        height: 30,
    },
    searchButton: {
        width: "30%",
    },
    errorMessagecontainer: {
        alignItems: 'center'
    },
    errorMessage: {
        color: "red"
    }
})