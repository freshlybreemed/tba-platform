import Manage from "../../components/Manage";
import { connect } from "react-redux";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { AUTH_CONFIG } from "../../lib/auth0-variables";

const host = AUTH_CONFIG.host;

const ManagePage = ({ data, errorCode }) => {
  var response;
  switch (errorCode) {
    case 200:
      response = <Manage event={data} />;
      break;
    case 404:
      response = <>Sorry that event is not available.</>;
      break;
  }
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/static/react-vis.css" />
      </Head>
      {response}
    </>
  );
};
ManagePage.getInitialProps = async context => {
  const { manage } = context.query;
  const res = await fetch(`${host}/api/event/${manage}`);
  const json = await res.json();
  const errorCode = json.length === 1 ? 200 : 404;
  context.store.dispatch({
    type: "fetch_event",
    payload: json[0]
  });
  return { data: json[0], errorCode };
};
export default connect()(ManagePage);
