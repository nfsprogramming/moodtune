# 🎵 MoodTune - AI-Powered Emotion-Based Music Recommender

**Transform your emotions into the perfect soundtrack.**

MoodTune analyzes your text input to detect your emotional state and recommends personalized Tamil music that matches your mood. Built with modern web technologies and AI-powered emotion detection.

---

## ✨ Features

- 🧠 **AI Emotion Detection** - Advanced NLP to analyze your feelings
- 🎵 **Smart Music Recommendations** - 6 curated Tamil songs per mood
- 🖼️ **Dynamic Cover Art** - High-resolution album artwork from iTunes API
- 🎧 **Full Song Playback** - Audio-only player with YouTube integration
- ❤️ **Like System** - Save your favorite recommendations
- 🎨 **Modern UI** - Glassmorphism design with smooth animations
- 📱 **Responsive** - Works beautifully on all devices

---

## 🚀 Tech Stack

### Frontend
- **React** + **Vite** - Fast, modern development
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **HTML5 Audio API** - Audio playback

### Backend
- **FastAPI** - High-performance Python API
- **Transformers** - Hugging Face emotion detection
- **yt-dlp** - YouTube audio extraction
- **iTunes API** - Cover art & metadata

---

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
cd TextEmotionMusic

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python server.py
```

The backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Quick Start (Windows)

Simply run the batch file:
```bash
start_new_app.bat
```

This starts both backend and frontend automatically!

---

## 🎯 Usage

1. **Enter your mood** - Type how you're feeling in the text area
2. **Get recommendations** - Click "Get Recommendations" 
3. **Explore songs** - Browse 6 personalized Tamil song suggestions
4. **Play music** - Click "Play" to listen to full songs
5. **Like favorites** - Heart icon to save songs you love

---

## 📁 Project Structure

```
TextEmotionMusic/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── App.jsx          # Main application
│   │   ├── App.css          # Styles
│   │   └── index.css        # Global styles
│   └── package.json
├── recommender/             # Music recommendation engine
│   └── emotion_to_music.py  # Song database & iTunes API
├── models/                  # AI models
├── server.py                # FastAPI backend
├── predict.py               # Emotion prediction
├── requirements.txt         # Python dependencies
├── LICENSE                  # MIT License
└── README.md               # This file
```

---

## 🎨 Features in Detail

### Emotion Detection
- Uses Hugging Face Transformers
- Supports multiple emotions: happy, sad, angry, love, calm, etc.
- Confidence scoring for accuracy

### Music Recommendations
- 50+ curated Tamil songs (2020-2025 hits)
- Dynamic cover art fetching
- Spotify search links
- Random selection for variety

### Audio Player
- Full-length song playback
- Play/pause controls
- Seek bar with time display
- Volume control
- Smooth animations

---

## 🛠️ API Endpoints

### `POST /predict`
Analyzes text and returns mood with song recommendations

**Request:**
```json
{
  "text": "I'm feeling great today!",
  "model": "simple"
}
```

**Response:**
```json
{
  "mood": "happy",
  "confidence": 0.95,
  "recommendations": [...],
  "genres": [...],
  "playlist_link": "..."
}
```

### `POST /get_youtube_audio`
Fetches YouTube audio stream URL for full song playback

**Request:**
```json
{
  "title": "Hukum",
  "artist": "Anirudh"
}
```

**Response:**
```json
{
  "audio_url": "https://...",
  "video_id": "..."
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**NFS Programming**
- Developer: Mohammed Nifras
- Email: mohammed.nifras.000555@gmail.com
- GitHub: [@nfsprogramming](https://github.com/nfsprogramming)
- Phone: +91 8925147213

---

## 🙏 Acknowledgments

- Hugging Face for Transformers library
- iTunes API for cover art
- YouTube for audio content
- Anirudh, AR Rahman, and all Tamil music artists

---

## 📸 Screenshots

*Coming soon - Add screenshots of your beautiful UI!*

---

## 🐛 Known Issues

- YouTube audio extraction requires `yt-dlp` to be installed
- Some songs may not have preview audio available
- iTunes API may have rate limits

---

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Playlist creation
- [ ] User accounts & saved preferences
- [ ] Social sharing
- [ ] More music sources (Spotify API, Apple Music)
- [ ] Offline mode

---

**Made with ❤️ and 🎵 by NFS Programming**
