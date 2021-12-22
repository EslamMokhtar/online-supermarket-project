import * as React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthContext from "../../shared/context/auth-context";

function IsLogin({ children, ...rest }) {
  const ctx = React.useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        ctx.isAuth ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}
export default IsLogin;
