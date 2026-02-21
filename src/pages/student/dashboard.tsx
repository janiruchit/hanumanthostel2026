import { useAuth } from "@/hooks/use-auth";
import { useRentRecords } from "@/hooks/use-rent";
import { useMenu } from "@/hooks/use-menu";
import { useNotifications } from "@/hooks/use-notifications";
import { useSettings } from "@/hooks/use-settings";
import { StudentHeader } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import { Bell, Calendar, IndianRupee, Utensils } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: rentRecords } = useRentRecords();
  const { data: menu } = useMenu();
  const { data: notifications } = useNotifications();
  const { data: settings } = useSettings();

  // Filter rent for current user
  const myRent = rentRecords?.filter(r => r.studentId === user?.id);
  const pendingRent = myRent?.find(r => r.status === 'unpaid');
  const recentRent = myRent?.slice(0, 3);

  // Get today's day name
  const today = format(new Date(), 'EEEE'); // e.g., "Monday"

  return (
    <div className="min-h-screen bg-gray-50/50">
      <StudentHeader />
      
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">
            Room {user?.roomNumber} ({user?.sharingType?.replace('-', ' ')}) • Hanumant Hostel
          </p>
          <p className="text-xs text-muted-foreground mt-1">Aadhar: {user?.aadharNumber || "Not Provided"}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Rent & Notifications */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Rent Status Card */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-orange-50 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-lg text-primary">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <CardTitle>Rent Status</CardTitle>
                  </div>
                  {pendingRent ? (
                    <Badge variant="destructive" className="px-3 py-1">Payment Due</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1">All Paid</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {pendingRent ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Outstanding Balance for</p>
                        <h3 className="text-3xl font-bold text-foreground mt-1">{pendingRent.month}</h3>
                        <p className="text-2xl font-semibold text-primary mt-1">₹{pendingRent.amount}</p>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                            Pay Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Scan to Pay</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col items-center justify-center p-6 space-y-4">
                            <div className="p-4 bg-white rounded-xl shadow-inner border">
                              {settings?.upiId ? (
                                <QRCodeSVG 
                                  value={`upi://pay?pa=${settings.upiId}&pn=HanumantHostel&am=${pendingRent.amount}&cu=INR`} 
                                  size={200} 
                                />
                              ) : (
                                <div className="w-[200px] h-[200px] flex items-center justify-center bg-muted text-muted-foreground text-sm text-center">
                                  UPI ID not set by admin
                                </div>
                              )}
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-lg">Amount: ₹{pendingRent.amount}</p>
                              <p className="text-sm text-muted-foreground">UPI ID: {settings?.upiId || "Not Available"}</p>
                            </div>
                            <Button className="w-full" variant="outline" onClick={() => window.open(`upi://pay?pa=${settings?.upiId}&pn=HanumantHostel&am=${pendingRent.amount}&cu=INR`, '_blank')}>
                              Open UPI App
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    <p>No pending dues. You're all caught up!</p>
                  </div>
                )}

                {/* Payment History */}
                {recentRent && recentRent.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Recent History</h4>
                    <div className="space-y-3">
                      {recentRent.map(record => (
                        <div key={record.id} className="flex justify-between items-center text-sm p-3 bg-white/50 rounded-lg">
                          <span className="font-medium">{record.month}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-medium">₹{record.amount}</span>
                            <Badge variant="outline" className={record.status === 'paid' ? "text-green-600 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100"}>
                              {record.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <CardTitle>Notice Board</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications && notifications.length > 0 ? (
                    notifications.map((note) => (
                      <div key={note.id} className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                        <p className="text-sm text-foreground leading-relaxed">{note.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {note.createdAt && format(new Date(note.createdAt), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">No new notifications.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Menu */}
          <div className="lg:col-span-1">
            <Card className="h-full border-none shadow-md flex flex-col">
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" />
                  <CardTitle>Weekly Menu</CardTitle>
                </div>
                <CardDescription>What's cooking today?</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <Tabs defaultValue={today} className="w-full">
                  <div className="px-6 pt-4 pb-2">
                    <TabsList className="w-full grid grid-cols-7 h-auto p-1 bg-muted/50">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <TabsTrigger 
                          key={day} 
                          value={day}
                          className="text-[10px] sm:text-xs py-2 px-1 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          {day.slice(0, 3)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                    const dayMenu = menu?.find(m => m.day === day);
                    return (
                      <TabsContent key={day} value={day} className="mt-0 p-6 space-y-6">
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Breakfast</h4>
                          <p className="text-sm font-medium">{dayMenu?.breakfast || "Not set"}</p>
                        </div>
                        <div className="w-full h-px bg-border/50" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Lunch</h4>
                          <p className="text-sm font-medium">{dayMenu?.lunch || "Not set"}</p>
                        </div>
                        <div className="w-full h-px bg-border/50" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Dinner</h4>
                          <p className="text-sm font-medium">{dayMenu?.dinner || "Not set"}</p>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
