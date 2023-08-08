import React from 'react'
import './App.css'
import PlayOrder from './components/PlayOrder';
import MusicList from './components/MusicList';
import Lyric from './components/Lyric';
import AudioPlayer from './components/AudioPlayer';
import { useSelector } from 'react-redux';



export default function App() {
  let checkMusic = useSelector(state => state.checkMusic);
  return (
      <div className='container'>
        {/* 背景 */}
        <img src={require(`@/assets/music/${checkMusic}.jpg`)} className="bjimg" alt={checkMusic}/>
        <div className='filter'>
        <div className='bg'>
          <div className='left'>
            <PlayOrder></PlayOrder>
            <MusicList></MusicList>
          </div>
          <div className='right'>
            <Lyric></Lyric>
            <AudioPlayer></AudioPlayer>
          </div>
        </div>
        </div>
      </div>
    )
  }
