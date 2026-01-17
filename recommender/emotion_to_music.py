import random
import urllib.parse
import requests
import concurrent.futures

def get_music_recommendation(emotion):
    """
    Returns a list of music genres/styles based on the detected emotion.
    Prioritizes Tamil Music methods.
    """
    emotion = emotion.lower()
    
    # Keeping genres for broad context
    mapping = {
        "happy": ["Anirudh Vibes", "Thalapathy Fast Beats", "Club Hits 2024", "Insta Trending Tamil"],
        "joy": ["Anirudh Vibes", "Thalapathy Fast Beats", "Club Hits 2024", "Insta Trending Tamil"],
        "sad": ["Sid Sriram Soul", "Pradeep Kumar Melodies", "AR Rahman 2020s", "Yuvan Drug"],
        "sadness": ["Sid Sriram Soul", "Pradeep Kumar Melodies", "AR Rahman 2020s", "Yuvan Drug"],
        "angry": ["Ani Rockstar Mode", "Santhosh Narayanan Raw", "Vikram Squad", "Leo Badass"],
        "anger": ["Ani Rockstar Mode", "Santhosh Narayanan Raw", "Vikram Squad", "Leo Badass"],
        "love": ["Pradeep Kumar Love", "GVM New Age", "Anirudh Melody", "Dhanush Love Hits"],
        "calm": ["Nivas K Prasanna", "Sean Roldan Chill", "Midnight Vibes", "Rain Effect"],
        "relief": ["Nivas K Prasanna", "Sean Roldan Chill", "Midnight Vibes", "Rain Effect"],
        "fear": ["Divine Connect", "Peaceful Flute", "Slow Piano", "Nature"],
        "neutral": ["Tamil Indie Scene", "Think Music Originals", "Coke Studio Tamil", "Vibe Mode"],
        "surprise": ["Remix Mode", "Trap City Tamil", "DJ Walta"],
        "disgust": ["Focus Beats", "Pure Instrumental", "Binary Beats"]
    }
    
    return mapping.get(emotion, ["Tamil Viral", "Trending Now"])

def get_itunes_metadata(song_title, artist):
    """
    Fetches cover art and preview link from iTunes API.
    Retries with just the song title if the combination fails.
    """
    def fetch(query_str):
        try:
            url = f"https://itunes.apple.com/search?term={urllib.parse.quote(query_str)}&entity=song&limit=1"
            response = requests.get(url, timeout=3)
            if response.status_code == 200:
                return response.json().get('results', [])
        except:
            return []
        return []

    # Attempt 1: Title + Artist
    # Remove any parenthetical info from artist for better search (e.g. "Anirudh (Leo)" -> "Anirudh")
    clean_artist = artist.split('(')[0].strip()
    results = fetch(f"{song_title} {clean_artist}")
    
    # Attempt 2: Just Title (if specific enough)
    if not results:
        results = fetch(song_title)

    if results:
        track = results[0]
        # cell phone quality 100x100 -> decent quality 600x600 replacement
        artwork_url = track.get('artworkUrl100', '').replace('100x100', '600x600')
        return {
            "image": artwork_url,
            "preview": track.get('previewUrl')
        }
    
    return {"image": None, "preview": None}


def get_specific_song_recommendations(emotion):
    """
    Returns specific modern Tamil song recommendations with dynamic cover art.
    """
    emotion = emotion.lower()
    
    def create_spotify_search_link(song, artist):
        query = f"{song} {artist}"
        encoded_query = urllib.parse.quote(query)
        return f"https://open.spotify.com/search/{encoded_query}"

    # Expanded Database
    song_db_raw = {
        "happy": [
            {"title": "Hukum", "artist": "Anirudh"},
            {"title": "Naa Ready", "artist": "Anirudh"},
            {"title": "Badass", "artist": "Anirudh"},
            {"title": "Kaavaalaa", "artist": "Anirudh"},
            {"title": "Jalabulajangu", "artist": "Anirudh"},
            {"title": "Marana Mass", "artist": "Anirudh"},
            {"title": "Vaathi Coming", "artist": "Anirudh"},
            {"title": "Ranjithame", "artist": "Thaman S"},
            {"title": "Arabic Kuthu", "artist": "Anirudh"},
            {"title": "Kurchi Madathapetti", "artist": "Thaman S"},
            {"title": "Dippam Dappam", "artist": "Anirudh"},
            {"title": "Chellamma", "artist": "Anirudh"}
        ],
        "sad": [
            {"title": "Nira", "artist": "Sid Sriram"},
            {"title": "Naan Gaali", "artist": "Pradeep Kumar"},
            {"title": "Chithirai Sevvanam", "artist": "Pradeep Kumar"}, # Fixed spelling
            {"title": "Nee Singam Dhan", "artist": "AR Rahman"},
            {"title": "Yaanji", "artist": "Anirudh"},
            {"title": "Po Nila", "artist": "Pradeep Kumar"},
            {"title": "Mogathirai", "artist": "Pradeep Kumar"},
            {"title": "Ennodu Nee Irundhaal", "artist": "Sid Sriram"},
            {"title": "Maruvarthai", "artist": "Sid Sriram"},
            {"title": "Thangamey", "artist": "Anirudh"},
            {"title": "Kanave Kanave", "artist": "Anirudh"}
        ],
        "angry": [
            {"title": "Badass", "artist": "Anirudh"},
            {"title": "Vikram Title Track", "artist": "Anirudh"},
            {"title": "Thee Thalapandy", "artist": "Silambarasan TR"},
            {"title": "Maamadura", "artist": "Santhosh Narayanan"},
            {"title": "Neruppu Da", "artist": "Santhosh Narayanan"},
            {"title": "Ullaallaa", "artist": "Anirudh"},
            {"title": "Petta Parak", "artist": "Anirudh"},
            {"title": "Master the Blaster", "artist": "Anirudh"},
            {"title": "Verithanam", "artist": "AR Rahman"}
        ],
        "love": [
            {"title": "Naan Pizhai", "artist": "Anirudh"},
            {"title": "Megham Karukatha", "artist": "Dhanush"},
            {"title": "Mallipoo", "artist": "AR Rahman"},
            {"title": "Aga Naga", "artist": "AR Rahman"},
            {"title": "Mudhal Nee Mudivum Nee", "artist": "Darbuka Siva"},
            {"title": "Sirikkadhey", "artist": "Anirudh"},
            {"title": "Kannazhaga", "artist": "Anirudh"},
            {"title": "Unakaga", "artist": "AR Rahman"},
            {"title": "Kadhaippoma", "artist": "Leon James"},
            {"title": "Neeyum Naanum", "artist": "Anirudh"}
        ],
        "calm": [
            {"title": "Thenmozhi", "artist": "Santhosh Narayanan"},
            {"title": "Maya Nadh", "artist": "Santhosh Narayanan"},
            {"title": "Katchi Sera", "artist": "Sai Abhyankkar"},
            {"title": "Railin Oligal", "artist": "Govind Vasantha"},
            {"title": "Life of Pazham", "artist": "Anirudh"},
            {"title": "Aasai", "artist": "Sean Roldan"},
            {"title": "Vaa Vaathy", "artist": "GV Prakash"},
            {"title": "Kannamma", "artist": "Pradeep Kumar"}
        ]
    }
    
    # Map complex emotions to simple keys
    if emotion in ["joy", "surprise", "excited"]: emotion = "happy"
    if emotion in ["sadness", "disgust", "lonely", "grief"]: emotion = "sad"
    if emotion in ["anger", "frustrated"]: emotion = "angry"
    if emotion in ["relief", "relaxed"]: emotion = "calm"
    if emotion in ["romantic"]: emotion = "love"
    
    target_emotion = emotion if emotion in song_db_raw else "happy"
    
    # Select 6 random songs from the expanded list
    pool = song_db_raw.get(target_emotion)
    selected_songs = random.sample(pool, min(6, len(pool)))
    
    # Enrich with iTunes Metadata (Parallel Execution)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
        future_to_song = {executor.submit(get_itunes_metadata, song['title'], song['artist']): song for song in selected_songs}
        
        for future in concurrent.futures.as_completed(future_to_song):
            song = future_to_song[future]
            try:
                data = future.result()
                song['image'] = data['image']
                song['preview_audio'] = data['preview']
            except Exception as exc:
                song['image'] = None
                song['preview_audio'] = None
                
    # Add links dynamically
    for song in selected_songs:
        song['link'] = create_spotify_search_link(song['title'], song['artist'])
        
    return selected_songs

def get_playlist_link(emotion):
    """
    Returns a sample Spotify/YouTube playlist link tailored for Tamil songs.
    """
    emotion = emotion.lower()
    links = {
        # Happy / Kuthu
        "happy": "https://open.spotify.com/playlist/37i9dQZF1DWY1j3jZdCWOQ", # Tamil Kuthu
        
        # Sad / Melody
        "sad": "https://open.spotify.com/playlist/37i9dQZF1DX4RyF6t6y38S",   # Tamil Sad Songs
        
        # Angry / Mass
        "angry": "https://open.spotify.com/playlist/37i9dQZF1DX7jG33s6f8A6",  # Kollywood Mass
        
        # Love / Romantic
        "love": "https://open.spotify.com/playlist/37i9dQZF1DX6XceP05j2bS",   # Tamil Romance
        
        # Calm / Melodies
        "calm": "https://open.spotify.com/playlist/37i9dQZF1DX5lF4cK0w1Ea",   # Tamil 90s
        
        # Neutral / Indie
        "neutral": "https://open.spotify.com/playlist/37i9dQZF1DXcaU13M0h0eX",# Tamil Indie
        
        # Fear (Calming)
        "fear": "https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS",   # Chill Lofi (General)
    }
    
    # Map synonyms
    if emotion in ["joy", "surprise"]: emotion = "happy"
    if emotion in ["sadness", "disgust"]: emotion = "sad"
    if emotion in ["anger"]: emotion = "angry"
    if emotion in ["relief"]: emotion = "calm"
    
    return links.get(emotion, "https://open.spotify.com/genre/tamil-page")
