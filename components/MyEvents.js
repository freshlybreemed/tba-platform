import { Component } from "react";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import axios from "axios";

import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Dropdown,
  Empty,
  Icon,
  Menu,
  Progress,
  Popconfirm,
  Row,
  Spin,
  Table,
  Typography
} from "antd";
const { Text } = Typography;

const getTime = datetime => {
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  var dateTime = new Date(datetime);
  var day = days[dateTime.getDay()];
  var hr = dateTime.getHours();
  var min = dateTime.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  var ampm = "am";
  if (hr > 12) {
    hr -= 12;
    ampm = "pm";
  }
  var date = dateTime.getDate();
  if (date > 3 && date < 21) date = date + "th";
  switch (date % 10) {
    case 1:
      date = date + "st";
      break;
    case 2:
      date = date + "nd";
      break;
    case 3:
      date = date + "rd";
      break;
    default:
      break;
  }
  var month = months[dateTime.getMonth()];
  var year = dateTime.getFullYear();
  return day + ", " + month + " " + date;
};

const customizeRenderEmpty = () => (
  <>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Events">
      <Button href="/create" type="primary">
        Create Event
      </Button>
    </Empty>
  </>
);

const customizeRenderLoading = () => (
  <>
    <Spin size="large" />
  </>
);

const getPercentage = ticket => {
  let total = 0;
  let sold = 0;
  for (var ticketType in ticket.ticketTypes) {
    if (parseInt(ticket.ticketTypes[ticketType].currentQuantity) === 0) {
      sold += parseInt(ticket.ticketTypes[ticketType].startingQuantity);
    } else {
      sold +=
        parseInt(ticket.ticketTypes[ticketType].startingQuantity) -
        parseInt(ticket.ticketTypes[ticketType].currentQuantity);
    }
    total += parseInt(ticket.ticketTypes[ticketType].startingQuantity);
  }
  return { percent: parseInt((sold / total) * 100), sold, total };
};

const getGross = event => {
  let totalBalance = 0;
  let ticketTypes = event.ticketTypes;
  if (typeof event.tickets === "undefined") return `$0`;
  event.tickets.forEach(ticket => {
    for (let ticketType in ticket.metadata) {
      if (
        [
          "firstName",
          "lastName",
          "emailAddress",
          "phoneNumber",
          "eventId",
          "total",
          "updatedAt",
          "status",
          "guestId",
          "title"
        ].indexOf(ticketType) > -1
      )
        continue;
      // console.log(ticketType)
      // console.log(ticketTypes[ticketType])
      totalBalance +=
        ticketTypes[ticketType].price * parseInt(ticket.metadata[ticketType]);
    }
  });
  return `$${totalBalance}`;
};

class MyEvents extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { events, loading, dispatch } = this.props;
    console.log(events);
    const desktopColumns = [
      {
        title: "Event",
        dataIndex: "title",
        render: (text, event) => {
          return (
            <>
              <Row gutter={8}>
                <Col span={7}>
                  <Avatar
                    shape="square"
                    size={64}
                    src={event.image}
                    icon="user"
                  />
                </Col>
                <Col span={17}>
                  <Text strong>{text}</Text>
                  <br />
                  <Text>{event.location.name.split(",")[0]}</Text>
                  <br />
                  <Text>{getTime(event.startDate)}</Text>
                </Col>
              </Row>
            </>
          );
        }
      },
      {
        title: "Tickets Sold",
        dataIndex: "percentage",
        render: (tickets, event) => {
          const data = getPercentage(event);
          return (
            <>
              <Text type="secondary">{`${data.sold}/${data.total}`}</Text>
              <Progress percent={data.percent} size="small" status="active" />
            </>
          );
        }
      },
      {
        title: "Gross",
        dataIndex: "gross",
        key: "name",
        render: (text, event) => <>{getGross(event)}</>
      },
      {
        title: "Status",
        dataIndex: "eventStatus",
        key: "name",
        render: (text, event) => {
          let status = "";
          if (
            new Date(event.startDate).getTime() > new Date().getTime() &&
            event.eventStatus !== "draft"
          )
            status = <Badge status="success" text="Live" />;
          if (event.eventStatus === "draft")
            status = <Badge status="processing" text="Draft" />;
          if (
            new Date(event.startDate).getTime() < new Date().getTime() &&
            event.eventStatus !== "draft"
          )
            status = <Badge status="default" text="Sale Ended" />;
          return <>{status}</>;
        }
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text, event) => {
          const menu = (
            <Menu>
              <Menu.Item key={`/e/${event.slug}`}>
                <Link href={`/e/${event.slug}`}>View</Link>
              </Menu.Item>
              <Menu.Item key={`/manage/${event._id}`}>
                <Link href={`/manage/${event._id}`}>Manage</Link>
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  console.log("cmon man");
                  this.props.dispatch({ type: "edit_event", payload: event });
                }}
                key="3"
              >
                <Link href={`/cre`}>Edit</Link>
              </Menu.Item>
              {event.eventStatus === "draft" || !event.tickets ? (
                <Menu.Item key="4">
                  <Popconfirm
                    title="Are you sure delete this event?"
                    onConfirm={() => {
                      console.log({
                        data: event
                      });
                      axios
                        .delete(`/api/event/${event._id}`)
                        .then(res => {
                          console.log(res.data);
                          this.props.dispatch({
                            type: "event_deletion",
                            payload: event._id
                          });
                        })
                        .catch(err => {
                          console.log(err);
                        });
                    }}
                    onCancel={e => {
                      console.log(e);
                      message.error("Click on No");
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <a href="#">Delete</a>
                  </Popconfirm>
                </Menu.Item>
              ) : (
                ""
              )}
            </Menu>
          );
          return (
            <span>
              <Dropdown overlay={menu}>
                <Button>
                  Actions <Icon type="down" />
                </Button>
              </Dropdown>
            </span>
          );
        }
      }
    ];
    const mobileColumns = [
      {
        title: "Event",
        dataIndex: "title",
        render: (text, event) => {
          return (
            <>
              <Row gutter={8}>
                <Text strong>{text}</Text>
                <br />
                <Text>{getTime(event.startDate)}</Text>
              </Row>
            </>
          );
        }
      },
      {
        title: "Status",
        dataIndex: "eventStatus",
        key: "name",
        render: (text, event) => {
          console.log(
            event.title,
            event.startDate,
            new Date(event.startDate).getTime(),
            new Date().getTime()
          );
          let status = "";
          if (
            new Date(event.startDate).getTime() > new Date().getTime() &&
            event.eventStatus !== "draft"
          )
            status = <Badge status="success" text="Live" />;
          if (event.eventStatus === "draft")
            status = <Badge status="processing" text="Draft" />;

          if (
            new Date(event.startDate).getTime() < new Date().getTime() &&
            event.eventStatus !== "draft"
          )
            status = <Badge status="default" text="Sale Ended" />;
          return <>{status}</>;
        }
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text, event) => {
          const menu = (
            <Menu>
              <Menu.Item key={`/e/${event.slug}`}>
                <Link href={`/e/${event.slug}`}>View</Link>
              </Menu.Item>
              <Menu.Item key={`/manage/${event._id}`}>
                <Link href={`/manage/${event._id}`}>Manage</Link>
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  console.log("cmon man");
                  this.props.dispatch({ type: "edit_event", payload: event });
                }}
                key="3"
              >
                <Link href={`/cre`}>Edit</Link>
              </Menu.Item>
              <Menu.Item key="4">
                {" "}
                <Popconfirm
                  title="Are you sure delete this event?"
                  onConfirm={() => {
                    console.log({
                      data: event
                    });
                    axios
                      .delete(`/api/event/${event._id}`)
                      .then(res => {
                        console.log(res.data);
                        this.props.dispatch({
                          type: "event_deletion",
                          payload: event._id
                        });
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }}
                  onCancel={e => {
                    console.log(e);
                    message.error("Click on No");
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <a href="#">Delete</a>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          );
          return (
            <span>
              <Dropdown overlay={menu}>
                <Button>
                  Actions <Icon type="down" />
                </Button>
              </Dropdown>
            </span>
          );
        }
      }
    ];

    return (
      <>
        <Card
          title="Events"
          extra={
            <Button type="primary" href="/create">
              Create Event
            </Button>
          }
        >
          <ConfigProvider
            renderEmpty={
              !loading ? customizeRenderEmpty : customizeRenderLoading
            }
          >
            <Table
              size="small"
              {...{ pagination: false }}
              dataSource={events}
              columns={isMobile ? mobileColumns : desktopColumns}
            />
          </ConfigProvider>
        </Card>
      </>
    );
  }
}

export default connect()(MyEvents);
