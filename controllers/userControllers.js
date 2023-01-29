import { User, Thought } from "../models/index.js";

// * GET router.route("/").get(getAllUsers);
export function getAllUsers(req, res) {
	User.find()
		.populate("Thought")
		.then((users) => res.json(users))
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}

// * GET router.route("/:userId").get(getOneUser);
export function getOneUser(req, res) {
	User.findOne({ _id: req.params.userId })
		.populate("Thought")
		.then((user) => res.json(user))
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}

// * POST router.route("/").post(createUser);
export function createUser(req, res) {
	User.create(req.body)
		.then((user) => res.json(user))
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}

// * PUT router.route("/:userId").put(updateUser);
export function updateUser(req, res) {
	User.findOneAndUpdate(
		{ _id: req.params.userId },
		{ $set: req.body },
		{ runValidators: true, new: true } // {returnDocument: after} ?
	)
		.then((user) =>
			!user
				? res.status(404).json({ message: "No user with this id!" })
				: res.json(user)
		)
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}

// * DELETE router.route("/:userId").delete(deleteUser);
export function deleteUser(req, res) {
	User.findByIdAndDelete(req.params.userId).then((user) => {
		if (!user) {
			return res.status(404).json({ message: "No user with this id!" });
		} else {
			Thought.deleteMany({ username: user.username })
				.then((thought) => {
					if (!thought) {
						return res.status(404).json({
							message: "No thoughts belonged to this user!",
						});
					} else {
						res.status(204).json({
							message: `${thought} thoughts deleted!`,
						});
					}
				})
				.catch((err) => {
					console.error(err);
					return res.status(500).json(err);
				});
		}
	});
}

// * POST router.route("/:userId/friends/:friendId").post(addFriend);
export function addFriend(req, res) {}

// * DELETE router.route("/:userId/friends/:friendId").delete(deleteFriend);
export function deleteFriend(req, res) {}
