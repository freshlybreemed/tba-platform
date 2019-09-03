import React, { Component, lazy } from 'react';
import { Container, Col,Fade, Media, Row, Nav, NavItem, NavbarBrand, Collapse, NavLink, NavbarToggler, DropdownMenu, Jumbotron, Navbar, DropdownItem, Table, UncontrolledDropdown } from 'reactstrap';
import { connect } from "react-redux";
import { getUser, getEvents } from "../../../redux/actions/index";

const mapStateToProps = state => {
  console.log(state)
  const { user } = state 
  return { user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: user => dispatch(getUser(user)),
    getEvents: events => dispatch(getEvents(events))
  }
}
class TicketConfirmation extends Component {  
  constructor(props) {
  super(props);

  this.state = {
    isOpen: false,
    collapse: false,
    fadeIn: false
  };
  this.toggle = this.toggle.bind(this);
  this.getTotal = this.getTotal.bind(this)
}
  getTotal(){
    let total = 0;
    for (var ticket in this.state.ticketsTypes){
      ticket = this.state.ticketsTypes[ticket]
      console.log(ticket)
      total = total + ticket.count* (ticket.price+ticket.fees)
    }
    this.setState({total})
  }
  render() {

    return (
      <div>
      <Navbar color="light" light expand="md">
          <NavbarBrand href="/">TBA</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/components/">About</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">Search</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <div className="app align-items-center">
        <Container>
        <Jumbotron>
          <Media width="100%" src="https://chickenandmumbosauce.com/static/img/930-recap/IMG_8163.jpg"/>
          <br />
          <h1>Chicken & Mumbo Sauce</h1> 
            <br />
            <p className="lead"> Thank you for signing up for Chicken & Mumbo Sauce. Please check your email for confirmation. </p>
          <Row>
          <Col>
            <p> 
              <i className="icon-location-pin icons font-2x lmt-4"></i>
              <div>9:30 Club</div>
              <p className="text-muted">815 V St NW <br />Washington, DC 20001</p>
            </p>
            <p><i className="icon-clock icons font-2x lmt-4"></i><p className="text-muted"> Doors open at 10pm </p></p>
            <hr className="my-2" />            
          </Col>
          </Row>
        </Jumbotron>

        </Container>
      </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketConfirmation);