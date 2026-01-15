import { FlatList, StyleSheet, Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Menu, Text } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import LottieView from 'lottie-react-native';
import { useSongsContext } from '../src/SongsContext';
import { useState } from 'react';

type HomeNavigationProps = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function Home() {
    const { songs } = useSongsContext();
    const navigator = useNavigation<HomeNavigationProps>();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList contentContainerStyle={[styles.container, songs.length < 1 && { height: '100%' }]} data={songs}
                ListEmptyComponent={
                    <View style={styles.listEmptyView}>
                        <Text variant='titleLarge' style={{ textAlign: "center" }}>Search and add songs to your playlist from the Downloader</Text>
                        <LottieView source={require("../assets/Listening to audio on phone.json")} autoPlay loop style={styles.screenImage} />
                    </View>
                }
                renderItem={
                    ({ item, index }) => (
                        <Pressable onPress={() => navigator.navigate("Player", { id: index })}>
                            <Card>
                                <Card.Title
                                    title={item.title}
                                    titleVariant='titleLarge'
                                    subtitle={item.artist}
                                    subtitleVariant='bodySmall'
                                    left={() => <Image source={{ uri: item.artwork }} style={{ flex: 1 }} />}
                                    right={() =>
                                        <ContextMenu mediaId={item.mediaId!} />
                                    }
                                    rightStyle={{ marginEnd: 10 }}
                                />
                            </Card>
                        </Pressable>
                    )
                } />
        </SafeAreaView>
    )
};

function ContextMenu({ mediaId }: { mediaId: string }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const { removeSong } = useSongsContext();
    return (
        <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={<Feather onPress={() => setMenuVisible(true)} name="more-vertical" size={24} color="black" />}>
            <Menu.Item onPress={() => {
                removeSong(mediaId!)
                setMenuVisible(false);
            }} title="Remove song" />
        </Menu>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 5,
        padding: 10
    },
    listEmptyView: {
        flex: 1,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    screenImage: {
        width: 400,
        height: 400
    }
});