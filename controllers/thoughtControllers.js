import { User, Thought } from "../models/index.js";

// * GET router.route("/").get(getAllThoughts);
export function getAllThoughts(req, res) {
	Thought.find()
		.then((thoughts) => {
			res.json(thoughts);
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
			res.json(thought);
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
		{ runValidators: true, new: true }
	)
		.then((thought) => {
			if (!thought) {
				throw new ReferenceError(
					`No thought with this id: ${req.params.thoughtId}`
				);
			} else {
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
				throw new ReferenceError(
					`No thought with this id: ${req.params.thoughtId}`
				);
			} else {
				User.findOneAndUpdate(
					{ username: thought.username },
					{ $pull: { thoughts: req.params.thoughtId } },
					{ new: true }
				).then((user) => {
					if (!user) {
						// * If no user exists, throw an error to prevent mongoose from trying to reference a non-existent user
						throw new ReferenceError(
							`No user with this id: ${req.params.userId}`
						);
					} else {
						return user;
					}
				});
			}
			return res.json(thought);
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
		{ runValidators: true, new: true }
	)
		.then((thought) => {
			if (!thought) {
				throw new ReferenceError(
					`No thought with this id: ${req.params.thoughtId}`
				);
			} else {
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
	// Thought.findById(req.params.thoughtId)
	// 	.then((thought) => {
	// 		if (!thought) {
	// 			throw new ReferenceError(
	// 				`No thought with this id: ${req.params.thoughtId}`
	// 			);
	// 		}

	// 		const reactionIds = thought.reactions.map(
	// 			(reaction) => reaction.reactionId
	// 		);

	// 		if (!reactionIds.includes(req.params.reactionId)) {
	// 			throw new ReferenceError(
	// 				`Thought does not contain a reaction with this id: ${req.params.reactionId}`
	// 			);
	// 		} else {
	// 			return thought;
	// 		}
	// 	})
	// 	.then(() => {});

	Thought.findByIdAndUpdate(
		req.params.thoughtId,
		{ $pull: { reactions: { reactionId: req.params.reactionId } } },
		{ new: true }
	)
		.then((thought) => {
			if (!thought) {
				throw new ReferenceError(
					`No reaction with this id: ${req.params.reactionId}`
				);
			} else {
				return res.json(thought);
			}
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json(err);
		});
}
