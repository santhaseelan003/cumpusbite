const express = require("express");
const admin = require("firebase-admin");
const path = require("path");

const FIREBASE_API_KEY  = "AIzaSyCuzx5C9f1mjiN-PIv3XpxI3Dt71nGtcwM";
const fetch = require("node-fetch");




const app = express();

app.use(express.json());


//const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
 const serviceAccount = require("D:/miniproject/servicekey2.json");
///const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(express.static(path.join(__dirname, "public")));


const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded; // ✅ attach user data
    next();

  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};


app.get("/adminhome", async (req, res) => {
 
    res.sendFile(path.join(__dirname, "public", "adminHome.html"));
});

app.get("/customerhome", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "customerHome.html"));
});




app.post("/add-food", async (req, res) => {
  try {
    const { foodName, price, rating, imgUrl, category} = req.body;

    const docRef = await db.collection("foods").add({
      foodName,
      price,
      rating,
      imgUrl,
      category,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });


    const addedFood = {id: docRef.id, foodName: foodName, price: price, rating: rating, imgUrl: imgUrl, category :category};

    res.json({ message: "Foodadded", id: docRef.id , food: addedFood});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.post("/placeOrder" , async (req, res) => {
  try {
    const { foodOrdered,userId, userName, tableNo} = req.body;
    const status = "Preparing";


    const docRef = await db.collection("orders").add({
      foodOrdered,
      userId,
      userName,
      tableNo,
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });



    res.json({ message: "Orderplaced", id: docRef.id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/getFoods", async (req, res) => {
  try {
    const snapshot = await db.collection("foods").orderBy("createdAt", "asc").get();
    const foods = [];

    snapshot.forEach((doc) => {
      foods.push({
        id: doc.id,
        ...doc.data(),
      });
    });    

    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/getMyOrders" , async (req, res) => {

  try {

  

    let myOrders = [];

    const userId = req.query.userId;
    
    if (userId) {
     const matchSnapshot = await db.collection("orders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "asc")
      .get();

      matchSnapshot.forEach((doc) => {
        myOrders.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    }

    res.json(myOrders);
  }
  catch (error)
  {
    console.error(error);
  }

  });

app.get("/getOrders" , async (req , res) => {
  try{
    const snapshot = await db.collection("orders").orderBy("createdAt", "asc").get();
    const orders = [];

    snapshot.forEach((doc) => {
      orders.push({
        id : doc.id,
        ...doc.data(),
      });
    });
    res.json(orders);
  }
  catch(error){
    res.status(500).json({ error: error.message });
  }

});

// Food delivered
app.post("/foodDelivered", async (req, res) => {
  try {
    const { id , status } = req.body;
    await db.collection("orders").doc(id).update({status: status});

    res.json({ message: "Fooddelivered" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.post("/deleteFood", async (req, res) => {
  try {
    const { id } = req.body;
    await db.collection("foods").doc(id).delete();
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const user = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name
    });

    res.json({
      message: "Registered successfully",
      uid: user.uid
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      }
  
    
    );

    const data = await response.json();
    

    if (data.error) {
      return res.status(400).json({ error: "Invalid email or password" });
    }


    res.json({
      message: "Login successful",
      token: data.idToken,
      uid: data.localId
    });
    


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/verifyUser", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ valid: false, error: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);
    const isAdmin = decoded.email === "admin@gmail.com";

    res.json({
      valid: true,
      uid: decoded.uid,
      email: decoded.email,
      isAdmin : isAdmin
    });

  } catch (error) {
    res.status(401).json({
      valid: false,
      error: "Invalid token"
    });
  }
});



//const PORT = process.env.PORT || 3000;


const PORT = 3000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});