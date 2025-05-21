import "./App.css";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { indexRouter } from "./router/indexRouter";
import { authRouter } from "./router/authRouter";
import { Provider } from "react-redux";
import store from "./store/store";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { getSessionId } from "./utils/tokenManager";
function AppRouter() {
  const routes = useRoutes([...authRouter, indexRouter]);
  return routes;
}
function App() {
  useEffect(() => {
    getSessionId();
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <AppRouter />
      </Router>
    </Provider>
  );
}

export default App;
