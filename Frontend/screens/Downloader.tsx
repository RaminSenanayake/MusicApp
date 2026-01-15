import { StyleSheet, Alert, View, FlatList, Pressable, Keyboard, useWindowDimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, IconButton, ProgressBar, Snackbar, Text, TextInput } from 'react-native-paper';
import { downloadingSongType } from '../src/songType';
import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';
import { baseUrl } from '../getBaseUrl';
import { fetch } from 'expo/fetch';
import { File, Directory, Paths } from 'expo-file-system';
import { useSongsContext } from '../src/SongsContext';
import { Track } from 'react-native-track-player';

export default function Downloader() {
  const [searchedSong, setSearchedSong] = useState<downloadingSongType | null | string>("Search for a song 🎶");
  const [search, setSearch] = useState("");
  const [downloadedSong, setDownloadedSong] = useState<Track | null>(null);
  const [progress, setProgress] = useState<number>();
  const { songs, setSongs } = useSongsContext();
  const [isSongDownloaded, setSongDownloaded] = useState<boolean>(false);

  const getMusic = async () => {
    try {
      if (search.trim().length > 0) {
        setSearchedSong(null);
        const response = await fetch(`${baseUrl}/MusicApp/GetMusic?q=${search}&type=tracks`)
        const result = await response.json();
        const songResult = JSON.parse(result);
        setSearchedSong(songResult);
      } else {
        Alert.alert("Info", "Type a song name at the top to search");
      }
    } catch (error) {
      console.error(error);
      setSearchedSong("Search for a song 🎶");
    }
  }

  useEffect(() => {
    (downloadedSong != null && downloadedSong.url == "") && downloadSongFile(downloadedSong.mediaId!);
    downloadedSong?.url && storeSong();
  }, [downloadedSong, downloadedSong?.url]);

  const downloadSongFile = async (songId: string) => {
    console.log("requesting to download");
    try {
      const response = await fetch(`${baseUrl}/MusicApp/DownloadMusic?songId=${songId}`);
      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength!, 10);
      let loaded = 0;

      const reader = response.body!.getReader();
      const directory = new Directory(Paths.document, "songs");
      !directory.exists && directory.create({ intermediates: true });
      const downloadedSongFile = new File(directory, `${songId}.mp3`);

      const writer = downloadedSongFile.writableStream().getWriter();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          await writer.close();
          break;
        };
        await writer.write(value);
        loaded += value.byteLength;
        setProgress(Math.round(loaded / total))
      }

      downloadedSong != null && setDownloadedSong({ ...downloadedSong, url: downloadedSongFile.uri });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong. Try again later.");
      setDownloadedSong(null);
      setProgress(undefined);
    }
  }

  const storeSong = async () => {
    try {
      console.log(downloadedSong?.url);
      downloadedSong != null && setSongs([...songs, downloadedSong]);
      setSongDownloaded(true);
      console.log("download success");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong. Try again later.");
    } finally {
      setDownloadedSong(null);
      setProgress(undefined);
    }
  }

  return (
    <SafeAreaView style={styles.container} onTouchEnd={() => Keyboard.isVisible() && Keyboard.dismiss()}>
      <View style={{ flexDirection: "row" }}>
        <TextInput disabled={downloadedSong != null} onSubmitEditing={() => getMusic()} style={{ flex: 1 }} label={"Search song"} value={search} onChangeText={text => setSearch(text)} selectTextOnFocus />
        <IconButton disabled={downloadedSong != null} onPress={getMusic} style={{ flex: 0.1, alignSelf: "center" }} icon="magnify" size={25} mode='outlined' />
      </View>
      <View style={
        [
          { flexDirection: "row", alignItems: "center", gap: 10, paddingInline: 5 },
          downloadedSong == null && { display: 'none' }
        ]
      }>
        <Text variant='titleSmall'>Downloading...</Text>
        <ProgressBar style={{ width: 245 }} progress={progress} />
      </View>
      {
        typeof searchedSong == 'string' ?
          (
            <View style={styles.downloaderScreen}>
              <Text variant='displaySmall'>{searchedSong}</Text>
              <LottieView source={require("../assets/Girl listening to music.json")} autoPlay loop style={styles.dowloaderScreenImage} />
            </View>
          )
          :
          (

            <FlatList
              contentContainerStyle={[styles.songs, !searchedSong && { height: '100%' }]}
              data={searchedSong?.data.tracks.items}
              ListEmptyComponent={
                <View style={styles.downloaderScreen}>
                  <LottieView source={require("../assets/loading.json")} autoPlay loop style={styles.dowloaderScreenImage} />
                </View>
              }
              renderItem={(song) => (
                <Pressable disabled={downloadedSong != null || songs.some((track) => track.mediaId == song.item.id)} onPress={() => Alert.alert("Download music", `Do you want to download ${song.item.name} by `
                  +
                  song.item.artists.items.map((artist, index) => (
                    (index == 0 ? "" : " ") + artist.profile.name
                  )), [
                  {
                    text: "Ok",
                    onPress: () => {
                      setDownloadedSong({
                        mediaId: song.item.id,
                        title: song.item.name,
                        artist: `${song.item.contentRating.label == "EXPLICIT" ? "🅴 " : ""}` +
                          song.item.artists.items.map((artist, index) => (
                            (index == 0 ? "" : " ") + artist.profile.name
                          )),
                        artwork: song.item.albumOfTrack.coverArt[2].url,
                        url: "",
                        duration: song.item.duration.totalMilliseconds
                      });
                    }
                  },
                  {
                    text: "Cancel",
                    style: "cancel"
                  }
                ])}>
                  <Card style={[{ overflow: 'hidden' },
                  (downloadedSong != null || songs.some((track) => track.mediaId == song.item.id)) && { opacity: 0.6 }]}>
                    <Card.Title
                      title={song.item.name}
                      titleVariant='titleLarge'
                      subtitle={
                        `${song.item.contentRating.label == "EXPLICIT" ? "🅴 " : ""}` +
                        song.item.artists.items.map((artist, index) => (
                          (index == 0 ? "" : " ") + artist.profile.name
                        ))
                      }
                      subtitleVariant='bodySmall'
                      left={() => <Image source={song.item.albumOfTrack.coverArt[1].url} style={{ flex: 1 }} />}
                    />
                  </Card>
                </Pressable>
              )}
            />
          )
      }
      <Snackbar duration={3000} style={{ width: '100%' }} visible={isSongDownloaded} onDismiss={() => setSongDownloaded(false)}>Song Downloaded</Snackbar>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    padding: 10
  },
  topText: {
    fontWeight: "bold"
  },
  songs: {
    gap: 5,
    padding: 5
  },
  downloaderScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  dowloaderScreenImage: {
    width: 400,
    height: 400
  }
});