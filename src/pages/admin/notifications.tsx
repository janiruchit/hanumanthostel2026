import { useState } from "react";
import { useNotifications, useCreateNotification } from "@/hooks/use-notifications";
import { AdminLayout } from "./layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Bell, Send } from "lucide-react";

export default function AdminNotifications() {
  const { data: notifications, isLoading } = useNotifications();
  const createNotification = useCreateNotification();
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    createNotification.mutate({ message }, {
      onSuccess: () => {
        toast({ title: "Notification sent" });
        setMessage("");
      }
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1">Announce updates to all students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                New Announcement
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea 
                placeholder="Type your message here..." 
                className="min-h-[150px] mb-4 resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button 
                className="w-full shadow-md shadow-primary/20" 
                onClick={handleSend}
                disabled={createNotification.isPending || !message.trim()}
              >
                {createNotification.isPending ? "Posting..." : "Post Notice"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-muted-foreground text-center py-4">Loading history...</p>
                ) : notifications?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No announcements yet.</p>
                ) : (
                  notifications?.map((note) => (
                    <div key={note.id} className="p-4 rounded-xl bg-muted/30 border border-border flex justify-between items-start gap-4">
                      <p className="text-sm text-foreground flex-1">{note.message}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {note.createdAt && format(new Date(note.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
