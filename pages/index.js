/* eslint-disable react/react-in-jsx-scope */
import Head from "next/head";
import Overview from "../components/Overview";
import fetch from "isomorphic-unfetch";
import { connect } from "react-redux";
import { AUTH_CONFIG } from "../lib/auth0-variables";

const host = AUTH_CONFIG.host;

class OverviewPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Head>
          <link rel="stylesheet" href="/static/react-vis.css" />
        </Head>
        <Overview />
      </>
    );
  }
}
export default connect(state => {
  return {
    user: state.user
  };
})(OverviewPage);
