import { rotateTyle } from './const'

// 控制专辑封面旋转or停止
export function ifRotate(state=false /* 指定初始值 */, action) {
  switch (action.type) {
    case rotateTyle.yes:
      return true;
    case rotateTyle.no:
      return false;
    default:
      return state;
  }
}


// 控制选中歌曲
export function checkMusic(state='少年与海' /* 指定初始值 */, action) {
  switch (action.type) {
    case 'CHANGEMUSIC':
      return state = action.data;
    default:
      return state;
  }
}

// 当前播放时长
export function musicCurrentTime(state='00:00' /* 指定初始值 */, action) {
  switch (action.type) {
    case 'CREENTTIME':
      return action.data;
    default:
      return state;
  }
}

// 播放状态
export function playState(state='循环' /* 指定初始值 */, action) {
  switch (action.type) {
    case 'LOOP':
      return state = action.data;
    default:
      return state;
  }
}

// 播放器当前秒时间
export function player(state=0 /* 指定初始值 */, action) {
  switch (action.type) {
    case 'OBJ':
      return state = action.data;
    default:
      return state;
  }
}

// 监控歌词点击时间点
export function selectIrc(state={s: 0, str: '00:00'} /* 指定初始值 */, action) {
  switch (action.type) {
    case 'OK':
      return state = action.data;
    default:
      return state;
  }
}