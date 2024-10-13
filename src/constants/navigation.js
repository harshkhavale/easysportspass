import { CiViewList } from 'react-icons/ci';
import { LiaCitySolid } from 'react-icons/lia';
import { CgAttribution } from 'react-icons/cg';
import { MdOutlineBusinessCenter } from 'react-icons/md';
import { PiMapPin } from 'react-icons/pi';
import { TiChartAreaOutline } from 'react-icons/ti';
import { FiHome, FiSettings, FiUser } from 'react-icons/fi';
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { CheckSquare, FilePlus2, Handshake, NotebookPen, UserCog2Icon, Users2 } from 'lucide-react';

export const adminNavigation = [
  { name: 'Home', href: '/admin/home', icon: FiHome },
  { name: 'Membership Plans', href: '/admin/membership-plan', icon: CiViewList },
  { name: 'Manage Users', href: '/admin/manage-users', icon: FiUser },
  { name: 'Country', href: '/admin/country', icon: PiMapPin },
  { name: 'State', href: '/admin/state', icon: TiChartAreaOutline },
  { name: 'City', href: '/admin/city', icon: LiaCitySolid },
  { name: 'Plan Attribute', href: '/admin/plan-attributes', icon: CgAttribution },
  { name: 'Corporate Users', href: '/admin/corporate-users', icon: MdOutlineBusinessCenter },
  { name: 'Suppliers', href: '/admin/suppliers', icon: Handshake },
  { name: 'Settings', href: '/admin/settings', icon: FiSettings },
];

export const supplierNavigation = [
  { name: 'Activities', href: '/supplier/activities', icon: FilePlus2 },
  { name: 'Manage Supplier Profile', href: '/supplier/manage-supplier-profile', icon: UserCog2Icon },
  { name: 'Check In', href: '/supplier/check-in', icon: CheckSquare },
];
export const publicNavigation = [
  { name: 'Home', to: '/' },
  { name: 'Company', to: '/company' },
  { name: 'About Sports', to: '/about-sports' },
  { name: 'Subscription', to: '/subscription' },
  { name: 'Contact Us', to: '/contact-us' },
];

export const corporateNavigation = [
  { name: 'Plan Attributes', href: '/corporate/plan-attributes', icon: NotebookPen },
  { name: 'Manage Plan', href: '/corporate/manage-members', icon: Users2 },
  { name: 'Manage Corporate Profile', href: '/corporate/manage-corporate-profile', icon: UserCog2Icon },
];

export const publicSocials = [
  { name: 'Github', icon: FaGithub, link: 'https://github.com/' },
  { name: 'Linkedin', icon: FaLinkedin, link: 'https://linkedin.com/' },
  { name: 'Instagram', icon: FaInstagram, link: 'https://instagram.com/' },
  { name: 'Facebook', icon: FaFacebook, link: 'https://facebook.com/' },
];
