import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import { AuthRoute } from "./util/AuthRoute";
// import ProtectedRoutes from "./util/ProtectedRoutes";

import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Route exact path="/" component={Home} />
        <AuthRoute exact path="/login" component={Login} />
        <AuthRoute exact path="/register" component={Register} />
      </Router>
    </AuthProvider>
  );
}

export default App;
