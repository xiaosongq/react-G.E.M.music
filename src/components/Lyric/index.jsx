import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import style from './index.module.css'
import { musicCurrentTimeAction } from '@/store/action'

export default function Lyric() {
  // 是否旋转
  let rotate = useSelector(state => state.ifRotate);
  // 选中歌名
  let checkMusic = useSelector(state => state.checkMusic);
  // musicCurrentTime 字符串形式
  let musicCurrentTime = useSelector(state => state.musicCurrentTime)
  // 播放方式
  let order = useSelector(state => state.playState);
  // 秒时间
  let playerState = useSelector(state => state.player);

  let dispatch = useDispatch();

  let [currentLyric, setCurrentLyric] = useState([]);
  // 是否自动播放
  let [autoScroll, setAutoScroll] = useState(true);
  // 滚动的位置变量
  let [scroll, setScroll] = useState(0);
  let ulScroll = useRef(null);
  let divScroll = useRef(null);
  let rotateNeedle = useRef(null);
  // 当前歌词行
  let [line, setLine] = useState(-1);
  var lyricsItems = document.querySelectorAll('#geci li');
  // 拿到歌词高度
  let [lyricHeight, setLyricHeight] = useState(46);

  // playerState
  useEffect(() => {
    if(playerState === 0) {
      setScroll(0);
    }
  }, [playerState])

  // 切换歌名执行的初始化函数
  useEffect(() => {
    // 请求歌词
      (async () => {
        let temp = await axios.get(require(`@/assets/music/${checkMusic}.lrc`));
        setCurrentLyric(parseLyric(temp.data).lrc);
      })();
      // 将当前行设置为第一行 0
    setLine(-1);
    // 将当前滚动高度设置为 0
    setScroll(0);
    // 当前歌曲播放进度
    dispatch(musicCurrentTimeAction('00:00'));
    // 歌词容器高度
    ulScroll.current.style.transform = `translateY(0px)`

  }, [checkMusic]);

  // 判断每秒进度是否和其中一行歌词时间匹配 匹配的话歌词高亮 并滚动 时间精确到秒
  useEffect(() => {
    if(lyricsItems.length) {
      setLyricHeight(lyricsItems[1].offsetHeight)
    }
    // 如果播放方式为重复
    if(order === '重复' || musicCurrentTime === '00:00') {
      setLine(-1);
    }
    // 定义歌词时间数组
    let arr = [];
    for (let i = 0; i < lyricsItems.length; i++) {
      arr.push(lyricsItems[i].dataset.time?.split(':').join('') *1)
      // 如果没有等于当前歌词行，就查找最近的时间点 歌词高亮
      if (lyricsItems[i].dataset.time?.split(':').join('') *1 === musicCurrentTime?.split(':').join('')* 1) {

          setLine(i);
          // 是否开启自动滚动，如果开启直接设置当前高度
          if(autoScroll) {
            setScroll(i);
          }
        break;
      } else {
        arr.sort((a, b) => a - b);
        // 找到最接近且较小的值
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i] < musicCurrentTime?.split(':').join('')* 1) {
            setLine(i);
            if(autoScroll) {
              setScroll(i);
            }
            break;
          }
        }
      }
    }
  
  // setscrollHeight(((currentLyric.length - 9) / window.parseInt(window.getComputedStyle(ulScroll.current).height) * 100).toFixed(2));
  }, [musicCurrentTime, order, lyricsItems, autoScroll, scroll])

  // 获取封面
  let rotateCover = useRef(null);
  
  // 监控旋转 是否暂停 还是旋转
  useMemo(() => {
    if(rotateCover.current) {
      if(rotate) {
        rotateCover.current.style.animationPlayState = "running";
        rotateNeedle.current.style.transform = "rotateZ(0deg)";
        
      } else {
        rotateCover.current.style.animationPlayState = "paused";
        rotateNeedle.current.style.transform = "rotateZ(-25deg)";
      }
    }

  }, [rotate])

  // 处理歌词数据 将时间转化为对象 歌词单独显示
  function parseLyric(lyric) {
    const lrcObj = {
      ti: "",
      ar: "",
      al: "",
      by: "",
      lrc: [],
    };
  
    /*
      [ar:艺人名]
      [ti:曲名]
      [al:专辑名]
      [by:编者（指编辑LRC歌词的人）]
      [offset:时间补偿值] 其单位是毫秒，正值表示整体提前，负值相反。这是用于总体调整显示快慢的。
    */
  
    const lrcArr = lyric
      .split("\n")
      .filter(function (value) {
        // 1.通过回车去分割歌词每一行,遍历数组，去除空行空格
        return value.trim() !== "";
      })
      .map(function (value) {
        // 2.解析歌词
        // console.log(value.trim())
        const line = parseLyricLine(value.trim());
        if (line.type === "lyric") {
          lrcObj.lrc.push(line.data);
        } else {
          lrcObj[line.type] = line.data;
        }
        return value.trim();
      });
  
    function parseLyricLine(line) {
      const tiArAlByExp = /^\[(ti|ar|al|by):(.*)\]$/;
      const lyricExp = /^\[(\d{2}):(\d{2}).(\d{0,3})\](.*)/;
      let result;
      if ((result = line.match(tiArAlByExp)) !== null) {
        return {
          type: result[1],
          data: result[2],
        };
      } else if ((result = line.match(lyricExp)) !== null) {
        return {
          type: "lyric",
          data: {
            time: {
              m: result[1],
              s: result[2],
              ms: result[3],
            },
            lyric: result[4].trim(),
          },
        };
      }
    }
    return lrcObj;
  }

  
      // 监听滚轮滚动事件
      useEffect(()=>{
        let timer = null;
        function wheel (e){
          // 将自动滚动关闭
          setAutoScroll(false);
          
      if(timer) {
        clearTimeout(timer);
      }
      // e.deltaY 整数为向上滚动 负数为向下滚动
      if(e.deltaY < 0) {
        // 限制滚动位置 避免滚出准确位置
        if(`-${scroll * lyricHeight}` < 0) {
          // setScroll(++scroll);
          ulScroll.current.style.transform = `translateY(-${--scroll * lyricHeight}px)`
        }
      } else {

        if(((scroll * lyricHeight === 0 ? scroll * lyricHeight : Number(`-${scroll * lyricHeight}`)) >= Number(`-${window.parseInt(window.getComputedStyle(ulScroll.current).height)}`))) {
            ulScroll.current.style.transform = `translateY(-${++scroll * lyricHeight}px)`
          
        }
      }
      // 手动滚动无操作4秒后再次切换为自动滚动
      timer = setTimeout(() => {
        setAutoScroll(true);
        // 将当前滚动位置设置为当前时间行
        setScroll(line);
        ulScroll.current.style.transform = `translateY(-${line * lyricHeight}px)`
      }, 4000);
    }
    // 如果为addEventlistener 每次都会添加一个事件 如果函数只让它进来的时候执行一次，
    // wheel 函数内的变量永远保持第一次执行时的值，后面变量更改不会变，每次都找的第一次执行的值，因为这个
    // 函数就在第一次执行了。所以每次滚动都要执行一次，绑定的事件都要替换一次，会有性能方面的问题，但个人实力有限
    divScroll.current.onmousewheel = wheel
    return () => {
        divScroll.current.onmousewheel = null;
        clearTimeout(timer);
    }
},[scroll, autoScroll])



    // 点击歌词 切换播放进度 以及滚动的高度 当前行 时间秒以及时间字符串形式 00:00 设置全局设置
    function clickLrc(item, i) {
        setAutoScroll(false);
        setLine(i);
        dispatch({type: 'OBJ', data:(item.time.m * 60) + item.time.s * 1});
        dispatch(musicCurrentTimeAction(`${item.time.m}:${item.time.s}`));
        dispatch({type: 'OK', data: {s: (item.time.m * 60) + item.time.s * 1, str: `${item.time.m}:${item.time.s}`}});
        // 切换为自动滚动
        setTimeout(() => setAutoScroll(true), 200);
      
    }
    
  return (
    <div id='geci' ref={divScroll} className={style['lyric-content']}>
        <div>
          <ul ref={ulScroll} style={{transform: `translateY(-${(scroll * lyricHeight)}px)`}}>
          {
            currentLyric.map((item, i) => {
              return <li 
              onClick={() => clickLrc(item, i)}

              className={line === i ? style.highlight : ''}
              key={i} 
              data-time={`${item.time.m}:${item.time.s}`}>{item.lyric ? item.lyric: '-------------'}</li>

            })
          }
          </ul>
        </div>

        <aside className={style.record}>
        <div ref={rotateNeedle} className={style.needle}></div>
        <div ref={rotateCover} className={style.quan}>
          <div style={{backgroundImage: (`url(${encodeURI(require(`@/assets/music/${checkMusic}.jpg`))})`)}} className={style['album-art']}>

          </div>
        </div>
        </aside>

    </div>
  )
}
