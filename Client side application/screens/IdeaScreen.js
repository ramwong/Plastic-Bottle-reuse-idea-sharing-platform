import { StyleSheet, View, Text, Image, ScrollView, Button } from 'react-native';
import { useEffect, useState } from "react"
import LoadingOverlay from '../components/Loading';
import { getOneIdea, voting } from '../models/idea';
import { Picker } from '@react-native-picker/picker';

function IdeaScreen({ route }) {
    const imageName = route.params.imageName;
    const globalUsername = route.params.globalUsername;
    const ideaId = route.params.id;
    const [idea, setIdea] = useState()
    const [loading, setLoading] = useState(true)
    const [score, setScore] = useState(5)
    let count = 0;

    async function vote() {
        setLoading(true)
        const result = await voting(ideaId, imageName, globalUsername, score);
        fetchIdea();
    }

    async function fetchIdea() {
        const result = await getOneIdea(ideaId)
        setIdea(result)
        setLoading(false)
    }

    useEffect(() => {
        fetchIdea();
    }, [])

    function renderContent(item) {
        count++;
        if (item.type == "text") {
            return (
                <View style={styles.textStepContainer} key={count}>
                    <Text style={[styles.label, styles.text, styles.textStep]}>Step {count}</Text>
                    <Text style={[styles.text, styles.textStep]}>{item.content}</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.textStepContainer} key={count}>
                    <Text style={[styles.label, styles.text, styles.textStep]}>Step {count}</Text>
                    <Image resizeMode='contain' style={styles.image} source={{ uri: `data:image/jpeg;base64,${item.content}` }} />
                </View>
            )
        }
    }

    function renderVote(item) {
        return (
            <View key={item.username} style={styles.voteContainer}>
                <View style={styles.textRowContainer}>
                    <View style={[styles.username]}>
                        <Text style={[styles.text, styles.label]}>User:</Text>
                        <Text style={styles.text}>{item.username}</Text>

                    </View>
                    <View style={[styles.score]}>
                        <Text style={[styles.text, styles.label]}>Score:</Text>
                        <Text style={[styles.text]}>{item.score}</Text>
                    </View>
                </View>

                <View style={styles.textRowContainer}>
                    <Text style={[styles.text, styles.label]}>Vote Date:</Text>
                    <Text style={[styles.text]}>{item.vote_date}</Text>
                </View>
            </View>
        );
    }

    if (loading) {
        return (
            <LoadingOverlay />
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.informationContainer}>
                <Text style={styles.header}>Information</Text>
                <View style={styles.textRowContainer}>
                    <Text style={[styles.label, styles.text]}>Title:</Text>
                    <Text style={styles.text}>{idea.title}</Text>
                </View>
                <View style={styles.textRowContainer}>
                    <Text style={[styles.label, styles.text]}>Author:</Text>
                    <Text style={styles.text}>{idea.username}</Text>
                </View>
                <View style={styles.textRowContainer}>
                    <Text style={[styles.label, styles.text]}>Other Material:</Text>
                    <Text style={styles.text}>{idea.material_need ? "Yes" : "No"}</Text>
                </View>
                <View style={styles.textRowContainer}>
                    <Text style={[styles.label, styles.text]}>Type:</Text>
                    <Text style={styles.text}>{idea.type}</Text>
                </View>
                <View style={styles.textRowContainer}>
                    <Text style={[styles.label, styles.text]}>Create date:</Text>
                    <Text style={styles.text}>{idea.create_date}</Text>
                </View>
            </View>
            <View style={styles.imageContainer}>
                <Text style={styles.imageTitle}>Source</Text>
                <Image resizeMode='contain' style={styles.image} source={{ uri: `data:image/jpeg;base64,${idea.source}` }} />
            </View>
            {idea.contents.map(item => renderContent(item))}
            <View style={styles.imageContainer}>
                <Text style={styles.imageTitle}>Product</Text>
                <Image resizeMode='contain' style={styles.image} source={{ uri: `data:image/jpeg;base64,${idea.product}` }} />
            </View>
            <View style={styles.votesContainer}>
                <Text style={[styles.label, styles.text, styles.imageTitle, styles.votes]}>Votes</Text>
                {idea.votes.length ?
                    (
                        <View>
                            {idea.votes.map(item => renderVote(item))}
                        </View>
                    )
                    :
                    (
                        <Text style={[styles.noVoting, styles.text]}>No voting record</Text>
                    )
                }
            </View>
            {globalUsername && imageName ? (
                <View style={styles.ScoreRowContainer}>
                    <Text style={[styles.label, styles.text, styles.score]}>Score: </Text>
                    <View style={styles.pickerContainer}>
                        <Picker style={styles.picker}
                            selectedValue={score}
                            itemStyle={styles.pcikerItem}
                            onValueChange={(itemValue, itemIndex) => setScore(itemValue)}
                        >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((item) =>
                                <Picker.Item key={item} label={"" + item} value={item} />
                            )}
                        </Picker>
                    </View>

                    <View style={styles.voteButtonContainer}>

                        <Button title="Vote" onPress={vote} />
                    </View>
                </View>
            ) : null}

        </ScrollView>
    );
}

export default IdeaScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFD59E"
    },
    pickerContainer: {
        flex: 1
    },
    ScoreRowContainer: {
        borderWidth: 1,
        marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    voteButtonContainer: {
        alignItems: "center",
        marginHorizontal: 10
    },
    votesContainer: {
        borderWidth: 1,
        margin: 10
    },
    score: {
        marginHorizontal: 10
    },
    votes: {
        borderBottomWidth: 1
    },
    noVoting: {
        marginHorizontal: 10,
    },
    informationContainer: {
        borderWidth: 1,
        margin: 10
    },
    header: {
        marginHorizontal: 10,
        fontSize: 24,
        fontWeight: "bold",
        borderBottomWidth: 1
    },
    textRowContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    label: {
        fontWeight: "bold",
        marginRight: 5
    },
    text: {
        fontSize: 16
    },
    imageTitle: {
        marginHorizontal: 10,
        fontSize: 24
    },
    image: {
        height: 200,
        width: "40%",
        marginBottom: 5
    },
    imageContainer: {
        marginHorizontal: 10,
        borderWidth: 1,
        marginVertical: 5
    },
    textStepContainer: {
        borderWidth: 1,
        marginHorizontal: 10,
        marginVertical: 5
    },
    textStep: {
        marginHorizontal: 10,
    },
    username: {
        flex: 1,
        flexDirection:"row"
    },
    score: {
        flex: 1,
        flexDirection:"row",
        marginLeft:10
    },
})