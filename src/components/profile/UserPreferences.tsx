
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const UserPreferences = () => {
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [plagueAlerts, setPlagueAlerts] = useState(true);
  const [notificationChannel, setNotificationChannel] = useState("app");

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Settings className="h-5 w-5 mr-2 text-green-600" />
          Preferências do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="weather-alerts" className="flex items-center cursor-pointer">
              Alertas de Clima
            </Label>
            <Switch
              id="weather-alerts"
              checked={weatherAlerts}
              onCheckedChange={setWeatherAlerts}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="plague-alerts" className="flex items-center cursor-pointer">
              Alertas de Pragas
            </Label>
            <Switch
              id="plague-alerts"
              checked={plagueAlerts}
              onCheckedChange={setPlagueAlerts}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          
          <div className="mt-4">
            <Label htmlFor="notification-channel" className="mb-2 block">
              Canal Preferido de Notificação
            </Label>
            <Select value={notificationChannel} onValueChange={setNotificationChannel}>
              <SelectTrigger id="notification-channel" className="w-full bg-white">
                <SelectValue placeholder="Selecione um canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="app">Notificações no app</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
