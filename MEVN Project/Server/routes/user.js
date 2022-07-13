import express from "express";
const router = express.Router();

import {signin, signup,getdata,updatedata,deleteuser,edituser,multiuserdelete} from "../controllers/user.js";


router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getdata",getdata);
router.post("/updatedata",updatedata)
router.post("/deleteresult",deleteuser)
router.post("/edituser",edituser)
router.post("/multiuserdelete",multiuserdelete)

export default router;