import { useState } from 'react';

const ImageLoaderToBase64 = () => {
  const [imageUrl, setImageUrl] = useState(
    'https://plus.unsplash.com/premium_photo-1727427850298-4666d1c7825b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  );
  const [base64Image, setBase64Image] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('base64Image', base64Image);

  // Function to convert the image to Base64 after it loads
  const handleImageLoad = async () => {
    try {
      setLoading(true);

      // Fetch the image and get the Blob object
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to load image');

      const blob = await response.blob();

      // Use FileReader to convert the blob to a Base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result); // Store Base64 in state
        setLoading(false); // Stop loading state
      };
      reader.readAsDataURL(blob); // Convert Blob to Base64
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Original Image:</h3>
      {/* Render the image and call handleImageLoad after it has loaded */}
      <img
        src={imageUrl}
        alt='Loading...'
        onLoad={handleImageLoad}
        style={{ maxWidth: '300px' }}
        onError={() => setError('Image failed to load')}
      />
      {loading && <p>Converting to Base64...</p>}
      {error && <p>Error: {error}</p>}

      <h3>Base64 Image:</h3>
      {/* Display the converted Base64 image */}
      {base64Image && <img src={base64Image} alt='Converted to Base64' style={{ maxWidth: '300px' }} />}
    </div>
  );
};

export default ImageLoaderToBase64;
