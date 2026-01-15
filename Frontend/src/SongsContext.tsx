import AsyncStorage from "@react-native-async-storage/async-storage";
import { File, Paths } from "expo-file-system";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import TrackPlayer, { Track } from "react-native-track-player";

interface SongsContextValue {
    songs: Track[];
    getSongs: () => Promise<void>;
    setSongs: (songs: Track[]) => void
    removeSong: (mediaId: string) => void
}

const SongsContext = createContext<SongsContextValue | null>(null);

export default function SongsContextProvider({ children }: { children: ReactNode }) {
    const [songs, setSongs] = useState<Track[]>([]);
    const [isSongsToBeUpdated, setSongsToBeUpdated] = useState<boolean>(true);

    const storeSong = async (songs: Track[]) => {
        setSongs(songs);
        await AsyncStorage.setItem("songs", JSON.stringify(songs));
        setSongsToBeUpdated(true);
    }

    const removeSong = async (mediaId: string) => {
        try {
            const songFile = new File(Paths.document, "songs", `${mediaId}.mp3`);
            songFile.delete();
            const songList = await AsyncStorage.getItem("songs");
            const songs: Track[] = JSON.parse(songList!);
            const updatedSongs = songs.filter((track, index) => {
                track.mediaId == mediaId && TrackPlayer.remove(index);
                return track.mediaId !== mediaId;
            });
            storeSong(updatedSongs);
            console.log("removed " + mediaId);
        } catch (error) {
            console.log(error);
        }
    }

    const getData = async () => {
        console.log("Getting songs");
        try {
            const result = await AsyncStorage.getItem("songs");
            result != null && setSongs(JSON.parse(result));
        } catch (error) {
            console.log(error);
        } finally {
            setSongsToBeUpdated(false);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                TrackPlayer.setupPlayer();
            } catch (error) {
                console.log(error)
            }
        })();
        console.log("Track player is set up")
    }, []);

    useEffect(() => {
        console.log("number of songs: " + songs.length);
        isSongsToBeUpdated && getData();
    }, [isSongsToBeUpdated]);

    return (
        <SongsContext.Provider value={{
            songs,
            getSongs: getData,
            setSongs: storeSong,
            removeSong
        }}
        >
            {children}
        </SongsContext.Provider >
    );
}

export function useSongsContext() {
    const ctx = useContext(SongsContext);
    if (!ctx) {
        throw new Error("useSongsContext must be used inside SongsContextProvider");
    }
    return ctx;
}