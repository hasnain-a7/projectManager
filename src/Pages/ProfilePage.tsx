import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserContextId } from "@/AuthContext/UserContext";
const ProfilePage = () => {
  const { userContextId } = useUserContextId();
  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/profile.png" alt="Profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">User</CardTitle>
            <p className="text-sm text-muted-foreground">{userContextId}</p>
          </div>
        </CardHeader>
      </Card>

      <div className="w-[40%]">
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <Separator />
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
