import { User, Thought } from "../models/index.js";

// * GET router.route("/").get(getAllThoughts);
export function getAllThoughts(req, res) {
	Thought.find()
		.then((thoughts) => {
			const newThoughts = thoughts.map((thought) => {
				// ? Does a catch need to be implemented?
				const user = User.findOne({ username: thought.username }).then(
					(user) => res.json(user)
				);
				thought["userId"] = user.username;
				return thought;
			});
			return res.json(newThoughts);
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}

// * GET router.route("/:thoughtId").get(getOneThought);
export function getOneThought(req, res) {
	Thought.findOne({ _id: req.params.thoughtId })
		.then((thought) => {
			// ? Does a catch need to be implemented?
			const user = User.findOne({ username: thought.username }).then(
				(user) => res.json(user)
			);
			thought["userId"] = user.username;
			return res.json(thought);
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}

// * POST router.route("/").post(createThought);
export function createThought(req, res) {
	User.findOne({ username: req.body.username }).then((user) => {
		req.body["userId"] = user.username;
		Thought.create(req.body)
			.then((thought) => res.json(thought))
			.catch((err) => {
				console.error(err);
				return res.status(500).json(err);
			});
	});
}

// * PUT router.route("/:thoughtId").put(updateThought);
export function updateThought(req, res) {
	Thought.findOneAndUpdate(
		{ _id: req.params.thoughtId },
		{ $set: req.body },
		{ runValidators: true, new: true } // {returnDocument: after} ?
	)
		.then((thought) => {
			if (!thought) {
				return res
					.status(404)
					.json({ message: "No thought with this id!" });
			} else {
				// ? Does a catch need to be implemented?
				const user = User.findOne({ username: thought.username }).then(
					(user) => res.json(user)
				);
				thought["userId"] = user.username;
				return res.json(thought);
			}
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}

// *  DELETE router.route("/:thoughtId").delete(deleteThought);
export function deleteThought(req, res) {
	Thought.findByIdAndDelete(req.params.thoughtId)
		.then((thought) => {
			if (!thought) {
				return res
					.status(404)
					.json({ message: "No thought with this id!" });
			} else {
				User.findOneAndUpdate(
					{ username: thought.username },
					{ $pull: { thoughts: req.params.thoughtId } },
					{ new: true }
				).then((user) =>
					!user
						? res
								.status(404)
								.json({ message: "No user with this id!" })
						: res.json(user)
				);
			}
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}

// * POST (PUT) router.route("/:thoughtId/reactions").post(createReaction);
export function createReaction(req, res) {
	Thought.findByIdAndUpdate(
		req.params.thoughtId,
		// ? Is req.body acceptable for the reactionSchema?
		{ $push: { reactions: req.body } },
		{ runValidators: true, new: true } // {returnDocument: after} ?
	)
		.then((thought) => {
			if (!thought) {
				return res
					.status(404)
					.json({ message: "No thought with this id!" });
			} else {
				// ? Does a catch need to be implemented?
				const user = User.findOne({ username: thought.username }).then(
					(user) => res.json(user)
				);
				thought["userId"] = user.username;
				return res.json(thought);
			}
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}

// * DELETE (PUT) router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);
export function deleteReaction(req, res) {
	Thought.findByIdAndUpdate(
		req.params.thoughtId,
		// ? Is req.body acceptable for the reactionSchema?
		{ $pull: { reactions: req.params.reactionId } },
		{ new: true } // {returnDocument: after} ?)
	)
		.then((thought) => {
			if (!thought) {
				return res
					.status(404)
					.json({ message: "No thought with this id!" });
			} else {
				// ? Does a catch need to be implemented?
				const user = User.findOne({ username: thought.username }).then(
					(user) => res.json(user)
				);
				thought["userId"] = user.username;
				return res.json(thought);
			}
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}
