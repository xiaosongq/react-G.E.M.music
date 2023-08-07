import React, { useEffect, useState, useMemo } from 'react'
import musicList from '@/assets/music/music-list.json'
import style from './index.module.css'
import { connect } from 'react-redux'
import { noRotateAction, changeMusicAction, yesRotateAction, musicCurrentTimeAction } from '@/store/action'

function MusicList({rotate, checkMusic, changeMusicAction, yesRotateAction, musicCurrentTimeAction}) {
  let [state, setState] = useState(checkMusic);
  useEffect(() => {
    setState(checkMusic)
    musicCurrentTimeAction('00:00');
  }, [checkMusic, musicCurrentTimeAction])

  // 切换歌名执行的函数
  function change(e) {
      // 所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
    let timer;
    if (timer) {
      clearTimeout(timer);
  }
  // 防止切换速度过快导致一些不可控 bug
  timer = setTimeout(() => {
    changeMusicAction(e.target.dataset.name)
    yesRotateAction();
  }, 500);

  }
  // 判断当前播放歌曲开头图标是否旋转
  useMemo(() => {
    setTimeout(() => {
      let i = document.querySelector('.icon-xunhuan1');
      console.log(checkMusic)
      if(i) {
        if(rotate) {
          i.style.animationPlayState = "running";
        } else {
          i.style.animationPlayState = "paused";
        }
      }
    },100)

  }, [rotate, checkMusic])
  return (
    <div className={style['music-list']}>

    <ul>
      {
        musicList.list.map((item,i) => {
          return (<li style={{color: state  === item ? 'red':''}} data-name={item} onClick={change} key={i}>
            <i className={[style.rotate, state === item ? 'iconfont icon-xunhuan1':''].join(' ')}></i>
            {item}
            </li>)
        })
      }
    </ul>
  </div>
  )
}


export default connect(
  // 第一个函数用来将全局状态数据 添加为组件props中
  (state) => { 
    return {
      // 当前播放歌曲名称
      checkMusic: state.checkMusic,
      // 是否旋转
      rotate: state.ifRotate
    };
    },
    (dispatch) => {
      return {
        // 切换歌名
        changeMusicAction: (musicName) => dispatch(changeMusicAction(musicName)),
        // 旋转
        yesRotateAction:() =>  dispatch(yesRotateAction()),
        // 不旋转
        noRotateAction:() =>  dispatch(noRotateAction()),
        // 当前时间字符串形式 00:00
        musicCurrentTimeAction: (time) => dispatch(musicCurrentTimeAction(time))
      }
    }
  )(MusicList);