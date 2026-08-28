import { BrowserRouter, Routes, Route } from "react-router";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import {Toaster} from 'sonner';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useEffect } from "react";

import { useThemeStore } from "./stores/useThemeStore";

function App() {
  const {isDark, setTheme} = useThemeStore();

  useEffect(() => {
    setTheme(isDark);
  },[isDark]);

  return <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>

        <Route
          path = "/signin"
          element = {<SignInPage />}
        />

        <Route
          path = "/signup"
          element = {<SignUpPage />}
        />
        

        <Route 
        element = {<ProtectedRoute/>}>
          <Route
            path = "/chat"
            element = {<ChatAppPage />}
          />
        </Route>

        </Routes>
      </BrowserRouter>
  </>;
}

export default App
