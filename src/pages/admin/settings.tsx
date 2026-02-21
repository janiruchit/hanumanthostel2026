import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { AdminLayout } from "./layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertSettingsSchema } from "@shared/schema";
import { Settings as SettingsIcon } from "lucide-react";

export default function AdminSettings() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertSettingsSchema),
    defaultValues: {
      upiId: ""
    }
  });

  // Load existing settings
  useEffect(() => {
    if (settings) {
      form.reset({ upiId: settings.upiId || "" });
    }
  }, [settings, form]);

  const onSubmit = (data: any) => {
    updateSettings.mutate(data, {
      onSuccess: () => toast({ title: "Settings updated successfully" })
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure global hostel settings</p>
      </div>

      <div className="max-w-2xl">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              Payment Configuration
            </CardTitle>
            <CardDescription>Setup UPI ID for student rent payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="upiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hostel UPI ID</FormLabel>
                      <FormControl>
                        <Input placeholder="example@okhdfcbank" {...field} value={field.value || ''} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        This UPI ID will be used to generate QR codes for students to pay rent.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={updateSettings.isPending}>
                  {updateSettings.isPending ? "Saving..." : "Save Configuration"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
