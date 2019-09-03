import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Button, ButtonDropdown, Card, CardBody,DropdownMenu, DropdownToggle, DropdownItem, Jumbotron,ListGroupItem, ListGroup, Col, Row } from 'reactstrap';
import axios from 'axios';

const mapStateToProps = state => {
  const { user, events } = state
  return { user, events };
};class MyEvents extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.renderCurrentEvents = this.renderCurrentEvents.bind(this)
    this.renderDraftEvents = this.renderDraftEvents.bind(this)
    this.renderPastEvents = this.renderPastEvents.bind(this)
    this.getTime = this.getTime.bind(this)
    this.state = {
      dropdownOpen: new Array(19).fill(false),
    }

  }
  componentDidMount(){
    if (process.env.NODE_ENV === "development") {
      const events= [
        {
          "_id": "5d44c4dccd8a030007dc3cb5",
          "title": "The Hav Mercy show",
          "description": "Going to be soooo much fun. Endless suya and goat and beautiful people celebrating amazing culture.\n\nFeaturing a live band and music by Seagraves. See you all soon!",
          "endDate": "2019-08-02",
          "startDate": "2019-08-02",
          "eventType": "17",
          "image": {
            "cdnUri": "https://res.cloudinary.com/dzsf703vh/image/upload/v1564787834/zrtj1pjky7lnzta1h1l6.jpg",
            "files": [
              ""
            ]
          },
          "location": {
            "name": "Cloak & Dagger, U Street Northwest, Washington, DC, USA",
            "address": {
              "streetAddress": "1359 U St NW",
              "city": "Washington",
              "state": "DC",
              "postalCode": "20009",
              "country": "US"
            }
          },
          "organizer": "Freshly Breemed",
          "refundable": true,
          "tags": "",
          "ticketTypes": {
            "GA": {
              "name": "GA",
              "type": "paid",
              "price": 15,
              "fees": 2.45,
              "currentQuantity": 0,
              "startingQuantity": 20
            },
            "RSVP": {
              "name": "RSVP",
              "type": "rsvp",
              "price": 0,
              "fees": 0,
              "startingQuantity": 20,
              "currentQuantity": 0
            }
          },
          "user": "",
          "doorTime": "",
          "eventStatus": "live",
          "organizerId": "123"
        },
        {
          "_id": "2334c4dccd8a030007dc3cb5",
          "title": "The Hav Mercy (draft)",
          "description": "Going to be soooo much fun. Endless suya and goat and beautiful people celebrating amazing culture.\n\nFeaturing a live band and music by Seagraves. See you all soon!",
          "endDate": "2019-08-02",
          "startDate": "2019-08-02",
          "eventType": "17",
          "image": {
            "cdnUri": "https://res.cloudinary.com/dzsf703vh/image/upload/v1564787834/zrtj1pjky7lnzta1h1l6.jpg",
            "files": [
              ""
            ]
          },
          "location": {
            "name": "Cloak & Dagger, U Street Northwest, Washington, DC, USA",
            "address": {
              "streetAddress": "1359 U St NW",
              "city": "Washington",
              "state": "DC",
              "postalCode": "20009",
              "country": "US"
            }
          },
          "organizer": "Freshly Breemed",
          "refundable": false,
          "tags": "",
          "ticketTypes": {
            "GA": {
              "name": "GA",
              "type": "paid",
              "price": 15,
              "fees": 2.45,
              "currentQuantity": 0,
              "startingQuantity": 20
            },
            "RSVP": {
              "name": "RSVP",
              "type": "rsvp",
              "price": 0,
              "fees": 0,
              "startingQuantity": 20,
              "currentQuantity": 0
            }
          },
          "user": "",
          "doorTime": "",
          "eventStatus": "draft",
          "organizerId": "123"
        },
        {
          "_id": "5d4f8597736a117fe680b83c",
          "title": "The Hav Mercy show",
          "description": "Going to be soooo much fun. Endless suya and goat and beautiful people celebrating amazing culture.\n\nFeaturing a live band and music by Seagraves. See you all soon!",
          "endDate": "2019-10-02",
          "startDate": "2019-10-02",
          "eventType": "17",
          "image": {
            "cdnUri": "https://res.cloudinary.com/dzsf703vh/image/upload/v1564787834/zrtj1pjky7lnzta1h1l6.jpg",
            "files": [
              ""
            ]
          },
          "location": {
            "name": "Cloak & Dagger, U Street Northwest, Washington, DC, USA",
            "address": {
              "streetAddress": "1359 U St NW",
              "city": "Washington",
              "state": "DC",
              "postalCode": "20009",
              "country": "US"
            }
          },
          "organizer": "Freshly Breemed",
          "refundable": true,
          "tags": "",
          "ticketTypes": {
            "GA": {
              "name": "GA",
              "type": "paid",
              "price": 15,
              "fees": 2.45,
              "currentQuantity": 0,
              "startingQuantity": 20
            },
            "RSVP": {
              "name": "RSVP",
              "type": "rsvp",
              "price": 0,
              "fees": 0,
              "startingQuantity": 20,
              "currentQuantity": 0
            }
          },
          "user": "",
          "doorTime": "",
          "eventStatus": "live",
          "organizerId": "123"
        }
      ]
      this.setState(events)
    }
    this.renderCurrentEvents()
    this.renderDraftEvents()
    this.renderPastEvents()
    // console.log(this.state.events)
  }
  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => { return (index === i ? !element : false); });
    this.setState({
      dropdownOpen: newArray,
    });
  }
  getTime(datetime){
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var dateTime = new Date(datetime)
    var day = days[dateTime.getDay()];
    var hr = dateTime.getHours();
    var min = dateTime.getMinutes();
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
    return day + " " + month + " "+ date+ " ";

  }
  renderCurrentEvents(){
    let currentEvents = []
    this.props.events.map(event=>{
      console.log(event)
      if (event.eventStatus === 'live' && new Date(event.startDate).getTime() >new Date().getTime()) {
        currentEvents.push(
          <ListGroup>
            <ListGroupItem className="float-right" >{event.title}
              <div className="small text-muted">
                  {this.getTime(event.startDate)}
                </div> 
              <ButtonDropdown className="float-right" isOpen={this.state.dropdownOpen[0]} toggle={() => { this.toggle(0); }}>
                <DropdownToggle caret>
                  Manage
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag={Link} to={`/manage/${event._id}`}>Manage</DropdownItem>
                  <DropdownItem tag={Link} to={`/edit/${event._id}`}>Edit</DropdownItem>
                  <DropdownItem tag={Link} to={`/event/${event._id}`}>View</DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </ListGroupItem>
          </ListGroup>
        )
      }
    })
    return currentEvents
  }
  renderDraftEvents(){
    let draftEvents = []
    this.props.events.map(event=>{
      console.log(event)
      if (event.eventStatus === 'draft') {
    let draftEvents = []
      draftEvents.push(
          <ListGroup>
            <ListGroupItem className="float-right" >{event.title}
              <div className="small text-muted">
                  {this.getTime(event.startDate)}
                </div> 
              <ButtonDropdown className="float-right" isOpen={this.state.dropdownOpen[1]} toggle={() => { this.toggle(1); }}>
                <DropdownToggle caret>
                  Manage
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag={Link} to={`/manage/${event._id}`}>Manage</DropdownItem>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Publish</DropdownItem>
                  <DropdownItem>View</DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </ListGroupItem>
          </ListGroup>
        )
      }
    })
    return draftEvents
  }
  renderPastEvents(){
    let pastEvents = []
    this.props.events.map(event=>{
      console.log(event)
      if (event.eventStatus === 'live' && new Date(event.startDate).getTime() <new Date().getTime()) {
        pastEvents.push(
          <ListGroup>
            <ListGroupItem className="float-right" >{event.title}
              <div className="small text-muted">
                  {this.getTime(event.startDate)}
                </div> 
              <ButtonDropdown className="float-right" isOpen={this.state.dropdownOpen[1]} toggle={() => { this.toggle(1); }}>
                <DropdownToggle caret>
                  Manage
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag={Link} to={`/manage/${event._id}`}>Manage</DropdownItem>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>View</DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </ListGroupItem>
          </ListGroup>
        )
      }
    })
    return pastEvents
  }
  render() {
    console.log(this.props)
    const { events, user } = this.props

    return (
      <div className="animated fadeIn">
      <Row>
        <Col>
        {typeof events !== 'undefined' && events.length> 0 ?
          <div>
            <h5>Current Events</h5>
            {this.renderCurrentEvents()}
            <br />
            <h5>Event Drafts</h5>
            {this.renderDraftEvents()}
            <br />
            <h5>Past Events</h5>
            {this.renderPastEvents()}
          </div> : 
          <Card>
            <CardBody>
              <Jumbotron>
                <h1 className="display-3">Welcome to TBA!</h1>
                <p className="lead">A new way to connect the community with experiences</p>
                <hr className="my-2" />
                <p>Come join the family!</p>
                <p className="lead">
                  <Button href="#/create" color="primary">Create an Event</Button>
                </p>
              </Jumbotron>
            </CardBody>
          </Card>}
        </Col>
      </Row>
    </div>
    
    );
  }
}

export default connect(mapStateToProps)(MyEvents);
