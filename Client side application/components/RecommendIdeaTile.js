import { StyleSheet, View, Text, Image, Dimensions, Pressable } from "react-native";

const windowWidth = Dimensions.get('window').width;

function RecommendIdeaTile({ title, score, sourceImage, productImage, author, onPress, chance }) {


    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={styles.rowContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.score}>{score.toFixed(2)}</Text>
            </View>
            <View style={styles.rowContainer}>
                <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${sourceImage}` }} />
                <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${productImage}` }} />
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.author}>{author}</Text>
                <View  style={styles.chanceContainer}>
                    <Text style={styles.chance}>{chance}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default RecommendIdeaTile;

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        width: windowWidth * 0.9,
        backgroundColor: "white",
    },
    chanceContainer:{
        paddingRight:10
    },
    rowContainer: {
        flexDirection: "row",
    },
    title: {
        paddingLeft: 10,
        flex: 13,
        color: "#FFA1A1",
        fontSize: 24
    },
    score: {
        flex: 2,
        color: "#FFA1A1",
        fontSize: 24,
        paddingRight: 10,
    },
    image: {
        flex: 1,
        height: 200,
        width: "100%",
        resizeMode: "contain"
    },
    authorView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    author: {
        paddingLeft: 10,
        flex: 13,
        color: "#FFA1A1",
        fontSize: 24
    },
    chance: {
        flex: 4,
        color: "#FFA1A1",
        fontSize: 24,
    }
})