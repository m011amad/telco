import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function SessionTimeout() {
  useEffect(() => {
    let timer;
    let lastReset = 0;

    function resetTimer() {
      const now = Date.now();
      if (now - lastReset < 1000) return; // ignore if called within 1 second
      lastReset = now;
      clearTimeout(timer);
      timer = setTimeout(
        async () => {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            await supabase.auth.signOut();
          }
        },
        1000 * 60 * 30,
      );
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, []);

  return null;
}
