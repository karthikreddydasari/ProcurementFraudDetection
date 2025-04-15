import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ setResults }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('📂 Choose CSV File');
  const [dragging, setDragging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload a file.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5001/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("API response:", res.data);
      setResults(res.data.predictions);
    } catch (err) {
      console.error('AxiosError:', err);
      if (err.response) {
        alert(`Server Error: ${err.response.data.error || 'Check backend logs'}`);
      } else if (err.request) {
        alert('No response received. Backend may be down.');
      } else {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleFileChange = (f) => {
    setFile(f);
    setFileName(`📁 ${f.name}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      handleFileChange(droppedFile);
    } else {
      alert("Only CSV files are allowed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          padding: '0.8rem 1.2rem',
          border: dragging ? '2px dashed #007bff' : '2px dashed #ccc',
          borderRadius: '10px',
          textAlign: 'center',
          color: dragging ? '#007bff' : '#666',
          backgroundColor: '#fafafa',
          cursor: 'pointer',
          minWidth: '250px'
        }}
      >
        <label
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.2rem',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            boxShadow: '0 2px 6px rgba(0, 123, 255, 0.3)'
          }}
        >
          {fileName}
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileChange(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </label>
        <p style={{ fontSize: '0.9rem', margin: '0.3rem' }}>or drag and drop your CSV here</p>
      </div>

      <button
        type="submit"
        style={{
          marginLeft: '1rem',
          padding: '0.4rem 0.8rem',
          fontSize: '0.9rem',
          borderRadius: '8px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)'
        }}
      >
        Upload & Analyze
      </button>
    </form>
  );
};

export default UploadForm;
