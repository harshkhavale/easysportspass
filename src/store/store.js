import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './authSlice';
import generalReducer from './generalSlice';
import tableReducer from './slices/table-slice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'],
};

const generalPersistConfig = {
  key: 'general',
  storage,
  whitelist: ['countries', 'states', 'cities', 'plans', 'selectedPlan', 'activeSection'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedGeneralReducer = persistReducer(generalPersistConfig, generalReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    general: persistedGeneralReducer,
    table: tableReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
