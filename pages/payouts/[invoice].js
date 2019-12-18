import Invoice from "../../components/Invoice";
import Manage from "../../components/Manage";
import { connect } from "react-redux";
import { Component } from "react";

import Head from "next/head";
import fetch from "isomorphic-unfetch";
import absoluteUrl from "next-absolute-url";

class InvoicePage extends Component {
  static async getInitialProps(context) {
    const { invoice } = context.query;
    const { origin } = absoluteUrl(context.req);
    const res = await fetch(`${origin}/api/event/${invoice}`);
    const json = await res.json();
    const errorCode = json.length === 1 ? 200 : 404;
    return { data: json[0], errorCode };
  }
  render() {
    const { data, errorCode } = this.props;
    console.log("data");
    console.log(data);
    var response;
    switch (errorCode) {
      case 200:
        response = <Invoice event={data} />;
        break;
      case 404:
        response = <>Sorry that event is not available.</>;
        break;
    }
    return (
      <>
        <Head>
          {/* <link rel="stylesheet" href="/static/react-vis.css" /> */}
        </Head>
        {response}
      </>
    );
  }
}

export default connect()(InvoicePage);
