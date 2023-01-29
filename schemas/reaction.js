import { Schema, Types } from "mongoose";
import { DateTime } from "luxon";
import { getDate } from "../utils/getDate.js";

const reactionSchema = new Schema(
	{
		reactionId: {
			type: Schema.Types.ObjectId,
			default: () => new Types.ObjectId(),
		},
		reactionBody: {
			type: String,
			required: true,
			minLength: [1, "Cannot create an empty reaction"],
			maxLength: [280, "Exceeded character limit"],
		},
		username: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: () => {
				return DateTime.now();
			},
			get: getDate,
		},
	},
	{
		toJSON: {
			virtuals: true,
			getters: true,
		},
		id: false,
	}
);

export default reactionSchema;
