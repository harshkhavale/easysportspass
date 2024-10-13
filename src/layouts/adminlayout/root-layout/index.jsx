import { Outlet } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function RootLayout() {
  return (
    <div>
      <Navbar />
      <div className='min-h-screen pt-[4.25rem] p-4'>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
