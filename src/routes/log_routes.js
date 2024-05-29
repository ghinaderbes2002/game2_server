import { createLog } from "../controllers/log_controllers.js";

const logRoute = (app, options, done) => {
  app.route({
    method: "POST",
    url: "/createLog",
    handler: createLog,
  });

  done();
};

export default logRoute;
