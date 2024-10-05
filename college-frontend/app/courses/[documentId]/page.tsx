import React from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';


interface CourseData {
  id: number;
  
    Title: string;
    Slug: string;
    Description: string;
    Content: any[];
  
}

async function getCourse(id: string): Promise<CourseData> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/courses/${id}`);
    const courseData = response.data.data;
    console.log('Fetched Course Data:', courseData);
    return courseData;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
}

export default async function Course({ params }: { params: { documentId: string } }) {
  const course = await getCourse(params.documentId);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-3xl font-bold">{course.Title}</CardTitle>
          <CardDescription className="text-lg text-gray-100 mt-2">
            {course.Description}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6 space-y-6">
          {course.Content.map((section, index) => {
            switch (section.type) {
              case 'heading':
                const HeadingTag = `h${section.level}` as keyof JSX.IntrinsicElements;
                return React.createElement(
                  HeadingTag,
                  { 
                    key: index, 
                    className: `font-bold ${section.level === 2 ? 'text-2xl mt-8 mb-4' : 'text-xl mt-6 mb-3'}`
                  },
                  section.children[0].text
                );
              case 'paragraph':
                return (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {section.children[0].text}
                  </p>
                );
              case 'list':
                return (
                  <ul key={index} className="list-disc pl-6 space-y-2">
                    {section.children.map((listItem : any, idx : any) => (
                      <li key={idx} className="text-gray-700">
                        {listItem.children[0].text}
                      </li>
                    ))}
                  </ul>
                );
              default:
                return null;
            }
          })}
        </CardContent>
      </Card>
    </div>
  );
}