import { View, StyleSheet, FlatList, Text, Button } from 'react-native';
import { getMemberIdeaList, deleteIdea } from "../models/idea";
import { useEffect, useState } from "react"
import IdeaTile from '../components/IdeaTile'
import LoadingOverlay from '../components/Loading';
import { useNavigation } from "@react-navigation/native";

function IdeaManagementScreen({ route }) {
    const navigation = useNavigation();
    const username = route.params.globalUsername;
    const [ideaList, setIdeaList] = useState([])
    const [loading, setLoading] = useState(true)

    async function fetchMemberIdeaList() {
        setLoading(true);
        const result = await getMemberIdeaList(username);
        setIdeaList(result.ideas);
        setLoading(false);
    }

    async function del(ideaID){
        setLoading(true);
        const result = await deleteIdea(ideaID,username);
        fetchMemberIdeaList()
    }

    function renderIdeaItem({ item }) {
        function onPress() {
            navigation.navigate('Update Idea', {
                id: item._id,
                globalUsername: route.params.globalUsername
            })
        }
        return (

            <View key={item._id}>
                <IdeaTile
                    title={item.title}
                    score={item.avg_votes}
                    sourceImage={item.source}
                    productImage={item.product}
                    author={item.username}
                    onPress={onPress} />
                    <Button title='Delete' onPress={()=>del(item._id)}/>
            </View>
        );
    }


    useEffect(() => {
        fetchMemberIdeaList();
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

export default IdeaManagementScreen;

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