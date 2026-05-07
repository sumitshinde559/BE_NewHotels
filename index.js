const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const { initializeDatabase } = require("./db/db.connect");

const NewHotel = require("./models/newHotel.models");

initializeDatabase();

// const newHotel = {
//   name: "New Hotel 1",
//   category: "Resort",
//   location: "12 Main Road, Delhi",
//   phoneNumber: "0412345679",
//   rating: 4.2,
//   priceRange: "$$ (11-30)",
// };

async function createHotel(newHotel) {
  try {
    const hotel = new NewHotel(newHotel);

    const savedHotel = await hotel.save();

    console.log("New Hotel data:", savedHotel);

    return savedHotel;
  } catch (error) {
    throw error;
  }
}

//createHotel(newHotel);

//1. Create an API with route "/newHotels" to create a new hotel data in the Database. Test your API with Postman.

app.post("/newHotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body);
    res
      .status(201)
      .json({ message: "New hotel added successfully.", hotel: savedHotel });
  } catch (error) {
    res.status(500).json({ error: "Error in adding new hotel." });
  }
});

//1. Create an API with route "/newHotels" to read all hotels from the Database. Test your API with Postman.

async function findAllHotels() {
  try {
    const allHotels = await NewHotel.find();
    //console.log(allHotels);
    return allHotels;
  } catch (error) {
    throw error;
  }
}

app.get("/newHotels", async (req, res) => {
  try {
    const allHotels = await findAllHotels();
    if (allHotels) {
      res.json(allHotels);
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load all new hotels." });
  }
});

//2. Create an API with route "/newHotels/:hotelName" to read a hotel by its name. Test your API with Postman.

async function findHotelByName(hotelName) {
  try {
    const hotel = await NewHotel.findOne({ name: hotelName });
    //console.log(hotel);
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/newHotels/:hotelName", async (req, res) => {
  try {
    const hotel = await findHotelByName(req.params.hotelName);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load hotel." });
  }
});

//3. Create an API with route "/hotels/directory/:phoneNumber" to read a hotel by phone number. Test your API with Postman.

async function findHotelByPhone(phoneNumber) {
  try {
    const hotelByPhoneNumber = await NewHotel.findOne({
      phoneNumber: phoneNumber,
    });
    //console.log(hotelByPhoneNumber);
    return hotelByPhoneNumber;
  } catch (error) {
    throw error;
  }
}

app.get("/newHotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await findHotelByPhone(req.params.phoneNumber);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load hotel." });
  }
});

//4. Create an API with route "/newHotels/rating/:hotelRating" to read all hotels by rating. Test your API with Postman.

async function findHotelsByRating(rating) {
  try {
    const hotelsByRating = await NewHotel.find({ rating: rating });
    //console.log(hotelsByRating);
    return hotelsByRating;
  } catch (error) {
    throw error;
  }
}

app.get("/newHotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await findHotelsByRating(req.params.hotelRating);
    if (hotels.length != 0) {
      res.status(200).json(hotels);
    } else {
      res.status(404).json({ error: "Hotels not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load hotel." });
  }
});

//5. Create an API with route "/newHotels/category/:hotelCategory" to read all hotels by category. Test your API with Postman.

async function findHotelsByCategory(category) {
  try {
    const hotelsByCategory = await NewHotel.find({ category: category });
    //console.log(hotelsByCategory);
    return hotelsByCategory;
  } catch (error) {
    throw error;
  }
}

app.get("/newHotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await findHotelsByCategory(req.params.hotelCategory);
    if (hotels.length != 0) {
      res.status(200).json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "No hotels found." });
  }
});

async function deleteHotel(hotelId) {
  try {
    const deletedHotel = await NewHotel.findByIdAndDelete(hotelId);
    return deletedHotel;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/newHotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotel(req.params.hotelId);
    if (deletedHotel) {
      res
        .status(200)
        .json({ message: "Hotel deleted successfully.", hotel: deletedHotel });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hotel." });
  }
});

//1. Create an API to update a hotel data by their ID in the Database. Update the rating of an existing hotel. Test your API with Postman.

async function updateHotelById(hotelId, dateToUpdate) {
  try {
    const updatedHotel = await NewHotel.findByIdAndUpdate(
      hotelId,
      dateToUpdate,
      {
        returnDocument: "after",
      },
    );
    console.log(updatedHotel);
    return updatedHotel;
  } catch (error) {
    console.log(error);
  }
}

app.post("/newHotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotelById(req.params.hotelId, req.body);
    if (updatedHotel) {
      res.status(200).json({
        message: "Hotel updated successfully.",
        updatedHotel: updatedHotel,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update hotel." });
  }
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
