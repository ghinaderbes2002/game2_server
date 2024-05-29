import {
  createRound,
  getOpenRounds,
  getPlayerOfWeek,
} from "../controllers/rounds_controllers.js";
import { getRound } from "../controllers/rounds_controllers.js";
import { getRoundone } from "../controllers/rounds_controllers.js";
import { deleteRound } from "../controllers/rounds_controllers.js";
import { updateRound } from "../controllers/rounds_controllers.js";
import { verifyToken } from "../../src/middlewares/verify_token.js";

const roundRoute = (app, options, done) => {
  app.route({
    method: "POST",
    url: "/createround",
    // preHandler: verifyToken,
    handler: createRound,
  });

  app.route({
    method: "GET",
    url: "/getRound",
    // preHandler: verifyToken,
    handler: getRound,
  });

  app.route({
    method: "GET",
    url: "/getRoundone",
    // preHandler: verifyToken,
    handler: getRoundone,
  });

  app.route({
    method: "DELETE",
    url: "/deleteRound",
    // preHandler: verifyToken,
    handler: deleteRound,
  });

  app.route({
    method: "PUT",
    url: "/updateRound",
    // preHandler: verifyToken,
    handler: updateRound,
  });

  app.route({
    method: "GET",
    url: "/getPlayerOfWeek",
    // preHandler: verifyToken,
    handler: getPlayerOfWeek,
  });

  app.route({
    method: "GET",
    url: "/getOpenRounds",
    // preHandler: verifyToken,
    handler: getOpenRounds,
  });

  done();
};

export default roundRoute;
