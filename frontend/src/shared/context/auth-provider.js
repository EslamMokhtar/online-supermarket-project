import React from "react";
import AuthContext from "./auth-context";

const AuthProvider = (props) => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [uid, setUid] = React.useState("");
  const [token, setToken] = React.useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = React.useState();

  const handleLogin = React.useCallback(
    (uid, payloadToken, expirationDate, admin) => {
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: payloadToken,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
      if (admin) {
        setIsAdmin(true);
      }
      setToken(payloadToken);
      setUid(uid);
    },
    []
  );

  const handleLogout = React.useCallback(() => {
    setIsAdmin(false);
    setToken(null);
    setUid(null);
    localStorage.removeItem("userData");
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isAdmin: isAdmin,
        isAuth: !!token,
        uid: uid,
        token,
        tokenExpirationDate,
        handleLogin: handleLogin,
        handleLogout: handleLogout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
