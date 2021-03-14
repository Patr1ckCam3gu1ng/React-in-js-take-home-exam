import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/css/material-dashboard-react.css?v=1.4.1";

import indexRoutes from "routes/index.jsx";

import Index from "../src/auth/index";

import QuestionManage from "views/QuestionManage";
import AuthLogin from "./views/Login";

const hist = createBrowserHistory();

Index.setupInterceptors();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route
        path={`${process.env.PUBLIC_URL}/sections/:id/questions/new`}
        component={QuestionManage}
        exact={true}
      />
      <Route
        path={`${process.env.PUBLIC_URL}/sections/:id/questions/:id/new`}
        component={QuestionManage}
        exact={true}
      />
      <Route
        path={`${process.env.PUBLIC_URL}/sections/:id/questions/:id`}
        component={QuestionManage}
        exact={true}
      />
      <Route
        path={`${process.env.PUBLIC_URL}/login`}
        component={AuthLogin}
        exact={true}
      />
      {indexRoutes.map((prop, key) => {
        return <Route path={prop.path} component={prop.component} key={key} />;
      })}
    </Switch>
  </Router>,
  document.getElementById("root")
);
