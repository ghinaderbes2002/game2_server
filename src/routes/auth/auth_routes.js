import {signupController} from "../../controllers/auth/auth_controllers.js";
import { loginController } from "../../controllers/auth/auth_controllers.js";


const usersRoute=(app ,options,done) =>
{ app.post("/signup",signupController).post("/login",loginController);
done();}

export default usersRoute;