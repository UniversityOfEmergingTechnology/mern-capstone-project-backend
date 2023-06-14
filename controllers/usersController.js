const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { userName, password, email } = req.body;

    const userNameCheck = await User.findOne({ userName });
    if (userNameCheck) {
      return res.status(404).json({
        success: false,
        message: "Username already used",
      });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(404).json({
        success: false,
        message: "Email already used",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      userName,
      password: hashedPassword,
    });
    const newUserObject = newUser.toObject();
    delete newUserObject.password;
    res.status(200).json({
      success: true,
      message: "User registered succesfully",
      newUserObject,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const userExists = await User.findOne({ userName });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Incorrect Username or Password is wrong",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (!isPasswordValid) {
      res.status(404).json({
        success: false,
        message: "Incorrect Username or Password is wrong",
      });
    }

    const newUserObject = userExists.toObject();
    delete newUserObject.password;
    res.status(200).json({
      success: true,
      message: "Logged In  succesfully",
      newUserObject,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.setAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    const newUserObject = userData.toObject();
    delete newUserObject.password;
    return res.status(200).json({
        success : true ,
        message : "Updated the avatar image",
        newUserObject
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.getAllUsers = async (req, res) => {
  try{
    const users = await User.find({_id : {$ne : req.params.id}}).select([
      "email",
      "userName" ,
      "avatarImage" ,
      "_id"
    ])
    return res.status(200).json({
      success : true ,
      message:"Fetched all users successfully",
      users
    })
  }
  catch(err){
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  }  catch(err){
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};