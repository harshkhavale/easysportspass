import PropTypes from 'prop-types';
import { classNames } from '../../../lib/utils';

export default function Footer({ companyName, copyrightYear, socials, showSidebar = false }) {
  return (
    <footer
      className={classNames(showSidebar ? 'lg:pl-0' : 'lg:pl-72', 'sticky left-0 bottom-0 w-full pb-8 lg:pb-0 z-[1000] bg-white')}
    >
      <div className='border-t border-gray-200 w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:flex lg:flex-row lg:justify-between'>
        <div className='py-8 text-center text-sm text-slate-500 sm:text-left'>
          <span className='block sm:inline'>
            &copy; {copyrightYear} {companyName}
          </span>{' '}
          <span className='block sm:inline'>All rights reserved.</span>
        </div>
        <div className='flex gap-4 items-center justify-center md:justify-start'>
          {Array.isArray(socials)
            ? socials.map((social, index) => {
                return (
                  <a href={social.link} target='blank' key={index} className='flex items-center gap-2'>
                    <span>
                      <social.icon className={'w-5 h-5 shrink-0 text-slate-500'} />
                    </span>
                    {/* <span>{social.name}</span> */}
                  </a>
                );
              })
            : ''}
        </div>
      </div>
    </footer>
  );
}

// Define PropTypes
Footer.propTypes = {
  companyName: PropTypes.string.isRequired,
  copyrightYear: PropTypes.string.isRequired,
  socials: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.any.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
  showSidebar: PropTypes.bool.isRequired,
};
