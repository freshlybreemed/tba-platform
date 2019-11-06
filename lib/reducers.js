import moment from 'moment'
import { formatPrice } from '../lib/helpers';

const reducer = (
    state = {
      myEvents: [],
      user: {},
      createdEventForm: {
        title: {
        },
        organizerId:  '',
        description: {
          value: `<p>Include <strong>need-to-know information</strong> to make it easier for people to search for your event page and buy tickets once they're there.</p><p><br></p><p><br></p><p><br></p>`
        },
        endTime: {
          value: ''
        },
        endDate: {
          value: ''
        },
        startTime: {
          value: ''
        },
        eventType: {
          value: ''
        },
        startDate: {
          value: ''
        },
        cdnUri: {
            value: ''
        },
        discountCodes: {
          
        },
        image: "", 
        location: {
          name: "",
          streetAddress: "",
          city: "",
          state: "",
          postalCode: "",
          country: ""
        },
        organizer: {
            value: ''
        },
        refundable: true,
        tags: "",
        ticketTypes: {
        },
        doorTime: {
          value: ''
        },
        eventStatus: {
          value:"draft"
        }
      },
      createdEvent: {},
      selectedEvent: {},
      eventCheckoutForm: {
        total: 0,
        cart: {},
        eventId: '',
        guestId: '',
        firstName:'',
        status: 'pending',
        lastName: '',
        emailAddress: '',
        phoneNumber: ''
      }
    }, action) => {
    switch (action.type) {
      case 'edit_event':
        let selectedEvent = action.payload;
        let editedEvent = {}
        for (var thing in selectedEvent){  
          editedEvent[thing]= {}
          editedEvent[thing].value = selectedEvent[thing]
        }
        editedEvent.ticketTypes = selectedEvent.ticketTypes
        editedEvent.location = selectedEvent.location
        editedEvent.startDate.value = moment(editedEvent.startDate.value)
        editedEvent.endDate.value = moment(editedEvent.endDate.value)
        editedEvent.endTime= {value: editedEvent.endDate.value}
        editedEvent.startTime= {value: editedEvent.startDate.value}
        let createdEventForm= {...state.createdEventForm, ...editedEvent}
        return Object.assign({},state,{createdEventForm}, {createdEvent: selectedEvent} )

      case 'save_fields':
        let form = {createdEventForm: {...state.createdEventForm, ...action.payload.createdEventForm }}
        let event = {}
        for (var thing in form.createdEventForm){  

          event[thing] = form.createdEventForm[thing].value ? form.createdEventForm[thing].value : form.createdEventForm[thing]
        }
        if (form.createdEventForm.ticketTypes !=='undefined'){
          event.ticketTypes = form.createdEventForm.ticketTypes
        }
        event.organizerId = state.user.sub
        return Object.assign({},state,{createdEvent: event},form )
      case 'update_checkout':
        console.log(action.payload)
        var eventCheckoutForm = {...state.eventCheckoutForm, ...action.payload}
        var eventCheckout = eventCheckoutForm
        for (var thing in eventCheckout){
           console.log(thing)
           console.log(eventCheckout[thing])
          if (typeof eventCheckout[thing].value !== 'undefined'){
            eventCheckout[thing] = eventCheckout[thing].value
          } else{
            
          }
        }
        return Object.assign({},state, {eventCheckoutForm},{eventCheckout} )
      case 'complete_checkout':
        console.log(action.payload)
        
        return Object.assign({},state, {eventCheckoutForm: {...state.eventCheckoutForm, ...action.payload}})
      case 'fetch_events':
        console.log(action.payload)
        return Object.assign({},state, {myEvents: [...action.payload]})
      case 'fetch_event':
        console.log(action.payload)
        return Object.assign({},state, {selectedEvent: {...state.selectedEvent, ...action.payload}})
      case 'update_cart':
        let balance = 0;
        let cart = state.eventCheckoutForm.cart;
        let type = Object.keys(action.payload)[0]
        cart[type] = action.payload[type]
        for (var ticket in cart){
          let tix  = state.selectedEvent.ticketTypes[ticket]
          balance += parseFloat(cart[ticket].quantity * (tix.price+tix.fees))
        }
        var eventCheckout = state.eventCheckoutForm
        for (var thing in eventCheckout){
          if (typeof eventCheckout[thing].value !== 'undefined'){
            eventCheckout[thing] = eventCheckout[thing].value
          }
        }
        const total = balance
        console.log('total',total)
        return Object.assign({},state, {eventCheckout},{eventCheckoutForm: {...state.eventCheckoutForm, total, guestId:state.selectedEvent.guestId, eventId:state.selectedEvent._id,cart}})
      case 'logout_user':
        console.log(action.payload)
        return Object.assign({},state, {user:{}})
      case 'fetch_user':
        return Object.assign({},state, {user:action.payload})
       case 'ticket_creation':
        let obj = Object.assign({},state.createdEventForm.ticketTypes, action.payload)
        console.log(obj)
        return {...state, createdEventForm: {...state.createdEventForm, ticketTypes: { ...obj}}, createdEvent: {...state.createdEvent, ticketTypes: { ...obj}}};
       case 'ticket_deletion':
        let tickets = state.createdEventForm.ticketTypes
        delete tickets[action.payload]
        return {...state, createdEventForm: {...state.createdEventForm, ticketTypes: { ...tickets}}};
       case 'event_deletion':
        let events = state.myEvents.filter(event=>{
          return event._id != action.payload
        })
        delete tickets[action.payload]
        return {...state, myEvents: events};
       default:
        return state;
    }
  }
  
export default reducer