import { StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, IconButton, Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { Image } from 'expo-image';
import { savedSongType, useSongsContext } from '../src/SongsContext';
import TrackPlayer, { Event, State, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { Slider } from '@miblanchard/react-native-slider';
import { convertToMinutes } from '../src/util';
import { DefaultTheme } from '@react-navigation/native';

type PlayerScreenProps = NativeStackScreenProps<RootStackParamList, "Player">;

export default function Player({ route, navigation }: PlayerScreenProps) {

  const { songs } = useSongsContext();
  const [song, setSong] = useState<savedSongType>({
    id: "",
    title: "Select a song to play",
    artist: "",
    artwork: "",
    tinyCover: "",
    url: ""
  });
  const [isPreviousDisabled, setPreviousDisabled] = useState<boolean>(true);
  const [isNextDisabled, setNextDisabled] = useState<boolean>(true);
  const [isShuffled, setShuffled] = useState<boolean>(false);
  const { position, duration } = useProgress();

  const getSong = async () => {
    console.log("getting songs")
    setSong(songs[route.params.id]);
    try {
      await TrackPlayer.setQueue(songs);
      await TrackPlayer.skip(route.params.id);
    } catch (error) {
      console.log(error)
    }
  }

  const goPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  }

  const goNext = async () => {
    await TrackPlayer.skipToNext();
  }

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async ({ index }) => {
    setSong(songs[index!]);
    setPreviousDisabled(index! < 1);
    setNextDisabled(index == songs.length - 1)
    await TrackPlayer.setPlayWhenReady(true);
  });

  useEffect(() => {
    route.params.id > -1 && getSong();
  }, [route.params.id]);

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card} mode='contained'>
        {song?.artwork ? (
          <Image source={{ uri: song.artwork }} style={styles.cover} />
        ) : (
          <LottieView source={require("../assets/Singing and playing Music with Guitar.json")} style={styles.cover} autoPlay loop />
        )}
        <Card.Title
          title={song?.title}
          titleVariant='headlineSmall'
          titleStyle={!song.id && { textAlign: "center" }}
          subtitle={song?.artist}
          subtitleVariant='bodyMedium'
          style={styles.title}
        />
        {song.id &&
          <View>
            <Slider
              minimumValue={0}
              maximumValue={duration}
              value={position}
              minimumTrackTintColor={DefaultTheme.colors.primary}
              thumbTintColor={DefaultTheme.colors.primary}
              trackClickable={true}
              thumbStyle={{ height: 15, width: 15 }}
              thumbTouchSize={{ height: 15, width: 15 }}
              onSlidingComplete={(seconds) => {
                TrackPlayer.seekTo(seconds[0])
              }} />
            <View style={styles.songTimes}>
              <Text>{convertToMinutes(position)}</Text>
              <Text>{convertToMinutes(duration)}</Text>
            </View>
          </View>
        }
        <View style={styles.actions}>
          <IconButton icon="shuffle" size={40} disabled={!song.id} iconColor={isShuffled ? DefaultTheme.colors.primary : DefaultTheme.colors.text} onPress={() => setShuffled(prev => !prev)} />
          <IconButton icon="step-backward" size={40} onPress={goPrevious} disabled={isPreviousDisabled} />
          <PlayPauseButton key={song.id} disabled={!song.id} />
          <IconButton icon="step-forward" size={40} onPress={goNext} disabled={isNextDisabled} />
          <IconButton icon="repeat" size={40} disabled={!song.id} />
        </View>
      </Card>
    </SafeAreaView>
  )
};

function PlayPauseButton({ disabled }: { disabled?: boolean }) {
  const [icon, setIcon] = useState<IconSource>("pause");

  const playPause = async () => {
    const state = (await TrackPlayer.getPlaybackState()).state;
    if (state === State.Ready || state === State.Paused) {
      setIcon("pause");
      await TrackPlayer.play();
    } else if (state === State.Playing) {
      setIcon("play");
      await TrackPlayer.pause();
    }
  }

  return (
    <IconButton icon={icon} size={40} mode='outlined' onPress={playPause} disabled={disabled} />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 5,
    justifyContent: "center"
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0"
  },
  cover: {
    height: 350,
    width: 350,
    borderRadius: 20
  },
  title: {
    marginBottom: 10,
    paddingLeft: 0
  },
  songTimes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  }
});