const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OrganizerSchema = new Schema({
    id: { type: String, default: '', trim: true, maxlength: 400 },
    location: {type: Object, default: {}},
    events: [
      {
        name: { type: String, default: '', maxlength: 1000 },
        type: { type: String, default: '', maxlength: 1000 },
        count: { type: Number, default: 0},
        price: { type: Number, default: 0},
        fees: { type: Number, default: 0},
        createdAt: { type: Date, default: Date.now },
      }
    ],
    username: String,
    email: String,
    bio: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
  });

  /**
 * Validations
 */

EventSchema.path('title').required(true, 'Event title cannot be blank');
EventSchema.path('ticketTypes').required(true, 'Ticket type cannot be empty');
mongoose.model('Event', EventSchema);
