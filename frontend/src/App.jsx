/**
 * MoodTune - AI-Powered Music Recommender
 * Copyright (c) 2026 NFS Programming
 * Licensed under MIT License
 * 
 * Main React Application Component
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Music2, Disc, PlayCircle, BarChart2, Zap, Radio, Heart, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import './App.css'

function App() {
  /* Audio Player State */
  const [activeSong, setActiveSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [audioRef] = useState(new Audio())

  const [inputText, setInputText] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [likedSongs, setLikedSongs] = useState({})

  const analyzeMood = async () => {
    if (!inputText.trim()) return

    // Close player on new search
    if (activeSong) {
      audioRef.pause()
      setActiveSong(null)
      setIsPlaying(false)
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, model: "simple" }),
      })

      if (!response.ok) {
        throw new Error("Failed to connect to MoodTune API")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      setError(err.message || "Something went wrong. Ensure backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = (songTitle) => {
    setLikedSongs(prev => ({
      ...prev,
      [songTitle]: !prev[songTitle]
    }))
  }

  const handlePlayFull = async (song) => {
    if (activeSong?.title === song.title) {
      togglePlayPause()
    } else {
      setActiveSong(song)
      setIsPlaying(false)

      try {
        const response = await fetch("http://localhost:8000/get_youtube_audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: song.title,
            artist: song.artist
          }),
        })

        if (response.ok) {
          const data = await response.json()

          if (data.audio_url) {
            audioRef.src = data.audio_url
            audioRef.volume = volume
            audioRef.play().catch(e => {
              console.error("YouTube playback error:", e)
              if (song.preview_audio) {
                audioRef.src = song.preview_audio
                audioRef.play()
              }
            })
            setIsPlaying(true)
          } else if (song.preview_audio) {
            audioRef.src = song.preview_audio
            audioRef.volume = volume
            audioRef.play().catch(e => console.error("Playback error:", e))
            setIsPlaying(true)
          }
        } else {
          if (song.preview_audio) {
            audioRef.src = song.preview_audio
            audioRef.volume = volume
            audioRef.play().catch(e => console.error("Playback error:", e))
            setIsPlaying(true)
          }
        }
      } catch (err) {
        console.error("Error:", err)
        if (song.preview_audio) {
          audioRef.src = song.preview_audio
          audioRef.volume = volume
          audioRef.play().catch(e => console.error("Playback error:", e))
          setIsPlaying(true)
        }
      }
    }
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.pause()
      setIsPlaying(false)
    } else {
      audioRef.play().catch(e => console.error("Playback error:", e))
      setIsPlaying(true)
    }
  }

  // Audio event listeners
  audioRef.ontimeupdate = () => setCurrentTime(audioRef.currentTime)
  audioRef.onloadedmetadata = () => {
    setDuration(audioRef.duration)
    // Auto-skip first 3 seconds if it's a preview (often has intro)
    if (audioRef.duration <= 35) { // iTunes previews are ~30s
      audioRef.currentTime = 3
    }
  }
  audioRef.onended = () => setIsPlaying(false)

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration
    audioRef.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  const skipForward = () => {
    audioRef.currentTime = Math.min(audioRef.currentTime + 10, duration)
  }

  const skipBackward = () => {
    audioRef.currentTime = Math.max(audioRef.currentTime - 10, 0)
  }

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100
    setVolume(newVolume)
    audioRef.volume = newVolume
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="app-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-section"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Music2 size={48} className="text-accent" style={{ color: 'var(--accent)' }} />
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800' }}>
            Mood<span className="gradient-text">Tune</span>
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Discover music that resonates with your feelings.
        </p>
      </motion.div>

      <div className="input-section">
        <textarea
          className="glass-card mood-input"
          placeholder="How are you feeling right now? (e.g., I'm missing someone deeply...)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          className="analyze-btn"
          onClick={analyzeMood}
          disabled={loading || !inputText.trim()}
        >
          {loading ? (
            <>Analyzing...</>
          ) : (
            <>Get Recommendations <Zap size={18} /></>
          )}
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ color: 'var(--error)', marginTop: '1rem', textAlign: 'center' }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            className="results-container"
            style={{ width: '100%' }}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
              <motion.div variants={itemVariants} className="mood-badge glass-card">
                <BarChart2 size={18} />
                Detected Mood: {result.mood.toUpperCase()}
              </motion.div>
              <motion.div variants={itemVariants} style={{ maxWidth: '300px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  <span>Confidence</span>
                  <span>{Math.round(result.confidence * 100)}%</span>
                </div>
                <div className="confidence-bar">
                  <div className="confidence-fill" style={{ width: `${result.confidence * 100}%` }}></div>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="results-grid">
              {result.recommendations.map((song, i) => (
                <motion.div
                  key={i}
                  className={`song-card glass-card ${!song.image ? 'no-image' : ''}`}
                  style={song.image ? { backgroundImage: `url(${song.image})` } : {}}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="song-content">
                    <div className="song-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Disc size={20} style={{ color: 'white', opacity: 0.7 }} />
                        <span style={{ fontSize: '1.5rem', fontWeight: '800', opacity: 0.5, lineHeight: 1 }}>0{i + 1}</span>
                      </div>
                      <button
                        className={`like-btn ${likedSongs[song.title] ? 'liked' : ''}`}
                        onClick={() => toggleLike(song.title)}
                      >
                        <Heart size={20} fill={likedSongs[song.title] ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <div className="song-details">
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {song.title}
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', fontWeight: '500' }}>
                        {song.artist}
                      </p>

                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
                        <button
                          onClick={() => handlePlayFull(song)}
                          className="play-btn-playing"
                          style={{
                            background: activeSong?.title === song.title && isPlaying ? '#1db954' : 'white',
                            color: activeSong?.title === song.title && isPlaying ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '50px',
                            padding: '8px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                          }}
                        >
                          {activeSong?.title === song.title && isPlaying ? (
                            <><Pause size={16} /> Playing</>
                          ) : (
                            <><PlayCircle size={20} /> Play</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '3rem' }}>
              {result.genres && result.genres.map((g, i) => (
                <span key={i} className="genre-tag glass-card">#{g}</span>
              ))}
            </motion.div>

            {result.playlist_link && (
              <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '3rem' }}>
                <a
                  href={result.playlist_link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#1db954',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '99px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(29, 185, 84, 0.3)'
                  }}
                >
                  <Radio size={20} />
                  Open Full Playlist
                </a>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUDIO PLAYER BAR */}
      <AnimatePresence>
        {activeSong && (
          <motion.div
            className="music-player-bar"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="player-info">
              {activeSong.image && <img src={activeSong.image} alt="Art" className="player-img" />}
              <div className="player-text">
                <h4 title={activeSong.title}>{activeSong.title}</h4>
                <p>{activeSong.artist}</p>
              </div>
            </div>

            <div className="player-controls">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '400px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                  {/* Skip Backward Button */}
                  <button
                    onClick={skipBackward}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                      e.currentTarget.style.transform = 'scale(1.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                    title="Skip backward 10s"
                  >
                    <SkipBack size={18} />
                  </button>

                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlayPause}
                    style={{
                      background: '#1db954',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {isPlaying ? <Pause size={20} /> : <PlayCircle size={20} />}
                  </button>

                  {/* Skip Forward Button */}
                  <button
                    onClick={skipForward}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                      e.currentTarget.style.transform = 'scale(1.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                    title="Skip forward 10s"
                  >
                    <SkipForward size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', minWidth: '35px' }}>
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(currentTime / duration) * 100 || 0}
                    onChange={handleSeek}
                    style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      outline: 'none',
                      background: `linear-gradient(to right, #1db954 0%, #1db954 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`,
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', minWidth: '35px' }}>
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Volume2 size={18} style={{ color: 'var(--text-secondary)' }} />
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={handleVolumeChange}
                style={{
                  width: '80px',
                  height: '4px',
                  borderRadius: '2px',
                  outline: 'none',
                  background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`,
                  cursor: 'pointer'
                }}
              />
            </div>

            <button className="close-player" onClick={() => {
              audioRef.pause()
              setActiveSong(null)
              setIsPlaying(false)
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
