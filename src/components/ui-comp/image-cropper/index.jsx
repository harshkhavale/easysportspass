import PropTypes from 'prop-types';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';
import { useEffect, useRef, useState } from 'react';

import { Button } from '../button/button';
import setCanvasPreview from '../../../lib/set-canvas-preview';
import toast from 'react-hot-toast';

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 240;

// eslint-disable-next-line react/prop-types
const ImageCropper = props => {
  const [crop, setCrop] = useState();
  const [imageSrc, setImageSrc] = useState(props.originalImgSrc || '');
  const [dataUrl, setDataUrl] = useState('');

  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const selectFileRef = useRef(null);

  useEffect(() => {
    props.updateAvatar(dataUrl, imageSrc);

    // eslint-disable-next-line
  }, [dataUrl, props.updateAvatar]);

  const handleSelectFile = event => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || '';
      imageElement.src = imageUrl;

      setImageSrc(imageUrl);

      imageElement.addEventListener('load', event => {
        const imageElement = event.currentTarget;

        const { naturalWidth, naturalHeight } = imageElement;

        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          toast.error('Image must be at least 240 x 240 pixels.', { position: 'top-center', duration: 5000 });
          return setImageSrc('');
        }
      });
    });

    reader.readAsDataURL(file);
  };

  const handleReactCrop = (_crop, percentageCrop) => {
    setCrop(percentageCrop);
  };

  const handleImageLoad = event => {
    const { width, height } = event.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: '%',
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );

    const centeredCrop = centerCrop(crop, width, height);

    setCrop(centeredCrop);
  };

  const handleCropImage = () => {
    setCanvasPreview({
      canvas: previewCanvasRef.current,
      image: imageRef.current,
      crop: convertToPixelCrop(crop, imageRef.current?.width, imageRef.current?.height),
    });

    const dataUrl = previewCanvasRef.current?.toDataURL();
    setDataUrl(dataUrl);
  };

  return (
    <div className='flex flex-col gap-4 overflow-y-auto h-[75vh]'>
      <label htmlFor='image-cropper'>
        <Button
          onClick={() => selectFileRef.current?.click()}
          className='font-semibold text-sm rounded-full'
          size={'sm'}
          variant={'outline'}
        >
          Choose File
        </Button>
      </label>
      <input type='file' accept='image/*' id='image-cropper' onChange={handleSelectFile} className='hidden' ref={selectFileRef} />
      {imageSrc ? (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4 items-center'>
            <ReactCrop crop={crop} onChange={handleReactCrop} circularCrop keepSelection aspect={ASPECT_RATIO} minWidth={MIN_DIMENSION}>
              <img ref={imageRef} src={imageSrc} alt='upload-image' style={{ maxHeight: '60vh', width: '100%' }} onLoad={handleImageLoad} />
            </ReactCrop>
          </div>
          <div className='flex justify-center'>
            <Button type='button' onClick={handleCropImage} className='w-28 font-inter font-semibold'>
              Crop
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ minHeight: '65vh' }} />
      )}
      <canvas
        ref={previewCanvasRef}
        style={{
          display: 'none',
          border: '1px solid black',
          width: '15rem',
          height: '15rem',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default ImageCropper;

ImageCropper.propTypes = {
  originalImgSrc: PropTypes.string,
  updateAvatar: PropTypes.func.isRequired,
};
