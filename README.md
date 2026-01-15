# 🎵 MusicApp

**MusicApp** is a cross-platform music streaming application designed upon the <a href="https://rntp.dev/">React Native Track Player</a> and a <a href="https://rapidapi.com/amiteshgupta/api/spotify-downloader9">Spotify API</a> where you can download and listen to any song you like.

## 📱 Screenshots

*to be added*

<p align="center">
<img src="[https://via.placeholder.com/200x400.png?text=Home+Screen](https://www.google.com/search?q=https://via.placeholder.com/200x400.png%3Ftext%3DHome%2BScreen)" width="200" />
<img src="[https://via.placeholder.com/200x400.png?text=Music+Player](https://www.google.com/search?q=https://via.placeholder.com/200x400.png%3Ftext%3DMusic%2BPlayer)" width="200" />
</p>

---

## ✨ Features

* **Download and listen to music for free:** With the used Spotify API you can enjoy whatever song you want
* **Shuffling:** Want to mixup your playlist? now you can with the shuffle option in the player
* **Repeat:** Loop your *downloaded* songs using the repeat option

---

## 🛠 Tech Stack

### Frontend

* **React Native:** Framework for building the mobile app.

### Backend

* **Java 7 Ant:** Core REST API framework for searching and downloading songs.

---

## 📁 Project Structure

```text
MusicApp/
├── backend/                Java Spring Boot API
│   └── src/main/java/      Business logic, Controllers
├── frontend/               React Native Mobile App
│   ├── src/                Components, Screens, Navigation
│   ├── assets/             Icons, Images, Fonts
│   └── package.json        JS dependencies
└── README.md

```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/MusicApp/GetMusic?q={search}&type=tracks` | Fetch songs according to search result |
| `GET` | `/MusicApp/DownloadMusic?songId={songId}` | Download selected song |

---
## 👤 Author

**Ramin Senanayake:** [GitHub Profile](https://github.com/RaminSenanayake)
