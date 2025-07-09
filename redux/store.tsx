// src/redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import carouselReducer from "./slices/carouselSlice";
import aboutUsReducer from "./slices/aboutUsSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
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
import signatureReducer from './slices/signatureSlice';


const rootReducer = combineReducers({
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

const rootPersistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
    .concat(boardsApi.middleware)
    .concat(usersApi.middleware)
      .concat(groupsApi.middleware)
      .concat(listsApi.middleware)
      .concat(cardsApi.middleware)
      .concat(tasksApi.middleware)
      .concat(blogApi.middleware,
        testimonialsApi.middleware,
        aboutUsApi.middleware, 
        servicesApi.middleware), // <-- ADD THIS LINE
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
