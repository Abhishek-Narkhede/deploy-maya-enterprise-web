import userReducer from "./users/users";
import cartsReducer from "./carts/carts";
import globalConfigReducer from "./globalconfig/globalconfig";
import successReducer from "./success/success";

const rootReducers = {
	user: userReducer,
	// cart: cartsReducer,
	// globalConfig: globalConfigReducer,
	successInfo: successReducer
};

export default rootReducers;