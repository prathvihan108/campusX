import React from "react";
import { useParams } from "react-router-dom";

function User() {
	const { userid } = useParams();
	const { user } = useContext(UserContext);

	if (!user) return <div>please login</div>;

	return <></>;
}

export default User;
