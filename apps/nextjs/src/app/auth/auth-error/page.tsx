import Link from "next/link";

import { Button } from "@goat/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@goat/ui/components/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Error</CardTitle>
            <CardDescription>
              There was a problem signing you in. This could be due to an
              expired link or an issue with your authentication provider.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground text-sm">
                Please try signing in again. If the problem persists, contact
                support.
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/login">Back to login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
