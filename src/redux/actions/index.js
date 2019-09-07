import { GET_USER, GET_EVENTS, GET_EVENT } from "../constants/action-types";
export function getUser(payload) {
  return { type: GET_USER, payload };
}
export function getEvents(payload) {
  return { type: GET_EVENTS, payload };
}
export function getEvent(payload) {
  return { type: GET_EVENT, payload };
}