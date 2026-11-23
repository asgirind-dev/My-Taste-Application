import { DemoStateProvider } from "./contexts/DemoStateContext";
import AppRouter from "./app/router/AppRouter";
import "./App.css";

function App() {
  return (
    <DemoStateProvider>
      <AppRouter />
    </DemoStateProvider>
  );
}

export default App;