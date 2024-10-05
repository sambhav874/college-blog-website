import axios from 'axios';

// Define the shape of the homepage data
interface HomepageData {
  id: number;
  documentId: string;
  Title: string;
  Introduction: Array<{ type: string; children: any[] }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
}

// Fetch homepage data from Strapi using Axios
async function getHomepage(): Promise<HomepageData> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/homepage`);
    console.log('Fetched Homepage Data:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    throw error;
  }
}

export default async function Home() {
  const homepage = await getHomepage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{homepage.Title}</h1>
      <div className="prose max-w-none">
        {homepage.Introduction.map((block, index) => (
          <p key={index}>
            {block.children.map((child: any, childIndex: number) => (
              <span key={childIndex}>{child.text}</span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}