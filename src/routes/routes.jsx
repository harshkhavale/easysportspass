import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// layouts
import RootLayout from '../layouts/adminlayout/root-layout';
import AdminLayout from '../layouts/adminlayout';
import SupplierLayout, { Supplier } from '../layouts/supplier-layout';
import CorporateLayout, { Corporate } from '../layouts/corporate-layout';
import UserLayout, { User } from '../layouts/user-layout';

// pages
import Home from '../pages/Home';
import Register from '../pages/Register';
import MembershipPlanList from '../pages/MembershipPlanList';
import CorporatePlanList from '../pages/CorporatePlanList';
import VerifyUser from '../pages/VerifyUser';
import ProtectedRoute from '../components/widgets/ProtectedRoute';
import Profile from '../pages/Profile';

// admin Pages
import { AdminPage } from '../pages/admin/Admin';
import MemberShipPlan from '../pages/admin/membership-plan/index';
import ManageUser from '../pages/admin/manage-user';
import Country from '../pages/admin/country';
import State from '../pages/admin/state';
import City from '../pages/admin/city';
import PlanAttributes from '../pages/admin/plan-attributes';
import CorporateUser from '../pages/admin/corporate-users';
import Suppliers from '../pages/admin/suppliers';
import AdminHome from '../pages/admin/admin-home';

// public page
import Company from '../pages/public/company';
import AboutSports from '../pages/public/about-sports';
import Subscriptions from '../pages/public/subscriptions';
import ContactUs from '../pages/public/contact-us';

// auth pages
import ResetPassword from '../pages/auth/reset-password';
import PasswordResetSuccess from '../pages/auth/reset-password/password-reset-success';
import ResetLinkMessage from '../pages/auth/reset-password/reset-link-message';
import Login from '../pages/Login';

// supplier pages
import SupplierManageProfile from '../pages/supplier/manage-profile';
import CreateActivities from '../pages/supplier/create-activities';
import SupplierCheckIn from '../pages/supplier/supplier-check-in';

// corporate pages
import CorporateManageProfile from '../pages/corporate/manage-user';
import CorporatePlanAttributes from '../pages/corporate/plan-attributes';
import CorporateManagePlans from '../pages/corporate/membership-plan';

// users pages
import UserManageProfile from '../pages/user/manage-profile';
import UserActivities from '../pages/user/activities';
import SupplierActivityDetail from '../pages/user/activities/supplier-acitivity-detail';

// eslint-disable-next-line react/prop-types
export default function Router({ user, userType }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootLayout />}>
          <Route
            index={true}
            element={
              user ? (
                userType === 'Administrator' ? (
                  <Navigate to='/admin' />
                ) : userType === 'Supplier' ? (
                  <Navigate to={'/supplier'} />
                ) : userType === 'Normal' ? (
                  <Navigate to={'/user'} />
                ) : userType === 'Corporate' ? (
                  <Navigate to={'/corporate'} />
                ) : (
                  <>
                    <Navigate to='/login' />
                  </>
                )
              ) : (
                <Home />
              )
            }
          />
          <Route path='/company' element={<Company />} />
          <Route path='/about-sports' element={<AboutSports />} />
          <Route path='/subscription' element={<Subscriptions />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/memberships' element={<MembershipPlanList />} />
        </Route>

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/corporateplans' element={<CorporatePlanList />} />
        <Route path='/verifyuser' element={<VerifyUser />} />
        <Route path='/reset-password'>
          <Route index={true} element={<ResetPassword />} />
          <Route path='reset-pass-message' element={<ResetLinkMessage />} />
          <Route path='success' element={<PasswordResetSuccess />} />
        </Route>

        <Route path='/profile' element={<ProtectedRoute element={Profile} />} />

        {/*Admin Routes*/}
        <Route path='/admin' element={<ProtectedRoute element={AdminLayout} requiredType={'Administrator'} />}>
          <Route index={true} element={<ProtectedRoute element={AdminPage} requiredType='Administrator' />} />
          <Route path='manage-profile' element={<ProtectedRoute element={UserManageProfile} requiredType={'Administrator'} />} />
          <Route path='home' element={<ProtectedRoute element={AdminHome} requiredType='Administrator' />} />
          <Route path='membership-plan' element={<ProtectedRoute element={MemberShipPlan} requiredType={'Administrator'} />} />
          <Route path='manage-users' element={<ProtectedRoute element={ManageUser} requiredType={'Administrator'} />} />
          <Route path='country' element={<ProtectedRoute element={Country} requiredType={'Administrator'} />} />
          <Route path='state' element={<ProtectedRoute element={State} requiredType={'Administrator'} />} />
          <Route path='city' element={<ProtectedRoute element={City} requiredType={'Administrator'} />} />
          <Route path='plan-attributes' element={<ProtectedRoute element={PlanAttributes} requiredType={'Administrator'} />} />
          <Route path='corporate-users' element={<ProtectedRoute element={CorporateUser} requiredType={'Administrator'} />} />
          <Route path='suppliers' element={<ProtectedRoute element={Suppliers} requiredType={'Administrator'} />} />
          <Route path='settings' />
        </Route>

        {/* Supplier Routes */}
        <Route path='/supplier' element={<ProtectedRoute element={SupplierLayout} requiredType={'Supplier'} />}>
          <Route index={true} element={<ProtectedRoute element={Supplier} requiredType={'Supplier'} />} />
          <Route path='manage-supplier-profile' element={<ProtectedRoute element={SupplierManageProfile} requiredType={'Supplier'} />} />
          <Route path='manage-profile' element={<ProtectedRoute element={UserManageProfile} requiredType={'Supplier'} />} />
          <Route path='activities' element={<ProtectedRoute element={CreateActivities} requiredType={'Supplier'} />} />
          <Route path='check-in' element={<ProtectedRoute element={SupplierCheckIn} requiredType={'Supplier'} />} />
        </Route>

        {/* Corporate Routes */}
        <Route path='/corporate' element={<ProtectedRoute element={CorporateLayout} requiredType={'Corporate'} />}>
          <Route index={true} element={<ProtectedRoute element={Corporate} requiredType={'Corporate'} />} />
          <Route path='manage-corporate-profile' element={<ProtectedRoute element={CorporateManageProfile} requiredType={'Corporate'} />} />
          <Route path='manage-profile' element={<ProtectedRoute element={UserManageProfile} requiredType={'Corporate'} />} />
          <Route path='plan-attributes' element={<ProtectedRoute element={CorporatePlanAttributes} requiredType={'Corporate'} />} />
          <Route path='manage-members' element={<ProtectedRoute element={CorporateManagePlans} requiredType={'Corporate'} />} />
        </Route>

        {/* User Routes */}
        <Route path='/user' element={<ProtectedRoute element={UserLayout} requiredType={'Normal'} />}>
          <Route index={true} element={<ProtectedRoute element={User} requiredType={'Normal'} />} />
          <Route path='activities'>
            <Route index={true} element={<ProtectedRoute element={UserActivities} requiredType={'Normal'} />} />
            <Route path=':supplierId' element={<ProtectedRoute element={SupplierActivityDetail} requiredType={'Normal'} />} />
          </Route>
          <Route path='manage-profile' element={<ProtectedRoute element={UserManageProfile} type={'Normal'} requiredType={'Normal'} />} />
        </Route>

        {/* <Route path='/admin-login' element={<AdminLogin />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
