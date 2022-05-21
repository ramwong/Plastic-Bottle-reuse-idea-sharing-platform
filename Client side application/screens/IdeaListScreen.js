import { View, StyleSheet, FlatList, Text, Button } from 'react-native';
import { getIdeaList } from "../models/idea"
import { useEffect, useState } from "react"
import IdeaTile from '../components/IdeaTile'
import LoadingOverlay from '../components/Loading';
import { useNavigation } from "@react-navigation/native"
import SelectMultiple from 'react-native-select-multiple'

const types = ["Replacement", "Fun", "Art"]
const materialNeeds = [{ label: "Yes", value: true }, { label: "No", value: false }]

function IdeaListScreen({route}) {
    const navigation = useNavigation();
    const [ideaList, setIdeaList] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedTypes, setSelectedTypes] = useState([])
    const [selectedMaterialNeeds, setSelectedMaterialNeeds] = useState([])

    async function fetchIdeaList() {
        setLoading(true);
        const types = selectedTypes.map(item => item.value);
        const needs = selectedMaterialNeeds.map(item => item.value);
        const result = await getIdeaList(types, needs, "vote", 0);
        setIdeaList(result.ideas);
        setLoading(false);
    }

    function renderIdeaItem({ item }) {
        function onPress() {
            navigation.navigate('Idea', {
                id: item._id,
                imageName: "",
                globalUsername: route.params.globalUsername
            })
        }
        return <IdeaTile
            title={item.title}
            score={item.avg_votes}
            sourceImage={item.source}
            productImage={item.product}
            author={item.username}
            onPress={onPress} />


    }


    useEffect(() => {
        fetchIdeaList();
    }, [])


    if (loading) {
        return (
            <LoadingOverlay />
        );
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
                <View style={styles.refreshButton}>
                    <Button title={"Refresh"} onPress={fetchIdeaList}/>
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
            <FlatList
                data={ideaList}
                ListEmptyComponent={() => { return <Text style={{ flex: 1 }}>No idea found</Text> }}
                keyExtractor={(idea) => idea._id}
                renderItem={renderIdeaItem}
            />
        </View>
    )



}

export default IdeaListScreen;

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
        height:130
    },
    columnContainer: {
        width: "40%",
        alignItems: "center",
        borderWidth: 1,
        marginHorizontal: 10
    },
    refreshButton: {
        justifyContent:"flex-end"
    }
})