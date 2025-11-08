"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function DoctorsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center font-headline">Find a Doctor</h1>
        <p className="text-muted-foreground text-center mb-8">
          Search for doctors by name, specialty, or location.
        </p>

        <Card className="mb-8">
          <CardContent className="p-4">
            <form className="flex w-full items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, specialty, location..."
                  className="pl-10 pr-4 py-3 h-12 text-base bg-background/50"
                  aria-label="Search for a doctor"
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-12">
              <p>Your search results will appear here.</p>
              <p className="text-sm">Start by typing in the search bar above.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
