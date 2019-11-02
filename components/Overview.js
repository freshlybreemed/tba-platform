/* eslint-disable react/react-in-jsx-scope */
import {
  Archive,
  Bell,
  Bookmark,
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
  Col,
  DatePicker,
  Dropdown,
  List,
  Menu,
  message,
  Button,
  Divider,
  Progress,
  Row,
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


import NoSSR from 'react-no-ssr';
import PostCard from './shared/PostCard';
import StatCard from './shared/StatCard';
import WeatherCard from './shared/WeatherCard';
import styled from 'styled-components';
import { theme } from './styles/GlobalStyles';

const { MonthPicker } = DatePicker;
const { Title, Paragraph, Text } = Typography;

const axes = Array.from(Array(12).keys());

const generate = () => {
  let arr = [];
  axes.map(x => {
    const y = Math.floor(Math.random() * 10) + 1;
    arr.push({ x, y });
  });
  return arr;
};

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

const data = [
  {
    title: 'Click through ratio',
    subtitle: (
      <span>
        <span className="mr-1">15%</span>
        <TrendingUp size={20} strokeWidth={1} className="text-success" />
      </span>
    )
  },
  {
    title: 'Cost per thousand',
    subtitle: (
      <span>
        <span className="mr-1">$320.89</span>
        <TrendingDown size={20} strokeWidth={1} className="text-error" />
      </span>
    )
  },
  {
    title: 'Bounce rate',
    subtitle: (
      <span>
        <span className="mr-1">34%</span>
        <TrendingUp size={20} strokeWidth={1} className="text-success" />
      </span>
    )
  }
];

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

const Overview = ({data}) => {
  // console.log(data)
  return (
    <div>
      <Card
        bodyStyle={{ padding: '1rem' }}
        className="mb-4"
      >
        <Typography>
          <Title>Welcome to TBA</Title>
          <br />
          <Paragraph>
            A new way to connect the community with experiences. In the process of internal desktop applications development, many different design specs and
            implementations would be involved, which might cause designers and developers difficulties and
            duplication and reduce the efficiency of development.
          </Paragraph>
          <br />
 
        </Typography>
        <Button href="/create">Create an Event</Button>

      </Card>
{/* 
      <Row gutter={16}>
        <Col sm={24} md={8} className="mb-4">
          <Card bodyStyle={{ padding: 0 }}>
            <Row
              type="flex"
              align="middle"
              justify="center"
              gutter={16}
              className="py-4"
            >
              <Progress
                type="dashboard"
                percent={90}
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
                      <small>30% commission rate</small>
                    </div>
                  </span>
                )}
              />
            </Row>

            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <a
                        href="javascript:;"
                        className="px-4"
                        css={`
                          display: flex;
                        `}
                      >
                        {item.title}
                        <span className="mr-auto" />
                        <small>{item.subtitle}</small>
                      </a>
                    }
                  />
                </List.Item>
              )}
            />
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
      </Row>

      <Row gutter={16}>
        <Col md={24} lg={12}>
          <WeatherCard city="harare" country="zw" days={7} />
        </Col>

        <Col md={24} lg={12}>
          <PostCard
            title="Shrimp and Chorizo Paella"
            subtitle="Yesterday"
            image="/static/images/unsplash/1.jpg"
            images={[
              '/static/images/unsplash/1.jpg',
              '/static/images/unsplash/15.jpg'
            ]}
            imageHeight={309}
            text="Phileas Fogg and Aouda went on board, where they found Fix already installed. Below deck was a square cabin, of which the walls bulged out in the form of cots, above a circular divan; in the centre was a table provided with a swinging lamp."
          />
        </Col>
      </Row> */}
    </div>
  );
};

export default Overview;
