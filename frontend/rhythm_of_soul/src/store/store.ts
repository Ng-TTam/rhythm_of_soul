import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from '../reducers/tokenReducer';
import audioReducer from '../reducers/audioReducer';
import userReducer from '../reducers/userReducer';

const store = configureStore({
    reducer: {
            user: userReducer,
            token: tokenReducer,
            audio: audioReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;