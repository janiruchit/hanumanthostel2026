import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-destructive items-center justify-center">
            <AlertCircle className="h-10 w-10" />
            <h1 className="text-3xl font-bold">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-center text-muted-foreground">
            Did you get lost? This page doesn't exist.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Return Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
