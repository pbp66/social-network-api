import { Router } from "express";
const router = new Router();
import {
	getAllUsers,
	createUser,
	getOneUser,
	updateUser,
	deleteUser,
	addFriend,
	deleteFriend,
} from "../../controllers/userControllers.js";

router.route("/").get(getAllUsers).post(createUser);

router.route("/:userId").get(getOneUser).put(updateUser).delete(deleteUser);

router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);

export default router;
