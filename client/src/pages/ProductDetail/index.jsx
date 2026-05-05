import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-900">
      <h1 className="text-3xl font-semibold mb-4">Product Detail</h1>
      <p className="text-base text-slate-600">Viewing product ID: {id}</p>
    </div>
  );
}
