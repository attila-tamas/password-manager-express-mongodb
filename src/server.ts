import App from "./app";

import AuthenticationController from "@controllers/authentication.controller";
import KeyController from "@controllers/key.controller";
import UserController from "@controllers/user.controller";
import ValidationController from "@controllers/validation.controller";

new App([
	new AuthenticationController(),
	new ValidationController(),
	new KeyController(),
	new UserController(),
]);
