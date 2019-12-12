import "../assets/styles.less";

import App from "next/app";
import { Provider, connect } from "react-redux";

import AppProvider from "../components/shared/AppProvider";
import { createStore } from "redux";
import { GlobalStyles } from "../components/styles/GlobalStyles";
import Head from "next/head";
import NProgress from "nprogress";
import Page from "../components/Page";
import Router from "next/router";
import withRedux from "next-redux-wrapper";
import { makeStore } from "../lib/store";
import { AUTH_CONFIG } from "../lib/auth0-variables";

const host = AUTH_CONFIG.host;
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

class MyApp extends App {
  static async getInitialProps({ Component, ctx, req }) {
    let pageProps = {};
    const userAgent = ctx.req
      ? ctx.req.headers["user-agent"]
      : navigator.userAgent;

    let ie = false;
    if (userAgent.match(/Edge/i) || userAgent.match(/Trident.*rv[ :]*11\./i)) {
      ie = true;
    }
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    pageProps.query = ctx.query;
    pageProps.ieBrowser = ie;
    return { pageProps };
  }
  componentWillMount() {
    if (typeof localStorage !== "undefined") {
      var user_data = localStorage.getItem("user_details");
      var isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn) {
        const data = JSON.parse(user_data);
        console.log(`logged in `);
        const login = async () => {
          const resUser = await fetch(`${host}/api/user/${data.sub}`);
          const resEvents = await fetch(`${host}/api/events/${data.sub}`);
          const user = await resUser.json();
          const events = await resEvents.json();
          this.props.store.dispatch({
            type: "fetch_user",
            payload: {
              user: user[0],
              events
            }
          });
        };
        login();
      }
    }
  }
  render() {
    const { Component, pageProps, store } = this.props;
    // console.log(this.props);
    return (
      <>
        <GlobalStyles />
        <Head>
          <meta
            name="viewport"
            content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height"
          />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="shortcut icon" href="/static/images/triangle.png" />
          <title>TBA</title>
          <link
            href="https://fonts.googleapis.com/css?family=Anonymous+Pro:400,700"
            rel="stylesheet"
          />
          {pageProps.ieBrowser && (
            <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.2.5/polyfill.min.js" />
          )}
        </Head>
        <Provider store={store}>
          <AppProvider>
            <Page>
              <Component {...pageProps} />
            </Page>
          </AppProvider>
        </Provider>
      </>
    );
  }
}

export default withRedux(makeStore)(MyApp);
