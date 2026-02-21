import { useMenu, useUpdateMenu } from "@/hooks/use-menu";
import { AdminLayout } from "./layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";

type DayMenuForm = {
  breakfast: string;
  lunch: string;
  dinner: string;
};

function DayMenuCard({ day, currentMenu, onSave }: { day: string, currentMenu: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState<DayMenuForm>({
    breakfast: currentMenu?.breakfast || "",
    lunch: currentMenu?.lunch || "",
    dinner: currentMenu?.dinner || ""
  });
  const [isChanged, setIsChanged] = useState(false);

  const handleChange = (field: keyof DayMenuForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsChanged(true);
  };

  const handleSave = () => {
    onSave({ day, ...formData });
    setIsChanged(false);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-primary">{day}</CardTitle>
          {isChanged && (
            <Button size="sm" onClick={handleSave} className="h-7 text-xs">Save</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Breakfast</label>
          <Input 
            value={formData.breakfast} 
            onChange={(e) => handleChange('breakfast', e.target.value)}
            placeholder="e.g. Poha, Tea"
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Lunch</label>
          <Input 
            value={formData.lunch} 
            onChange={(e) => handleChange('lunch', e.target.value)}
            placeholder="e.g. Dal, Rice, Roti"
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Dinner</label>
          <Input 
            value={formData.dinner} 
            onChange={(e) => handleChange('dinner', e.target.value)}
            placeholder="e.g. Veg Curry, Roti"
            className="h-8"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminMenu() {
  const { data: menu, isLoading } = useMenu();
  const updateMenu = useUpdateMenu();
  const { toast } = useToast();

  const handleUpdate = (data: any) => {
    updateMenu.mutate(data, {
      onSuccess: () => toast({ title: `Menu updated for ${data.day}` })
    });
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (isLoading) return <AdminLayout><div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Food Menu</h1>
        <p className="text-muted-foreground mt-1">Plan weekly meals for students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {days.map(day => (
          <DayMenuCard 
            key={day} 
            day={day} 
            currentMenu={menu?.find(m => m.day === day)} 
            onSave={handleUpdate}
          />
        ))}
      </div>
    </AdminLayout>
  );
}
