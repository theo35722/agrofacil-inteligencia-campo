
import React from "react";
import { UserProfile } from "@/components/profile/UserProfile";
import { UserProperties } from "@/components/profile/UserProperties";
import { UserPreferences } from "@/components/profile/UserPreferences";
import { UserActivities } from "@/components/profile/UserActivities";
import { UserActions } from "@/components/profile/UserActions";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { profile, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

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
