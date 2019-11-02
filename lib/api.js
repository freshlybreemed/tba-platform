

const Archetype = require('archetype-js')
const BookType = require('./book')
const axios = require('axios')

var cloudinary = require("cloudinary").v2; 
const { ObjectId } = require('mongodb')
const { json } = require('micro')
const express = require('express')
const stripe = require("stripe")("xx");


const REACT_APP_GUEST_PASS_KEY = "xx"

//Enter your credentials below                                              
cloudinary.config({
  cloud_name: "xx", 
  api_key: "xx", 
  api_secret: "xx"                       
});

const headers = {
  Authorization: `Token ${REACT_APP_GUEST_PASS_KEY}`,
  "Content-Type": "application/json"
};

module.exports = db => {
  const router = express.Router()
  // Wrap an async function so we catch any errors that might occur
  const wrapAsync = handler => (req, res) => handler(req)
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error: error.message }))

  // Get an event
  router.get('/event/:slug', wrapAsync(async function(req) {
    const slug =  req.params.slug
    return ObjectId.isValid(slug)? db.collection('tba').find({_id:ObjectId(slug)}).toArray() : db.collection('tba').find({slug}).toArray() 
  }))

  router.get('/events/:sub', wrapAsync(async function(req) {
    const sub = req.params.sub
    console.log(db.collection('tba').find({organizerId: sub}).toArray())
    return db.collection('tba').find({organizerId: sub}).toArray()
  }))

  router.post('/user', wrapAsync(async function(req) {
    const data = await json(req);
    console.log(data)

    const user = await db.collection('users').findOneAndUpdate(
        { _id: data.sub },
        {
            $setOnInsert: data,
            $set: {"updatedAt":Math.floor(new Date() / 1000)}
        },
        {
            upsert: true,
            returnNewDocument: true
        }
    )  
    return { user }
  }))

  router.post('/event', wrapAsync(async function(req) {
    const data = await json(req)
    console.log(data)
    const event = data.data
    delete event.endTime;
    delete event.startTime;

    if (!event.guestmanager){
      await axios({
        method: "post",
        url: "http://app.guestmanager.com/api/public/v2/venues/",
        data: {
          venue: {
            name: event.location.name,
            time_zone: "Eastern Time (US & Canada)",
            address: {
              "address1": event.location.streetAddress,
              "city": event.location.city,
              "zipcode": event.location.postalCode,
              "state_code": event.location.state,
              "country_code": "US"
              }
            }
          },
        headers
        }).then(res=>{
          event.guestmanager = res.data
      })
      await axios({
        method: "post",
        url: "http://app.guestmanager.com/api/public/v2/events/",
        data: {
          event: {
            name: event.title,
            starts_at: event.startDate,
            ends_at: event.endDate,
            venue_id: event.guestmanager.id
            }
          },
          headers
        }).then(res=>{
          event.guestId = res.data.id
          console.log(res.data)
        }).catch(err=>{
          console.log(err)
      })
    }
    const { ticketTypes } = event;
    const tickets = []
    for (var tix in ticketTypes){
      if (ticketTypes[tix].id) continue
      tickets.push(
        await axios({
          method: "post",
          url: "http://app.guestmanager.com/api/public/v2/ticket_types/",
          data: {
            ticket_type: {
              name: tix,
              pdf_template_id: 10164
            }
          },
          headers
          }).then(res=>{
            event.ticketTypes[tix].id = res.data.id
            console.log(res.data)
          }).catch(err=>{
            console.log(err)
        })
      )
    }
    await Promise.all(tickets)

    event._id = ObjectId(event._id)
    let newEvent = await db.collection('tba').updateOne(
      { _id: event._id },
      {$set: event},
      {upsert: true}, 
      (err, event)=>{
        if (err) return err
        return event
      })
    return newEvent
}))
  router.delete('/event/:id', wrapAsync(async function(req) {
    const event = await db.collection('tba').deleteOne(
      { _id: ObjectId(req.params.id) },
      (err, eve)=>{
        if (err) {
          console.log(err)
          return err
        }
        console.log(event)
        return eve
      })
      return event

  }))
  const dispatchTicket = async (eventCheckout) => {
    var tickets = []
    let quantity = 0
    let ticketId = ""
    for (var item in eventCheckout.cart){
      quantity += eventCheckout.cart[item].quantity
      ticketId = eventCheckout.cart[item].id
    }
    console.log('quantity is', quantity)
    for (var i = 0;i<quantity;i++){
      console.log({ticket: {
        ticket_type_id: ticketId,
        event_id: eventCheckout.guestId,
        name: `${eventCheckout.firstName} ${eventCheckout.lastName}`,
        email: eventCheckout.emailAddress,
        dispatch: true
      }})
      tickets.push(
        axios({
          method: "post",
          url: "https://app.guestmanager.com/api/public/v2/tickets",
          data: {
            ticket: {
              ticket_type_id: ticketId,
              event_id: eventCheckout.guestId,
              name: `${eventCheckout.firstName} ${eventCheckout.lastName}`,
              email: eventCheckout.emailAddress,
              dispatch: true
            }
          },
          headers
        }).then((ticket)=>{
          console.log("ticket success")
          console.log(ticket)
        }).catch((err)=>{
          console.log("err")
          console.log(err)
        })
      )
    }
    
    await Promise.all(tickets)
  };

  const updateTixCount = async (cart, eventId, charges) => {
    console.log('charges get', charges)
    const obj = {}
    for(var tix in cart){
      const key = `ticketTypes.${tix}.currentQuantity`
      obj[key] = -cart[tix]
    }
    return await db.collection('tba').findOneAndUpdate(
      {_id: ObjectId(eventId)},
      {
        $inc:obj, 
        $push: {"tickets": { $each: charges, $position: 0}}, 
        $set: {"updatedAt": parseInt(new Date() /1000)}
      })
  }

  router.post("/charge", wrapAsync(async (req) => {
    try {
      const charges = []
      const body = await json(req)
      console.log(body)
      let { eventCheckout, token } = body
      let cart = {}
      for (let tix in eventCheckout.cart){
        cart[tix] = eventCheckout.cart[tix].quantity
      }
      const obj = {
        ...eventCheckout,
        ...cart,
      }
      delete obj.cart
      charges.push(await stripe.charges.create({
        amount: eventCheckout.total,
        currency: "usd",
        description: `TBA Ticket - ${eventCheckout.title}`,
        source: token.id,
        metadata: obj
      }));
      const event =  await updateTixCount(cart, eventCheckout.eventId, charges)
      await dispatchTicket(eventCheckout)
      return event
    } catch (err) {
      console.log(err);
      return err
    }
  }));

 
  return router
}