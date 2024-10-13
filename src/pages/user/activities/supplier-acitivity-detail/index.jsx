import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { createPrivateApi, getRequest, postRequest } from '../../../../api';
import { ENDPOINTS } from '../../../../constants/endpoints';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Skeleton } from '../../../../components/ui-comp/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui-comp/card';
import { Badge } from '../../../../components/ui-comp/badge';
import { MapPin, Globe, Mail, Phone, Clock, UserCheck } from 'lucide-react';

export default function SupplierActivityDetail() {
  const token = useSelector(state => state.auth?.token);
  const userId = useSelector(state => state.auth?.user?.userId);
  const params = useParams();

  const privateApi = createPrivateApi(token);
  const supplierId = params.supplierId;

  useQuery({
    queryKey: ['user-check-in-post'],
    queryFn: () =>
      postRequest({
        customAxios: privateApi,
        data: {
          userId,
          supplierId: parseInt(supplierId),
        },
        url: `${ENDPOINTS.CHECK_IN.CHECK_IN}`,
      }),
    gcTime: 0,
    staleTime: Infinity,
  });

  const {
    data: checkInCountData,
    isLoading: checkInCountIsLoading,
    isRefetching: checkInCountIsRefetching,
    isError: checkInCountIsError,
    error: checkInCountError,
  } = useQuery({
    queryKey: ['get-check-in-user-count'],
    queryFn: () =>
      getRequest({
        customAxios: privateApi,
        url: `${import.meta.env.VITE_API_URL}${ENDPOINTS.CHECK_IN.GET_CHECK_IN_USERS}/${supplierId}/count`,
      }),
    gcTime: 0,
    staleTime: Infinity,
  });

  const {
    data: supplierDetailData,
    isLoading: supplierDetailIsLoading,
    isRefetching: supplierDetailIsRefetching,
    isError: supplierDetailIsError,
    error: supplierDetailError,
  } = useQuery({
    queryKey: ['get-supplier-detail'],
    queryFn: () =>
      getRequest({ customAxios: privateApi, url: `${import.meta.env.VITE_API_URL}/${ENDPOINTS.SUPPLIER.SUPPLIER}/${supplierId}` }),
    gcTime: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (supplierDetailIsError) {
      toast.error(supplierDetailError.message || 'Something went wrong');
    }
  }, [supplierDetailIsError, supplierDetailError]);

  useEffect(() => {
    if (checkInCountIsError) {
      toast.error(checkInCountError.message || 'Something went wrong while getting the total check ins');
    }
  }, [checkInCountIsError, checkInCountError]);

  const { data: pictureData, isLoading: pictureIsLoading } = useQuery({
    queryKey: ['get-supplier-detail-picture'],
    queryFn: () =>
      getRequest({ customAxios: privateApi, url: `${ENDPOINTS.SUPPLIER.GET_SUPPLIER_PIC}/${supplierDetailData?.picture || ''}` }),
    enabled:
      (!supplierDetailIsLoading || !supplierDetailIsRefetching) &&
      typeof supplierDetailData?.picture === 'string' &&
      supplierDetailData?.picture?.length > 0,
    gcTime: 0,
    staleTime: Infinity,
  });

  const isLoading =
    supplierDetailIsLoading || supplierDetailIsRefetching || pictureIsLoading || checkInCountIsLoading || checkInCountIsRefetching;

  return (
    <div className='container mx-auto px-4 py-8'>
      {isLoading ? (
        <Skeleton className='w-full h-[30rem]' />
      ) : (
        <Card className='w-full'>
          <CardHeader>
            <CardTitle className='text-3xl font-bold'>{supplierDetailData.supplierName}</CardTitle>
            <div className='flex items-center mt-2 text-muted-foreground'>
              <UserCheck className='h-5 w-5 mr-2' />
              <span>{checkInCountData.count} check-ins</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <img
                  src={pictureData}
                  alt={supplierDetailData.supplierName}
                  className='w-full h-[30rem] object-cover shadow-lg rounded-lg'
                />
              </div>
              <div className='space-y-6'>
                <div>
                  <h3 className='text-xl font-semibold mb-2'>Description</h3>
                  <p>{supplierDetailData.description}</p>
                </div>
                <div className='flex items-center space-x-2'>
                  <MapPin className='h-5 w-5 text-muted-foreground' />
                  <span>
                    {supplierDetailData.address}, {supplierDetailData.postalcode}
                  </span>
                </div>
                {supplierDetailData.website && (
                  <div className='flex items-center space-x-2'>
                    <Globe className='h-5 w-5 text-muted-foreground' />
                    <a
                      href={supplierDetailData.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      {supplierDetailData.website}
                    </a>
                  </div>
                )}
                <div className='flex items-center space-x-2'>
                  <Mail className='h-5 w-5 text-muted-foreground' />
                  <a href={`mailto:${supplierDetailData.email}`} className='text-blue-600 hover:underline'>
                    {supplierDetailData.email}
                  </a>
                </div>
                {supplierDetailData.contact && (
                  <div className='flex items-center space-x-2'>
                    <Phone className='h-5 w-5 text-muted-foreground' />
                    <span>{supplierDetailData.contact}</span>
                  </div>
                )}
                {(supplierDetailData.openingTimes || supplierDetailData.closingTimes) && (
                  <div className='flex items-center space-x-2'>
                    <Clock className='h-5 w-5 text-muted-foreground' />
                    <span>
                      {supplierDetailData.openingTimes} - {supplierDetailData.closingTimes}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className='text-xl font-semibold mb-2'>Max Member Price</h3>
                  <Badge variant={'destructive'} className='text-lg rounded-md'>
                    ${supplierDetailData.maxMemberPrice.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
