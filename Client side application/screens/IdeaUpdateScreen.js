import { View, Button, Text, TextInput, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from "react";
import { updateIdea, getOneIdea } from "../models/idea";
import LoadingOverlay from '../components/Loading';
import { useNavigation } from "@react-navigation/native"
import { launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, useMediaLibraryPermissions, PermissionStatus } from 'expo-image-picker';

const imageOption = {
    allowsEditing: true,
    base64: true,
    quality: 0.5,
};

function IdeaUpdateScreen({ route }) {
    const username = route.params.globalUsername;
    const ideaId = route.params.id;
    const navigation = useNavigation();
    const [idea, setIdea] = useState()
    const [errorMessage, setErrorMessage] = useState("")
    const [title, setTitle] = useState("")
    const [type, setType] = useState("Replacement");
    const [isMaterialNeed, setIsMaterialNeed] = useState(true);
    const [loading, setLoading] = useState(true)
    const [source, setSource] = useState("");
    const [contents, setContents] = useState([]);
    const [product, setProduct] = useState("");
    const [cameraPermissionInformation, requestCameraPermission] = useCameraPermissions();
    const [mediaLibraryPermissionInformation, requestMediaLibraryPermission] = useMediaLibraryPermissions();

    async function fetchIdea() {
        const result = await getOneIdea(ideaId)
        setIdea(result)
        setTitle(result.title)
        setType(result.type)
        setIsMaterialNeed(result.material_need)
        setSource(result.source)
        setContents(result.contents)
        setProduct(result.product)
        setLoading(false)
    }

    useEffect(() => {
        fetchIdea();
    }, [])

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



    async function takeSourceImage() {
        const hasPermission = await verifyCameraPermissions();

        if (!hasPermission) {
            return;
        }
        const image = await launchCameraAsync(imageOption);
        setSource(image.base64);
    }

    async function getSourceImage() {
        const hasPermission = await verifyCameraPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await launchImageLibraryAsync(imageOption);
        setSource(image.base64);
    }

    async function takeProductImage() {
        const hasPermission = await verifyCameraPermissions();

        if (!hasPermission) {
            return;
        }
        const image = await launchCameraAsync(imageOption);
        setProduct(image.base64);
    }

    async function getProductImage() {
        const hasPermission = await verifyCameraPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await launchImageLibraryAsync(imageOption);
        setProduct(image.base64);
    }

    async function takeContentImage(i) {
        const hasPermission = await verifyCameraPermissions();

        if (!hasPermission) {
            return;
        }
        const image = await launchCameraAsync(imageOption);
        let tempContents = [...contents];
        tempContents[i].content = image.base64
        setContents(tempContents);
    }

    async function getContentImage(i) {
        const hasPermission = await verifyCameraPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await launchImageLibraryAsync(imageOption);
        let tempContents = [...contents];
        tempContents[i].content = image.base64
        setContents(tempContents);
    }

    function updateContent(i, value) {
        let tempContents = [...contents];
        tempContents[i].content = value;

        setContents(tempContents);
    }

    function removeStep(i) {
        let tempContents = [...contents];
        tempContents.splice(i, 1);
        setContents(tempContents);
    }

    function renderStep(item, i) {
        return (
            <View style={styles.columnContainer} key={i}>
                <View style={styles.stepRowContainer}>
                    <Text style={styles.stepLabel}>Step:{i + 1}</Text>
                    {item.type == "image" ? (
                        <View style={styles.imageButtonContainer}>
                            <Button
                                title="Take Image" onPress={() => takeContentImage(i)}
                            />
                        </View>
                    ) : <></>}
                    {item.type == "image" ? (
                        <View style={styles.imageButtonContainer}>
                            <Button
                                title="Get Image" onPress={() => getContentImage(i)}
                            />
                        </View>
                    ) : <></>}
                    <View style={styles.imageButtonContainer}>
                        <Button
                            title="Remove" onPress={() => removeStep(i)}
                        />
                    </View>
                </View>
                {item.type == "text" ? (
                    <TextInput onChangeText={(value) => updateContent(i, value)} multiline={true} style={styles.stepInput}>{item.content}</TextInput>
                ) : (
                    <View style={styles.imageRowContainer}>
                        {!item.content ? (
                            <Text style={styles.label}>Step {i + 1} image has not taken </Text>
                        ) : (
                            <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${item.content}` }} />
                        )}
                    </View>)
                }
            </View>
        )
    }

    function addTextContent() {
        setContents([...contents, { type: "text", content: "" }])
    }

    function addImageContent() {
        setContents([...contents, { type: "image", content: "" }])
    }


    async function update() {
        setLoading(true);
        const result = await updateIdea(
            ideaId, username,
            type, isMaterialNeed, title,
            source, contents, product);
        if (!result.status.success) {
            setErrorMessage(result.status.reason)
        } else {
            Alert.alert("Update Success",
                "Update Success, Press OK to go to idea page",
                [{
                    text: "OK", onPress: () => navigation.navigate('Idea', {
                        id: result._id,
                        imageName: ""
                    })
                }]
            )

        }
        setLoading(false);
    }

    if (loading) {
        return (
            <LoadingOverlay />
        );
    }

    let sourceImageComponent = <Text style={styles.label}>Source image has not taken </Text>;
    if (source) {
        sourceImageComponent = <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${source}` }} />
    }

    let productImageComponent = <Text style={styles.label}>Product image has not taken </Text>;
    if (product) {
        productImageComponent = <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${product}` }} />
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.rowContainer}>
                <Text style={styles.label}>Title: </Text>
                <TextInput style={styles.input}
                    onChangeText={setTitle}
                    value={title} />
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.label}>Type: </Text>
                <View style={styles.pickerContainer}>
                    <Picker style={styles.picker}
                        selectedValue={type}
                        onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                    >
                        <Picker.Item label="Replacement" value="Replacement" />
                        <Picker.Item label="Fun" value="Fun" />
                        <Picker.Item label="Art" value="Art" />
                    </Picker>
                </View>
            </View>

            <View style={styles.rowContainer}>
                <Text style={styles.label}>Other Material: </Text>
                <View style={styles.pickerContainer}>
                    <Picker style={styles.picker}
                        selectedValue={isMaterialNeed}
                        onValueChange={(itemValue, itemIndex) => setIsMaterialNeed(itemValue)}
                    >
                        <Picker.Item label="Yes" value={true} />
                        <Picker.Item label="No" value={false} />
                    </Picker>
                </View>
            </View>

            <View style={styles.columnContainer}>
                <View style={styles.imageRowContainer}>
                    <Text style={styles.label}>Source: </Text>
                    <View style={styles.imageButtonContainer}>
                        <Button
                            title="Take Image" onPress={takeSourceImage}
                        />
                    </View>
                    <View style={styles.imageButtonContainer}>
                        <Button
                            title="Get Image" onPress={getSourceImage}
                        />
                    </View>
                </View>
                <View style={styles.imageRowContainer}>
                    {sourceImageComponent}
                </View>
            </View>


            <View style={styles.contentContainer}>
                <Text style={styles.label}>Contents</Text>
                {contents.map(renderStep)}
                <View style={styles.contentRowContainer}>
                    <Text style={styles.label}>Add Step: </Text>
                    <View style={styles.imageButtonContainer}>
                        <Button
                            title="Add text" onPress={addTextContent}
                        />
                    </View>
                    <View style={styles.imageButtonContainer}>
                        <Button
                            title="Add image" onPress={addImageContent}
                        />
                    </View>
                </View>
            </View>


            <View style={styles.columnContainer}>
                <View style={styles.imageRowContainer}>
                    <Text style={styles.label}>Product: </Text>
                    <View style={styles.imageButtonContainer}>
                        <Button
                            title="Take Image" onPress={takeProductImage}
                        />
                    </View>
                    <View style={styles.imageButtonContainer}>
                        <Button
                            title="Get Image" onPress={getProductImage}
                        />
                    </View>
                </View>
                <View style={styles.imageRowContainer}>
                    {productImageComponent}
                </View>
            </View>

            <View style={styles.createButton}>
                <Button title='Update' onPress={update} />
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
    )
}

export default IdeaUpdateScreen;

const styles = StyleSheet.create({
    contentContainer: {
        width: "95%",
        flexDirection: "column",
        marginHorizontal: 10,
        marginVertical: 5,
        borderWidth: 1,
    },
    container: {
        alignItems: "center"
    },
    columnContainer: {
        width: "100%",
        flexDirection: "column",
        marginVertical: 5
    },
    picker: {
        height: 40,
        flex: 1,
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
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        flex: 1,
        margin: 5
    },
    input: {
        height: 35,
        margin: 5,
        borderWidth: 1,
        padding: 10,
        flex: 2
    },
    stepInput: {
        marginHorizontal: 5,
        borderWidth: 1,
        borderTopWidth: 0,
        padding: 10,
        flex: 2,
        textAlignVertical: "top"
    },
    label: {
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        marginStart: 5
    },
    stepLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        marginStart: 5
    },
    rowContainer: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 5,
        borderWidth: 1,
        alignItems: 'center'
    },
    stepRowContainer: {
        flexDirection: "row",
        marginHorizontal: 5,
        borderWidth: 1,
        alignItems: 'center'
    },
    imageRowContainer: {
        flexDirection: "row",
        marginHorizontal: 10,
        borderWidth: 1,
        alignItems: 'center'
    },
    contentRowContainer: {
        flexDirection: "row",
        borderTopWidth: 1,
        alignItems: 'center'
    },
    createButton: {
        marginVertical: 30,
        width: "30%",
    },
    errorMessagecontainer: {
        alignItems: 'center'
    },
    errorMessage: {
        color: "red"
    }
})