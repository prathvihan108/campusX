import { useAuth } from "../../../context/AuthContext.jsx";
import Loading from "./Loading.jsx";

import React from "react";

function LoadingModel() {
	console.log("Loading model mounted");
	const { showLoading } = useAuth();
	console.log("showLoading", showLoading);
	return <div>{showLoading && <Loading />}</div>;
}

export default LoadingModel;
