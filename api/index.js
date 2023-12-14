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
const Message = require("./models/message"); 

//endpoint for registration of the user
app.post("/register", (req, res) => {
  const { name, email, password, image , dateOfBirth , weight , height , diabetesType } = req.body;

  // create a new User object
  const newUser = new User({ name, email, password, image , dateOfBirth , weight , height , diabetesType });

  // save the user to the database
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

//function to create a token for the user ฟังก์ชั่นสร้างโทเค็นให้กับผู้ใช้
const createToken = (userId) => {
  // Set the token payload ตั้งค่าเพย์โหลดโทเค็น
  const payload = {
    userId: userId,
  };

  // Generate the token with a secret key and expiration time  สร้างโทเค็นด้วยรหัสลับและเวลาหมดอายุ
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

//endpoint to access all the users except the user who's is currently logged in! endpoint เพื่อเข้าถึงผู้ใช้ทั้งหมด ยกเว้นผู้ใช้ที่เข้าสู่ระบบอยู่ในปัจจุบัน!
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

//endpoint to send a request to a user เพื่อส่งคำขอไปยังผู้ใช้
app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    //update the recepient's friendRequestsArray!
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { freindRequests: currentUserId },
    });

    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

//endpoint to show all the friend-requests of a particular user
app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user document based on the User id
    const user = await User.findById(userId)
      .populate("freindRequests", "name email image")
      .lean();

    const freindRequests = user.freindRequests;

    res.json(freindRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to accept a friend-request of a particular person
app.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    //retrieve the documents of sender and the recipient
    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    recepient.freindRequests = recepient.freindRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recepientId.toString
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to access all the friends of the logged in user!
app.get("/accepted-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//endpoint to post Messages and store it in the backend endpoint เพื่อโพสต์ข้อความและเก็บไว้ในแบ็กเอนด์
app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null,
    });

    await newMessage.save();
    res.status(200).json({ message: "Message sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

///endpoint to get the userDetails to design the chat Room header
app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user data from the user ID
    const recepientId = await User.findById(userId);

    res.json(recepientId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to fetch the messages between two users in the chatRoom
app.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to delete the messages!
app.post("/deleteMessages", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "invalid req body!" });
    }

    await Message.deleteMany({ _id: { $in: messages } });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server" });
  }
});



app.get("/friend-requests/sent/:userId",async(req,res) => {
  try{
    const {userId} = req.params;
    const user = await User.findById(userId).populate("sentFriendRequests","name email image").lean();

    const sentFriendRequests = user.sentFriendRequests;

    res.json(sentFriendRequests);
  } catch(error){
    console.log("error",error);
    res.status(500).json({ error: "Internal Server" });
  }
})

app.get("/friends/:userId",(req,res) => {
  try{
    const {userId} = req.params;

    User.findById(userId).populate("friends").then((user) => {
      if(!user){
        return res.status(404).json({message: "User not found"})
      }

      const friendIds = user.friends.map((friend) => friend._id);

      res.status(200).json(friendIds);
    })
  } catch(error){
    console.log("error",error);
    res.status(500).json({message:"internal server error"})
  }
})

app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // ดึงข้อมูลจาก user
    const { image, dateOfBirth, weight, height, diabetesType, ...userData } = user.toObject();

    return res.status(200).json({ user: userData, image, dateOfBirth, weight, height, diabetesType });
  } catch (error) {
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

//Finish
//food
// Import the Food model or define it if not already done
const Food =require("./models/food"); 
// Define your API endpoint to fetch food data
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
      console.log('Received request with data:', req.body);
  
      if (!date || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
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
      });
      const savedMeal = await newMeal.save();
      res.status(201).json(savedMeal);
    } catch (error) {
      console.error('Error saving meal:', error.message);
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
