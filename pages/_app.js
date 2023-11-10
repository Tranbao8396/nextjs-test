import { SessionProvider } from "next-auth/react";
import '../styles/globals.scss';
import { useEffect } from "react";

export default function App({ Component, pageProps: { session, ...pageProps }}) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps}/>
    </SessionProvider>
  );
}