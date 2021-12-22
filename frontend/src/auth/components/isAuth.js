import * as React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthContext from "../../shared/context/auth-context";

function RequireAuth({ children, ...rest }) {
  const ctx = React.useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        ctx.isAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
export default RequireAuth;
