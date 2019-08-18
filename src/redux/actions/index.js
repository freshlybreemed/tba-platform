import { GET_USER, GET_EVENTS } from "../constants/action-types";
export function getUser(payload) {
  return { type: GET_USER, payload };
}
export function getEvents(payload) {
  return { type: GET_EVENTS, payload };
}