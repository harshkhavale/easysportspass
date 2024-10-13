import { useNavigate } from 'react-router-dom';
import { ArrowUpFromDot, MailCheck } from 'lucide-react';

import { Button } from '../../../../components/ui-comp/button/button';
import { useSelector } from 'react-redux';

export default function ResetLinkMessage() {
  const navigate = useNavigate();
  const resetPassMessages = useSelector(state => state.auth.resetPassMessages);

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 h-screen'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-2 items-center'>
        <div className='p-4 bg-green-200 rounded-full'>
          <MailCheck className='text-green-500' />
        </div>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>{`Check your ${resetPassMessages.type}`}</h2>
        <p className='text-sm text-muted-foreground text-center'>{`We sent a password reset link to ${resetPassMessages.emailOrMobile}`}</p>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <div className='flex flex-col gap-6 items-center'>
          <p>
            <span>{`Didn't receive the ${resetPassMessages.type}? `}</span>
            <Button type='button' variant='link' className='p-0'>{`Click to resend`}</Button>
          </p>
          <Button type='button' className={'flex gap-2 items-center w-full'} variant={'link'} onClick={() => navigate('/login')}>
            <ArrowUpFromDot className='-rotate-90 w-4 h-4' />
            <span>Back to log in</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
