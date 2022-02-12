import {configureStore, ThunkAction, Action, combineReducers} from '@reduxjs/toolkit';
import { reducer as rootNodes } from '../components/rootNode';
import { reducer as nodes } from '../components/node'

const rootReducer = combineReducers({
  rootNodes,
  nodes,
})

export const store = configureStore({
  reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
