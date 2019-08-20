import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { TextMask, InputAdapter } from 'react-text-mask-hoc';
import { Button, CardHeader, Card, CardBody, CardFooter, FormGroup, Label, FormText, Badge,Col, Table, Container, Collapse, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios'
import LaddaButton, { SLIDE_LEFT } from 'react-ladda';
import { DateRangePicker } from 'react-dates';
import { connect } from "react-redux";
import 'react-dates/lib/css/_datepicker.css';
import './react_dates_overrides.css';
import PlacesAutocomplete from 'react-places-autocomplete';
const initialText = `<p>Include <strong>need-to-know information</strong> to make it easier for people to search for your event page and buy tickets once they're there.</p><p><br></p><p><br></p><p><br></p>`

const mapStateToProps = state => {
  return { user: state.user };
};
class AccountSettings extends Component {

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
        user: "",
        doorTime: "",
        eventStatus: ""
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.processUpload = this.processUpload.bind(this)
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
      let user = this.props.user
      user.picture = res.data.url
      let link = "https:"+user.picture.split(':')[1]  
      console.log(link)
      this.setState({user, uploading: false})
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
    axios('/event',{
      method: 'POST',
      data: {
          "event": {...this.state.event}
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
  handleChange(evt) {
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
      // set("event.description",evt)
    }
    else if (evt.target.name.split('.').length>1){
      var obj = {...this.state}
      var ticketType = {}
      if(evt.target.name.split('.')[0] + '.' + evt.target.name.split('.')[1] === "event.ticketTypes"){
      }
      console.log(evt.target.name, evt.target.value)
      set(evt.target.name, evt.target.value)
      // console.log(obj)
    }
    this.setState({ ...obj },()=> console.log(this.state));
  }
  render() {

    return (
      <div className="animated fadeIn">
      <Row>
        <Col xs="12">

        <Card>
          <CardHeader>
            <strong>Account Settings</strong>
          </CardHeader>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">First Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="text-input" value={this.props.user.given_name} onChange={this.handleChange} name="firstName" required/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Last Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="text-input" value={this.props.user.family_name} onChange={this.handleChange} name="lastName" required/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Organizer Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="text-input" onChange={this.handleChange} name="organizerName" required/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label>Phone Number</Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><i className="fa fa-phone"></i></InputGroupText>
                  </InputGroupAddon>
                  <TextMask
                    mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    Component={InputAdapter}
                    className="form-control"
                  />
                </InputGroup>
                <FormText color="muted">
                  ex. (999) 999-9999
                </FormText>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Home Address</Label>
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
                </Col>
              </FormGroup>
          
              <FormGroup row>
                <Col md="3">
                  <Label>Date of Birth</Label>
                </Col>
                <Col md="9">
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><i className="fa fa-calendar"></i></InputGroupText>
                    </InputGroupAddon>
                    <TextMask
                      mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                      Component={InputAdapter}
                      className="form-control"
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <Collapse isOpen={this.state.isOpen}>
                <h4>Create Ticket</h4>
              </Collapse>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="file-input">Add profile picture</Label>
                </Col>
                <Col xs="12" md="9">
                  <input type="file" id="file-input"  onChange={this.processUpload} name="file" />
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

export default connect(mapStateToProps)(AccountSettings);
