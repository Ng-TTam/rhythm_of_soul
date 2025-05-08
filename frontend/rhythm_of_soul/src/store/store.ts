import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from '../reducers/tokenReducer';

const store = configureStore({
    reducer: {
            
            token: tokenReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;