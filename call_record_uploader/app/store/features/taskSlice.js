/** Task模块切片 */
import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  // 切片名称
  name: 'task',
  // 切片初始状态
  initialState: {
    taskList: null,
  },
  // 编写不同业务逻辑下，对公共状态的更改
  reducers: {
    setAllTaskList(state, action) {
      // state: redux中的公共状态 [基于immer管理,无需自己克隆]
      // action: 派发的行为对象,无需考虑行为标识问题,传递的其他信息,都需要在
      // action.payload 传递进来的值
      state.taskList = action.payload;
    },
    removeTask(state, { payload }) {
      let taskList = state.taskList;
      if (!Array.isArray(taskList)) return;

      state.taskList = taskList.filter(item => {
        return +item.id !== +payload;
      });
    }
  }
});
// 从切片中获取actionCreator,和reduces中的同名函数不是一个东西
// setAllTaskList([])   =>   { type: 'task/setAllTaskList', payload: []}
export const { setAllTaskList, removeTask } = taskSlice.actions;

// 从切片中获取reducer
export default taskSlice.reducer;