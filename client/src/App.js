import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import { AuthRoute, AuthRoute2 } from "./util/AuthRoute"; //2 IF REGISTERED THEN DESIRED LOC ELSE HOME

import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateGroup from "./pages/CreateGroup";
import Groups from "./pages/Groups";
import Group from "./pages/Group";
import Explore from "./pages/Explore";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route exact path="/" component={Home} />
        <AuthRoute exact path="/login" component={Login} />
        <AuthRoute exact path="/register" component={Register} />
        <AuthRoute2 exact path="/creategroup" component={CreateGroup} />
        <AuthRoute2 exact path="/groups" component={Groups} />
        <AuthRoute2 exact path="/groups/:groupId" component={Group} />
        <AuthRoute2 exact path="/explore" component={Explore} />
      </Router>
    </AuthProvider>
  );
}

export default App;
