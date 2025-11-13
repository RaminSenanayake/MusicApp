import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import TrackPlayer, { AddTrack } from "react-native-track-player";

export type savedSongType = AddTrack & {
    id: string;
    tinyCover: string;
}

interface SongsContextValue {
    songs: savedSongType[];
    getSongs: () => Promise<void>;
    setSongs: (songs: savedSongType[]) => void
}

const SongsContext = createContext<SongsContextValue | null>(null);

export default function SongsContextProvider({ children }: { children: ReactNode }) {
    const [songs, setSongs] = useState<savedSongType[]>([]);
    const [songsUpdated, setSongsUpdated] = useState<boolean>(true);

    const storeSong = async (songs: savedSongType[]) => {
        setSongs(songs);
        await AsyncStorage.setItem("songs", JSON.stringify(songs));
        setSongsUpdated(true);
    }

    const getData = async () => {
        console.log("Getting songs");
        try {
            const result = await AsyncStorage.getItem("songs");
            result != null && setSongs(JSON.parse(result));
            setSongsUpdated(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                await TrackPlayer.setupPlayer();
            } catch (error) {
                console.log(error)
            }
        })();
        console.log("Track player is set up")
    }, [])

    useEffect(() => {
        console.log("number of songs: " + songs.length);
        songsUpdated && getData();
    }, [songsUpdated]);

    return (
        <SongsContext.Provider value={{
            songs,
            getSongs: getData,
            setSongs: storeSong
        }}
        >
            {children}
        </SongsContext.Provider >
    )
}

export function useSongsContext() {
    const ctx = useContext(SongsContext);
    if (!ctx) {
        throw new Error("useSongsContext must be used inside SongsContextProvider");
    }
    return ctx;
}