import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  videoUrl: z.string().url("Please enter a valid video URL"),
  videoSource: z.enum(["YOUTUBE", "VIMEO", "GOOGLE_DRIVE"]),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().optional(),
});

const sectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  lessons: z.array(lessonSchema),
});

const courseSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  //instructor: z.string().min(1, "Please select an instructor"),
  isFree: z.boolean(),
  price: z.coerce.number().min(0, "Price must be a positive number").optional(),
  category: z.string().min(1, "Please select a category"),
  language: z.string().min(1, "Please select a language"),
  level: z.string().min(1, "Please select a level"),
  thumbnailUrl: z.string().optional(),
  demoVideoUrl: z.string().optional(),
  sections: z.array(sectionSchema).min(1, "At least one section is required"),
}).refine((data) => {
  if (!data.isFree && (!data.price || data.price <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Price is required for paid courses",
  path: ["price"],
});

type CourseFormData = z.infer<typeof courseSchema>;

// Video source options
const videoSources = [
  { id: "GOOGLE_DRIVE", name: "Google Drive" },
  { id: "YOUTUBE", name: "YouTube" },
  { id: "VIMEO", name: "Vimeo" },
];

// Mock data for languages and levels until tables are created
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

// Duration format helper
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const parseDuration = (duration: string): number => {
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]; // MM:SS
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  }
  return 0;
};

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
  const [categories, setCategories] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      instructor: "",
      isFree: false,
      price: 0,
      category: "",
      language: "",
      level: "",
      thumbnailUrl: "",
      demoVideoUrl: "",
      sections: [
        {
          title: "Introduction",
          lessons: [{ 
            title: "", 
            videoUrl: "", 
            videoSource: "GOOGLE_DRIVE" as const,
            duration: "",
            description: "",
          }],
        },
      ],
    },
  });

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, profilesRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('profiles').select('*').eq('role', 'INSTRUCTOR'),
        ]);

        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (profilesRes.data) setInstructors(profilesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      }
    };

    fetchData();
  }, []);

  const { fields: sections, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const addSection = () => {
    appendSection({
      title: "",
      lessons: [{ 
        title: "", 
        videoUrl: "", 
        videoSource: "GOOGLE_DRIVE" as const,
        duration: "",
        description: "",
      }],
    });
  };

  const addLesson = (sectionIndex: number) => {
    const currentSections = form.getValues("sections");
    const updatedSections = [...currentSections];
    updatedSections[sectionIndex].lessons.push({ 
      title: "", 
      videoUrl: "", 
      videoSource: "GOOGLE_DRIVE" as const,
      duration: "",
      description: "",
    });
    form.setValue("sections", updatedSections);
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const currentSections = form.getValues("sections");
    const updatedSections = [...currentSections];
    updatedSections[sectionIndex].lessons.splice(lessonIndex, 1);
    form.setValue("sections", updatedSections);
  };

  const onSubmit = async (data: CourseFormData) => {
    try {
      // Process lessons with duration conversion and URL formatting
      const processedData = {
        ...data,
        sections: data.sections.map(section => ({
          ...section,
          lessons: section.lessons.map(lesson => ({
            ...lesson,
            videoUrl: lesson.videoSource === "GOOGLE_DRIVE" 
              ? convertGoogleDriveUrl(lesson.videoUrl)
              : lesson.videoUrl,
            duration: parseDuration(lesson.duration),
          })),
        })),
      };

      console.log("Course data:", processedData);
      toast.success(isEdit ? "Course updated successfully!" : "Course created successfully!");
      navigate("/admin/courses");
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Failed to save course');
    }
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

                  {/* Free/Paid Toggle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Free Course</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Make this course free for all students
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {!form.watch("isFree") && (
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (₦)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="15000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Thumbnail and Demo Video */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="thumbnailUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Thumbnail URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="demoVideoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Demo Video URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/watch?v=..." {...field} />
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
                                <SelectItem key={instructor.id} value={instructor.user_id}>
                                  {instructor.full_name}
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
                            <div key={lessonIndex} className="grid grid-cols-1 gap-4 p-4 border rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                  name={`sections.${sectionIndex}.lessons.${lessonIndex}.duration`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Duration (MM:SS or HH:MM:SS)</FormLabel>
                                      <FormControl>
                                        <Input placeholder="5:30" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`sections.${sectionIndex}.lessons.${lessonIndex}.videoSource`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Video Source</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select source" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {videoSources.map((source) => (
                                            <SelectItem key={source.id} value={source.id}>
                                              {source.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="md:col-span-2">
                                  <FormField
                                    control={form.control}
                                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.videoUrl`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Video URL</FormLabel>
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
                              </div>

                              <FormField
                                control={form.control}
                                name={`sections.${sectionIndex}.lessons.${lessonIndex}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Lesson Description (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Brief description of the lesson"
                                        className="min-h-[80px]"
                                        {...field} 
                                      />
                                    </FormControl>
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