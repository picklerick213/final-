import React from "react";
import { useProfile } from "./User";

function ProfileComponent() {
    const { loading, data } = useProfile();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Render profile data once loaded
    return (
        <div>
            <h2>Profile</h2>
            <p>Name: {data.name}</p>
            <p>Email: {data.email}</p>
            {/* Other profile details */}
        </div>
    );
}

export default ProfileComponent;
