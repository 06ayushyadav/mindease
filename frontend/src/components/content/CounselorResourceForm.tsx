
import { useState } from 'react';
import api from '@/apis/axios';

export default function CounselorResourceForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('pdf');
  const [file, setFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('type', type);
      if (file) form.append('file', file);
      if (externalUrl) form.append('externalUrl', externalUrl);
      form.append('tags', tags);
   

      const token = localStorage.getItem('token');
      const response = await api.post('/api/resource/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      console.log(response.data)
      setMsg('Resource uploaded successfully');
      setTitle(''); setDescription(''); setFile(null); setTags('');
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center ' >
      
      <form
        onSubmit={submit}
        className="max-w-2xl w-full p-6 bg-white rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Add New Resource For The Public
        </h2>

        <label className="block mb-2 text-gray-700">Title*</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block mb-2 text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block mb-2 text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
          <option value="article">Article</option>
          <option value="link">Link</option>
        </select>

        <label className="block mb-2 text-gray-700">File (optional)</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />

        <label className="block mb-2 text-gray-700">External URL (optional)</label>
        <input
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block mb-2 text-gray-700">Tags (comma separated)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          disabled={loading}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition"
        >
          {loading ? 'Uploading...' : 'Upload Resource'}
        </button>

        {msg && <p className="mt-3 text-sm text-center text-green-600">{msg}</p>}
      </form>
    </div>
  );
}