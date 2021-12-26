import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SingleProjectView from "./components/SingleProjectView";
import { AuthProvider } from "./context/auth";
import Home from "./pages/Home";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/:id/spv" component={SingleProjectView} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
