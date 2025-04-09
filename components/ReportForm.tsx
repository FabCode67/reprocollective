import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { addReport } from "@/lib/db";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  date: z.string(),
  moneyEarned: z.coerce.number().min(0),
  padsBought: z.coerce.number().int().min(0),
  padsDonated: z.coerce.number().int().min(0),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  adolescentsTrained: z.coerce.number().int().min(0),
  content: z.string().min(50, { message: "Content must be at least 50 characters" })
});

export default function ReportForm() {
  const router = useRouter();
  
  // Get the current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: today,
      moneyEarned: 0,
      padsBought: 0,
      padsDonated: 0,
      description: "",
      adolescentsTrained: 0,
      content: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addReport(values);
    router.push("/reports");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Report Title</FormLabel>
                <FormControl>
                  <Input placeholder="Monthly Contribution Report" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }: { field: any }) => (
                <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="moneyEarned"
            render={({ field }: { field: any }) => (
                <FormItem>
                <FormLabel>Money Earned ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="padsBought"
            render={({ field }: { field: any }) => (
                <FormItem>
                <FormLabel>Pads Bought</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="padsDonated"
            render={({ field }: { field: any }) => (
                <FormItem>
                <FormLabel>Pads Donated</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="adolescentsTrained"
            render={({ field }: { field: any }) => (
                <FormItem>
                <FormLabel>Adolescents Trained on SRHR</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description of the contribution..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Full Article Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed report..." className="h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="button" variant="outline" className="mr-2" onClick={() => router.push("/reports")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
            Submit Report
          </Button>
        </div>
      </form>
    </Form>
  );
}
