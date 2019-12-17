import moment from "moment";
import { formatPrice } from "../lib/helpers";

const reducer = (
  state = {
    myEvents: [],
    user: {
      accountSettings: {}
    },
    createdEventForm: {
      title: {},
      organizerId: "",
      description: {
        value: `<p>Include <strong>need-to-know information</strong> to make it easier for people to search for your event page and buy tickets once they're there.</p><p><br></p><p><br></p><p><br></p>`
      },
      endTime: {
        value: ""
      },
      endDate: {
        value: ""
      },
      startTime: {
        value: ""
      },
      eventType: {
        value: ""
      },
      startDate: {
        value: ""
      },
      cdnUri: {
        value: ""
      },
      discountCodes: {},
      expenses: {},
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
        value: ""
      },
      refundable: true,
      tags: "",
      ticketTypes: {},
      doorTime: {
        value: ""
      },
      eventStatus: {
        value: "draft"
      }
    },
    userCheckoutForm: {},
    accountSettingsForm: {},
    createdEvent: {},
    selectedEvent: {},
    eventCheckoutForm: {
      total: 0,
      cart: {},
      eventId: "",
      guestId: "",
      firstName: "",
      status: "pending",
      lastName: "",
      emailAddress: "",
      phoneNumber: ""
    }
  },
  action
) => {
  switch (action.type) {
    case "edit_event":
      let selectedEvent = action.payload;
      let editedEvent = {};
      for (var thing in selectedEvent) {
        editedEvent[thing] = {};
        editedEvent[thing].value = selectedEvent[thing];
      }
      editedEvent.ticketTypes = selectedEvent.ticketTypes;
      editedEvent.location = selectedEvent.location;
      editedEvent.startDate.value = moment(editedEvent.startDate.value);
      editedEvent.endDate.value = moment(editedEvent.endDate.value);
      editedEvent.endTime = { value: editedEvent.endDate.value };
      editedEvent.startTime = { value: editedEvent.startDate.value };
      let createdEventForm = { ...state.createdEventForm, ...editedEvent };
      return Object.assign(
        {},
        state,
        { createdEventForm },
        { createdEvent: selectedEvent }
      );
    case "update_account":
      var form = {
        accountSettingsForm: {
          ...state.accountSettingsForm,
          ...action.payload.accountSettingsForm
        }
      };
      var user = state.user;
      user.accountSettings = {};
      for (var thing in form.accountSettingsForm) {
        user.accountSettings[thing] = form.accountSettingsForm[thing].value;
      }
      console.log("user", user);
      return Object.assign({}, state, { user: { ...user } }, form);
    case "save_fields":
      var form = {
        createdEventForm: {
          ...state.createdEventForm,
          ...action.payload.createdEventForm
        }
      };
      let event = {};
      for (var thing in form.createdEventForm) {
        event[thing] = form.createdEventForm[thing].value
          ? form.createdEventForm[thing].value
          : form.createdEventForm[thing];
      }
      if (form.createdEventForm.ticketTypes !== "undefined") {
        event.ticketTypes = form.createdEventForm.ticketTypes;
      }
      event.organizerId = state.user.sub;
      return Object.assign({}, state, { createdEvent: event }, form);
    case "update_checkout":
      var form = {
        userCheckoutForm: {
          ...state.userCheckoutForm,
          ...action.payload.userCheckoutForm
        }
      };
      console.log("reducer", action.payload);
      var userCheckoutForm = { ...state.userCheckoutForm, ...action.payload };
      var userCheckout = state.eventCheckoutForm;
      for (var thing in userCheckoutForm) {
        if (typeof userCheckoutForm[thing].value !== "undefined") {
          userCheckout[thing] = userCheckoutForm[thing].value;
        }
      }
      return Object.assign(
        {},
        state,
        { eventCheckoutForm: { ...state.eventCheckoutForm, ...userCheckout } },
        form
      );
    case "complete_checkout":
      console.log(action.payload);

      return Object.assign({}, state, {
        eventCheckoutForm: { ...state.eventCheckoutForm, ...action.payload }
      });
    case "fetch_events":
      return Object.assign({}, state, { myEvents: [...action.payload] });
    case "fetch_event":
      return Object.assign({}, state, {
        selectedEvent: { ...state.selectedEvent, ...action.payload }
      });
    case "update_cart":
      let balance = 0;
      let cart = state.eventCheckoutForm.cart;
      let type = Object.keys(action.payload)[0];
      cart[type] = action.payload[type];
      for (var ticket in cart) {
        let tix = state.selectedEvent.ticketTypes[ticket];
        balance += parseFloat(cart[ticket].quantity * (tix.price + tix.fees));
      }
      var eventCheckout = state.eventCheckoutForm;
      for (var thing in eventCheckout) {
        if (typeof eventCheckout[thing].value !== "undefined") {
          eventCheckout[thing] = eventCheckout[thing].value;
        }
      }
      const total = balance;
      return Object.assign({}, state, {
        eventCheckoutForm: {
          ...state.eventCheckoutForm,
          total,
          guestId: state.selectedEvent.guestId,
          eventId: state.selectedEvent._id,
          cart
        }
      });
    case "logout_user":
      console.log(action.payload);
      return Object.assign({}, state, { user: {} });
    case "fetch_user":
      var user = action.payload.user;
      var editedAccount = {};
      for (var thing in user.accountSettings) {
        editedAccount[thing] = {};
        editedAccount[thing].value = user.accountSettings[thing];
      }

      let accountSettingsForm = {
        ...state.accountSettingsForm,
        ...editedAccount
      };
      return Object.assign(
        {},
        state,
        { user },
        { accountSettingsForm },
        { myEvents: action.payload.events }
      );
    case "expense_creation":
      var obj = Object.assign({}, state.selectedEvent.expenses, action.payload);
      console.log(obj);
      return {
        ...state,
        selectedEvent: {
          ...state.selectedEvent,
          expenses: { ...obj }
        }
      };
    case "ticket_creation":
      var obj = Object.assign(
        {},
        state.createdEventForm.ticketTypes,
        action.payload
      );
      console.log(obj);
      return {
        ...state,
        createdEventForm: {
          ...state.createdEventForm,
          ticketTypes: { ...obj }
        },
        createdEvent: { ...state.createdEvent, ticketTypes: { ...obj } }
      };
    case "ticket_deletion":
      let tickets = state.createdEventForm.ticketTypes;
      delete tickets[action.payload];
      return {
        ...state,
        createdEventForm: {
          ...state.createdEventForm,
          ticketTypes: { ...tickets }
        }
      };
    case "event_deletion":
      let events = state.myEvents.filter(event => {
        return event._id != action.payload;
      });
      delete tickets[action.payload];
      return { ...state, myEvents: events };
    default:
      return state;
  }
};

export default reducer;
