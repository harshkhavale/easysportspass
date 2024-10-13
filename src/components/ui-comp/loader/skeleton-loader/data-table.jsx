import { Skeleton } from '../../skeleton';

function SkeletonRows() {
  return (
    <div className='flex gap-2 rounded-sm'>
      <Skeleton className='w-[100%] h-[1.25rem]' />
      <Skeleton className='w-[100%] h-[1.25rem]' />
      <Skeleton className='w-[100%] h-[1.25rem]' />
      <Skeleton className='w-[100%] h-[1.25rem]' />
      <Skeleton className='w-[100%] h-[1.25rem]' />
    </div>
  );
}

const DataTableSkeletonLoading = () => {
  return (
    <div className='w-[100%] border rounded-[0.625rem] p-2 flex flex-col gap-2'>
      <Skeleton className='w-[100%] h-[2rem]' />
      <SkeletonRows />
      <SkeletonRows />
      <SkeletonRows />
      <SkeletonRows />
    </div>
  );
};

export default DataTableSkeletonLoading;
