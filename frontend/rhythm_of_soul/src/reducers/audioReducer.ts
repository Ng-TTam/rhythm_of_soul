import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Song {
  id: string;
  imageUrl: string;
  title: string;
  artist: string;
  mediaUrl: string;
}

interface PlaylistState {
  songs: Song[];
  currentIndex: number;
}

interface AudioSliceState {
  // Trạng thái phát hiện tại
  play: boolean;
  currentSong: Song | null;
  
  // Trạng thái playlist
  playlist: PlaylistState | null;
  
  // Cài đặt phát
  repeatMode: 'none' | 'one' | 'all';
  shuffle: boolean;
  
  // Thông tin phát hiện tại (để tương thích với code cũ)
  imageSong: string;
  titleSong: string;
  artistSong: string;
  mediaUrlSong: string;
  id: string;
}

const initialState: AudioSliceState = {
  play: false,
  currentSong: null,
  playlist: null,
  repeatMode: 'none',
  shuffle: false,
  imageSong: '',
  titleSong: '',
  artistSong: '',
  mediaUrlSong: '',
  id: '',
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    // Phát một bài hát đơn lẻ
    playSingleSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
      state.play = true;
      state.playlist = null;
      
      // Cập nhật cho tương thích
      state.imageSong = action.payload.imageUrl;
      state.titleSong = action.payload.title;
      state.artistSong = action.payload.artist;
      state.mediaUrlSong = action.payload.mediaUrl;
    },
    
    // Thiết lập playlist và phát
    setPlaylist: (state, action: PayloadAction<Song[]>) => {
      if (action.payload.length === 0) return;
      
      state.playlist = {
        songs: action.payload,
        currentIndex: 0
      };
      state.currentSong = action.payload[0];
      state.play = true;
      
      // Cập nhật cho tương thích
      state.imageSong = action.payload[0].imageUrl;
      state.titleSong = action.payload[0].title;
      state.artistSong = action.payload[0].artist;
      state.mediaUrlSong = action.payload[0].mediaUrl;
    },
    
    // Chuyển bài tiếp theo trong playlist
    playNextSong: (state) => {
      if (!state.playlist || !state.currentSong) return;
      
      let nextIndex = state.playlist.currentIndex + 1;
      
      // Xử lý khi hết playlist
      if (nextIndex >= state.playlist.songs.length) {
        if (state.repeatMode === 'all') {
          nextIndex = 0;
        } else {
          state.play = false;
          return;
        }
      }
      
      const nextSong = state.playlist.songs[nextIndex];
      state.playlist.currentIndex = nextIndex;
      state.currentSong = nextSong;
      state.play = true;
      
      // Cập nhật cho tương thích
      state.imageSong = nextSong.imageUrl;
      state.titleSong = nextSong.title;
      state.artistSong = nextSong.artist;
      state.mediaUrlSong = nextSong.mediaUrl;
    },
    
    // Chuyển bài trước đó trong playlist
    playPreviousSong: (state) => {
      if (!state.playlist || !state.currentSong) return;
      
      let prevIndex = state.playlist.currentIndex - 1;
      
      // Xử lý khi ở đầu playlist
      if (prevIndex < 0) {
        if (state.repeatMode === 'all') {
          prevIndex = state.playlist.songs.length - 1;
        } else {
          prevIndex = 0;
        }
      }
      
      const prevSong = state.playlist.songs[prevIndex];
      state.playlist.currentIndex = prevIndex;
      state.currentSong = prevSong;
      state.play = true;
      
      // Cập nhật cho tương thích
      state.imageSong = prevSong.imageUrl;
      state.titleSong = prevSong.title;
      state.artistSong = prevSong.artist;
      state.mediaUrlSong = prevSong.mediaUrl;
    },
    
    // Toggle play/pause
    toggleePlay: (state, action: PayloadAction<boolean>) => {
            state.play = action.payload;
    },
    
    // Thay đổi chế độ lặp
    toggleRepeatMode: (state) => {
      const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
      const currentIndex = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(currentIndex + 1) % modes.length];
    },
    
    // Bật/tắt phát ngẫu nhiên
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
      
      if (state.shuffle && state.playlist) {
        // Xáo trộn playlist
        const shuffled = [...state.playlist.songs];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        state.playlist.songs = shuffled;
        state.playlist.currentIndex = shuffled.findIndex(
          song => song.id === state.currentSong?.id
        );
      }
    },
    
    // Giữ nguyên action cũ để tương thích
    setAudio: (state, action: PayloadAction<{
      play: boolean;
      id : string;
      imageSong: string;
      titleSong: string;
      artistSong: string;
      mediaUrlSong: string;
    }>) => {
      state.play = action.payload.play;
      state.imageSong = action.payload.imageSong;
      state.id = action.payload.id;
      state.titleSong = action.payload.titleSong;
      state.artistSong = action.payload.artistSong;
      state.mediaUrlSong = action.payload.mediaUrlSong;
      
      // Cập nhật currentSong nếu cần
      state.currentSong = {
        id: action.payload.id, // hoặc generate ID tạm
        imageUrl: action.payload.imageSong,
        title: action.payload.titleSong,
        artist: action.payload.artistSong,
        mediaUrl: action.payload.mediaUrlSong
      };
    },
    
    // Giữ nguyên action cũ để tương thích
    clearAudio: (state) => {
      state.play = false;
      state.currentSong = null;
      state.playlist = null;
      state.imageSong = '';
      state.titleSong = '';
      state.artistSong = '';
      state.mediaUrlSong = '';
    }
  },
});

export const { 
  playSingleSong,
  setPlaylist,
  playNextSong,
  playPreviousSong,
  toggleePlay,
  toggleRepeatMode,
  toggleShuffle,
  setAudio,
  clearAudio
} = audioSlice.actions;

export default audioSlice.reducer;