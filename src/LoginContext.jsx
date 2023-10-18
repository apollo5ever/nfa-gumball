import React, { useState } from "react";

const LoginContext = React.createContext([{}, () => {}]);
//const walletListCookie = Cookies.get('walletList');

const LoginProvider = (props) => {
  const [state, setState] = useState({
    ws: null,
    walletMode: "rpc",
    daemonMode: "user",
  });
  return (
    <LoginContext.Provider value={[state, setState]}>
      {props.children}
    </LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };
