import { Component } from "react";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import axios from "axios";
import { formatPrice } from "../lib/helpers";

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

const customizeRenderEmpty = type => (
  <>
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={`No ${type} Yet`}
    />
    {type === "Payouts" ? <Button type="primary">Setup Payouts</Button> : ""}
  </>
);

const customizeRenderLoading = () => (
  <>
    <Spin size="large" />
  </>
);
const getPayouts = events => {
  const payoutEvents = events.filter(event => {
    return event.payouts;
  });

  const payouts = [];
  payoutEvents.forEach(event => {
    payouts.push(
      Object.assign({}, ...event.payouts, {
        title: event.title,
        _id: event._id
      })
    );
  });
  console.log(events);
  return payouts;
};

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

class Payouts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { events, loading, dispatch } = this.props;
    console.log(getPayouts(events));

    const payoutsDesktopColumns = [
      {
        title: "Payout ID",
        dataIndex: "id",
        key: "id",
        render: (id, payout) => {
          console.log("payout", payout);
          return (
            <Link
              href={`/payouts/${payout._id}`}
            >{`${payout.arrival_date}`}</Link>
          );
        }
      },
      {
        title: "Event",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "Initiated On",
        dataIndex: "created",
        key: "created",
        render: total => {
          var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
          date.setUTCSeconds(total);
          return `${getTime(date)}`;
        }
      },
      {
        title: "Est. Arrival",
        dataIndex: "arrival_date",
        key: "arrival_date",
        render: total => {
          var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
          date.setUTCSeconds(total);
          return `${getTime(date)}`;
        }
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: total => `${formatPrice(total)}`
      }
      // {
      //   title: 'Action',
      //   key: 'action',
      //   render: (text, record) => {
      //     const menu = (
      //       <Menu >
      //         <Menu.Item key={1}><Link href={`/e/${record.slug}`}>Edit</Link></Menu.Item>
      //         <Menu.Item key={2}><Link href={`/manage/${record._id}`}>Invalidate</Link></Menu.Item>
      //         <Menu.Item key={3}><Link href={`/create`}>Refund</Link></Menu.Item>
      //       </Menu>
      //     );
      //     return (
      //       <span>
      //         <Dropdown overlay={menu}>
      //         <Button>
      //           Edit <Icon type="down" />
      //         </Button>
      //         </Dropdown>
      //       </span>
      //     )
      //   }
      // }
    ];
    const payoutsMobileColumns = [
      // {
      //   title: '#',
      //   dataIndex: 'key',
      //   key: 'key',
      //   render: text => <a href="javascript:;">{text}</a>
      // },
      {
        title: "Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Total",
        dataIndex: "total",
        key: "total"
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => {
          const menu = (
            <Menu>
              <Menu.Item key={`/e/${event.slug}`}>
                <Link href={`/e/${event.slug}`}>Edit</Link>
              </Menu.Item>
              <Menu.Item key={`/manage/${event._id}`}>
                <Link href={`/manage/${event._id}`}>Invalidate</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link href={`/create`}>Refund</Link>
              </Menu.Item>
            </Menu>
          );
          return (
            <span>
              <Dropdown overlay={menu}>
                <Button>
                  Edit <Icon type="down" />
                </Button>
              </Dropdown>
            </span>
          );
        }
      }
    ];

    return (
      <>
        <Card title="Payouts">
          <ConfigProvider renderEmpty={() => customizeRenderEmpty("Payouts")}>
            <Table
              size="small"
              {...{ pagination: false }}
              dataSource={getPayouts(events)}
              columns={payoutsDesktopColumns}
            />
          </ConfigProvider>
        </Card>
      </>
    );
  }
}

export default connect(state => {
  return {
    events: state.myEvents
  };
})(Payouts);
