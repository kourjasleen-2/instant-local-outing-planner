import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [message, setMessage] = useState("");
  const signInWithGoogle = async () => {
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/planner` },
    });
    if (error) setMessage(error.message);
  };
  return <main className="glimmr-app page"><section className="surface" style={{ maxWidth: 420, margin: "80px auto", padding: 28 }}>
    <div className="eyebrow">glimmr account</div><h1 className="display">Plan your next good day.</h1>
    <p className="muted">Sign in securely with your Google account to save plans and track outings.</p>
    <button className="btn btn-blue" type="button" onClick={() => void signInWithGoogle()} style={{ width: "100%", justifyContent: "center", marginTop: 18 }}><span aria-hidden="true" style={{ fontWeight: 800 }}>G</span> Continue with Google</button>
    {message && <p className="field-error" role="alert">{message}</p>}
  </section></main>;
}
