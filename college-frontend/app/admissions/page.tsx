'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PageData {
  id: number;
  Title: string;
  Slug: string;
  Content: Array<{
    type: string;
    level?: number;
    children: Array<{
      type: string;
      text: string;
    }>;
  }>;
  FeaturedImage: {
    url: string;
    alternativeText?: string;
  };
}

const AdmissionsPage = () => {
  const [pageData, setPageData] = useState<PageData | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/pages`, {
          params: {
            populate: 'FeaturedImage',
          },
        });
        const aboutPage = response.data.data.find((page: PageData) => page.Slug === 'admissions');
        setPageData(aboutPage);
      } catch (error) {
        console.error('Error fetching page data:', error);
      }
    };

    fetchPageData();
  }, []);

  if (!pageData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{pageData.Title}</h1>
      {/* Render the featured image if available */}
      {pageData.FeaturedImage && (
        <img
          src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.FeaturedImage.url}`}
          alt={pageData.FeaturedImage.alternativeText || 'Featured Image'}
          className="mb-6"
        />
      )}
      <div className="prose">
        {pageData.Content.map((section, index) => {
          switch (section.type) {
            case 'heading':
              const HeadingTag = `h${section.level}` as keyof JSX.IntrinsicElements;
              return <HeadingTag key={index}>{section.children[0].text}</HeadingTag>;
            case 'paragraph':
              return <p key={index}>{section.children[0].text}</p>;
            case 'list':
              return (
                <ul key={index}>
                  {section.children.map((listItem, idx) => (
                    <li key={idx}>{listItem.children[0].text}</li>
                  ))}
                </ul>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default AdmissionsPage;