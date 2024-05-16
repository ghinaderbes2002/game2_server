import { createRound } from "../controllers/rounds_controllers.js";
import { getRound } from "../controllers/rounds_controllers.js";
import { getRoundone } from "../controllers/rounds_controllers.js";
import { deleteRound } from "../controllers/rounds_controllers.js";
import { updateRound } from "../controllers/rounds_controllers.js";
import { getPlayerOfWeek } from "../controllers/rounds_controllers.js";

const roundRoute = (app, options, done) => {
  app.post("/createround", createRound);
  app.get("/getRound", getRound);
  app.get("/getRoundone", getRoundone);
  app.delete("/deleteRound", deleteRound);
  app.put("/updateRound", updateRound);
  app.put("/getPlayerOfWeek", getPlayerOfWeek);
  done();
};

export default roundRoute;
