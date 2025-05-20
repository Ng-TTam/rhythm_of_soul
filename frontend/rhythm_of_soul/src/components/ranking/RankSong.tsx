import { useState } from 'react';
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";
import { FaPlay } from "@react-icons/all-files/fa/FaPlay";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// Define TypeScript interfaces
interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  cover: string;
  rank: number;
  rankChange: number | null;
  isNew?: boolean;
}

interface ChartData {
  name: string;
  time: string;
  song1: number;
  song2: number;
}

interface ChartCategory {
  name: string;
  songs: Song[];
}

// Mock data for the chart
const chartData: ChartData[] = [
  { name: "00:00", time: "00:00", song1: 30, song2: 20 },
  { name: "02:00", time: "02:00", song1: 25, song2: 18 },
  { name: "04:00", time: "04:00", song1: 40, song2: 28 },
  { name: "06:00", time: "06:00", song1: 35, song2: 30 },
  { name: "08:00", time: "08:00", song1: 55, song2: 40 },
  { name: "10:00", time: "10:00", song1: 60, song2: 45 },
  { name: "12:00", time: "12:00", song1: 50, song2: 48 },
  { name: "14:00", time: "14:00", song1: 55, song2: 50 },
  { name: "16:00", time: "16:00", song1: 50, song2: 48 },
  { name: "18:00", time: "18:00", song1: 55, song2: 52 },
  { name: "20:00", time: "20:00", song1: 60, song2: 50 },
  { name: "22:00", time: "22:00", song1: 55, song2: 48 },
];

// Mock data for Vietnamese songs
const vnSongs: Song[] = [
  { id: 1, title: "Phim Ba Người", artist: "Nguyên Vũ", duration: "05:18", cover: "/assets/images/default/cover.png", rank: 1, rankChange: 1 },
  { id: 2, title: "Cay", artist: "Khắc Hưng, Jimmii Nguyễn", duration: "03:35", cover: "/assets/images/default/cover.png", rank: 2, rankChange: -1 },
  { id: 3, title: "Kỷ Sỉ Vả Anh Sao", artist: "Đông Nhi", duration: "03:27", cover: "/assets/images/default/cover.png", rank: 3, rankChange: 3 },
  { id: 4, title: "Bắc Bling (Bắc Ninh)", artist: "Hòa Minzy ft. Xuân Hiếu, Tuấn Cry, Masew", duration: "04:05", cover: "/assets/images/default/cover.png", rank: 4, rankChange: -1 },
  { id: 5, title: "Mất Kết Nối", artist: "Dương Domic", duration: "03:27", cover: "/assets/images/default/cover.png", rank: 5, rankChange: 1 }
];

// Mock data for US-UK songs
const usukSongs: Song[] = [
  { id: 1, title: "Luther", artist: "Kendrick Lamar, SZA", duration: "02:58", cover: "/assets/images/default/cover.png", rank: 1, rankChange: null, isNew: true },
  { id: 2, title: "Die With A Smile", artist: "Lady Gaga, Bruno Mars", duration: "04:12", cover: "/assets/images/default/cover.png", rank: 2, rankChange: null, isNew: true },
  { id: 3, title: "A Bar Song (Tipsy)", artist: "Shaboozey", duration: "02:31", cover: "/assets/images/default/cover.png", rank: 3, rankChange: null },
  { id: 4, title: "Pink Pony Club", artist: "Chappell Roan", duration: "04:18", cover: "/assets/images/default/cover.png", rank: 4, rankChange: null, isNew: true },
  { id: 5, title: "I'm The Problem", artist: "Morgan Wallen", duration: "03:38", cover: "/assets/images/default/cover.png", rank: 5, rankChange: null, isNew: true }
];

// Mock data for K-Pop songs
const kpopSongs: Song[] = [
  { id: 1, title: "Like JENNIE", artist: "JENNIE", duration: "02:04", cover: "/assets/images/default/cover.png", rank: 1, rankChange: null, isNew: true },
  { id: 2, title: "Drowning", artist: "WOODZ", duration: "04:05", cover: "/assets/images/default/cover.png", rank: 2, rankChange: null },
  { id: 3, title: "Don't you know(PROD.ROCOBERRY)", artist: "IZ*ONE", duration: "05:02", cover: "/assets/images/default/cover.png", rank: 3, rankChange: null },
  { id: 4, title: "To Reach You", artist: "Y2K", duration: "02:38", cover: "/assets/images/default/cover.png", rank: 4, rankChange: null },
  { id: 5, title: "I'm Firefly", artist: "Hwang Karam", duration: "03:35", cover: "/assets/images/default/cover.png", rank: 5, rankChange: 1 }
];

// Mock data for top 100 songs
const top100Songs: Song[] = [
  ...vnSongs,
  { id: 6, title: "Mắt Kết Nối", artist: "Dương Domic", duration: "03:27", cover: "/assets/images/default/cover.png", rank: 6, rankChange: 1 },
  { id: 7, title: "Anh Mãi Biết Cuối", artist: "Dương Hồng Minh(D), Trịng Duy Tân", duration: "02:48", cover: "/assets/images/default/cover.png", rank: 7, rankChange: -2 },
  { id: 8, title: "Đã Đừng", artist: "Hoàng Dũng", duration: "04:51", cover: "/assets/images/default/cover.png", rank: 8, rankChange: 0 },
  { id: 9, title: "Thôi Thế Thôi Thôi", artist: "Nguyễn Vũ", duration: "03:46", cover: "/assets/images/default/cover.png", rank: 9, rankChange: 0 },
  { id: 10, title: "Phép Màu (From Đất Cú Gà Original Soundtrack)", artist: "MAYDAYS, Minh Tốc & Lam", duration: "04:27", cover: "/assets/images/default/cover.png", rank: 10, rankChange: 0 }
];

// Chart categories
const chartCategories: ChartCategory[] = [
  { name: "Việt Nam", songs: vnSongs },
  { name: "US-UK", songs: usukSongs },
  { name: "K-Pop", songs: kpopSongs }
];

// Active song indicator for the chart
const CustomizedDot = (props: any) => {
  const { cx, cy, index } = props;
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4} 
      fill={index === 6 ? "#1ed760" : "#fff"} 
      stroke={index === 6 ? "#1ed760" : "#ff4b4a"} 
      strokeWidth={2}
    />
  );
};

const ChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded text-xs">
        <p className="font-semibold">{payload[0].payload.time}</p>
        <p className="text-red-400">Song 1: {payload[0].value}</p>
        <p className="text-blue-400">Song 2: {payload[1].value}</p>
      </div>
    );
  }
  return null;
};

// Components
const Chart = () => {
  const [activeSong, setActiveSong] = useState("Cay");
  
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-orange-500">#ZingChart</h2>
        <button className="bg-transparent border border-gray-600 rounded-full p-1">
          <FaPlay size={16} className="text-white" />
        </button>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis hide={true} />
            <Tooltip content={<ChartTooltip />} />
            <Line 
              type="monotone" 
              dataKey="song1" 
              stroke="#ff4b4a" 
              strokeWidth={2} 
              dot={<CustomizedDot />} 
              activeDot={{ r: 6, fill: "#ff4b4a" }} 
            />
            <Line 
              type="monotone" 
              dataKey="song2" 
              stroke="#4b9eff" 
              strokeWidth={2} 
              dot={false} 
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-gray-800 p-2 rounded-lg flex items-center mt-4 w-max">
        <img src="/api/placeholder/32/32" alt="Song cover" className="rounded mr-2" />
        <div>
          <p className="font-semibold">{activeSong}</p>
          <p className="text-gray-400 text-xs">Khắc Hưng, Jimmii Nguyễn</p>
        </div>
        <span className="ml-4 text-gray-400">26%</span>
      </div>
    </div>
  );
};

const SongRow = ({ song }: { song: Song }) => {
  return (
    <div className="flex items-center p-2 hover:bg-gray-800 rounded-md group">
      <div className="w-8 text-center text-gray-400">
        <span>{song.rank}</span>
      </div>
      <div className="w-6 text-center text-xs">
        {song.rankChange !== null && (
          <span className={song.rankChange > 0 ? "text-green-500" : song.rankChange < 0 ? "text-red-500" : "text-gray-500"}>
            {song.rankChange > 0 ? "▲" : song.rankChange < 0 ? "▼" : "–"}
            {song.rankChange !== 0 && Math.abs(song.rankChange)}
          </span>
        )}
        {song.isNew && <span className="text-yellow-500">NEW</span>}
      </div>
      <div className="relative mr-3">
        <img src={song.cover} alt={song.title} className="w-10 h-10 rounded" />
        <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center rounded">
          <FaPlay size={16} className="text-white" />
        </div>
      </div>
      <div className="flex-1">
        <p className="font-medium text-white">{song.title}</p>
        <p className="text-xs text-gray-400">{song.artist}</p>
      </div>
      <div className="text-right text-xs text-gray-400 w-12">
        {song.duration}
      </div>
    </div>
  );
};

const SongList = ({ songs, showViewMore = false }: { songs: Song[], showViewMore?: boolean }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      {songs.map(song => (
        <SongRow key={song.id} song={song} />
      ))}
      
      {showViewMore && (
        <div className="text-center mt-4">
          <button className="bg-gray-800 text-white text-sm rounded-full px-6 py-2">
            Xem top 100
          </button>
        </div>
      )}
    </div>
  );
};

const ChartCategories = ({ categories }: { categories: ChartCategory[] }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg mt-6">
      <h2 className="text-xl font-bold text-white mb-4">Bảng Xếp Hạng Tuần</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">{category.name}</h3>
              <button className="text-gray-400">
                <FaPlay size={16} />
              </button>
            </div>
            
            <div>
              {category.songs.slice(0, 5).map(song => (
                <div key={song.id} className="flex items-center py-2 hover:bg-gray-700 rounded px-2 group">
                  <div className="w-6 text-center text-gray-400 mr-2">
                    <span>{song.rank}</span>
                  </div>
                  <div className="w-4 text-center text-xs mr-2">
                    {song.rankChange !== null && (
                      <span className={song.rankChange > 0 ? "text-green-500" : song.rankChange < 0 ? "text-red-500" : "text-gray-500"}>
                        {song.rankChange > 0 ? "▲" : song.rankChange < 0 ? "▼" : "–"}
                      </span>
                    )}
                    {song.isNew && <span className="text-yellow-500">N</span>}
                  </div>
                  <div className="relative mr-2">
                    <img src={song.cover} alt={song.title} className="w-8 h-8 rounded" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center rounded">
                      <FaPlay size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm truncate">{song.title}</p>
                    <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                  </div>
                  <div className="text-right text-xs text-gray-400 w-10">
                    {song.duration}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4">
              <button className="bg-gray-700 text-white text-xs rounded-full px-4 py-1">
                Xem tất cả
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component
export default function ZingChart() {
  const [activeTab, setActiveTab] = useState("realtime");
  
  return (
    <div className="bg-gray-950 min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b border-gray-800 pb-4">
          <div className="flex space-x-8">
            <button 
              className={`pb-4 ${activeTab === 'realtime' ? 'text-white border-b-2 border-orange-500 font-bold' : 'text-gray-400'}`}
              onClick={() => setActiveTab('realtime')}
            >
              Realtime
            </button>
            <button 
              className={`pb-4 ${activeTab === 'weekly' ? 'text-white border-b-2 border-orange-500 font-bold' : 'text-gray-400'}`}
              onClick={() => setActiveTab('weekly')}
            >
              Tuần
            </button>
            <button 
              className={`pb-4 ${activeTab === 'daily' ? 'text-white border-b-2 border-orange-500 font-bold' : 'text-gray-400'}`}
              onClick={() => setActiveTab('daily')}
            >
              Ngày
            </button>
          </div>
        </div>
        
        {activeTab === 'realtime' && (
          <>
            <Chart />
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  BIGTEAM BIGDREAM
                </h2>
                <button className="text-gray-400 flex items-center">
                  <span>Tất cả</span>
                  <FaChevronRight size={16} />
                </button>
              </div>
              <SongList songs={top100Songs} showViewMore={true} />
            </div>
          </>
        )}
        
        {activeTab === 'weekly' && (
          <ChartCategories categories={chartCategories} />
        )}
        
        {activeTab === 'daily' && (
          <div className="text-center py-12">
            <p>Bảng xếp hạng ngày sẽ được cập nhật vào cuối ngày</p>
          </div>
        )}
      </div>
    </div>
  );
}