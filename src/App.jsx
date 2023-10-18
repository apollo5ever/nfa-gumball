import { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import WalletToggle from "./components/walletToggle";
import { LoginContext } from "./LoginContext";
import { useInitXSWD } from "./useInitXSWD";
import WebSocketService from "./webSocketService";
import DaemonToggle from "./components/daemonToggle";
import { useGetAddress } from "./hooks/useGetAddress";
import { useInitializeWallet } from "./hooks/useInitializeWallet";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  InputGroup,
  Tabs,
  Tab,
} from "react-bootstrap";
import Browse from "./components/browse";
import { useGetNFA } from "./hooks/useGetNFA";
import CreateMachine from "./components/createMachine";
import View from "./components/viewNFAs";

function App() {
  const [state, setState] = useContext(LoginContext);
  const [initXSWD] = useInitXSWD();
  const [initializeWallet] = useInitializeWallet();
  const [key, setKey] = useState("browse");
  const [getNFA] = useGetNFA();

  /* useEffect(() => {
    initializeWallet();
  }, []); */

  useEffect(() => {
    initializeWallet();
  }, [state.walletMode]);

  return (
    <>
      <header>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#">NFA Gumball</Navbar.Brand>
          <img
            src={
              "https://media.discordapp.net/attachments/1085656662276325503/1158324835701764116/photo_2023-10-02_09-47-39.jpg?ex=651d2711&is=651bd591&hm=d37d491e8e4a629728aac3fa0738ac49c857e36c386670ee8352ea8523839ab1&=&width=644&height=644"
            }
          />
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav"></Navbar.Collapse>
          <div className="d-flex flex-column">
            <WalletToggle />
            <DaemonToggle />
          </div>
        </Navbar>
      </header>
      <main>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="browse" title="Browse Gumball Machines">
            <div style={{ marginTop: "20px" }}>
              <Browse />
            </div>
          </Tab>
          <Tab eventKey="create" title="Create Gumball Machine">
            <div style={{ marginTop: "20px" }}>
              <CreateMachine />
            </div>
          </Tab>
          <Tab eventKey="view" title="View Your NFAs">
            <div style={{ marginTop: "20px" }}>
              <View />
            </div>
          </Tab>
        </Tabs>
      </main>
      <footer></footer>
    </>
  );
}

export default App;
