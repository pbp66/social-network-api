import { Router } from "express";
const router = new Router();

// TODO: Import controllers.

router.route("/").get(getAllThoughts).post(createThought);

router
	.route("/:thoughtId")
	.get(getOneThought)
	.put(updateThought)
	.delete(deleteThought);

router.route("/:thoughtId/reactions").post(createReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

export default router;
