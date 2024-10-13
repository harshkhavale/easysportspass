import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AvatarImage } from '@radix-ui/react-avatar';
import { motion } from 'framer-motion';
import { Edit2, PenOff } from 'lucide-react';

//^ lib
import { classNames, cn } from '../../../lib/utils';

//^ ui
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogDescription,
} from '../../ui-comp/dialog';

//^ component
import ImageCropper from '../image-cropper';
import { Avatar, AvatarFallback } from '../../ui-comp/avatar';
import Spinner from '../loader/spinner';

// eslint-disable-next-line react/prop-types
const EditButton = ({ onClick, className, isLoading }) => {
  return (
    <motion.div
      onClick={isLoading ? () => {} : onClick}
      initial={{ translateX: '-1.5rem', right: 0 }}
      animate={{ translateX: '-1.5rem', right: 0 }}
      whileTap={{ scale: 0.8 }}
      className={classNames(
        isLoading ? 'cursor-not-allowed bg-primary/80' : '',
        cn(`bg-primary p-3 cursor-pointer rounded-full shadow-lg absolute bottom-0 ${className}`)
      )}
    >
      {isLoading ? <PenOff className='text-slate-100' /> : <Edit2 className='text-slate-100' />}
    </motion.div>
  );
};

// eslint-disable-next-line react/prop-types
const ProfilePicture = ({ updateProfileImage, imageUrl, userName, imageLoadingState = false }) => {
  const imageUploadDialogRef = useRef(null);
  const imageUploadDialogCloseRef = useRef(null);
  const [imageUrlString, setImageUrlString] = useState(imageUrl || '');
  const [originalImageUrl, setOriginalImageUrl] = useState('');

  useEffect(() => {
    setImageUrlString(imageUrl);
    setOriginalImageUrl(imageUrl);
  }, [imageUrl]);

  const handleEditButtonModel = () => {
    imageUploadDialogRef.current?.click();
  };

  const handleUpdateAvatar = useCallback((imageUrl, originalImgUrl) => {
    if (imageUrl.trim().length > 0) {
      setImageUrlString(imageUrl);
      setOriginalImageUrl(originalImgUrl);
      updateProfileImage?.(imageUrl);
      imageUploadDialogCloseRef.current?.click();
    }

    // eslint-disable-next-line
  }, []);

  const handlePreviewImage = () => {};

  return (
    <>
      <Dialog>
        <DialogTrigger className='hidden' ref={imageUploadDialogRef} />
        <DialogContent className='sm:max-w-[70%]' style={{ borderRadius: '1rem' }}>
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <ImageCropper originalImgSrc={originalImageUrl} updateAvatar={handleUpdateAvatar} />
          </DialogDescription>
          <DialogFooter>
            <DialogClose className='hidden' ref={imageUploadDialogCloseRef} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className='w-[15rem] h-[15rem] rounded-full relative' onClick={handlePreviewImage}>
        <Avatar className='w-[15rem] h-[15rem] rounded-full border border-slate-400 cursor-default'>
          <AvatarImage src={imageUrlString} alt='profile-image' className='shadow-sm object-cover rounded-full w-full h-full' />
          <AvatarFallback className='text-9xl'>
            {imageLoadingState ? <Spinner className={'w-10 h-10 stroke-primary'} /> : userName}
          </AvatarFallback>
        </Avatar>

        <EditButton isLoading={imageLoadingState} onClick={handleEditButtonModel} />
      </div>
    </>
  );
};

export default ProfilePicture;

ProfilePicture.propTypes = {
  imageUrl: PropTypes.any.isRequired,
  userName: PropTypes.string.isRequired,
  imageLoadingState: PropTypes.bool,
};
