# Jamendo API Integration Guide

## Overview
Your music app now integrates with **Jamendo API** - a free music streaming service with millions of tracks under Creative Commons licenses.

## What's New

### Backend Changes (`first-go/backend/`)
1. **New File**: `jamendo.go` - Handles all Jamendo API calls
   - `GetJamendoTracksHandler()` - Fetch trending or search tracks
   - `GetJamendoGenresHandler()` - Get popular genres
   - `GetJamendoGenreTracksHandler()` - Fetch tracks by genre

### Frontend Changes (`second-go/script.js`)
1. **Dynamic Track Loading** - No more hardcoded tracks
2. **Real Music Search** - Search millions of Jamendo tracks
3. **Genre Browsing** - Browse by music genres
4. **Random Emojis & Colors** - Dynamic card styling

## API Endpoints

```
GET /api/jamendo/tracks?q=<query>&limit=<number>
   - Search for tracks or get trending tracks if no query

GET /api/jamendo/genres
   - Get list of music genres

GET /api/jamendo/genres/tracks?genre=<genre>&limit=<number>
   - Get tracks for a specific genre
```

## Setup Instructions

### 1. Run the Backend

```bash
cd /home/l2euser/Documents/Music/first-go/backend
go run *.go
```

The backend will start on `http://localhost:8080`

### 2. Open Frontend

Open `second-go/index.html` in your browser

### 3. How to Use

- **Home Page**: Shows trending tracks from Jamendo
- **Search**: Click search bar and type artist/song name
- **Browse Genres**: Click genre cards to see tracks in that category
- **Play Music**: Click play button on any track to start playing

## Jamendo API Features

- ✅ **Free Tier** - No API key required for basic searches
- ✅ **Creative Commons Licensed** - All music is free to use
- ✅ **High Audio Quality** - MP3 streams included
- ✅ **Album Art** - Cover images for each track
- ✅ **Metadata** - Title, artist, duration, genre

## Current API Key

The integration uses a public API key: `6d8fb5d0`

### To Get Your Own API Key (Optional):
1. Visit: https://www.jamendo.com/developers
2. Create a free account
3. Generate an API key
4. Replace `JamendoAPIKey` in `backend/jamendo.go`

```go
const JamendoAPIKey = "your_api_key_here"
```

## Limits & Best Practices

- **Rate Limit**: ~200 requests per day (free tier)
- **Results**: Max 200 tracks per request
- **Cache**: Consider caching popular searches on backend
- **Error Handling**: App falls back gracefully on API failures

## Features You Can Add

1. **Save Favorites** - Add tracks to "Liked Songs"
2. **Playlists** - Create custom playlists with Jamendo tracks
3. **Recently Played** - Track user's listening history
4. **User Recommendations** - Based on favorite genres
5. **Offline Download** - Download tracks for offline play (CC licensed)

## Troubleshooting

### No tracks appearing?
- Check backend is running: `curl http://localhost:8080/api/jamendo/tracks`
- Check browser console for errors (F12)
- Verify API endpoint URLs in `script.js`

### API Rate Limited?
- Wait a few hours (daily limit reset)
- Get your own API key from Jamendo
- Implement server-side caching

### CORS Issues?
- Backend has CORS enabled for all origins
- If issues persist, check backend is running on port 8080

## Next Steps

1. ✅ Backend running with Jamendo integration
2. ✅ Frontend fetching real music data
3. 🔄 Add user authentication (already in backend)
4. 🔄 Save user's favorite tracks to database
5. 🔄 Create user playlists

## File Structure

```
first-go/
├── backend/
│   ├── jamendo.go          (NEW - Jamendo API integration)
│   ├── main.go
│   ├── routes.go           (UPDATED - new endpoints)
│   ├── handlers.go
│   ├── models.go
│   ├── auth.go
│   ├── middleware.go
│   ├── database.go
│   └── go.mod

second-go/
├── index.html
├── script.js               (UPDATED - fetch real data)
├── styles.css
├── manifest.json
└── sw.js
```

## API Response Examples

### Trending Tracks
```json
[
  {
    "id": "123456",
    "name": "Song Title",
    "artist_name": "Artist Name",
    "album_name": "Album Name",
    "duration": 210,
    "genre": "Electronic",
    "image": "https://...",
    "audio": "https://..."
  }
]
```

### Genres
```json
[
  {
    "title": "Afrobeats",
    "emoji": "🥁",
    "id": "afrobeats",
    "bg": "#1a3a1a"
  }
]
```

## Performance Tips

- **Lazy Load**: Load tracks only when user scrolls
- **Pagination**: Load 20 tracks at a time, not all
- **Search Debouncing**: Wait 500ms after user stops typing before searching
- **Image Optimization**: Use thumbnail images instead of full size

## Questions?

Check Jamendo API docs: https://www.jamendo.com/api/v3.0
