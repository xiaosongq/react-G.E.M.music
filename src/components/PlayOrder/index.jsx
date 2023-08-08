import React, { useState } from 'react'
import style from './index.module.css'
import {  useSelector, useDispatch } from 'react-redux';

import { playStateAction } from '@/store/action';

export default function PlayOrder() {
  let order = useSelector(state => state.playState);
  let [select, setSelect] = useState(order);

  let dispatch = useDispatch();
  // 点击切换播放形式的函数
  function changeOrder(e) {
    // 让当前点击的播放形式高亮
    setSelect(e.target.dataset.id)
    // 设置给全局变量
    dispatch(playStateAction(e.target.dataset.id));
  }

  return (
    <div className={style['playorder']}>
    <div data-id='循环' onClick={changeOrder} style={{color: select === '循环' ? 'red' : ''}}>
      <i data-id='循环' className='iconfont icon-xunhuan'></i><br />
      循环
    </div>
    <div data-id='顺序' onClick={changeOrder} style={{color: select === '顺序' ? 'red' : ''}}>
      <i data-id='顺序' className='iconfont icon-sequence'></i><br />
      顺序
    </div>
    <div data-id='重复' onClick={changeOrder} style={{color: select === '重复' ? 'red' : ''}}>
      <i data-id='重复' className='iconfont icon-zhongfu'></i><br />
      重复
    </div>
  </div>
  )
}