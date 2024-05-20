import { IEmployee } from "@/components/employees/employee_row";
import Layout from "@/components/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Login from "./login";
import { LOCAL_USER } from "@/constants";

export default function App({ Component, pageProps }: AppProps) {

  const [loggedEmp, setLoggedEmp] = useState<IEmployee | undefined>(undefined)

  useEffect(() => {
    let value = localStorage.getItem(LOCAL_USER) || undefined
    if (value !== undefined && value !== 'undefined') setLoggedEmp(JSON.parse(value))
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_USER, JSON.stringify(loggedEmp))
  }, [loggedEmp])

  if (loggedEmp) return <Layout setEmp={setLoggedEmp} currEmp={loggedEmp}>
    <Component {...pageProps} />
  </Layout>;
  else return <Login setEmp={setLoggedEmp} {...pageProps} />
}
