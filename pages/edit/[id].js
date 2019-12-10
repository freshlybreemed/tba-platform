import Create from "../../components/Create";
import Head from "next/head";
import fetch from "isomorphic-unfetch";

import { connect } from "react-redux";
import { AUTH_CONFIG } from "../../lib/auth0-variables";

const host = AUTH_CONFIG.host;
const CreatePage = ({ data, errorCode }) => {
  var response;
  switch (errorCode) {
    case 200:
      response = <Create event={data} />;
      break;
    case 404:
      response = <>Sorry that event is not available.</>;
      break;
  }
  return (
    <>
      <Head>
        <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
        <link
          href="//cdnjs.cloudflare.com/ajax/libs/antd/3.23.4/antd.css"
          rel="stylesheet"
        />
      </Head>
      {response}
    </>
  );
};

CreatePage.getInitialProps = async context => {
  const { id } = context.query;
  const res = await fetch(`${host}/api/event/${id}`);
  const json = await res.json();
  console.log(json);
  const errorCode = json.length === 1 ? 200 : 404;
  // console.log("fuck", context.store.dispatch);
  // context.store.dispatch({ type: "edit_event", payload: json[0] });

  return { data: json[0], errorCode };
};

export default connect()(CreatePage);
