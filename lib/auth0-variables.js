const host =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://one-freshlybreemed.tba-project.now.sh";
export const AUTH_CONFIG = {
  domain: "tbaevents.auth0.com",
  clientId: "DddqRMNgnBh5OAtbDaB4RAncuXkAhUKx",
  host,
  callbackUrl: `${host}/auth/callback`
};
