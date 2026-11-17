// React & React Native
import {useEffect, useState} from "react";
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// Expo
import {LinearGradient} from "expo-linear-gradient";
import {MaterialCommunityIcons} from "@expo/vector-icons";


// Supabase
import {supabase} from "@/lib/supabase";

// Components
import ChallengeView from "@/components/ChallengeView";
import {Filter} from "@/components/Filter";
import {Modal} from "@/components/Modal";
import {useChallenges} from "@/lib/useChallenges";
import {useCurrentUser} from "@/lib/useCurrentUser";
import {useUsers} from "@/lib/useUsers";
import PendingChallengesView from "@/components/PendingChallengesView";

export default function Challenges() {
    const [openCreationModal, setCreationModalOpen] = useState(false);
    const [challengeName, setChallengeName] = useState("");
    const [challengeTotalReps, setChallengeTotalReps] = useState("");
    const [openParticipantSearch, setOpenParticipantSearch] = useState(false);
    const [openAcceptModal, setAcceptModalOpen] = useState(false);

    const {user: currentUser, reloadUser} = useCurrentUser();

    const [chosenParticipants, setChosenParticipants] = useState<string[]>([]);

    useEffect(() => {
        if (currentUser?.id) {
            setChosenParticipants([currentUser.id]);
        }
    }, [currentUser?.id]);

    const {acceptedChallenges, pendingChallenges, refetchChallenges} =
        useChallenges(currentUser?.id);
    const {users, otherUsers} = useUsers(currentUser?.id);

    const createChallenge = async () => {
        if (!challengeName || isNaN(Number(challengeTotalReps))) return;

        const {data: creator, error: authError} = await supabase.auth.getUser();
        if (authError || !creator?.user) return;

        const creatorId = creator.user.id;

        // Select users from list (creator always included)
        const finalChosenUsers = users.filter(
            (user) => chosenParticipants.includes(user.name) || user.id === creatorId
        );

        const invitedIds = finalChosenUsers
            .filter((user) => user.id !== creatorId)
            .map((user) => user.id);

        const {data: challengeData, error} = await supabase
            .from("challenges")
            .insert([
                {
                    name: challengeName,
                    goal: Number(challengeTotalReps),
                    creator: creatorId,
                    participants: [creatorId], // Only creator is accepted initially
                    invited: invitedIds, // Everyone else is invited
                },
            ])
            .select()
            .single();

        if (error || !challengeData) {
            console.error("❌ Error creating challenge:", error);
            return;
        }

        // Insert progress for creator with status "accepted"
        const {error: creatorProgressError} = await supabase
            .from("challenges_progress")
            .insert([
                {
                    challenge_id: challengeData.id,
                    user_id: creatorId,
                    username: currentUser?.username ?? "unknown",
                    progress: 0,
                    goal: challengeData.goal,
                    name: challengeData.name,
                    status: "accepted",
                },
            ]);

        if (creatorProgressError) {
            console.error(
                "❌ Error inserting creator progress:",
                creatorProgressError
            );
        }

        // Insert progress for invited users (status can be undefined or "invited")
        for (const user of finalChosenUsers) {
            if (user.id === creatorId) continue;

            const {error: invitedError} = await supabase
                .from("challenges_progress")
                .insert([
                    {
                        challenge_id: challengeData.id,
                        user_id: user.id,
                        username: user.name,
                        progress: 0,
                        goal: challengeData.goal,
                        name: challengeData.name,
                        status: "invited", // Optional, matches logic in hook
                    },
                ]);

            if (invitedError) {
                console.error(
                    `❌ Error inserting progress for invited ${user.name}:`,
                    invitedError
                );
            }
        }

        // Reset state and reload
        setChallengeName("");
        setChallengeTotalReps("");
        setCreationModalOpen(false);
        await refetchChallenges();
    };


    return (
        <LinearGradient
            colors={["#fc5c7d", "#6a82fb"]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradient}
        >
            <View style={{flex: 1}}>
                <Text style={[styles.title]}>Challenges</Text>

                <ScrollView
                    style={{marginTop: 20, paddingHorizontal: 20, marginBottom: 100}}
                >
                    {!acceptedChallenges ? (
                        <Text style={{
                            textAlign: "center",
                            marginTop: 20,
                            color: "#000000",
                            fontSize: 25,
                            backgroundColor: "white",
                            borderRadius: 20,
                            padding: 10
                        }}>
                            No challenges found : /
                        </Text>
                    ) : (
                        <ChallengeView
                            challenges={acceptedChallenges}
                            refetchChallenges={refetchChallenges}
                        />
                    )}

                </ScrollView>

                <Modal isOpen={openCreationModal} title="Create a Challenge">
                    <View style={styles.container}>
                        <TextInput
                            style={styles.input}
                            placeholder="Challenge Name"
                            value={challengeName}
                            onChangeText={setChallengeName}
                        />
                    </View>

                    <View style={styles.container}>
                        <TextInput
                            style={styles.input}
                            placeholder="Total Reps"
                            value={challengeTotalReps}
                            onChangeText={setChallengeTotalReps}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.container}>
                        <Pressable
                            style={styles.button}
                            onPress={() => {
                                setOpenParticipantSearch(true);
                                setCreationModalOpen(false);
                            }}
                        >
                            <Text style={styles.buttonText}>Choose competition</Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.button,
                                {backgroundColor: "limegreen", marginTop: 20},
                            ]}
                            onPress={() => {
                                setCreationModalOpen(false);
                                if (
                                    challengeTotalReps != null &&
                                    Number(challengeTotalReps) > 0 &&
                                    challengeName != null &&
                                    challengeName != ""
                                ) {
                                    createChallenge();
                                }
                            }}
                        >
                            <Text style={styles.buttonText}>Create</Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.button,
                                {
                                    backgroundColor: "white",
                                    marginTop: 20,
                                    borderColor: "red",
                                    borderWidth: 2,
                                },
                            ]}
                            onPress={() => setCreationModalOpen(false)}
                        >
                            <Text style={[styles.buttonText, {color: "red"}]}>Cancel</Text>
                        </Pressable>
                    </View>
                </Modal>

                <Modal title="Pending Challenges" isOpen={openAcceptModal}>
                    <ScrollView>
                        <PendingChallengesView
                            pendingChallenges={pendingChallenges}
                            refetchChallenges={refetchChallenges}
                        />
                    </ScrollView>
                    <View style={styles.container}>
                        <Pressable
                            style={[
                                styles.button,
                                {
                                    backgroundColor: "darkorange",
                                    marginTop: 20,
                                    borderColor: "red",
                                    borderWidth: 2,
                                },
                            ]}
                            onPress={() => setAcceptModalOpen(false)}
                        >
                            <Text style={[styles.buttonText, {color: "white"}]}>Back</Text>
                        </Pressable>
                    </View>
                </Modal>

                <Filter
                    objects={otherUsers
                        .filter((user) => user.id)
                        .map((user) => user.name)}
                    onPressCancel={() => {
                        setOpenParticipantSearch(false);
                        setCreationModalOpen(true);
                    }}
                    onSelect={(selected) => {
                        const participants = currentUser?.username
                            ? [...selected, currentUser.username]
                            : [...selected];

                        setChosenParticipants(participants);

                        console.log("Selected participants:", participants);
                    }}
                    isOpen={openParticipantSearch}
                    style={{marginTop: 100}}
                    title="Choose others"
                />

                <MaterialCommunityIcons
                    name="sword-cross"
                    size={35}
                    color="black"
                    style={styles.challengeButton}
                    onPress={() => setCreationModalOpen(true)}
                />

                <View style={styles.defendButtonContainer}>
                    <MaterialCommunityIcons
                        name="shield-sword-outline"
                        size={35}
                        color="black"
                        onPress={() => setAcceptModalOpen(true)}
                    />

                    {pendingChallenges.length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{pendingChallenges.length}</Text>
                        </View>
                    )}
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#fff",
        fontFamily: "Gabarito",
        marginLeft: 20,
    },
    gradient: {
        flex: 1,
        paddingTop: 60,
    },
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        width: "100%",
    },
    input: {
        width: "90%",
        height: 54,
        borderColor: "#6a82fb",
        borderWidth: 2,
        borderRadius: 16,
        backgroundColor: "#f7f7fa",
        fontFamily: "Gabarito",
        fontSize: 20,
        paddingHorizontal: 18,
        marginBottom: 10,
        shadowColor: "#6a82fb",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    button: {
        backgroundColor: "#6a82fb",
        width: "90%",
        padding: 16,
        borderRadius: 16,
        marginTop: 10,
        shadowColor: "#6a82fb",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
        letterSpacing: 1,
        fontFamily: "Gabarito",
    },
    challengeButton: {
        position: "absolute",
        bottom: 20,
        left: 20,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#fff",
        borderColor: "#6a82fb",
        borderWidth: 2,
        elevation: 4,
        shadowColor: "#6a82fb",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.18,
        shadowRadius: 8,
    },
    defendButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#fff",
        borderColor: "#fc5c7d",
        borderWidth: 2,
        elevation: 4,
        shadowColor: "#fc5c7d",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.18,
        shadowRadius: 8,
    },
    badge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "red",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
        zIndex: 1,
    },
    badgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    defendButtonContainer: {
        position: "absolute",
        bottom: 20,
        right: 20,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#fff",
        borderColor: "#fc5c7d",
        borderWidth: 2,
        elevation: 4,
        shadowColor: "#fc5c7d",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.18,
        shadowRadius: 8,
    },
});
