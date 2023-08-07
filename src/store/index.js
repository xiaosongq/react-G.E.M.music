// configureStore 这个方法用来创建全局状态管理者 store
import { configureStore } from '@reduxjs/toolkit'

// 导入所有的仓库交给全局状态管理者进行状态管理
import * as reducer from './reducers'


// 创建全局状态管理者 并导出
export default configureStore({ reducer })