import React from 'react'
import './App.css'
import PlayOrder from './components/PlayOrder';
import MusicList from './components/MusicList';
import Lyric from './components/Lyric';
import AudioPlayer from './components/AudioPlayer';
import { connect } from 'react-redux';

function App({checkMusic}) {
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

export default connect(
    // 第一个函数用来将全局状态数据 添加为组件props中
    (state) => { 
      return {
        checkMusic: state.checkMusic
      };
    }
    )(App);