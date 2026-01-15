export type downloadingSongType = {
  "success": boolean,
  "data": {
    "tracks": {
      "items": [
        {
          "type": string,
          "id": string,
          "uri": string,
          "name": string,
          "artists": {
            "items": [
              {
                "profile": {
                  "name": string
                },
                "uri": string
              }
            ]
          },
          "contentRating": {
            "label": string
          },
          "duration": {
            "totalMilliseconds": number
          },
          "albumOfTrack": {
            "id": string,
            "uri": string,
            "name": string,
            "coverArt": [
              {
                "height": 300,
                "url": string,
                "width": 300
              },
              {
                "height": 64,
                "url": string,
                "width": 64
              },
              {
                "height": 640,
                "url": string,
                "width": 640
              }
            ]
          },
          "playability": {
            "playable": boolean,
            "reason": string
          }
        },
      ],
      "totalCount": number
    }
  },
  "generatedTimeStamp": number
}