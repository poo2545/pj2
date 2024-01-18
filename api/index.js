const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { ObjectId } = require('mongodb');
const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://diabet:1111@cluster0.ykyrfhv.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongo Db");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDb", err);
  });

app.listen(port, () => {
  console.log("Server running on port 8000");
});

const User = require("./models/user");
const Conversations = require("./models/Conversations");
const Messages = require("./models/Messages");

app.post('/conversation', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newCoversation = new Conversations({ members: [senderId, receiverId] });
    await newCoversation.save();
    res.status(200).send('Conversation created successfully');
  } catch (error) {
    console.log(error, 'Error')
  }
})

app.get('/conversations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({ members: { $in: [userId] } });

    const conversationUserData = await Promise.all(conversations.map(async (conversation) => {
      const receiverId = conversation.members.find((member) => member !== userId);
      const user = await User.findById(receiverId);
      if (!user) {
        return null;
      }
      return { user: { receiverId: user._id, email: user.email, fullName: user.fullName, image: user.image }, conversationId: conversation._id };
    }));
    const validConversations = conversationUserData.filter(conversation => conversation !== null);
    res.status(200).json(validConversations);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/message', async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId } = req.body;

    if (!senderId || !message) return res.status(400).send('Please fill all required fields')
    if (conversationId === 'new' && receiverId) {
      const newCoversation = new Conversations({ members: [senderId, receiverId] });
      await newCoversation.save();
      const newMessage = new Messages({ conversationId: newCoversation._id, senderId, message });
      await newMessage.save();
      return res.status(200).send('Message sent successfully');
    } else if (!conversationId && !receiverId) {
      return res.status(400).send('Please fill all required fields');
    }
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.log(error, 'Error')
  }
})

app.get('/message/:conversationId', async (req, res) => {
  try {
    const checkMessages = async (conversationId) => {
      console.log(conversationId, 'conversationId')
      const messages = await Messages.find({ conversationId });
      const messageUserData = Promise.all(messages.map(async (message) => {
        const user = await User.findById(message.senderId);
        return { user: { id: user._id, email: user.email, fullName: user.fullName, image: user.image }, message: message.message }
      }));
      res.status(200).json(await messageUserData);
    }
    const conversationId = req.params.conversationId;
    if (conversationId === 'new') {
      const checkConversation = await Conversations.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });
      if (checkConversation.length > 0) {
        checkMessages(checkConversation[0]._id);
      } else {
        return res.status(200).json([])
      }
    } else {
      checkMessages(conversationId);
    }
  } catch (error) {
    console.log('Error', error)
  }
})

app.get('users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ _id: { $ne: userId } });
    const usersData = Promise.all(users.map(async (user) => {
      return { user: { email: user.email, fullName: user.fullName, receiverId: user._id } }
    }))
    res.status(200).json(await usersData);
  } catch (error) {
    console.log('Error', error)
  }
})


app.post("/register", (req, res) => {
  const { fullName, email, password, image, dateOfBirth, weight, height, diabetesType, challengeCalorie } = req.body;
  const newUser = new User({ fullName, email, password, image, dateOfBirth, weight, height, diabetesType, challengeCalorie });
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      console.log("Error registering user", err);
      res.status(500).json({ message: "Error registering the user!" });
    });
});

//สร้างโทเค็นให้กับผู้ใช้
const createToken = (userId) => {
  const payload = {
    userId: userId,
  };
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });

  return token;
};

//endpoint for logging in of that particular user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  //check if the email and password are provided
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Email and the password are required" });
  }

  //check for that user in the database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        //user not found
        return res.status(404).json({ message: "User not found" });
      }

      //compare the provided passwords with the password in the database
      if (user.password !== password) {
        return res.status(404).json({ message: "Invalid Password!" });
      }

      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.log("error in finding the user", error);
      res.status(500).json({ message: "Internal server Error!" });
    });
});

app.get("/users/:userId", (req, res) => {
  const loggedInUserId = req.params.userId;

  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log("Error retrieving users", err);
      res.status(500).json({ message: "Error retrieving users" });
    });
});

app.get("/me/:userId", async (req, res) => {
  const loggedInUserId = req.params.userId;

  try {
    const user = await User.findById(loggedInUserId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    console.log("Error retrieving user", err);
    res.status(500).json({ message: "Error retrieving user" });
  }
});


app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ดึงข้อมูลจาก user
    const { fullName,image,email,password, dateOfBirth, weight, height, diabetesType, challengeCalorie, ...userData } = user.toObject();

    return res.status(200).json({ user: userData, fullName,email,password, dateOfBirth, weight, height, diabetesType, challengeCalorie,image });
  } catch (error) {
    console.error("Error while getting the profile:", error);
    res.status(500).json({ message: "Error while getting the profile" });
  }
});


app.put('/profile/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updatedProfileData = req.body; // Data sent by the client for updating the profile

  try {
    // Find the user by their ID and update their profile data
    const user = await User.findByIdAndUpdate(userId, updatedProfileData, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Error updating the user profile" });
  }
});

const Food = require("./models/food");
app.get('/food', async (req, res) => {
  try {
    const foods = await Food.find();
    if (foods.length === 0) {
      return res.status(404).json({ message: 'No food records found' });
    }
    res.status(200).json(foods);
  } catch (error) {
    console.error('Error fetching food records:', error);
    res.status(500).json({ error: 'Unable to fetch food records' });
  }
});

app.post('/food', async (req, res) => {
  try {
    // Assuming the request body contains the details of the new food
    const { FoodName,
      FoodCalorie,
      FoodProtein,
      FoodFat,
      FoodCarbo,
      FoodFiber,
      FoodImage, } = req.body;

    // Create a new food instance
    const newFood = new Food({
      FoodName,
      FoodCalorie,
      FoodProtein,
      FoodFat,
      FoodCarbo,
      FoodFiber,
      FoodImage,
    });

    // Save the new food record to the database
    const savedFood = await newFood.save();

    // Respond with the created food record
    res.status(201).json(savedFood);
  } catch (error) {
    console.error('Error creating a new food record:', error);
    res.status(500).json({ error: 'Unable to create a new food record' });
  }
});

const Medication = require('./models/medication');
//เพิ่ม
app.post('/medications', async (req, res) => {
  try {
    const { time, dosage, medicationName, size, userId } = req.body;

    // Check if userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Create a new medication object
    const newMedication = new Medication({
      time,
      dosage,
      medicationName,
      size,
      user: userId, // Associate the medication with a user
    });

    // Save the medication to the database
    await newMedication.save();

    // Respond with a success message and the saved medication
    res.status(201).json({
      message: 'Medication record saved successfully',
      medication: newMedication,
    });
  } catch (error) {
    console.error('Error saving medication record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//fetch
app.get('/medications/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const medications = await Medication.find({ user: userId });

    if (medications.length === 0) {
      return res.status(404).json({ message: 'No medication records found for this user' });
    }

    res.status(200).json(medications);
  } catch (error) {
    console.error('Error fetching medication records:', error);
    res.status(500).json({ error: 'Unable to fetch medication records' });
  }
});
//edit
app.put('/medications/:id', async (req, res) => {
  try {
    const medicationId = req.params.id;
    const { medicationName, dosage, time, size } = req.body;
    // Validate the request data here...
    const updatedMedication = await Medication.findByIdAndUpdate(
      medicationId,
      { medicationName, dosage, time, size },
      { new: true }
    );

    if (!updatedMedication) {
      return res.status(404).json({ message: 'Medication record not found' });
    }

    res.status(200).json({
      message: 'Medication record updated successfully',
      medication: updatedMedication,
    });
  } catch (error) {
    console.error('Error updating medication record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/medications/:id', async (req, res) => {
  try {
    const medicationId = req.params.id;

    // Find and delete the medication by ID
    const deletedMedication = await Medication.findByIdAndRemove(medicationId);

    if (!deletedMedication) {
      return res.status(404).json({ message: 'Medication record not found' });
    }

    res.status(200).json({
      message: 'Medication record deleted successfully',
      deletedMedication,
    });
  } catch (error) {
    console.error('Error deleting medication record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const MealPatient = require('./models/MealPatient');

app.post('/meals', async (req, res) => {
  try {
    const { date, BName, Bcalories, BProtein, BFat, BCarbohydrate, BFiber,
      LName, Lcalories, LProtein, LFat, LCarbohydrate, LFiber,
      DName, Dcalories, DProtein, DFat, DCarbohydrate, DFiber,
      userId } = req.body;

    if (!date || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch user details based on userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newMeal = new MealPatient({
      Date: date,
      BName: BName || '',
      Bcalories: Bcalories || 0,
      BProtein: BProtein || 0,
      BFat: BFat || 0,
      BCarbohydrate: BCarbohydrate || 0,
      BFiber: BFiber || 0,

      LName: LName || '',
      Lcalories: Lcalories || 0,
      LProtein: LProtein || 0,
      LFat: LFat || 0,
      LCarbohydrate: LCarbohydrate || 0,
      LFiber: LFiber || 0,

      DName: DName || '',
      Dcalories: Dcalories || 0,
      DProtein: DProtein || 0,
      DFat: DFat || 0,
      DCarbohydrate: DCarbohydrate || 0,
      DFiber: DFiber || 0,

      user: userId,
      fullName: user.fullName, // Add fullName from the user details
    });

    const savedMeal = await newMeal.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


app.get('/meals/:userId/:date', async (req, res) => {
  try {
    const userId = req.params.userId;
    const date = new Date(req.params.date);

    const meals = await MealPatient.find({ user: userId, Date: date });

    res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/meals/:mealId', async (req, res) => {
  try {
    const mealId = req.params.mealId;

    const deletedMeal = await MealPatient.findByIdAndRemove(mealId);
    if (!deletedMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/meals/:mealId', async (req, res) => {
  try {
    const mealId = req.params.mealId;
    const updatedMealData = req.body;
    // Check if the meal with the specified ID exists
    const existingMeal = await MealPatient.findById(mealId);
    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    // Update meal data
    Object.assign(existingMeal, updatedMealData);
    // Recalculate SumCalorie
    existingMeal.SumCalorie = existingMeal.Bcalories + existingMeal.Lcalories + existingMeal.Dcalories;
    // Save the updated meal
    const updatedMeal = await existingMeal.save();

    res.status(200).json(updatedMeal);
  } catch (error) {
    console.error('Error updating meal:', error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.get('/meals/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const meals = await MealPatient.find({ user: userId });
    res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const noFood = require('./models/noFood'); // Adjust the path accordingly
app.get('/nofood', async (req, res) => {
  try {
    const noFoods = await noFood.find();
    res.status(200).json(noFoods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
