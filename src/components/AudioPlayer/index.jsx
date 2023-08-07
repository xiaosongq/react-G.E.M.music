import React, { useEffect, useRef, useState } from 'react'
import { Slider, Popover } from 'antd';
import { connect } from 'react-redux'

import { yesRotateAction, noRotateAction, musicCurrentTimeAction, changeMusicAction } from '@/store/action';
import musicList from '@/assets/music/music-list.json';
import './index.css'


function AudioPlayer(props) {
  // 播放rudio原组件
  let player = useRef(null);
  // 总时长播放组件
  let totalTime = useRef(null);
  // 总时长时间戳
  let [totalTimeState, setTotalTimeState] = useState(0);
  // 当前时长显示组件
  let currentTimeShow = useRef(null);
  // 当前时长值
  let [currentTimeState, setTotalcurrentTimeState] = useState(0);

  // 音量控制键
  let volume = useRef(null);
  // 当前播放按钮
  let playerBtn = useRef(null);

  let [state, setState] = useState(props.checkMusic);
  function play(e, key) {
    if(key === '是我点的') {
    if(state === props.checkMusic) {
      // 添加类名为正在播放的状态类名
      playerBtn.current.classList.toggle("plyPlay");
    } else {
      setState(props.checkMusic)
      playerBtn.current.classList.add("plyPlay")
    }
  }
      // 判断是否又正在播放的状态类名，如果有执行播放，反之相反
      if (e.classList.contains("plyPlay")) {
        if(key === '是我点的') {
          // 播放
          player.current.play();
          props.yesRotateAction();
        }
          // 获取总时长秒数
          var seconds = Math.floor(player.current.duration);
          // 秒钟转分钟
          var minutes = Math.floor(seconds / 60);
          // 剩余秒数
          seconds = seconds % 60;
          // 如果大于十前面加0
          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;
          // 赋值给实际显示的DOM元素
          totalTime.current.innerHTML = `${minutes ? minutes : '00'}:${seconds ? seconds : '00'}`;

          // 监听当前目标位置已更改时
          player.current.addEventListener('timeupdate', function () {
            setTotalcurrentTimeState(player.current.currentTime);
            props.playerStateAction(player.current.currentTime);
              // 当前秒钟转分钟
              var min = Math.floor(player.current.currentTime / 60);
              // 当前剩余秒数
              var currentTime = Math.floor(player.current.currentTime % 60);
              // 如果大于十前面加0
              min = min < 10 ? "0" + min : min;
              currentTime = currentTime < 10 ? "0" + currentTime : currentTime;
              // console.log(currentTime)
              // 赋值给实际显示的DOM元素
              currentTimeShow.current.innerHTML = `${min}:${currentTime}/`;
              // 公式：当前秒数 / 总时长秒数 * 100 %
              // progressBtn.current.style.left = Math.floor(player.current.currentTime / player.current.duration * 100) - 2 + "%";
              // progressBar.current.style.width = Math.floor(player.current.currentTime / player.current.duration * 100) + "%";
              props.musicCurrentTimeAction(`${min}:${currentTime}`)
          })

          player.current.addEventListener("ended", (event) => {
            if(props.order === '循环') {
              // 如果是播放方式是循环 loop 重复播放为false
              changeMusic(1, '循环');
              player.current.loop = false;
            } else if (props.order === '顺序') {
              let index = musicList.list.indexOf(props.checkMusic);
              console.log(musicList.list[index + 1])
              // 如果是顺序判断是否是最后一个
              if(musicList.list[index + 1]) {
                changeMusic(1, '顺序');
              } else {
                // 如果是最后一个停止播放
                player.current.currentTime = 0;
                props.musicCurrentTimeAction(`00:00`);
                if(playerBtn.current.classList.contains("plyPlay")) {
                  playerBtn.current.classList.remove("plyPlay")
                }
                player.current.pause();
                props.noRotateAction();
              }
              // 重复播放关闭
              player.current.loop = false;
            } else if (props.order === '重复') {
              // 是重复播放添加loop属性
              player.current.loop = true;
            }
          });
          player.current.addEventListener('seeked', function(){
              // console.log(111);
          })
      } else {
        // 点击停止
          player.current.pause();
          props.noRotateAction();
      }
  }
  // 如果切换歌曲执行的函数
  useEffect(() => {
    // 时间清零
    props.musicCurrentTimeAction(`00:00`);
    if(state === props.checkMusic) {
      // 添加类名为正在播放的状态类名
      // playerBtn.current.classList.toggle("plyPlay");
    } else {
      // 切换为当前歌名
      setState(props.checkMusic)
      // 播放按钮切换图片
      playerBtn.current.classList.add("plyPlay")
      // 执行播放
      play(playerBtn.current)
    }
    // 计算总时长并显示
    const countAudioTime = async () => {
      let audio = document.createElement('audio');
      audio.src = require(`@/assets/music/${props.checkMusic}.flac`)
      audio.autoplay = true;
      while (isNaN(audio.duration) || audio.duration === Infinity) {
        // 延迟一会 不然网页都卡死
        await new Promise(resolve => setTimeout(resolve, 200));
        // 设置随机播放时间，模拟调进度条
        audio.currentTime = 10000000 * Math.random();
        }
        // console.log('音频的总时长:',audio.duration)
        // 获取总时长秒数
        var seconds = Math.floor(audio.duration);
        setTotalTimeState(audio.duration);
        // 秒钟转分钟
        var minutes = Math.floor(seconds / 60);
        // 剩余秒数
        seconds = seconds % 60;
        // 如果大于十前面加0
        var a = minutes < 10 ? "0" + minutes : minutes;
        var b = seconds < 10 ? "0" + seconds : seconds;
        totalTime.current.innerHTML = `${a}:${b}`;

      }
      // 执行总数长函数
      countAudioTime()
  }, [props.checkMusic])

  // 点击上一首或下一首执行的函数
  function changeMusic(num) {
    // 当前时间清零
    player.current.currentTime = 0;
    // 展示时间清零
    props.musicCurrentTimeAction(`00:00`);
    // 专辑封面旋转
    props.yesRotateAction();
    let timer;
    if (!timer) {
      // 防止点击的速度过快而导致一些不可控的问题 bug
        timer = setTimeout(() => {
            timer = null;
            // 查找歌曲当前索引值
            let index = musicList.list.indexOf(props.checkMusic);
            // 如果num 等于 1 为下一首
              if(num === 1) {
                props.changeMusicAction(musicList.list[index + 1] ? musicList.list[index + 1] : musicList.list[0]);
                // 否则为 上一首 固定地方执行，单独用需要再写判断判断值，防止别人乱传值
              } else {
                props.changeMusicAction(musicList.list[index - 1] ? musicList.list[index - 1] : musicList.list[musicList.list.length - 1]);
              }
          }, 500)
        }
  }
  // 监听播放状态 判断播放状态是否为重复的函数
  useEffect(() => {
    if(props.order === '重复') {
      player.current.loop = true;
    } else {
      player.current.loop = false;
    }
  }, [props.order]);


  // 修改进度
  const handleProgressChange = (value)=>{
    // 如果是暂停状态的话直接播放
    if(!props.rotate && !playerBtn.current.classList.contains("plyPlay")) {
      play(playerBtn.current)
    }
    if (player.current) {
      // 变更当前播放进度
      player.current.currentTime = value;
      // 切换进度后全局设置同步变
      props.playerStateAction(player.current.currentTime);
      setTotalcurrentTimeState(player.current.currentTime);

      // 计算当前进度秒，转换为分钟秒的显示形式
        // 获取总时长秒数
        var seconds = Math.floor(value);
        // 秒钟转分钟
        var minutes = Math.floor(seconds / 60);
        // 剩余秒数
        seconds = seconds % 60;
        // 如果大于十前面加0
        var a = minutes < 10 ? "0" + minutes : minutes;
        var b = seconds < 10 ? "0" + seconds : seconds;
      // 同步更改全局设置
      props.musicCurrentTimeAction(`${a}:${b}`);
      // 显示到页面上
      currentTimeShow.current.innerHTML = `${a}:${b}/`;

    }
}
    // 修改音量
    const handleVolumeChange = (value)=>{
      // 如果是静音或播放 切换雪碧图位置 
      if(value <= 0) {
        volume.current.style.backgroundPosition = '-104px -69px';
      } else {
        volume.current.style.backgroundPosition = '-153px -250px';
      }
      if (player.current) {
        player.current.volume = value;
      }
  }

  // 监控点击歌词的进度
  useEffect(() => {
    // 修改为点击歌词的秒时间
    player.current.currentTime = props.selectIrcTime.s;
    setTotalcurrentTimeState(props.selectIrcTime.s);
    currentTimeShow.current.innerHTML = `${props.selectIrcTime.str}/`;

    play(playerBtn.current);
  }, [props.selectIrcTime])

  return (
    
    <div className="play-wrap">
      <audio autoPlay id='player' ref={player} src={require(`@/assets/music/${props.checkMusic}.flac`)}></audio>
      <div className="hand-play">
        <div className="word">
          <span ref={currentTimeShow}>00:00/</span>
          <span ref={totalTime}>00:00</span>
        </div>
        <div className="bottomBar">
        <Slider 
          trackStyle={{backgroundColor: 'red'}}
          railStyle={{backgroundColor: '#191919'}}
          value={props.playerState}
          step={0.1} 
          max={totalTimeState} 
          onChange={handleProgressChange}
        />
        </div>
        <div className="control clearfix">
          <div style={{color: 'transparent'}}>1212</div>
          <div className="btns clearfix">
          <button className="prev" onClick={() => changeMusic(-1)} title="上一首(ctrl+←)">
          </button>
          <button ref={playerBtn} className="ply" onClick={(e) => play(e.target,'是我点的')} title="播放/暂停(p)"></button>
          <button className="next" onClick={() => changeMusic(1)}></button>
          </div>
            <Popover trigger="hover" content={ 
              <div style={{height: '100px'}}>
                <Slider 
                  vertical 
                  trackStyle={{backgroundColor: 'red'}}
                  step={0.1} 
                  max={1} 
                  defaultValue={0.5} 
                  onChange={handleVolumeChange} />
              </div> 
              }>
        <div className='volume' ref={volume}>
          </div>
          </Popover>

        </div>
      </div>
    </div>


  )
}

export default connect(
  // 第一个函数用来将全局状态数据 添加为组件props中
  (state) => { 
    return {
      // 当前旋转状态
      rotate: state.ifRotate,
      // 切换歌曲名称
      checkMusic: state.checkMusic,
      // 播放状态变量
      order: state.playState,
      // 当前播放秒
      playerState: state.player,
      // 当前时间字符串形式 00:00
      musicCurrentTime: state.musicCurrentTime,
      // 当前点击歌词时间
      selectIrcTime: state.selectIrc
    };
   }, // 这个函数一旦书写 必须返回一个对象
  (dispatch) => { 
    return {
      // 播放旋转
      yesRotateAction:() =>  dispatch(yesRotateAction()),
      // 不旋转
      noRotateAction:() =>  dispatch(noRotateAction()),
      // 切换歌名
      changeMusicAction: (musicName) => dispatch(changeMusicAction(musicName)),
      // 当前时间字符串形式 00:00
      musicCurrentTimeAction: (time) => dispatch(musicCurrentTimeAction(time)),
      // 当前秒时间
      playerStateAction: (obj) => dispatch({type: 'OBJ', data: obj})
    };
   } // 这个函数一旦书写 必须返回一个对象
  )(AudioPlayer);