import { Component } from "react";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import axios from "axios";
import { getTime } from "../lib/helpers";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
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
      totalBalance +=
        ticketTypes[ticketType].price * parseInt(ticket.metadata[ticketType]);
    }
  });
  return `$${totalBalance}`;
};

class MyEvents extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { events, loading, dispatch } = this.props;
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
                  <Text>
                    {event.location.name
                      ? event.location.name.split(",")[0]
                      : "TBD"}
                  </Text>
                  <br />
                  <Text>{getTime(event.startDate, "date")}</Text>
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
        key: "gross",
        render: (text, event) => <>{getGross(event)}</>
      },
      {
        title: "Status",
        dataIndex: "eventStatus",
        key: "status",
        render: (text, event) => {
          let status = "";
          if (
            new Date(event.endDate).getTime() > new Date().getTime() &&
            event.eventStatus !== "draft"
          )
            status = <Badge status="success" text="Live" />;
          if (event.eventStatus === "draft")
            status = <Badge status="processing" text="Draft" />;
          if (
            new Date(event.endDate).getTime() < new Date().getTime() &&
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
                <Link href={`/e/${event.slug}`}>
                  <a href={`/e/${event.slug}`}>View</a>
                </Link>
              </Menu.Item>
              <Menu.Item key={`/manage/${event._id}`}>
                <Link href={`/manage/${event._id}`}>
                  <a href={`/manage/${event._id}`}>Manage</a>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link href={`/edit/${event._id}`}>
                  <a href={`/edit/${event._id}`}>Edit</a>
                </Link>
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
                <Text>{getTime(event.startDate, "date")}</Text>
              </Row>
            </>
          );
        }
      },
      {
        title: "Status",
        dataIndex: "eventStatus",
        key: "status",
        render: (text, event) => (
          <>
            {new Date(event.startDate).getTime() > new Date().getTime() &&
              event.eventStatus !== "draft" && (
                <Badge status="success" text="Live" />
              )}

            {event.eventStatus === "draft" && (
              <Badge status="processing" text="Draft" />
            )}
            {new Date(event.startDate).getTime() < new Date().getTime() &&
              event.eventStatus !== "draft" && (
                <Badge status="default" text="Sale Ended" />
              )}
          </>
        )
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text, event) => {
          const menu = (
            <Menu>
              <Menu.Item key={`/e/${event.slug}`}>
                <Link href={`/e/${event.slug}`}>
                  <a href={`/e/${event.slug}`}>View</a>
                </Link>
              </Menu.Item>
              <Menu.Item key={`/manage/${event._id}`}>
                <Link href={`/manage/${event._id}`}>
                  <a href={`/manage/${event._id}`}>Manage</a>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link href={`/edit/${event._id}`}>
                  <a href={`/edit/${event._id}`}>Edit</a>
                </Link>
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
