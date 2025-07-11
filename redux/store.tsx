// src/redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

// Import all your slices
import authReducer from "./slices/authSlice";
import carouselReducer from "./slices/carouselSlice";
import aboutUsReducer from "./slices/aboutUsSlice";
import signatureReducer from "./slices/signatureSlice";

// Import all your RTK Query APIs
import { blogApi } from "./services/blogApi";
import { servicesApi } from "./services/servicesApi";
import { testimonialsApi } from './services/testimonialsApi';
import { aboutUsApi } from "@/redux/services/aboutUsApi";
import { boardsApi } from './services/boardsApi';
import { listsApi } from './services/listsApi';
import { cardsApi } from './services/cardsApi';
import { tasksApi } from './services/tasksApi';
import { usersApi } from "./services/usersApi";
import { groupsApi } from "./services/groupsApi";

// 1. First: Standard combineReducers for all slices/APIs
const appReducer = combineReducers({
  auth: authReducer,
  carousel: carouselReducer,
  aboutUs: aboutUsReducer,
  signature: signatureReducer,
  [groupsApi.reducerPath]: groupsApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [boardsApi.reducerPath]: boardsApi.reducer,
  [listsApi.reducerPath]: listsApi.reducer,
  [cardsApi.reducerPath]: cardsApi.reducer,
  [tasksApi.reducerPath]: tasksApi.reducer,
  [aboutUsApi.reducerPath]: aboutUsApi.reducer,
  [servicesApi.reducerPath]: servicesApi.reducer,
  [blogApi.reducerPath]: blogApi.reducer,
  [testimonialsApi.reducerPath]: testimonialsApi.reducer,
});

// 2. Now: Root reducer that listens for RESET_APP action
const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_APP") {
    // This clears ALL state in Redux (including persisted).
    state = undefined;
  }
  return appReducer(state, action);
};

// 3. Redux Persist config
const rootPersistConfig = {
  key: "root",
  storage,
  // Optionally, blacklist/whitelist specific reducers here:
  // blacklist: [], whitelist: [],
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

// 4. Create your store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // RTK Query + redux-persist friendly
    })
      .concat(boardsApi.middleware)
      .concat(usersApi.middleware)
      .concat(groupsApi.middleware)
      .concat(listsApi.middleware)
      .concat(cardsApi.middleware)
      .concat(tasksApi.middleware)
      .concat(
        blogApi.middleware,
        testimonialsApi.middleware,
        aboutUsApi.middleware,
        servicesApi.middleware
      ),
});

// 5. Persistor for purge/reset
export const persistor = persistStore(store);

// 6. Typed hooks for components
export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
