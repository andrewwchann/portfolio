import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type CopyToastContextValue = {
  copyEmail: () => void;
};

const CopyToastContext = createContext<CopyToastContextValue | null>(null);

export function CopyToastProvider({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number>();

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setVisible(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setVisible(false), 2200);
  }, [email]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <CopyToastContext.Provider value={{ copyEmail }}>
      {children}
      <div
        className={`copy-toast${visible ? " copy-toast--visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        Copied
      </div>
    </CopyToastContext.Provider>
  );
}

export function useCopyEmail() {
  const ctx = useContext(CopyToastContext);
  if (!ctx) {
    throw new Error("useCopyEmail must be used within CopyToastProvider");
  }
  return ctx.copyEmail;
}
