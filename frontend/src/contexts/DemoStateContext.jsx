import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoState } from "../hooks/useDemoState";
import { cloneSeed, roleLocation } from "../utils";

const DemoStateContext = createContext(null);

export function DemoStateProvider({ children }) {
  const [state, setState] = useDemoState();
  const [signedIn, setSignedIn] = useState(false);
  const [role, setRole] = useState("Administrator");
  const [location, setLocation] = useState("All locations");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const switchRole = (next) => {
    setRole(next);
    setLocation(roleLocation[next]);
    navigate("/");
    notify(`Demo view switched to ${next}`);
  };

  const reset = () => {
    if (!confirm("Reset all prototype records and transactions to the original demonstration data?")) return;
    setState(cloneSeed());
    notify("Demonstration data has been reset");
  };

  const signIn = () => {
    setSignedIn(true);
    setLocation(roleLocation[role]);
    navigate("/");          // 👈 මේක තමයි fix එක
  };

  const signOut = () => {
    setSignedIn(false);
    navigate("/signin");    // 👈 sign out වුනාම sign in page එකට යන්න
  };

  const value = {
    state,
    setState,
    role,
    setRole,
    location,
    setLocation,
    signedIn,
    signIn,
    signOut,
    notify,
    switchRole,
    reset,
    toast,
    navigate,
  };

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export const useDemo = () => {
  const ctx = useContext(DemoStateContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoStateProvider");
  return ctx;
};