import { useState, useEffect } from 'react';

const useImageToBase64 = imageUrl => {
  const [base64Image, setBase64Image] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);

        // Fetch the image as a blob
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image');

        const blob = await response.blob();

        // Convert the blob to Base64 using FileReader
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Image(reader.result); // Set the Base64 data to state
          setLoading(false); // Set loading to false
        };
        reader.readAsDataURL(blob); // Read blob as Base64 URL
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchImage();
  }, [imageUrl]);

  return { base64Image, loading, error };
};

export default useImageToBase64;
