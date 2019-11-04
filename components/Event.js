import { Button, Card, Col, Collapse, Divider, Icon,message, Input,Modal, Row, Tag, Table, Select, Spin, Steps, Statistic} from 'antd'
import { Calendar, Target } from 'react-feather'
import {StripeProvider} from 'react-stripe-elements';
import CardSection from './CardSection'
import EventCheckout from './EventCheckout'
import { Component } from 'react';
import { connect } from 'react-redux';
import MapGL, { Marker, NavigationControl, Popup } from 'react-map-gl';
import {Result} from 'antd'
import PropTypes from 'prop-types';
import axios from 'axios'
import { formatPrice } from '../lib/helpers';

const { Option } = Select;
const { Meta } = Card;
const Panel = Collapse.Panel;
const ButtonGroup= Button.Group
const { Step } = Steps;


const getTime = (datetime, mode) =>{
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
    if (mode === 'start')
      return day + " " + month + " "+ date+ " "+hr + ":" + min + ampm ;
    else {
      return hr + ":" + min + ampm 
    }
}
class Event extends Component {
    constructor(props){
        super(props)
        this.state = {
            stripe: null,
            activeKey: 0,
            current: 0,
            quantity: 0,
            total: 0,
            ModalText: 'Content of the modal',
            visible: false,
            confirmLoading: false,
        };
        this.handleIncrement= this.handleIncrement.bind(this)
    }
    componentDidMount() {
      // Create Stripe instance in componentDidMount
      // (componentDidMount only fires in browser/DOM environment)
        this.setState({stripe: window.Stripe('pk_test_KJ6mPZxJuMvOl8yqmsCtdM9J00bx9VCCpE')});
        const event = this.props.json
        let ticketTypes = {}
        let tickettypes = []
        for (let ticket in event.ticketTypes){
            ticketTypes[ticket] = event.ticketTypes[ticket]
            ticketTypes[ticket].count = 0
            tickettypes.push(ticketTypes[ticket])
        }
        this.setState({data: tickettypes})
    }
    handleIncrement(value, type) { 
        const { selectedEvent } = this.props
        let tixs = {}
        tixs[type] = {
            quantity: value,
            id: selectedEvent.ticketTypes[type].id
        }
        this.props.dispatch({
            type: 'update_cart',
            payload: tixs
        })
      }
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }
    
    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    handleChange() {
        console.log("key");
        this.setState({
          activeKey: this.state.activeKey === 1? 0: 1,
        });    
    }

    render(){
        const { json, eventCheckoutForm } = this.props
        const { current } = this.state;
        const columns = [
            {
              title: 'Ticket Type',
              dataIndex: 'name',
              key: 'name'
            },
            {
              title: 'Price',
              dataIndex: 'price',
              key: 'age',
              render: (text, ticket) => {
                let price
                if (text===0) 
                    price = "Free"
                else
                    price= `$${text} + ${formatPrice(ticket.fees)} Fees`
                return (<>{price}</>)
                }
        
            },
            {
              title: 'Quantity',
              dataIndex: 'count',
              key: 'count',
              render: (text, ticket) => {
                  return(
                  <>
                  <Row>
                      {/* {ticket.currentQuantity<0? */}
                        <Select 
                            defaultValue={this.props.eventCheckoutForm.cart[ticket.name]? this.props.eventCheckoutForm.cart[ticket.name]: 0 } 
                            style={{ width: 120 }} 
                            onChange={(e) => this.handleIncrement(e, ticket.name)}
                        >
                            <Option value={0}>0</Option>
                            <Option value={1}>1</Option>
                            <Option value={2}>2</Option>
                            <Option value={3}>3</Option>
                            <Option value={4}>4</Option>
                        </Select>
                        {/* :<Tag color="red">Sold Out</Tag>
                    } */}
                    </Row>
                  </>
        
              )
            },
        
            }
        ]
        
        const moneySteps = [
            {
                title: 'Select Tickets',
                content: <>
                            <Table pagination={false} 
                            footer={() => `Total: ${formatPrice(eventCheckoutForm.total)}`}
                            columns={columns} dataSource={this.state.data} />
                        </> ,
            },
            {
                title: 'Info',
                content: <EventCheckout  mode="no-payment"/>
            },
            {
                title: 'Checkout',
                status: 'payment',
                content: eventCheckoutForm.total>0?
                        <CardSection />:
                        <EventCheckout  mode="no-payment"/>
            }
        ];
        const freeSteps = [
            {
                title: 'Select Tickets',
                content: <>
                            <Table pagination={false} 
                            footer={() => `Total: ${formatPrice(eventCheckoutForm.total)}`}
                            columns={columns} dataSource={this.state.data} />
                        </> ,
            },
            {
                title: 'Info',
                content: <EventCheckout  mode="no-payment"/>
            },
            {
                title: 'Done',
                content: <EventCheckout Form mode="no-payment"/>
            }
        ];
        const steps = this.props.eventCheckoutForm.total>0? moneySteps:freeSteps
        return (
            <>
                <Card cover={<img src={json.image}/>}>
                    <Statistic title={json.organizer? `${json.organizer} Presents`: ``} value={json.title} valueStyle={{ color: '#000000' }} />
                    {this.props.eventCheckoutForm.status === 'pending'?
                    <>
                    <Row gutter={8}>
                    
                        <Collapse 
                        activeKey={this.state.activeKey} 
                            bordered={false} >
                            <Panel  showArrow={false} key="1">
                                <Steps current={current}  >    
                                {
                                    steps.map(item => (
                                    <Step disabled={true} key={item.title} title={item.title} />
                                ))
                                }
                                </Steps>
                                <div className="steps-content">{steps[current].content}</div>
                                <div className="steps-action">
                                {current > 0 && (
                                    <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                    Previous
                                    </Button>
                                )}
                                {current < steps.length - 1 && (
                                    <Button type="primary" onClick={() => this.next()}>
                                    Next
                                    </Button>
                                )}
                                {/* {current === steps.length - 1 && (
                                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                    Done
                                    </Button>
                                )} */}
                                </div>
                            </Panel>
                        </Collapse>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Divider />
                            <div dangerouslySetInnerHTML={{__html: json.description}}></div>            
                        </Col>
                        <Col span={12}>
                            <Divider />                    
                            {json.location.name.split(',')[0]}
                            <p>{json.location.streetAddress === json.location.name.split(',')[0]? `${json.location.city}, ${json.location.state}`: json.location.streetAddress }</p>
                            {`${getTime(json.startDate, "start")}-${getTime(json.endDate, "end")}`}
                            <p>{json.refundable? "Refundable": "No refunds. All sales are final"}</p>
                            <Button onClick={() => this.handleChange()}>Tickets</Button>
                        </Col>
                    </Row></>: <Result
                    status="success"
                    title="Successfully Purchased Tickets"
                    subTitle={`Your order with ${json.title} has been successfully posted. Your receipt will be emailed to you at ${eventCheckoutForm.emailAddress.value}.`}
                    extra={[
                    <Button type="primary" key="console">
                        Go Console
                    </Button>,
                    <Button key="buy">Buy Again</Button>,
                    ]}
                />}
                    <Row>fg
                        <MapGL
                            {...{latitude: 37.785164,
                            longitude: -100,
                            zoom: 3.5,
                            bearing: 0,
                            pitch: 0      }    }              
                            width="100%"
                        height="100%"
                        mapStyle="mapbox://styles/mapbox/dark-v9"
                        // onViewportChange={this._updateViewport}
                        mapboxApiAccessToken={process.env.mapBoxApi}
                        >
                        {/* {CITIES.map(this._renderCityMarker)}
                        {this._renderPopup()} */}
                        {/* <NavigationControl onViewportChange={this._updateViewport} /> */}
                        </MapGL>
                    </Row>
                </Card>
            </>
        )
    }
}

const mapStateToProps = state => {
    console.log(state)
    return {
        selectedEvent: state.selectedEvent,
        eventCheckoutForm: state.eventCheckoutForm,
        eventCheckout: state.eventCheckout
    }
}
export default connect(mapStateToProps)(Event)