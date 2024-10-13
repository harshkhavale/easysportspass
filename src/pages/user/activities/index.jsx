import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { LockKeyholeIcon, StarIcon } from 'lucide-react';
import { Card } from '../../../components/ui-comp/card';
import { classNames } from '../../../lib/utils';
import { createPrivateApi, getRequest } from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Skeleton } from '../../../components/ui-comp/skeleton';
import { Separator } from '../../../components/ui-comp/separator';
import { Button } from '../../../components/ui-comp/button/button';

const reviews = { average: 4, totalCount: 1624 };

function SupplierDetailsCard({ supplierValue, supplierName }) {
  const navigate = useNavigate();
  const token = useSelector(state => state.auth?.token);
  const privateAxios = createPrivateApi(token);

  const { data: pictureData, isLoading: pictureIsLoading } = useQuery({
    queryKey: ['get-supplier-picture', supplierValue.supplierId],
    queryFn: () => getRequest({ customAxios: privateAxios, url: `${ENDPOINTS.SUPPLIER.GET_SUPPLIER_PIC}/${supplierValue?.picture || ''}` }),
    enabled: typeof supplierValue.picture === 'string' && supplierValue.picture.length > 0,
    gcTime: 0,
    staleTime: Infinity,
  });

  return (
    <Card onClick={() => navigate(`${supplierValue?.supplierId}`)} className='cursor-pointer'>
      <div className='flex flex-col'>
        <div className='relative flex h-80 w-full flex-col overflow-hidden rounded-lg rounded-bl-none rounded-br-none p-2 hover:opacity-75 xl:w-auto'>
          <span aria-hidden='true' className='absolute inset-0'>
            {pictureIsLoading ? (
              <Skeleton className={'h-full w-full'} />
            ) : (
              <img src={pictureData} alt={supplierName} className='h-full w-full object-cover object-center' />
            )}
          </span>
          <span aria-hidden='true' className='absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50' />
          <div className='relative flex justify-between items-center mt-auto'>
            <div className='relative flex items-center mt-auto'>
              {[0, 1, 2, 3, 4].map(rating => (
                <StarIcon
                  key={rating}
                  className={classNames(
                    reviews.average > rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 fill-gray-300',
                    'h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden='true'
                />
              ))}
            </div>
            <p className='font-medium text-white text-base'>67m</p>
          </div>
        </div>
        <div className='p-4 flex justify-between flex-col h-[inherit] gap-10'>
          <div className='flex flex-col gap-1'>
            <p className='capitalize'>{supplierName}</p>
            <p>{supplierValue.address}</p>
            <p className='flex gap-2 items-center'>
              <span className='text-red-500'>Closed</span>
              <span>Opens at 10h</span>
            </p>
          </div>
          <div className='flex flex-col justify-end h-full'>
            <p className='flex gap-2 items-center'>
              <span>
                <LockKeyholeIcon className='text-red-500 w-4 h-4' />
              </span>
              <strong>Available </strong>
              <span>from Gold</span>
            </p>
          </div>
        </div>
      </div>
      <div>
        <Separator />
        <div className='p-2 flex justify-end items-center'>
          <Button variant='ghost' className='uppercase'>
            Upgrade
          </Button>
        </div>
      </div>
    </Card>
  );
}

SupplierDetailsCard.propTypes = {
  supplierName: PropTypes.string.isRequired,
  supplierValue: PropTypes.shape({
    supplierId: PropTypes.number.isRequired,
    picture: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
};

export default function Activities() {
  const token = useSelector(state => state.auth?.token);
  const privateAxios = createPrivateApi(token);

  const {
    data: getSupplierData,
    isLoading: getSupplierIsLoading,
    isError: getSupplierIsError,
    error: getSupplierError,
  } = useQuery({
    queryKey: ['get-supplier-data'],
    queryFn: () => getRequest({ customAxios: privateAxios, url: ENDPOINTS.SUPPLIER.SUPPLIER }),
    gcTime: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (getSupplierIsError) {
      toast.error(getSupplierError.message || 'Something went wrong');
    }
  }, [getSupplierError, getSupplierIsError]);

  return (
    <section className='container'>
      <div className='mt-10 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0 gap-8'>
        {getSupplierIsLoading
          ? Array.from({ length: 10 }).map((_, index) => <Skeleton key={index} className={'w-full h-[20rem]'} />)
          : getSupplierData?.$values.map((value, index) => (
              <React.Fragment key={index}>
                <SupplierDetailsCard supplierName={value.supplierName} supplierValue={value} />
              </React.Fragment>
            ))}
      </div>
    </section>
  );
}
