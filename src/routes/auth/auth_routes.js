import { signupController } from "../../controllers/auth/auth_controllers.js";
import { loginController } from "../../controllers/auth/auth_controllers.js";

const usersRoute = (app, options, done) => {
  app.route({
    method: "POST",
    url: "/signup",
    handler: signupController,
  });

  app.route({
    method: "POST",
    url: "/login",
    handler: loginController,
  });

  done();
};

export default usersRoute;
