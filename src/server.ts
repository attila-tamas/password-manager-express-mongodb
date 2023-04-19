import App from "./app";

import AuthenticationController from "./controllers/authentication-controller";
import KeyController from "./controllers/key-controller";
import UserController from "./controllers/user-controller";

new App([
	new AuthenticationController(), //
	new KeyController(),
	new UserController(),
]);
