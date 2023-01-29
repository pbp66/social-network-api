import { DateTime } from "luxon";

export function getDate(date) {
	return DateTime.fromISO(date).toFormat("MM/dd/yyyy hh:mm a");
}

export function getISODate(date) {
	return date;
}
