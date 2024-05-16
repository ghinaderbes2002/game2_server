import {createLog} from "../controllers/log_controllers.js";


const logRoute=(app ,options,done) =>
{ app.post("/createLog",createLog);
done();}

export default logRoute;