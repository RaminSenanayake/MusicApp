import TrackPlayer, { Track } from "react-native-track-player";

export function convertToMinutes(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = (seconds - minutes * 60).toFixed(0);
    return `${minutes}:${Number(secs) < 10 ? '0' + secs : secs}`
}

export async function shuffle(isShuffled: boolean, songs: Track[], songId: number, isSongSelected: boolean) {
    const activeTrack = await TrackPlayer.getActiveTrack();
    if (isShuffled) {
        const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();
        await TrackPlayer.move(activeTrackIndex!, 0);
        await TrackPlayer.removeUpcomingTracks();
        const shufflingSongs = [...songs].filter((track) => { return track != activeTrack });
        let currentIndex = shufflingSongs.length;
        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [shufflingSongs[currentIndex], shufflingSongs[randomIndex]] = [shufflingSongs[randomIndex], shufflingSongs[currentIndex]];
        }
        TrackPlayer.add(shufflingSongs);
    } else {
        if (isSongSelected) {
            await TrackPlayer.setQueue(songs);
            await TrackPlayer.skip(songId);
        } else {
            const activeTrack = await TrackPlayer.getActiveTrack();
            const position = (await TrackPlayer.getProgress()).position;
            await TrackPlayer.setQueue(songs);
            const activeIndex = (await TrackPlayer.getQueue()).findIndex((track) => activeTrack?.mediaId === track.mediaId);
            await TrackPlayer.skip(activeIndex)
            await TrackPlayer.seekTo(position);
        }
    }
}