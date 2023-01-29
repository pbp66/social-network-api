import { User, Thought } from "../models/index.js";

// * GET router.route("/").get(getAllUsers);
export function getAllUsers(req, res) {
	User.find()
		.then((users) => res.json(users))
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}

// * GET router.route("/:userId").get(getOneUser);
export function getOneUser(req, res) {
	User.findOne({ _id: req.params.userId })
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
		{ runValidators: true, new: true }
	)
		.then((user) => {
			if (!user) {
				// * If no user exists, throw an error to prevent mongoose from trying to reference a non-existent user
				throw new ReferenceError(
					`No user with this id: ${req.params.userId}`
				);
			} else {
				return res.json(user);
			}
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}

// * DELETE router.route("/:userId").delete(deleteUser);
export function deleteUser(req, res) {
	User.findByIdAndDelete(req.params.userId).then((user) => {
		if (!user) {
			// * If no user exists, throw an error to prevent mongoose from trying to reference a non-existent user
			throw new ReferenceError(
				`No user with this id: ${req.params.userId}`
			);
		} else {
			Thought.deleteMany({ username: user.username })
				.then((thought) => {
					if (!thought) {
						throw new ReferenceError(
							`No thoughts belong to ${user.username}`
						);
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

// * POST (PUT) router.route("/:userId/friends/:friendId").post(addFriend);
export function addFriend(req, res) {
	// * Verify that the user ids reference valid user objects within the database
	User.findById(req.params.userId)
		.then((user) => {
			if (!user) {
				// * If no user exists, throw an error to prevent mongoose from trying to reference a non-existent user
				throw new ReferenceError(
					`No user with this id: ${req.params.userId}`
				);
			} else if (user.friends.includes(req.params.friendId)) {
				throw new Error(
					`User Id ${req.params.friendId} already exists in friends`
				);
			} else {
				return user;
			}
		})
		.then(() => {
			User.findById(req.params.friendId).then((friend) => {
				if (!friend) {
					// * If no user exists, throw an error to prevent mongoose from trying to reference a non-existent user
					throw new ReferenceError(
						`No friend with this id: ${req.req.params.friendId}`
					);
				} else if (friend.friends.includes(req.params.userId)) {
					throw new Error(
						`Cannot have duplicate user ids in friends array`
					);
				} else {
					return friend;
				}
			});
		})
		.then(() => {
			User.findByIdAndUpdate(
				req.params.userId,
				{ $push: { friends: req.params.friendId } },
				{ new: true }
			).then((user) => {
				if (!user) {
					// * If no user exists, throw an error to prevent mongoose from trying to reference a non-existent user
					throw new ReferenceError(
						`No user with this id: ${req.params.userId}`
					);
				}
			});
		})
		.then(() => {
			User.findByIdAndUpdate(
				req.params.friendId,
				{ $push: { friends: req.params.userId } },
				{ new: true }
			).then((friend) => {
				if (!friend) {
					// * If no user exists, throw an error to prevent mongoose from trying to reference a non-existent user
					throw new ReferenceError(
						`No user with this id: ${req.req.params.friendId}`
					);
				}
			});
		})
		.then(() => res.status(204).send())
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err });
			return;
		});
}

// * DELETE (PUT) router.route("/:userId/friends/:friendId").delete(deleteFriend);
export function deleteFriend(req, res) {
	// * Friends field in user model is array of user schemas. A user object, not an ID, must be removed from the array.

	User.findById(req.params.userId)
		.then((user) => {
			if (!user) {
				// * If no user exists, throw an error to prevent mongoose from trying to reference a non-existent user
				throw new ReferenceError(
					`No user with this id: ${req.params.userId}`
				);
			} else if (!user.friends.includes(req.params.friendId)) {
				throw new ReferenceError(
					`User does not have a friend with this userId: ${req.params.friendId}`
				);
			} else {
				return user;
			}
		})
		.then(() => {
			User.findOne({ _id: req.params.friendId }).then((friend) => {
				if (!friend) {
					// * If no user exists, throw an error to prevent mongoose from trying to reference a non-existent user
					throw new ReferenceError(
						`No friend with this id: ${req.req.params.friendId}`
					);
				} else if (!friend.friends.includes(req.params.userId)) {
					throw new ReferenceError(
						`Friend is not friends with this userId: ${req.params.userId}`
					);
				} else {
					return friend;
				}
			});
		})
		.then(() => {
			User.findByIdAndUpdate(
				req.params.userId,
				{ $pull: { friends: req.params.friendId } },
				{ new: true }
			).then((user) => {
				if (!user) {
					// * If no user exists, throw an error to prevent mongoose from trying to reference a non-existent user
					throw new ReferenceError(
						`No user with this id: ${req.params.userId}`
					);
				}
			});
		})
		.then(() => {
			User.findByIdAndUpdate(
				req.params.friendId,
				{ $pull: { friends: req.params.userId } },
				{ new: true }
			).then((friend) => {
				if (!friend) {
					// * If no user exists, throw an error to prevent mongoose from trying to reference a non-existent user
					throw new ReferenceError(
						`No user with this id: ${req.req.params.friendId}`
					);
				}
			});
		})
		.then(() => res.status(204).send())
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err });
			return;
		});
}
