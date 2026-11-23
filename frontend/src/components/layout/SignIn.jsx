import { useState } from "react";
import { useDemo } from "../../contexts/DemoStateContext";
import { Button, Field, Icon } from "../common";
import { roleLocation, roles } from "../../utils";

export function SignIn() {
  const { role, setRole, signIn } = useDemo();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!form.get("email") || !form.get("password")) {
      setError("Enter your email and password to continue.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signIn();
    }, 700);
  };

  return (
    <div className="auth">
      <section className="auth-brand">
        <div className="auth-logo">
          <span>M</span>
          <div>
            <strong>MY TASTE</strong>
            <small>Connected food operations</small>
          </div>
        </div>
        <div className="auth-message">
          <div className="auth-kicker">ONE TEAM. FIVE LOCATIONS.</div>
          <h1>
            Good food.
            <br />
            Great teamwork.
          </h1>
          <p>
            Bring procurement, production, distribution, sales, and employee benefits together in
            one dependable workspace.
          </p>
          <div className="benefits">
            {[
              ["Connected operations", "One shared view across every location"],
              ["Traceable workflows", "Every movement and approval recorded"],
              ["Role-based clarity", "The right tools for every team member"],
            ].map(([t, d]) => (
              <div key={t}>
                <Icon name="check" />
                <span>
                  <b>{t}</b>
                  <small>{d}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-footer">
          MY TASTE • Sri Lanka <span>Enterprise prototype · Demonstration data</span>
        </div>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form">
          <div className="mobile-logo">
            <span>M</span>
            <strong>MY TASTE</strong>
          </div>
          <div className="eyebrow">WELCOME BACK</div>
          <h2>Sign in to your workspace</h2>
          <p>Enter your account details or choose a demo role below.</p>
          <form onSubmit={submit}>
            <Field label="Email or username" required>
              <input name="email" defaultValue="demo@mytaste.lk" placeholder="you@mytaste.lk" />
            </Field>
            <Field label="Password" required>
              <div className="password">
                <input
                  name="password"
                  defaultValue="mytaste2026"
                  type={show ? "text" : "password"}
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </Field>
            <div className="form-row between">
              <label className="checkbox">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <button
                type="button"
                className="link"
                onClick={() => setError("Password reset is simulated in this prototype.")}
              >
                Forgot password?
              </button>
            </div>
            {error && <div className="inline-error">{error}</div>}
            <Button className="sign-in" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" /> Signing in…
                </>
              ) : (
                <>
                  Sign In <Icon name="arrow" />
                </>
              )}
            </Button>
          </form>
          <div className="divider">
            <span>DEMO ACCESS</span>
          </div>
          <p className="demo-help">Explore a complete workflow from any internal role.</p>
          <div className="demo-roles">
            {roles.map((r) => (
              <button
                key={r}
                className={r === role ? "selected" : ""}
                onClick={() => setRole(r)}
                type="button"
              >
                <span className="role-dot">
                  {r
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span>
                  <b>{r}</b>
                  <small>{roleLocation[r]}</small>
                </span>
                {r === role && <Icon name="check" size={15} />}
              </button>
            ))}
          </div>
          <Button variant="secondary" className="demo-enter" onClick={signIn}>
            Enter as {role}
          </Button>
          <small className="security-note">
            Demo access does not connect to live authentication or business services.
          </small>
        </div>
      </section>
    </div>
  );
}