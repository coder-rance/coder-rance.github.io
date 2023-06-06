import { configureStore } from '@reduxjs/toolkit';
import taskSliceReducer from './features/taskSlice';

const store = configureStore({
  // 指定reducer
  reducer: {
    // 按模块管理各个切片
    task: taskSliceReducer
  },
  // 使用中间件 默认集成reduxThunk
  // middleware: []
});

export default store;