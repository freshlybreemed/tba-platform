import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { connect } from 'react-redux'
import { Button, CardHeader, Card, CardBody, CardFooter, FormGroup, Label, FormText,Col, Collapse, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Table } from 'reactstrap';
import axios from 'axios'
import LaddaButton, { SLIDE_LEFT } from 'react-ladda';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './react_dates_overrides.css';
import PlacesAutocomplete from 'react-places-autocomplete';
const initialText = `<p>Include <strong>need-to-know information</strong> to make it easier for people to search for your event page and buy tickets once they're there.</p><p><br></p><p><br></p><p><br></p>`

const mapStateToProps = state => {
  const { user, events } = state;
  return { user, events };
};
class Create extends Component {

  constructor(props){
    super(props);
    this.state = {      
      expSlideLeft: false,
      ready: false,
      isOpen: false,
      uploading: false,
      orientation: 'vertical',
      openDirection: 'down',
      currentTicketType: '',
      currentTicketQuantity: 0,
      currentTicketName: '',
      currentTicketPrice: 0,
      currentTicketDescription: '',
      images: [],
      event: {
        title: "",
        organizerId: "",
        description: initialText,
        endDate: "",
        startDate: "",
        eventType: "",
        image: {
          cdnUri: "",
          files: [""]
        }, 
        location: {
          name: "",
          address: {
            streetAddress: "",
            city: "",
            state: "",
            postalCode: "",
            country: ""
          }
        },
        organizer: {
          name: "",
          id: ""
        },
        refundable: true,
        tags: "",
        ticketTypes: {
        },
        updatedAt: "",
        user: "",
        doorTime: "",
        eventStatus: "draft"
      }
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.processUpload = this.processUpload.bind(this)
    this.ticketCreation = this.ticketCreation.bind(this)
    this.createTicket = this.createTicket.bind(this)
    this.autocompleteInit = this.autocompleteInit.bind(this)
    this.renderTickets = this.renderTickets.bind(this)
    this.toggle = this.toggle.bind(this)
    this.modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']                                         // remove formatting button
      ]
    }

  }
  componentDidMount () {
    console.log(window.location.hash.split('/')[1])
    if (window.location.hash.split('/')[1] === 'edit'){
      const id = window.location.hash.split('/')[2]
      let event = this.props.events.filter(event=> event._id === id)[0]
      this.setState({event},()=>console.log(this.state.event))
    }
    else{
      let event = this.state.event
      event.organizerId = this.props.user.sub
      this.setState({event},()=>console.log(this.state.event))
    }
    this.autocompleteInit()
  }
  autocompleteInit(){
    var set = () => this.setState({ready: true})
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBWqhUxBtnG59S2Lx47umesuG-NnLpMGSA&libraries=places";
    script.async = true;
    script.onload = set 
    document.body.appendChild(script)
  }
  processUpload = async e => {
    console.log(e.target.files[0])
    const files = Array.from(e.target.files)
    this.setState({ uploading: true })

    const formData = new FormData()

    files.forEach((file, i) => {
      console.log(i)
      formData.append("file", file)
    })

    await axios(`/upload`, {
      method: 'POST',
      data: formData,
    })
    .then(res => {
      let event = this.state.event
      event.image.cdnUri = res.data.url
      let link = "https:"+event.image.cdnUri.split(':')[1]  
      console.log(link)
      this.setState({event, uploading: false})
    })
    .catch(err =>{
      this.setState({uploading: false})
    })
  }

  getDetailsForPlaceId(placeId) {
    return new Promise((resolve, reject) => {
      const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
      const request = {
          placeId,
          fields: ['address_components']
      };
      placesService.getDetails(request, (result, status) => {
        var location ={
          itemRoute: "",
          streetAddress: "",
          city: "",
          state: "",
          postalCode: "",
          country: ""
        }
        console.log(result)
        const address = result.address_components
        address.forEach(address_component => {
          switch (address_component.types[0]){
            case "route":
              location.itemRoute = address_component.short_name;
              break;
            case "locality":
              location.city = address_component.short_name;
              break;
            case "administrative_area_level_1":
              location.state = address_component.short_name;
              break;
            case "country":
              location.country = address_component.short_name;
              break;
            case "postal_code": 
              location.postalCode = address_component.short_name;
              break;
            case "street_number":
              location.streetAddress = address_component.short_name;
              break;
            default:
              break;
          }
        })
        if (location.itemRoute){
          location.streetAddress = location.streetAddress + ' ' + location.itemRoute
        } 
        delete location.itemRoute
        var obj = {...this.state.event}
        obj.location.address = location
        this.setState({event: obj},()=>console.log(this.state))
      });
    });
  }
  handleLocationChange = address => {
    var event = {...this.state.event}
    event.location.name = address
    this.setState({ event });
  };

  handleSelect = async (address, placeId) => {
    var event = {...this.state.event}
    event.location.name = address
    this.setState({ event });
    this.getDetailsForPlaceId(placeId);
  };
  handleSubmit(e) {
    e.preventDefault();
    let event = this.state.event
    event.eventStatus = 'live'
    event.updatedAt = new Date()
    axios('/event',{
      method: 'POST',
      data: {
          event
      },
    }).then((res) => {
      console.log("RESPONSE RECEIVED: ", res);
    })
    .catch((err) => {
      console.log("AXIOS ERROR: ", err);
    })
  }
  toggle(type) {
    if (type === "expSlideLeft") {
      console.log(type)
      this.setState({
        [type]: !this.state[type],
        progress: 0.5
      })
    } 
    else if (type !== "cancel" ) {
      this.setState(state => ({ 
        isOpen: true,
        currentTicketType: type
      }),()=>console.log(this.state.currentTicketType));
    }
    else {
      this.setState(state => ({ 
        isOpen: !state.isOpen
       }),()=>console.log(this.state));
     }
  }
  // TODO: Add validators
  ticketCreation(){
    return (
    <div> 
      <FormGroup row>
        <Col md="3">
          <Label htmlFor="text-input">Name</Label>
        </Col>
        <Col xs="12" md="9">
          <Input type="text" id="text-input" value={this.state.currentTicketName} onChange={this.handleChange} name="currentTicketName" required/>
          <FormText color="muted"></FormText>
        </Col>
      </FormGroup>
      {this.state.currentTicketType !== "donation" ?

      <FormGroup row>

        <Col>
          <Label htmlFor="text-input">Quantity</Label>
        </Col>
        <Col>
          <Input type="text" id="text-input" value={this.state.currentTicketQuantity} onChange={this.handleChange} name="currentTicketQuantity" required/>
          <FormText color="muted"></FormText>
        </Col>
      </FormGroup> : '' }
      {this.state.currentTicketType === "paid" ?
        <FormGroup row>
          <Col md="3">
            <Label htmlFor="text-input">Price</Label>
          </Col>
          <Col xs="12" md="9">
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <Input type="number" id="text-input" value={this.state.currentTicketPrice} onChange={this.handleChange} name="currentTicketPrice"  required/>
            </InputGroup>
          </Col>
        </FormGroup> : ''}
      <FormGroup row>
        <Col md="3">
          <Label htmlFor="text-input">Ticket Description</Label>
        </Col>
        <Col xs="12" md="9">
          <Input type="text" name="currentTicketDescription" value={this.state.currentTicketDescription} onChange={this.handleChange} id="text-input" rows="9"
                  placeholder="Include need-to-know information here...." required/>
        </Col>
        <Col>
          <Button color="secondary" onClick={this.createTicket} size="md" >Save</Button>
          <Button color="secondary" onClick={() => this.toggle("cancel")} size="md" >Cancel</Button>
        </Col>
      </FormGroup>
    </div>
    )
  }
  createTicket(){
    const state = this.state
    const currentTicketName = state.currentTicketName
    var tickets = state.event.ticketTypes
    tickets[currentTicketName] = {
      name: state.currentTicketName, 
      type: state.currentTicketType, 
      description: state.currentTicketDescription,
      startingQuantity: parseInt(state.currentTicketQuantity), 
      currentQuantity: parseInt(state.currentTicketQuantity), 
      price: parseInt(state.currentTicketPrice),
      fees: state.currentTicketPrice * .16
    }
    state.event.ticketTypes = tickets
    state.currentTicketDescription = ''
    state.currentTicketName= ''
    state.currentTicketPrice= ''
    state.currentTicketType= ''
    state.currentTicketQuantity= ''
    
    this.setState({
      state,
      isOpen: !state.isOpen
    },()=>console.log(this.state.event.ticketTypes))
  }
  handleChange(evt) {
    // console.log(evt.target.name)
    const set = (path, value) => {
      var schema = obj;  // a moving reference to internal objects within obj
      var pList = path.split('.');
      var len = pList.length;
      for(var i = 0; i < len-1; i++) {
          var elem = pList[i];
          if( !schema[elem] ) schema[elem] = {}
          schema = schema[elem];
      }
      schema[pList[len-1]] = value;
    }
    if (typeof evt==="string"){
      var obj = {...this.state}
      obj.event.description = evt
      this.setState({obj},()=> console.log(this.state));
      return
    }
    if (evt.target.name.split('.').length>1){
      console.log(evt.target.name)
      var obj = {...this.state}
      var ticketType = {}
      if(evt.target.name.split('.')[0] + '.' + evt.target.name.split('.')[1] === "event.ticketTypes"){
        
        console.log(evt.target.name.split('.'), evt.target.value)
        // set(evt.target.name, evt.target.value)
      }
      set(evt.target.name, evt.target.value)
      console.log(evt.target.name, evt.target.value)
      set(evt.target.name, evt.target.value)
      this.setState({ ...obj },()=> console.log(this.state));

    }else{
      console.log({[evt.target.name]: evt.target.value})
      this.setState({[evt.target.name]: evt.target.value}, () => console.log(this.state))
    }
    
  }
  renderTickets(){
    const tickets = []
    for (var ticket in this.state.event.ticketTypes){
      const ticketInfo = this.state.event.ticketTypes[ticket]
      tickets.push(<tr>
        <td className="text-center">
          <Input type="text" id="text-input" onChange={this.handleChange} value={ticketInfo.name}name={`event.ticketTypes.${ticket}`}required/>
        </td>
        <td>
          <div className="clearfix">
            <div className="float-center">
            <Input type="text" id="text-input" onChange={this.handleChange} value={typeof this.state.event.ticketTypes.GA !== 'undefined' ? this.state.event.ticketTypes["GA"].price: "idk" }name={`event.ticketTypes.${ticket}`}
             required/>
            </div>
          </div>
        </td>
        <td className="text-center">
          {ticketInfo.price === 0? "Free": `$${ticketInfo.price}`}
          </td>
          <td className="text-center">
          <Link class="btn btn-success">Edit
            {/* <i class="fa fa-edit"></i> */}
          </Link>
          <Link class="btn btn-danger">
            <i class="fa fa-trash"></i>
          </Link>
        </td>
      </tr>
      )
    }
    return tickets
  
  }
  render() {

    return (
      <div className="animated fadeIn">
      <Row>
        <Col xs="12">

        <Card>
          <CardHeader>
            <strong>{window.location.hash.split('/')[1] !== 'edit'? "Create Event": "Edit Event"}</strong>
          </CardHeader>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Event Title</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="text-input" onChange={this.handleChange} value={this.state.event.title }name="event.title" required/>
                  <FormText color="muted">Give it a short distinct name</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Location</Label>
                </Col>
                <Col xs="12" md="9">
                  {this.state.ready? 
                    <PlacesAutocomplete
                    value={this.state.event.location.name}
                    onChange={this.handleLocationChange}
                    onSelect={this.handleSelect}
                    >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div>
                        <input
                          {...getInputProps({
                            className: 'form-control',
                            id:"text-input"
                          })}
                        />
                        <div className="autocomplete-dropdown-container">
                          {loading && <div>Loading...</div>}
                          {suggestions.map(suggestion => {
                            const className = suggestion.active
                              ? 'suggestion-item--active'
                              : 'suggestion-item';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                              ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                              : { backgroundColor: '#ffffff', cursor: 'pointer' };
                            return (
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                  style,
                                })}
                              >
                                <span>{suggestion.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete> : ""}
                  <FormText color="muted">Enter venue or address</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="datetime">Start Date </Label>
                </Col>
                <Col md="3">
                  <Input type="date" id="date-input" name="event.startDate" value={this.state.event.startDate } onChange={this.handleChange} placeholder="time" required/>
                </Col>
                <Col md="3">
                  <Label htmlFor="datetime">Start Time</Label>
                </Col>
                <Col md="3">
                  <Input type="time" id="time-input" name="time-input" placeholder="time" required/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="datetime">End Date</Label>
                </Col>
                <Col md="3">
                  <Input type="date" id="date-input" name="event.endDate" value={this.state.event.endDate } onChange={this.handleChange} placeholder="date" required/>
                </Col>
                <Col md="3">
                  <Label htmlFor="datetime">End Time</Label>
                </Col>
                <Col md="3">
                  <Input type="time" id="time-input" name="time-input" placeholder="time" required/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="textarea-input">Event Description</Label>
                </Col>
                <Col xs="12" md="9">
                  <ReactQuill  value={this.state.event.description} name="event.description" onChange={this.handleChange} modules={this.modules} />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col >
                  <Label htmlFor="text-input">Event Organizer</Label>
                </Col>
                <Col>
                  <Input type="text" id="text-input" value={this.state.event.organizer } onChange={this.handleChange} name="event.organizer" required/>
                  <FormText color="muted"></FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="selectSm">Event Type</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="event.eventType" value={this.state.event.eventType } onChange={this.handleChange} id="Select">
                    <option value="" selected="selected">Select the type of event</option>
                    <option value="19">Appearance or Signing</option>
                    <option value="17">Attraction</option>
                    <option value="18">Camp, Trip, or Retreat</option>
                    <option value="9">Class, Training, or Workshop</option>
                    <option value="6">Concert or Performance</option>
                    <option value="1">Conference</option>
                    <option value="4">Convention</option>
                    <option value="8">Dinner or Gala</option>
                    <option value="5">Festival or Fair</option>
                    <option value="14">Game or Competition</option>
                    <option value="10">Meeting or Networking Event</option>
                    <option value="100">Other</option>
                    <option value="11">Party or Social Gathering</option>
                    <option value="15">Race or Endurance Event</option>
                    <option value="12">Rally</option>
                    <option value="7">Screening</option>
                    <option value="2">Seminar or Talk</option>
                    <option value="16">Tour</option>
                    <option value="13">Tournament</option>
                    <option value="3">Tradeshow, Consumer Show, or Expo</option>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label>Add Tickets</Label>
                </Col>
                <Col md="9">
                  <Table hover responsive className="table-outline mb-0 d-sm-table">
                  <thead className="thead-light">
                    <tr>
                      <th className="text-center">Ticket Name</th>
                      {/* <th>Name</th>
                      <th className="text-center">Quantity</th>
                      <th>Date</th>*/}
                      <th >Quantity available</th> 
                      <th className="text-center">Price</th> 
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderTickets()}
                  </tbody>
                </Table>
                </Col>
              </FormGroup>
                  <FormGroup row>
                  <Col md="3">
                      </Col>
                      <Col xs="12" md="9">

                    <Button onClick={() => this.toggle("rsvp")}>+ RSVP</Button>
                    <Button onClick={() => this.toggle("paid")}>+ Paid Ticket</Button>
                    <Button onClick={() => this.toggle("donation")}>+ Donation</Button>
                  </Col>
                  </FormGroup>
                
                
              <Collapse isOpen={this.state.isOpen}>
                <h4>Create Ticket</h4>
                  {this.ticketCreation()}
              </Collapse>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="file-input">Add event image</Label>
                </Col>
                <Col xs="12" md="9">
                  <input type="file" id="file-input"  onChange={this.processUpload} name="file" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="file-multiple-input">Slideshow Images</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="file" id="file-multiple-input" name="file-multiple-input" multiple />
                </Col>
              </FormGroup>
              <FormGroup row hidden>
                <Col md="3">
                  <Label className="custom-file" htmlFor="custom-file-input">Custom file input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Label className="custom-file">
                    <Input className="custom-file" type="file" id="custom-file-input" name="file-input" />
                    <span className="custom-file-control"></span>
                  </Label>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
          <CardFooter>
            <h6>slide-left</h6>
            <LaddaButton
              className="btn btn-info btn-ladda"
              loading={this.state.expSlideLeft}
              onClick={() => this.toggle('expSlideLeft')}
              data-color="blue"
              data-style={SLIDE_LEFT}
            >
            Submit!
            </LaddaButton>
            {/* <Button disabled class="btn btn-success btn-ladda" data-style="slide-left" onClick={this.handleSubmit} type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button> */}
            {this.state.uploading? 
              <Button disabled class="btn btn-success btn-ladda" data-style="slide-left" onClick={this.handleSubmit} type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>:
              <Button onClick={this.handleSubmit} type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>}
            <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
          </CardFooter>
        </Card>
        
        </Col>
      </Row>
    </div>
    
    );
  }
}

export default connect(mapStateToProps)(Create);
