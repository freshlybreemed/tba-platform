/* eslint-disable react/react-in-jsx-scope */
import {
    Archive,
    Bell,
    BarChart,
    Tv,
    Bookmark,
    DollarSign,
    Edit,
    GitCommit,
    MessageCircle,
    MoreHorizontal,
    PhoneCall,
    Printer,
    Save,
    Server,
    Trash,
    TrendingDown,
    TrendingUp
  } from 'react-feather';
  import {
    Avatar,
    Card,
    Button,
    Col,
    ConfigProvider,
    DatePicker,
    Descriptions,
    Divider,
    Dropdown,
    Empty,
    Icon,
    List,
    Menu,
    message,
    Progress,
    Row,
    Statistic,
    Switch,
    Table,
    Tag,
    Timeline,
    Typography
  } from 'antd';
  import {
    DiscreteColorLegend,
    FlexibleWidthXYPlot,
    HorizontalGridLines,
    VerticalBarSeries,
    VerticalGridLines,
    XAxis,
    YAxis
  } from 'react-vis';
  import { formatPrice } from '../lib/helpers';

  import { Component } from 'react'
  import {withRouter} from 'next/router';
  import Link from 'next/link';
  import NoSSR from 'react-no-ssr';
  import PostCard from './shared/PostCard';
  import StatCard from './shared/StatCard';
  import WeatherCard from './shared/WeatherCard';
  import styled from 'styled-components';
  import { theme } from './styles/GlobalStyles';
  import {isMobile} from 'react-device-detect';
  import {AUTH_CONFIG} from '../lib/auth0-variables';

  import event from '../lib/event'

  const host = AUTH_CONFIG.host

  const { Paragraph } = Typography;
  const { MonthPicker } = DatePicker;
  const { Title, Text } = Typography;

const axes = Array.from(Array(12).keys());

const generate = () => {
  let arr = [];
  axes.map(x => {
      const y = Math.floor(Math.random() * 10) + 1;
      arr.push({ x, y });
  });
  return arr;
};

const getTime = (datetime) =>{
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var dateTime = new Date(datetime)
  var day = days[dateTime.getDay()];
  var hr = dateTime.getHours();
  var min = dateTime.getMinutes();
  if (min < 10) {
      min = "0" + min;
  }
  var ampm = "am";
  if( hr > 12 ) {
      hr -= 12;
      ampm = "pm";
  }
  var date = dateTime.getDate();
  if (date > 3 && date < 21) date = date+ 'th'; 
  switch (date % 10) {
      case 1:  date = date+"st"; break
      case 2:  date = date+ "nd";break
      case 3:  date = date+ "rd";break
      default: break
  }
  var month = months[dateTime.getMonth()];
  var year = dateTime.getFullYear();
  return day + ", " + month + " "+ date;
}

const getTixQuantity = (metadata) =>{
  let quantity = 0
  for (let ticketType in metadata){
    if ((['firstName','lastName','emailAddress', 'phoneNumber', 'eventId', 'total', 'status', 'guestId', 'title'].indexOf(ticketType) > -1)) continue
      quantity+=parseInt(metadata[ticketType])
  }
  return quantity
}

const getPercentage = (event) => {
    let total = 0
    let sold = 0
    for (var ticketType in event.ticketTypes){
        if(parseInt(event.ticketTypes[ticketType].currentQuantity) === 0){
        sold+=parseInt(event.ticketTypes[ticketType].startingQuantity)
      }
      else{
        sold+=parseInt(event.ticketTypes[ticketType].startingQuantity)-parseInt(event.ticketTypes[ticketType].currentQuantity)
      }
      total+=parseInt(event.ticketTypes[ticketType].startingQuantity)
    
    }
    return parseInt((sold/total) *100);
  }

const payoutsDesktopColumns = [
    {
      title: 'Initiated On',
      dataIndex: 'key',
      key: 'key',
      render: order => <Link href={`/manage/`}>{order}</Link>
    },
    {
      title: 'Payout Method',
      dataIndex: 'name',
      key: 'name'
     },
    {
      title: 'Status',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Est. Arrival',
      dataIndex: 'total',
      key: 'total',
      render: total => `$${total}`
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: total => `$${total}`
    },
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
const ordersDesktopColumns = [
    {
      title: 'Order #',
      dataIndex: 'key',
      key: 'key',
      render: (order, metadata) => <Link href={`/manage/${metadata.eventId}/order/${order}`}>{order}</Link>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
     },
    {
      title: 'Quantity',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: total => `$${total}`
    },
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
const ordersMobileColumns = [
    // {
    //   title: '#',
    //   dataIndex: 'key',
    //   key: 'key',
    //   render: text => <a href="javascript:;">{text}</a>
    // },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
     },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        const menu = (
          <Menu >
            <Menu.Item key={`/e/${event.slug}`}><Link href={`/e/${event.slug}`}>Edit</Link></Menu.Item>
            <Menu.Item key={`/manage/${event._id}`}><Link href={`/manage/${event._id}`}>Invalidate</Link></Menu.Item>
            <Menu.Item key="3"><Link href={`/create`}>Refund</Link></Menu.Item>
          </Menu>
        );
        return(
          <span>
            <Dropdown overlay={menu}>
            <Button>
              Edit <Icon type="down" />
            </Button>
          </Dropdown>
          </span>
        )
      }
    }
  ];
  
const series = [
    {
      title: 'Views',
      data: generate()
    },
    {
      title: 'Sales',
      data: generate()
    }
];
  
const Legend = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding: 0.5rem 0;
.rv-discrete-color-legend {
    display: inline-block;
    width: auto !important;
}
.rv-discrete-color-legend-item {
    padding-top: 0;
    padding-bottom: 0;
}
`;
  
  const menu = (
    <Menu>
      <Menu.Item>
        <Row type="flex" align="middle">
          <Archive size={16} strokeWidth={1} className="mr-3" />{' '}
          <span>Archive</span>
        </Row>
      </Menu.Item>
      <Menu.Item>
        <Row type="flex" align="middle">
          <Edit size={16} strokeWidth={1} className="mr-3" /> <span>Edit</span>
        </Row>
      </Menu.Item>
      <Menu.Item>
        <Row type="flex" align="middle">
          <Trash size={16} strokeWidth={1} className="mr-3" /> <span>Delete</span>
        </Row>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Row type="flex" align="middle">
          <Save size={16} strokeWidth={1} className="mr-3" /> <span>Save as</span>
        </Row>
      </Menu.Item>
      <Menu.Item>
        <Row type="flex" align="middle">
          <Printer size={16} strokeWidth={1} className="mr-3" />{' '}
          <span>Print</span>
        </Row>
      </Menu.Item>
    </Menu>
  );
  
  const TimelinePeriod = ({ content }) => (
    <small
      className="text-muted"
      css={`
        display: block;
      `}
    >
      {content}
    </small>
  );

  class Order extends Component {
    constructor(props) {
      super(props)

    }
    componentWillMount = () => {
      console.log(this.props)
      this.salesData()
    }

    salesData = () => {
        var date = new Date().getTime()/1000
        var yesterday = date - 86400
        var ticketDayCount = 0
        let totalBalance = 0
        let ticketTypes = this.props.event.ticketTypes;
        var totalTicketCount = 0
        if (typeof this.props.event.tickets !== 'undefined') {
          this.props.event.tickets.forEach((ticket)=>{
            for (let ticketType in ticket.metadata){ 
              if ((['firstName','lastName','emailAddress', 'phoneNumber', 'updatedAt','eventId', 'total', 'status', 'guestId', 'title'].indexOf(ticketType) > -1)) continue
              totalTicketCount += parseInt(ticket.metadata[ticketType])
              totalBalance += ticketTypes[ticketType].price*  parseInt(ticket.metadata[ticketType])
              if (ticket.created > yesterday && ticket.created < date) {
                ticketDayCount+=  parseInt(ticket.metadata[ticketType])
              }
            }
          })
        }
        this.setState({ticketDayCount, totalTicketCount, totalBalance:totalBalance.toFixed(2)},()=>console.log(this.state))
    }
  
    render = () => {
        const { event, customer } = this.props
        
        const customizeRenderEmpty = (type) => (<>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`No ${type} Yet`}/>
            {type === 'Payouts'? <Button>Setup Payouts</Button>:""}
            </>
        );
        var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
        date.setUTCSeconds(customer.created);
        const menu = (
            <Menu >
                <Menu.Item key={0}><Link>Edit Info</Link></Menu.Item>
                <Menu.Item key={1}><Link>Refund</Link></Menu.Item>
                <Menu.Item key={1}><Link>Transfer</Link></Menu.Item>
            </Menu>
            )
        return (
            <><Title level={3}>{event.title}</Title>

                <Row gutter={16}>
                    <Card
                        bodyStyle={{ padding: '1rem' }}
                        className="mb-4"  
                        title={`Order Details (#${customer.created.toString().slice(-5)}) ${formatPrice(customer.metadata.total)}`}
                    >
                        <Paragraph>{`Completed (Delivery method: eTicket)`}</Paragraph>
                        <Paragraph>{`Purchased by ${customer.metadata.firstName} ${customer.metadata.lastName} (${customer.metadata.emailAddress}) on ${date} `}</Paragraph>
                    <Descriptions>
                    
                        <Descriptions.Item label="First Name">{`${customer.metadata.firstName}`}</Descriptions.Item>
                        <Descriptions.Item label="Last Name">{`${customer.metadata.lastName}`}</Descriptions.Item>

                        {/* <Table columns={ordersDesktopColumns}  {...{pagination: false}} dataSource={this.renderRecentOrders()} /> */}
                    </Descriptions>
                    <span>
                        <Dropdown overlay={menu}>
                            <Button>
                            Actions <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </span>
                </Card>
                </Row>
                {/* <Row gutter={16}>
                <Col sm={24} md={8} className="mb-4">
                <Card title="Stats" bodyStyle={{ padding: 0 }}>
                  <Row
                  type="flex"
                  align="middle"
                  justify="center"
                  gutter={16}
                  className="py-4"
                  >
                    <Progress
                      type="dashboard"
                      percent={getPercentage(event)}
                      width={181}
                      format={percent => (
                      <span className="text-center">
                        <div
                        css={`
                            display: block;
                            color: #007bff;
                            margin: auto;
                        `}
                        >
                        <GitCommit size={20} strokeWidth={2} />
                        </div>
                        <div
                        className="h5 mb-0"
                        css={`
                            display: block;
                        `}
                        >
                        {percent}
                        </div>
                        <div className="h6">
                        <small>% tickets sold</small>
                        </div>
                      </span>
                      )}
                    />
                    </Row>
                  </Card>
                </Col>
                <Col sm={24} md={8} className="mb-4">
                  <Card
                      title="Tasks"
                      extra={
                      <Dropdown overlay={menu}>
                          <MoreHorizontal
                          size={20}
                          strokeWidth={1}
                          fill={theme.textColor}
                          />
                      </Dropdown>
                      }
                  >
                      <Timeline pending="Tasks pending..." className="mt-2">
                      <Timeline.Item>
                          <div className="text-truncate">
                          <TimelinePeriod content="09.45" />
                          <span>Create a services site</span>
                          </div>
                      </Timeline.Item>
                      <Timeline.Item>
                          <div className="text-truncate">
                          <TimelinePeriod content="11.20" />
                          <span>Solve initial network problems</span>
                          </div>
                      </Timeline.Item>
                      <Timeline.Item
                          dot={
                          <Server size={16} strokeWidth={1} color={theme.errorColor} />
                          }
                      >
                          <div className="text-truncate">
                          <TimelinePeriod content="13.00" />
                          <span>Technical testing</span>
                          </div>
                      </Timeline.Item>
                      <Timeline.Item>
                          <div className="text-truncate">
                          <TimelinePeriod content="15.00" />
                          <span>Network problems being solved</span>
                          </div>
                      </Timeline.Item>
                      </Timeline>
                    </Card>
                </Col>
                <Col sm={24} md={8} className="mb-4">
                  <Card
                      title="Activity"
                      extra={
                      <Dropdown overlay={menu}>
                          <MoreHorizontal
                          size={20}
                          strokeWidth={1}
                          fill={theme.textColor}
                          />
                      </Dropdown>
                      }
                  >
                      <Timeline
                      pending={<div className="ml-4">Activities pending...</div>}
                      className="mt-2"
                      >
                      <Timeline.Item
                          dot={<Avatar size={24} src="/static/images/face1.jpg" />}
                      >
                          <div className="ml-4 text-truncate">
                          <TimelinePeriod content="9.45" />
                          <span>
                              <a>John Doe</a> launched a new application
                          </span>
                          </div>
                      </Timeline.Item>
                      <Timeline.Item
                          dot={<Avatar size={24} src="/static/images/face2.jpg" />}
                      >
                          <div className="ml-4 text-truncate">
                          <TimelinePeriod content="11.20" />
                          <span>
                              <a>Paula Bean</a> Cleared calendar events
                          </span>
                          </div>
                      </Timeline.Item>
                      <Timeline.Item
                          dot={<Avatar size={24} src="/static/images/face3.jpg" />}
                      >
                          <div className="ml-4 text-truncate">
                          <TimelinePeriod content="13.00" />
                          <span>
                              <a>Peter Hadji</a> Joined your mailing list
                          </span>
                          </div>
                      </Timeline.Item>
                      <Timeline.Item
                          dot={<Avatar size={24} src="/static/images/face4.jpg" />}
                      >
                          <div className="ml-4 text-truncate">
                          <TimelinePeriod content="15.00" />
                          <span>
                              <a>Trevor Belmont</a> Created a new task list
                          </span>
                          </div>
                      </Timeline.Item>
                      </Timeline>
                  </Card>
                  </Col>
              </Row> */}
            </>
        );
    }
  };
  
  export default Order;
  