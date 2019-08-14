const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const EventSchema = new Schema({
    title: { type: String, default: '', trim: true, maxlength: 400 },
    location: {type: Object, default: {}},
    user: { type: Schema.ObjectId, ref: 'User' },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String, default: '', trim: true, maxlength: 1000 },
    organizerId: { type: String, default: '', trim: true, maxlength: 100 },
    ticketTypes: [
      {
        name: { type: String, default: '', maxlength: 1000 },
        type: { type: String, default: '', maxlength: 1000 },
        count: { type: Number, default: 0},
        price: { type: Number, default: 0},
        fees: { type: Number, default: 0},
        createdAt: { type: Date, default: Date.now },
      }
    ],
    tags: { type: [] },
    image: {
      cdnUri: String,
      files: []
    },
    createdAt: { type: Date, default: Date.now }
  });

  /**
 * Validations
 */

EventSchema.path('title').required(true, 'Event title cannot be blank');
EventSchema.path('ticketTypes').required(true, 'Ticket type cannot be empty');
mongoose.model('Event', EventSchema);
