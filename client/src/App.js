import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import { AuthRoute, AuthRoute2 } from "./util/AuthRoute";

import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateGroup from "./components/CreateGroup";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Route exact path="/" component={Home} />
        <AuthRoute exact path="/login" component={Login} />
        <AuthRoute exact path="/register" component={Register} />
        <AuthRoute2 exact path="/creategroup" component={CreateGroup} />
      </Router>
    </AuthProvider>
  );
}

export default App;
