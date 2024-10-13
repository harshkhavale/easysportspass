import { heroimg } from '../assets';
import TabSection from '../components/HeroTabSection';

const Home = () => {
  return (
    <>
      <div className='fixed bg-cover bg-center w-full top-0 left-0 -z-10 h-full' style={{ backgroundImage: `url(${heroimg})` }}></div>

      <div>
        <div className='flex flex-col items-center md:items-start px-4 md:px-0 md:py-60 w-full max-w-3xl'>
          <TabSection />
        </div>
      </div>
    </>
  );
};

export default Home;
