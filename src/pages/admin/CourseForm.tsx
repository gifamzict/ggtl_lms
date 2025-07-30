import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  videoUrl: z.string().url("Please enter a valid Google Drive URL"),
});

const sectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  lessons: z.array(lessonSchema),
});

const courseSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  instructor: z.string().min(1, "Please select an instructor"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Please select a category"),
  language: z.string().min(1, "Please select a language"),
  level: z.string().min(1, "Please select a level"),
  sections: z.array(sectionSchema).min(1, "At least one section is required"),
});

type CourseFormData = z.infer<typeof courseSchema>;

// Mock data
const instructors = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
  { id: "4", name: "Sarah Wilson" },
];

const categories = [
  { id: "1", name: "Programming" },
  { id: "2", name: "Design" },
  { id: "3", name: "Business" },
  { id: "4", name: "Marketing" },
];

const languages = [
  { id: "en", name: "English" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
];

const levels = [
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
];

// Utility function to convert Google Drive URLs
const convertGoogleDriveUrl = (url: string): string => {
  // Extract file ID from various Google Drive URL formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9-_]+)/,
    /id=([a-zA-Z0-9-_]+)/,
    /\/open\?id=([a-zA-Z0-9-_]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const fileId = match[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }
  
  // If no pattern matches, return original URL
  return url;
};

export default function CourseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      instructor: "",
      price: 0,
      category: "",
      language: "",
      level: "",
      sections: [
        {
          title: "Introduction",
          lessons: [{ title: "", videoUrl: "" }],
        },
      ],
    },
  });

  const { fields: sections, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const addSection = () => {
    appendSection({
      title: "",
      lessons: [{ title: "", videoUrl: "" }],
    });
  };

  const addLesson = (sectionIndex: number) => {
    const currentSections = form.getValues("sections");
    const updatedSections = [...currentSections];
    updatedSections[sectionIndex].lessons.push({ title: "", videoUrl: "" });
    form.setValue("sections", updatedSections);
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const currentSections = form.getValues("sections");
    const updatedSections = [...currentSections];
    updatedSections[sectionIndex].lessons.splice(lessonIndex, 1);
    form.setValue("sections", updatedSections);
  };

  const onSubmit = (data: CourseFormData) => {
    // Convert all Google Drive URLs to preview format
    const processedData = {
      ...data,
      sections: data.sections.map(section => ({
        ...section,
        lessons: section.lessons.map(lesson => ({
          ...lesson,
          videoUrl: convertGoogleDriveUrl(lesson.videoUrl),
        })),
      })),
    };

    console.log("Course data:", processedData);
    toast.success(isEdit ? "Course updated successfully!" : "Course created successfully!");
    navigate("/admin/courses");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin/courses")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold text-foreground">
                {isEdit ? "Edit Course" : "Add New Course"}
              </h1>
            </div>
            <ThemeToggle />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter course title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₦)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter course description"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="instructor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select instructor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {instructors.map((instructor) => (
                                <SelectItem key={instructor.id} value={instructor.id}>
                                  {instructor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {languages.map((language) => (
                                <SelectItem key={language.id} value={language.id}>
                                  {language.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {levels.map((level) => (
                                <SelectItem key={level.id} value={level.id}>
                                  {level.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Course Content */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Course Content</CardTitle>
                    <Button type="button" onClick={addSection} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {sections.map((section, sectionIndex) => (
                    <Card key={section.id} className="border-muted">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <FormField
                            control={form.control}
                            name={`sections.${sectionIndex}.title`}
                            render={({ field }) => (
                              <FormItem className="flex-1 mr-4">
                                <FormControl>
                                  <Input 
                                    placeholder="Section title"
                                    className="font-medium"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {sections.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSection(sectionIndex)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                              <FormField
                                control={form.control}
                                name={`sections.${sectionIndex}.lessons.${lessonIndex}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Lesson Title</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter lesson title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`sections.${sectionIndex}.lessons.${lessonIndex}.videoUrl`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Google Drive Video URL</FormLabel>
                                    <div className="flex gap-2">
                                      <FormControl>
                                        <Input 
                                          placeholder="https://drive.google.com/file/d/..." 
                                          {...field} 
                                        />
                                      </FormControl>
                                      {section.lessons.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeLesson(sectionIndex, lessonIndex)}
                                          className="text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addLesson(sectionIndex)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lesson
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/admin/courses")}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEdit ? "Update Course" : "Create Course"}
                </Button>
              </div>
            </form>
          </Form>
        </main>
      </div>
    </SidebarProvider>
  );
}