import { StyleSheet, FlatList, DeviceEventEmitter } from "react-native"
import { useNavigation } from "@react-navigation/native"
import NavigationButton from "../components/NavigationButton";
import ScreenButton from "../models/ScreenButton";
import { useState } from "react"


const ScreenButtons = [
    new ScreenButton('0', 'Idea List', '#B4FF9F', 'IdeaList'),
    new ScreenButton('1', 'Member', '#F9FFA4', 'Member'),
    new ScreenButton('2', 'Searching', '#FFD59E', 'Searching'),
    new ScreenButton('3', 'Create Idea', '#FFA1A1', 'CreateIdea'),
]

function HomePageScreen({ route }) {
    const navigation = useNavigation();
    const [globalUsername, setGlobalUsername] = useState("");
    const [globalLogined, setGobalLogined] = useState(false);
    DeviceEventEmitter.addListener("setGlobalUsername", (eventData) =>
        setGlobalUsername(eventData));
    DeviceEventEmitter.addListener("setGobalLogined", (eventData) =>
        setGobalLogined(eventData));

    function renderButton(itemData) {
        function pressHandler() {
            navigation.navigate(itemData.item.screen, {
                globalUsername: globalUsername,
                globalLogined: globalLogined
            })
        }

        return (
            <NavigationButton
                color={itemData.item.color}
                title={itemData.item.title}
                onPress={pressHandler}
                disabled={itemData.item.id == 3 && !globalLogined}
            />
        )
    }

    return (
        <FlatList
            data={ScreenButtons}
            keyExtractor={item => item.id}
            renderItem={renderButton}
            numColumns={2}
        />
    );
}

export default HomePageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
