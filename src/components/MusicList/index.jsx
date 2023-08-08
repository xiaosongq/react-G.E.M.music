import React, { useEffect, useState, useMemo } from 'react'
import musicList from '@/assets/music/music-list.json'
import style from './index.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { changeMusicAction, yesRotateAction } from '@/store/action'

export default function MusicList() {
  let checkMusic = useSelector(state => state.checkMusic);
  let rotate = useSelector(state => state.ifRotate);

  let dispatch = useDispatch();

  let [state, setState] = useState(checkMusic);
  useEffect(() => {
    console.log(checkMusic)
    setState(checkMusic)
  }, [checkMusic])

  // 切换歌名执行的函数
  function change(e) {
      // 所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
    let timer;
    if (timer) {
      clearTimeout(timer);
  }
  // 防止切换速度过快导致一些不可控 bug
  timer = setTimeout(() => {
    dispatch(changeMusicAction(e.target.dataset.name))
    dispatch(yesRotateAction());
  }, 100);

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
