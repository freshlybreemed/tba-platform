import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Icon,
  message,
  Input,
  Modal,
  Row,
  Tag,
  Table,
  Select,
  Spin,
  Steps,
  Statistic
} from "antd";
import { Calendar, Target } from "react-feather";
import { StripeProvider } from "react-stripe-elements";
import CardSection from "./CardSection";
import EventCheckout from "./EventCheckout";
import Checkout from "./Checkout";
import { Component } from "react";
import { connect } from "react-redux";
import MapGL, { Marker, NavigationControl, Popup } from "react-map-gl";
import { Result } from "antd";
import PropTypes from "prop-types";
import axios from "axios";
import { getTime } from "../lib/helpers";
import CITIES from "../demos/mock/cities.json";
import CityInfo from "../demos/map-gl/city-info";
import CityPin from "../demos/map-gl/city-pin";

const { Option } = Select;
const { Meta } = Card;
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const { Step } = Steps;

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stripe: null,
      activeKey: 0,
      current: 0,
      quantity: 0,
      total: 0,
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false,
      viewport: {
        latitude: 37.785164,
        longitude: -100,
        zoom: 3.5,
        bearing: 0,
        pitch: 0
      }
    };
  }
  componentDidMount() {
    // Create Stripe instance in componentDidMount
    // (componentDidMount only fires in browser/DOM environment)
    this.setState({
      stripe: window.Stripe("pk_test_KJ6mPZxJuMvOl8yqmsCtdM9J00bx9VCCpE")
    });
    const event = this.props.json;
    let ticketTypes = {};
    let tickettypes = [];
    for (let ticket in event.ticketTypes) {
      ticketTypes[ticket] = event.ticketTypes[ticket];
      ticketTypes[ticket].count = 0;
      tickettypes.push(ticketTypes[ticket]);
    }
    this.setState({ data: tickettypes });
  }
  _renderCityMarker = (city, index) => (
    <Marker
      key={`marker-${index}`}
      longitude={city.longitude}
      latitude={city.latitude}
    >
      <CityPin size={20} onClick={() => this.setState({ popupInfo: city })} />
    </Marker>
  );

  _renderPopup() {
    const { popupInfo } = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <CityInfo info={popupInfo} />
        </Popup>
      )
    );
  }

  render() {
    const { json, eventCheckoutForm } = this.props;
    const { current, viewport } = this.state;

    return (
      <>
        <Card cover={<img src={json.image} />}>
          <Statistic
            title={json.organizer ? `${json.organizer} Presents` : ``}
            value={json.title}
            valueStyle={{ color: "#000000" }}
          />
          {this.props.eventCheckoutForm.status === "pending" ? (
            <>
              <Row gutter={8}>
                <Col span={12}>
                  <Divider />
                  <div
                    dangerouslySetInnerHTML={{ __html: json.description }}
                  ></div>
                </Col>
                <Col span={12}>
                  <Divider />
                  {json.location.name.split(",")[0]}
                  <p>
                    {json.location.streetAddress ===
                    json.location.name.split(",")[0]
                      ? `${json.location.city}, ${json.location.state}`
                      : json.location.streetAddress}
                  </p>
                  {`${getTime(json.startDate, "full")}-${getTime(
                    json.endDate,
                    "time"
                  )}`}
                  <p>
                    {json.refundable
                      ? "Refundable"
                      : "No refunds. All sales are final"}
                  </p>
                  <Checkout />
                </Col>
              </Row>
            </>
          ) : (
            <Result
              status="success"
              title="Successfully Purchased Tickets"
              subTitle={`Your order with ${json.title} has been successfully posted. Your receipt will be emailed to you at ${eventCheckoutForm.emailAddress}.`}
              extra={
                [
                  // <Button type="primary" key="console">
                  //   Go Console
                  // </Button>,
                  // <Button key="buy">Buy Again</Button>
                ]
              }
            />
          )}
          <Row>
            <div className="full-workspace">
              <MapGL
                {...{
                  latitude: 37.785164,
                  longitude: -100,
                  zoom: 3.5,
                  bearing: 0,
                  pitch: 0
                }}
                width="100%"
                height="100%"
                mapStyle="mapbox://styles/mapbox/dark-v9"
                onViewportChange={this._updateViewport}
                mapboxApiAccessToken={process.env.mapBoxApi}
              >
                {CITIES.map(this._renderCityMarker)}
                {this._renderPopup()}
                <NavigationControl onViewportChange={this._updateViewport} />
              </MapGL>
            </div>
          </Row>
        </Card>
      </>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    selectedEvent: state.selectedEvent,
    eventCheckoutForm: state.eventCheckoutForm,
    eventCheckout: state.eventCheckout
  };
};
export default connect(mapStateToProps)(Event);
