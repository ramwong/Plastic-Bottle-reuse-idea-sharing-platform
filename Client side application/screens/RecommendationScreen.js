import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useEffect, useState } from "react"
import RecommendIdeaTile from '../components/RecommendIdeaTile'
import LoadingOverlay from '../components/Loading';
import { useNavigation } from "@react-navigation/native"

function RecommendationScreen({ route }) {
    const navigation = useNavigation();
    const ideaList = route.params.ideas;
    const [loading, setLoading] = useState(true)

    function renderIdeaItem({ item }) {
        function onPress() {
            navigation.navigate('Idea', {
                id: item._id,
                imageName: route.params.imageName,
                globalUsername: route.params.globalUsername
            })
        }
        return <RecommendIdeaTile
            title={item.title}
            score={item.avg_votes}
            sourceImage={item.source}
            productImage={item.product}
            author={item.username}
            chance={`${(item.chance*100).toFixed(2)}%`}
            onPress={onPress} />
    }


    useEffect(() => {
        setLoading(false);
    }, [])


    if (loading) {
        return (
            <LoadingOverlay />
        );
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={ideaList}
                ListEmptyComponent={() => { return <Text style={{ flex: 1 }}>No idea found</Text> }}
                keyExtractor={(idea) => idea._id}
                renderItem={renderIdeaItem}
            />
        </View>
    )



}

export default RecommendationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFD59E"
    },
    checkBox: {
        width: "90%",
        borderTopWidth: 1
    },
    checkBoxRowStyle: {
        backgroundColor: "#FFD59E"
    },
    rowContainer: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "center",
        height: 130
    },
    columnContainer: {
        width: "40%",
        alignItems: "center",
        borderWidth: 1,
        marginHorizontal: 10
    },
    refreshButton: {
        justifyContent: "flex-end"
    }
})