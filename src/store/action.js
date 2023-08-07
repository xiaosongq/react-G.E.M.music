import { rotateTyle } from "./const";

// 定义修改是否旋转的方法
export function yesRotateAction() {
  return {
    type: rotateTyle.yes
  }
}

export function noRotateAction() {
  return {
    type: rotateTyle.no
  }
}

export function changeMusicAction(payload) {
  return {
    type: 'CHANGEMUSIC',
    data: payload
  }
}

// 当前播放时长
export function musicCurrentTimeAction(payload) {
  return {
    type: 'CREENTTIME',
    data: payload
  }
}

// 改变播放方式
export function playStateAction(payload) {
  return {
    type: 'LOOP',
    data: payload
  }
}