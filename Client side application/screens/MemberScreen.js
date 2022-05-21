import { StyleSheet, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import NavigationButton from "../components/NavigationButton";
import ScreenButton from "../models/ScreenButton";


const ScreenButtons = [
    new ScreenButton('0', 'Login', '#B4FF9F', 'Login'),
    new ScreenButton('1', 'Register', '#F9FFA4', 'Register'),
    new ScreenButton('2', 'Update Password', '#FFD59E', 'Update Password'),
    new ScreenButton('3', 'Manage Ideas', '#FFA1A1', 'Manage Ideas'),
]

function MemberScreen({ route }) {
    const navigation = useNavigation();
    function renderButton(itemData) {
        function pressHandler() {
            navigation.navigate(itemData.item.screen, route.params)
        }
        return (
            <NavigationButton
                color={itemData.item.color}
                title={itemData.item.title}
                onPress={pressHandler}
                disabled={itemData.item.id >= 2 && !route.params.globalLogined}
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

export default MemberScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
