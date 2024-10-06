'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EnrollmentForm from '../../components/EnrollmentForm';

export default function EnrollPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Enroll in a Course</h1>
      <EnrollmentForm />
    </div>
  );
}