import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import carouselReducer from './slices/carouselSlice';
import aboutUsReducer from './slices/aboutUsSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

const rootReducer = combineReducers({
  auth: authReducer,
  carousel: carouselReducer,
  aboutUs: aboutUsReducer,
});

const rootPersistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// ----- THIS IS THE IMPORTANT PART -----
export type RootState = ReturnType<typeof rootReducer>;
// --------------------------------------

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
