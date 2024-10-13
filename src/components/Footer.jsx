import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaApple, FaGooglePlay } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = e => setEmail(e.target.value);
  const handleSubscribe = () => {
    // Handle the email subscription logic
    // console.log('Subscribed with email:', email);
  };

  return (
    <footer className=' bg-white text-black py-10 w-full z-10 shadow-lg border'>
      <div className='container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Social Media Section */}
        <div className='flex flex-col items-start'>
          <h2 className='text-lg font-semibold mb-4'>Follow Us</h2>
          <div className='flex space-x-4'>
            <Link to='https://facebook.com'>
              <FaFacebookF size={24} />
            </Link>
            <Link to='https://twitter.com'>
              <FaTwitter size={24} />
            </Link>
            <Link to='https://instagram.com'>
              <FaInstagram size={24} />
            </Link>
            <Link to='https://linkedin.com'>
              <FaLinkedinIn size={24} />
            </Link>
          </div>
        </div>

        {/* Download Our App Section */}
        <div className='flex flex-col items-start'>
          <h2 className='text-lg font-semibold mb-4'>Download Our App</h2>
          <div className='flex space-x-4'>
            <Link to='/appstore'>
              <FaApple size={32} />
            </Link>
            <Link to='/playstore'>
              <FaGooglePlay size={28} />
            </Link>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className='flex flex-col items-start'>
          <h2 className='text-lg font-semibold mb-4'>Join Our Newsletter</h2>
          <div className='flex space-x-2'>
            <input
              type='email'
              placeholder='Enter your email'
              className='px-4 py-2 border border-blue-400 rounded-lg text-black'
              value={email}
              onChange={handleEmailChange}
            />
            <button className='bg-blue-500 rounded-lg px-4 py-2 text-white hover:bg-blue-600 transition' onClick={handleSubscribe}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className='mt-8 text-center text-gray-400'>
        <p>&copy; {new Date().getFullYear()} EasySportsPass. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
