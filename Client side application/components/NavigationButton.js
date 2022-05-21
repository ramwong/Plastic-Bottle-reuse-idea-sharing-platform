import { StyleSheet, Pressable, View, Text } from "react-native";

function NavigationButton({ onPress, color, title, disabled }) {
    return (
        <View style={styles.buttonOuterContainer}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.button, pressed ? styles.buttonPressed : null
                ]}
                disabled={disabled}
            >
                <View style={[styles.innerContainer, { backgroundColor: disabled ? "grey" : color }]}>
                    <Text style={styles.title}>{title}</Text>
                </View>
            </Pressable>
        </View>
    );
}

export default NavigationButton;

const styles = StyleSheet.create({
    buttonOuterContainer: {
        flex: 1,
        margin: 16,
        height: 150,
        borderRadius: 8,
        elevation: 4,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
    },
    button: {
        flex: 1,
    },
    buttonPressed: {
        opacity: 0.5,
    },
    innerContainer: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
})