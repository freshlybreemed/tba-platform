/* eslint-disable react/react-in-jsx-scope */
import Head from "next/head";
import Event from "../components/Event";
import fetch from "isomorphic-unfetch";
import { connect } from "react-redux";
import absoluteUrl from "next-absolute-url";

const EventPage = ({ json }) => {
  return (
    <>
      <Head>
        <meta property="og:title" content={json.title} />
        {/* <meta property="og:site_name" content="Uno"/> */}
        <meta property="og:image" content={json.image.cdnUri} />
        <script src="https://js.stripe.com/v3/"></script>
        <link rel="stylesheet" href="/static/react-vis.css" />
        <link rel="stylesheet" href="/static/store.css" />
      </Head>
      <Event json={json} />
    </>
  );
};
EventPage.getInitialProps = async ({ store }) => {
  const { origin } = absoluteUrl(context.req);
  const res = await fetch(`${origin}/api/event/the-hav-mercy-show`);
  const json = await res.json();
  return { json: json[0] };
};

export default connect()(EventPage);
