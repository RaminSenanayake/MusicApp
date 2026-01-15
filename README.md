# 🎵 MusicApp

**MusicApp** is a cross-platform music streaming application designed upon the [React Native Track Player](https://rntp.dev/) and a [Spotify API](https://rapidapi.com/amiteshgupta/api/spotify-downloader9) where you can download and listen to any song you like.
> [!NOTE]
> *This project is developed for a university assignment and yet to optimize for real use.*

## 📱 Screenshots
*to be added*

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
