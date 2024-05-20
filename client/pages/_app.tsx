import { IEmployee } from "@/components/employees/employee_row";
import Layout from "@/components/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import Login from "./login";

export default function App({ Component, pageProps }: AppProps) {

  const [loggedEmp, setLoggedEmp] = useState<IEmployee | undefined>(undefined)

  if (loggedEmp) return <Layout setEmp={setLoggedEmp} currEmp={loggedEmp}>
    <Component {...pageProps} />
  </Layout>;
  else return <Login setEmp={setLoggedEmp} {...pageProps} />
}
