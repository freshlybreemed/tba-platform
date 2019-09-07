import React, { Component } from 'react';
import 'quill/dist/quill.snow.css';
import 'react-dates/lib/css/_datepicker.css';
import './react_dates_overrides.css';
import { getUser } from "../../redux/actions/index";
import { TextMask, InputAdapter } from 'react-text-mask-hoc';
import { Button, CardHeader, Card, CardBody, CardFooter, FormGroup, Label, FormText,Col, Collapse, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios'
import { connect } from "react-redux";
import PlacesAutocomplete from 'react-places-autocomplete';

const mapStateToProps = state => {
  return { user: state.user };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getUser: user => dispatch(getUser(user)),
  }
}
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
      images: [],
      user: {
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
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.processUpload = this.processUpload.bind(this)
    this.toggle = this.toggle.bind(this)
    

  }
  componentDidMount () {
    let user = {...this.props.user}
    user.location = {
      name: ""
    }
    var set = () => this.setState({ready: true, user})
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
        var obj = {...this.state.user}
        obj.location.address = location
        this.setState({user: obj},()=>console.log(this.state))
      });
    });
  }
  handleLocationChange = address => {
    var user = {...this.state.user}
    user.location.name = address
    this.setState({ user });
  };

  handleSelect = async (address, placeId) => {
    var user = {...this.state.user}
    user.location.name = address
    this.setState({ user });
    this.getDetailsForPlaceId(placeId);
  };
  handleSubmit(e) {
    e.preventDefault();
    if (process.env.NODE_ENV !== "development"){
      axios('/user',{
        method: 'POST',
        data: {
            "user": {...this.state.user}
        },
      }).then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      })
    }
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
    let obj = {...this.state}
    if(evt.target.name.split('.')[0] + '.' + evt.target.name.split('.')[1] === "event.ticketTypes"){
    }
    console.log(evt.target.name, evt.target.value)
    set(evt.target.name, evt.target.value)
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
                    <Input type="text" id="text-input" value={this.props.user.given_name} onChange={this.handleChange} name="user.firstName" required/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Last Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="text" id="text-input" value={this.props.user.family_name} onChange={this.handleChange} name="user.lastName" required/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Organizer Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="text" id="text-input" onChange={this.handleChange} name="user.organizerName" required/>
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
                      name="user.phoneNumber"
                      onChange={this.handleChange}
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
                      value={this.state.user.location.name}
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
                        name="user.dateOfBirth"
                        onChange={this.handleChange}
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
