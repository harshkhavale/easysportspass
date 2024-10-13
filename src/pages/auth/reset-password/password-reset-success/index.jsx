import { useNavigate } from 'react-router-dom';
import { ArrowUpFromDot, CircleCheckBig } from 'lucide-react';

import { Button } from '../../../../components/ui-comp/button/button';

export default function PasswordResetSuccess() {
  const navigate = useNavigate();

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 h-screen'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-2 items-center'>
        <div className='p-4 bg-green-200 rounded-full'>
          <CircleCheckBig className='text-green-500' />
        </div>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Password Reset</h2>
        <p className='text-sm text-muted-foreground text-center'>Your password has been successfully reset. Click below to log in.</p>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <div className='flex flex-col gap-4'>
          <Button type='submit' className={'flex gap-2 items-center w-full'} onClick={() => navigate('/')}>
            <span>Continue</span>
          </Button>
          <Button type='button' className={'flex gap-2 items-center w-full'} variant={'link'} onClick={() => navigate('/login')}>
            <ArrowUpFromDot className='-rotate-90 w-4 h-4' />
            <span>Back to log in</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
