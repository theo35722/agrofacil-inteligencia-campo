
import { Bell, BellOff, Check, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "info" | "warning" | "success";
  read: boolean;
}

const Notifications = () => {
  // Mock data for demo
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Alerta de Clima",
      message: "Previsão de chuva forte amanhã. Evite aplicar defensivos.",
      date: "14/05/2025",
      type: "warning",
      read: false
    },
    {
      id: "2",
      title: "Lembrete de Atividade",
      message: "Adubação do Talhão 3 programada para amanhã.",
      date: "14/05/2025",
      type: "info",
      read: false
    },
    {
      id: "3",
      title: "Diagnóstico Concluído",
      message: "O diagnóstico da imagem enviada foi concluído. Veja os resultados.",
      date: "13/05/2025",
      type: "success",
      read: false
    },
    {
      id: "4",
      title: "Nova Dica Disponível",
      message: "Adicionamos um novo artigo sobre manejo de pragas na soja.",
      date: "12/05/2025",
      type: "info",
      read: true
    }
  ]);
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    toast.success("Todas as notificações marcadas como lidas");
  };
  
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    toast.success("Notificação marcada como lida");
  };
  
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== id
    );
    setNotifications(updatedNotifications);
    toast.success("Notificação removida");
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("Todas as notificações foram removidas");
  };
  
  const getNotificationColor = (type: "info" | "warning" | "success") => {
    switch (type) {
      case "warning":
        return "bg-orange-100 border-orange-200 text-orange-800";
      case "success":
        return "bg-agro-green-100 border-agro-green-200 text-agro-green-800";
      default:
        return "bg-agro-blue-100 border-agro-blue-200 text-agro-blue-800";
    }
  };
  
  const getNotificationBadge = (type: "info" | "warning" | "success") => {
    switch (type) {
      case "warning":
        return "bg-orange-500 hover:bg-orange-600";
      case "success":
        return "bg-agro-green-500 hover:bg-agro-green-600";
      default:
        return "bg-agro-blue-500 hover:bg-agro-blue-600";
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
            Notificações
          </h1>
          <p className="text-gray-600">
            Acompanhe alertas e lembretes importantes
          </p>
        </div>
        
        <div className="space-x-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs border-agro-green-300 text-agro-green-700 hover:bg-agro-green-50"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" /> 
              Marcar todas como lidas
            </Button>
          )}
          
          {notifications.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs border-red-300 text-red-700 hover:bg-red-50"
              onClick={clearAllNotifications}
            >
              <Trash2 className="h-3 w-3 mr-1" /> 
              Limpar tudo
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <BellOff className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">Nenhuma notificação disponível</p>
            <p className="text-gray-400 text-sm mt-1">
              As notificações e alertas aparecerão aqui
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 border rounded-lg ${notification.read ? 'bg-white' : getNotificationColor(notification.type)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="mt-1">
                    <Bell className={`h-5 w-5 ${notification.read ? 'text-gray-400' : 'text-agro-green-600'}`} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{notification.title}</h4>
                      
                      {!notification.read && (
                        <Badge className={getNotificationBadge(notification.type)}>
                          Nova
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      {notification.date}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-4 w-4 text-agro-green-600" />
                      <span className="sr-only">Marcar como lida</span>
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
