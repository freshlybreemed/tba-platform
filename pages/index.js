/* eslint-disable react/react-in-jsx-scope */
import Head from "next/head";
import Overview from "../components/Overview";
import fetch from "isomorphic-unfetch";
import { connect } from "react-redux";

class OverviewPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = async () => {
    const { user } = this.props;
    var user_data = localStorage.getItem("user_details");
    var isLoggedIn = localStorage.getItem("isLoggedIn");
    const data = JSON.parse(user_data);
    if (isLoggedIn && !user.sub) {
      console.log(`logged in `);
      const resUser = await fetch(`${host}/api/user/${data.sub}`);
      const user = await resUser.json();
      this.props.dispatch({
        type: "fetch_user",
        payload: user[0]
      });
    } else {
      if (!user.sub) {
        console.log("not logged in");
      }
      this.setState({ loading: false });
    }
  };

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
