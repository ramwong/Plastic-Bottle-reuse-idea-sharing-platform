import { View, Text, TextInput, StyleSheet, Button, Alert,DeviceEventEmitter } from 'react-native';
import { useState } from "react";
import { memberRegister } from '../models/user';
import LoadingOverlay from '../components/Loading';
import { useNavigation } from "@react-navigation/native";

function MemberRegisterScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [comfirm, setComfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function register() {
        setErrorMessage(false)
        if (password != comfirm) {
            Alert.alert("Password not same",
                "Password and Confirm are not same",
                [{ text: "OK"}]
            )
            return;
        }

        setLoading(true)
        const result = await memberRegister(username, password);
        setLoading(false)
        if (!result.status.success) {
            setErrorMessage(result.status.reason)
        } else {
            Alert.alert("Login Success",
                "Login Success, Press OK to go back home",
                [{ text: "OK", onPress: () => navigation.popToTop() }]
            )
            DeviceEventEmitter.emit("setGlobalUsername", username);
            DeviceEventEmitter.emit("setGobalLogined", true);
        }

    }



    if (loading) {
        return (
            <LoadingOverlay />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <Text style={styles.label}>Username: </Text>
                <TextInput style={styles.input}
                    onChangeText={setUsername}
                    value={username} />
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.label}>Password: </Text>
                <TextInput style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password} />
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.label}>Confirm: </Text>
                <TextInput style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setComfirm}
                    value={comfirm} />
            </View>
            <View style={styles.loginButton}>
                <Button title='Login' onPress={register} />
            </View>
            <View style={styles.errorMessagecontainer}>
                {errorMessage.length ?
                    <Text style={[styles.label, styles.errorMessage]}>
                        {errorMessage}
                    </Text>
                    : null
                }
            </View>
        </View>
    )
}

export default MemberRegisterScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: "center"
    },
    input: {
        height: 35,
        margin: 5,
        borderWidth: 1,
        padding: 10,
        flex: 2
    },
    label: {
        flex: 2,
        fontSize: 24,
        fontWeight: "bold",
        marginHorizontal: 5
    },
    rowContainer: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 10,
        borderWidth: 1,
        alignItems: 'center'
    },
    loginButton: {
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