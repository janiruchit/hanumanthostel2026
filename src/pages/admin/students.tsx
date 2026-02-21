import { useState } from "react";
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from "@/hooks/use-students";
import { AdminLayout } from "./layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Plus, Search, Trash2, Edit2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminStudents() {
  const { data: students, isLoading } = useStudents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const filteredStudents = students?.filter(s => 
    s.role === 'student' && 
    (s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.roomNumber?.includes(searchTerm))
  );

  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "password123", // Default password for admin-created users
      role: "student",
      name: "",
      roomNumber: "",
      mobile: "",
      sharingType: "6-sharing",
      aadharNumber: ""
    }
  });

  const onSubmit = (data: any) => {
    if (editingStudent) {
      updateStudent.mutate({ id: editingStudent.id, ...data }, {
        onSuccess: () => {
          toast({ title: "Student updated" });
          setIsDialogOpen(false);
          setEditingStudent(null);
          form.reset();
        }
      });
    } else {
      createStudent.mutate(data, {
        onSuccess: () => {
          toast({ title: "Student created" });
          setIsDialogOpen(false);
          form.reset();
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this student?")) {
      deleteStudent.mutate(id, {
        onSuccess: () => toast({ title: "Student removed" })
      });
    }
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    form.reset({
      username: student.username,
      password: student.password, // This might be hidden usually, handling simply for now
      role: "student",
      name: student.name,
      roomNumber: student.roomNumber,
      mobile: student.mobile,
      sharingType: student.sharingType || "6-sharing",
      aadharNumber: student.aadharNumber || ""
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student records and assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingStudent(null); form.reset(); }} className="w-full sm:w-auto gap-2">
              <Plus className="w-4 h-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="roomNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room No.</FormLabel>
                        <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sharingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sharing Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || '6-sharing'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sharing" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3-sharing">3 Sharing (₹9000)</SelectItem>
                            <SelectItem value="6-sharing">6 Sharing (₹8500)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="aadharNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar Card Number</FormLabel>
                      <FormControl><Input {...field} value={field.value || ''} placeholder="12-digit Aadhar number" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createStudent.isPending || updateStudent.isPending}>
                  {createStudent.isPending || updateStudent.isPending ? "Saving..." : "Save Student"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search by name or room number..." 
            className="pl-9 bg-gray-50/50 border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name & Aadhar</TableHead>
                <TableHead>Room & Sharing</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading students...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStudents?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No students found.</TableCell>
                </TableRow>
              ) : (
                filteredStudents?.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/5">
                    <TableCell className="font-medium">
                      <div>{student.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">Aadhar: {student.aadharNumber || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">Room {student.roomNumber || "-"}</div>
                      <div className="text-xs text-muted-foreground">{student.sharingType?.replace('-', ' ') || "6 sharing"}</div>
                    </TableCell>
                    <TableCell>{student.mobile || "-"}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{student.username}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(student)}>
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
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
