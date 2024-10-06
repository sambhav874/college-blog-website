"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Enrollment {
  id: number;
  enrollmentDate: string;
  enrollmentStatus: string;
  course: {
    Title: string;
    documentId: string;
  };
}

export default function MyEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrollments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/enrollments?populate=course`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        setEnrollments(response.data.data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        setError("Failed to load enrollments. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, [router]);

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Enrollments</h1>
      {enrollments.length === 0 ? (
        <p>You are not enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <CardHeader>
                <CardTitle>{enrollment.course.Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {enrollment.enrollmentStatus}</p>
                <p>
                  Enrolled on:{" "}
                  {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                </p>
                <Button
                  className="mt-4"
                  onClick={() =>
                    router.push(`/courses/${enrollment.course.documentId}`)
                  }
                >
                  View Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Button className="mt-8" onClick={() => router.push("/enrollment")}>
        Enroll in a New Course
      </Button>
    </div>
  );
}
