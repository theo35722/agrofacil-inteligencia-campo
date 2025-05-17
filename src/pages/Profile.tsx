
import React from "react";
import { UserProfile } from "@/components/profile/UserProfile";
import { UserProperties } from "@/components/profile/UserProperties";
import { UserPreferences } from "@/components/profile/UserPreferences";
import { UserActivities } from "@/components/profile/UserActivities";
import { UserActions } from "@/components/profile/UserActions";

const Profile = () => {
  return (
    <div className="flex flex-col gap-6 pb-16">
      <h1 className="text-xl font-bold mb-2 px-4">Perfil do Usuário</h1>
      
      <div className="flex flex-col gap-6 px-4">
        <UserProfile />
        <UserProperties />
        <UserPreferences />
        <UserActivities />
        <UserActions />
      </div>
    </div>
  );
};

export default Profile;
