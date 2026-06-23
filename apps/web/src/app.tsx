import Checkboxes from "./components/checkboxes";
import Header from "./components/header";
import Page from "./components/page";
import { SocketProvider } from "./providers/socket-provider";

function App() {
  return (
    <SocketProvider>
      <Page>
        <Header />
        <Checkboxes />
      </Page>
    </SocketProvider>
  );
}

export default App;
