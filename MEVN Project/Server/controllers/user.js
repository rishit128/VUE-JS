import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import UserModal from "../models/user.js";
import moment from "moment";
import {
  USERNOTEXIST,
  INVALIDPASSWORD,
  SOMETHINGWRONG,
  USERALREADY,
} from "../constants/actionmessage.js";
const secret = process.env.SECRET;


export const signup = async (req, res) => {
  const { email, password, phone, name, creator } = req.body;
  console.log(creator);
  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists Try with another email address" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({
      email,
      password: hashedPassword,
      name: `${name}`,
      phone: phone,
      Date: moment().toISOString(),
      Createdby: creator
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const signin = async (req, res) => {
  const { email, password } = req.body;


  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: USERNOTEXIST });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: INVALIDPASSWORD });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json(SOMETHINGWRONG);
  }
};

export const getdata = async (req, res) => {
  try {
    const user = await UserModal.find()
    if (user) {
      return res.status(200).json(user)
    }
    return res.status(404).json({ message: "No Data" })
  }
  catch (err) { res.status(500).json(SOMETHINGWRONG); }
}


export const updatedata = async (req, res) => {

  console.log(req.body);
  const { email } = req.body
  const { creator } = req.body
  const editresult = await UserModal.findOneAndUpdate({ email }, { Usertype: req.body.usertype, Isapproved: req.body.isapproved, Updatedby: creator }, { new: true });

  res.status(201).json(editresult)

}
export const deleteuser = async (req, res) => {

  const user = req.body
  const { email } = req.body

  const deleteresult = await UserModal.findOneAndDelete({ email });
  res.status(200).json(deleteresult)


}
export const edituser = async (req, res) => {

  const { id } = req.body

  const edituser = await UserModal.findByIdAndUpdate(id, { name: req.body.name, phone: req.body.phone }, { new: true })

  res.status(201).json({ result: edituser })
}

export const multiuserdelete = async (req, res) => {
  const _id = req.body
  console.log(_id);
  _id.map(async (id) => {
    await UserModal.findByIdAndRemove(id)
  })

  res.status(201).json(_id)

}