import { useState } from "react";
import { useStudents } from "@/hooks/use-students";
import { useRentRecords, useCreateRent, useMarkRentPaid } from "@/hooks/use-rent";
import { AdminLayout } from "./layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminRent() {
  const { data: students } = useStudents();
  const { data: rentRecords, isLoading } = useRentRecords();
  const createRent = useCreateRent();
  const markPaid = useMarkRentPaid();
  const { toast } = useToast();

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // New Rent State
  const [newRentStudent, setNewRentStudent] = useState<string>("");
  const [newRentAmount, setNewRentAmount] = useState<string>("");
  const [newRentMonth, setNewRentMonth] = useState<string>("");

  const filteredRecords = rentRecords?.filter(r => 
    filterStatus === "all" ? true : r.status === filterStatus
  );

  const handleCreateRent = () => {
    if (!newRentStudent || !newRentMonth) {
      toast({ variant: "destructive", title: "Please fill all fields" });
      return;
    }

    const student = students?.find(s => s.id.toString() === newRentStudent);
    const amount = student?.sharingType === '3-sharing' ? 9000 : 8500;

    createRent.mutate({
      studentId: parseInt(newRentStudent),
      amount: amount,
      month: newRentMonth,
      status: "unpaid"
    }, {
      onSuccess: () => {
        toast({ title: "Rent demand created" });
        setIsDialogOpen(false);
        setNewRentAmount("");
        setNewRentMonth("");
        setNewRentStudent("");
      }
    });
  };

  const handleMarkPaid = (id: number) => {
    markPaid.mutate(id, {
      onSuccess: () => toast({ title: "Marked as paid" })
    });
  };

  // Helper to get student name
  const getStudentName = (id: number) => {
    return students?.find(s => s.id === id)?.name || "Unknown";
  };
  
  const getStudentRoom = (id: number) => {
    return students?.find(s => s.id === id)?.roomNumber || "-";
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Rent & Fees</h1>
          <p className="text-muted-foreground mt-1">Track payments and outstanding balances</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Add Rent Demand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Rent Demand</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Student</label>
                <Select value={newRentStudent} onValueChange={setNewRentStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.filter(s => s.role === 'student').map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name} (Room {s.roomNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Month</label>
                <Select value={newRentMonth} onValueChange={setNewRentMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                      <SelectItem key={m} value={`${m} ${new Date().getFullYear()}`}>
                        {m} {new Date().getFullYear()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                Amount will be auto-calculated based on student's sharing type (₹8500 or ₹9000).
              </div>
              <Button onClick={handleCreateRent} className="w-full" disabled={createRent.isPending}>
                {createRent.isPending ? "Creating..." : "Create Demand"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
          className="rounded-full px-4"
        >
          All
        </Button>
        <Button 
          variant={filterStatus === "unpaid" ? "default" : "outline"}
          onClick={() => setFilterStatus("unpaid")}
          className="rounded-full px-4"
        >
          Unpaid
        </Button>
        <Button 
          variant={filterStatus === "paid" ? "default" : "outline"}
          onClick={() => setFilterStatus("paid")}
          className="rounded-full px-4"
        >
          Paid
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Student</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading records...</TableCell>
                </TableRow>
              ) : filteredRecords?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No records found.</TableCell>
                </TableRow>
              ) : (
                filteredRecords?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{getStudentName(record.studentId)}</TableCell>
                    <TableCell>{getStudentRoom(record.studentId)}</TableCell>
                    <TableCell>{record.month}</TableCell>
                    <TableCell>₹{record.amount}</TableCell>
                    <TableCell>
                      <Badge variant={record.status === 'paid' ? "default" : "destructive"} className={record.status === 'paid' ? "bg-green-500 hover:bg-green-600" : ""}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {record.status === 'unpaid' && (
                        <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleMarkPaid(record.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
