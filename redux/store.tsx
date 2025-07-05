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

const rootReducer = combineReducers({
  auth: authReducer,
  carousel: carouselReducer,
  aboutUs: aboutUsReducer,
  [servicesApi.reducerPath]: servicesApi.reducer,
  [blogApi.reducerPath]: blogApi.reducer,
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
      .concat(blogApi.middleware, servicesApi.middleware), // <-- ADD THIS LINE
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
