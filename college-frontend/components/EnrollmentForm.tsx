'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Course {
  id: number;
  Title: string;
  Slug: string;
  Description: string;
  Content: any[];
  documentId: any;
}

export default function EnrollmentForm() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [enrollmentDate, setEnrollmentDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/courses`);
        setCourses(response.data.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again.');
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to enroll in a course.');
      setIsLoading(false);
      return;
    }

    try {
      // First, get the current user's ID
      const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = userResponse.data.id;
      console.log("user Id is "+ userId);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/enrollments`,
        {
          data: {
            course: selectedCourse,
            enrollmentDate: enrollmentDate,
            enrollmentStatus: 'Enrolled',
            users_permissions_user: userId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Enrollment successful:', response.data);
      router.push('/my-enrollments');
    } catch (error) {
      console.error('An error occurred:', error);
      setError('Enrollment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Course Enrollment</CardTitle>
        <CardDescription>Enroll in a new course</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select onValueChange={setSelectedCourse} value={selectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.Title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="enrollmentDate">Enrollment Date</Label>
            <Input
              id="enrollmentDate"
              type="date"
              value={enrollmentDate}
              onChange={(e) => setEnrollmentDate(e.target.value)}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Enrolling...' : 'Enroll'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}