const mongoose = require("mongoose");

const newHotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    priceRange: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const NewHotel = mongoose.model("NewHotel", newHotelSchema);

module.exports = NewHotel;
