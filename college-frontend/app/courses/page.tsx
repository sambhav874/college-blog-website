import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface CourseData {
  id: number;
  Title: string;
  Slug: string;
  Description: string;
  Content: any[];
}


async function getCourses(): Promise<CourseData[]> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/courses?populate=*`);
    const courseData = response.data.data;
    console.log('Fetched Course Data:', courseData);
    return courseData;
  } catch (error) {
    console.error('Error fetching course data:', error);
    throw error;
  }
}

export default async function Home() {
  const courses = await getCourses();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Our Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                {course.Title}
              </CardTitle>
              <CardDescription>{course.Description}</CardDescription>
            </CardHeader>
            <CardContent>
              {course.Content.map((section, index) => {
                switch (section.type) {
                  case 'heading':
                    return (
                      <h2 key={index} className={`text-${section.level}xl font-bold mt-4`}>
                        {section.children[0].text}
                      </h2>
                    );
                  case 'paragraph':
                    return <p key={index} className="mt-2">{section.children[0].text}</p>;
                  case 'list':
                    return (
                      <ul key={index} className="list-disc ml-6 mt-2">
                        {section.children.map((listItem, idx) => (
                          <li key={idx}>{listItem.children[0].text}</li>
                        ))}
                      </ul>
                    );
                  default:
                    return null;
                }
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}