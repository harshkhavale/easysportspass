import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import 'tailwindcss/tailwind.css';
import { createPrivateApi } from '../../api';
import { ENDPOINTS } from '../../constants/endpoints';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { IoIosCheckmarkCircleOutline, IoMdClose } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineBusinessCenter, MdOutlineCropLandscape } from 'react-icons/md';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Membership() {
  const token = useSelector(state => state.auth?.token);
  const privateApi = createPrivateApi(token);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editedPlan, setEditedPlan] = useState({
    planName: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.MEMBERSHIP.GET_ALL_PLANS);
      setPlans(Array.isArray(response.data.$values) ? response.data.$values : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
    }
  };

  const createPlan = async (values, { resetForm }) => {
    try {
      const payload = {
        PlanName: values.planName,
        Description: values.description,
        Price: parseInt(values.price),
        CreatedDateTime: new Date().toISOString(),
        ModifiedDateTime: new Date().toISOString(),
        CreatedBy: 'Admin',
        ModifiedBy: 'Admin',
      };

      await privateApi.post(ENDPOINTS.MEMBERSHIP.GET_NORMAL_PLANS, payload);
      fetchPlans();
      resetForm();
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  const startEditingPlan = plan => {
    setEditingPlanId(plan.planId);
    setEditedPlan({
      planName: plan.planName,
      description: plan.description,
      price: plan.price,
    });
  };

  const cancelEditingPlan = () => {
    setEditingPlanId(null); // Exit editing mode
    setEditedPlan({ planName: '', description: '', price: '' }); // Clear the edited plan state
  };

  const confirmAction = (action, message) => {
    toast(t => (
      <span>
        {message}
        <div className='flex p-2'>
          <button
            onClick={() => {
              action();
              toast.dismiss(t.id);
            }}
            className='bg-green-500 text-white px-3 py-1 rounded ml-3'
          >
            Confirm
          </button>
          <button onClick={() => toast.dismiss(t.id)} className='bg-red-500 text-white px-3 py-1 rounded ml-2'>
            Cancel
          </button>
        </div>
      </span>
    ));
  };

  const saveEditedPlan = async id => {
    confirmAction(async () => {
      try {
        const updatedPlan = {
          ...editedPlan,
          price: parseInt(editedPlan.price),
          ModifiedDateTime: new Date().toISOString(),
          ModifiedBy: 'Admin',
        };

        await privateApi.put(`${ENDPOINTS.MEMBERSHIP.GET_NORMAL_PLANS}/${id}`, updatedPlan);
        fetchPlans();
        setEditingPlanId(null);
        setEditedPlan({ planName: '', description: '', price: '' });
      } catch (error) {
        console.error('Error updating plan:', error);
      }
    }, 'Are you sure you want to save changes?');
  };

  const deletePlan = async id => {
    confirmAction(async () => {
      try {
        await privateApi.delete(`${ENDPOINTS.MEMBERSHIP.GET_NORMAL_PLANS}/${id}`);
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }, 'Are you sure you want to delete this plan?');
  };

  const planValidationSchema = Yup.object({
    planName: Yup.string().required('Plan name is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
  });

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen bg-gray-100'>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className='p-8 bg-white min-h-screen'>
      <div className='mb-12'>
        <h2 className='text-xl font-semibold text-gray-700 mb-4'>Create New Plan</h2>

        <Formik
          initialValues={{ planName: '', description: '', price: '' }}
          validationSchema={planValidationSchema}
          onSubmit={createPlan}
        >
          <Form className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <div>
              <Field
                type='text'
                name='planName'
                placeholder='Plan Name'
                className='border border-gray-300 rounded-sm p-2 w-full'
              />
              <ErrorMessage name='planName' component='div' className='text-red-500 text-sm mt-1' />
            </div>
            <div>
              <Field
                type='text'
                name='description'
                placeholder='Description'
                className='border border-gray-300 rounded-sm p-2 w-full'
              />
              <ErrorMessage name='description' component='div' className='text-red-500 text-sm mt-1' />
            </div>
            <div>
              <Field
                type='number'
                name='price'
                placeholder='Price'
                className='border border-gray-300 rounded-sm p-2 w-full'
              />
              <ErrorMessage name='price' component='div' className='text-red-500 text-sm mt-1' />
            </div>
            <button type='submit' className='bg-blue-600 hover:bg-blue-800 p-2 text-white rounded-sm col-span-3'>
              Create Plan
            </button>
          </Form>
        </Formik>
      </div>

      <div>
        <h2 className='text-xl font-semibold text-gray-700 mb-4'>Existing Plans</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
            <thead>
              <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
                <th className='py-3 px-6 text-left'>Type</th>
                <th className='py-3 px-6 text-left'>ID</th>
                <th className='py-3 px-6 text-left'>Plan Name</th>
                <th className='py-3 px-6 text-left'>Description</th>
                <th className='py-3 px-6 text-left'>Price</th>
                <th className='py-3 px-6 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-gray-600 text-sm font-light'>
              {plans.length > 0 ? (
                plans.map(plan => (
                  <tr key={plan.planId} className='border-b border-gray-200 hover:bg-gray-100'>
                    <td className='py-3 px-6 text-left'>
                      {plan.corporateId ? <MdOutlineBusinessCenter /> : <MdOutlineCropLandscape />}
                    </td>
                    <td className='py-3 px-6 text-left whitespace-nowrap'>{plan.planId}</td>
                    <td className='py-3 px-6 text-left'>
                      {editingPlanId === plan.planId ? (
                        <input
                          type='text'
                          value={editedPlan.planName}
                          onChange={e => setEditedPlan({ ...editedPlan, planName: e.target.value })}
                          className='border border-gray-300 rounded-sm p-2'
                        />
                      ) : (
                        plan.planName
                      )}
                    </td>
                    <td className='py-3 px-6 text-left'>
                      {editingPlanId === plan.planId ? (
                        <input
                          type='text'
                          value={editedPlan.description}
                          onChange={e => setEditedPlan({ ...editedPlan, description: e.target.value })}
                          className='border border-gray-300 rounded-sm p-2'
                        />
                      ) : (
                        plan.description
                      )}
                    </td>
                    <td className='py-3 px-6 text-left'>
                      {editingPlanId === plan.planId ? (
                        <input
                          type='number'
                          value={editedPlan.price}
                          onChange={e => setEditedPlan({ ...editedPlan, price: e.target.value })}
                          className='border border-gray-300 rounded-sm p-2'
                        />
                      ) : (
                        plan.price
                      )}
                    </td>
                    <td className='py-3 px-6 text-center'>
                      {editingPlanId === plan.planId ? (
                        <div className='flex justify-center'>
                          <IoIosCheckmarkCircleOutline
                            size={24}
                            className='cursor-pointer text-green-600'
                            onClick={() => saveEditedPlan(plan.planId)}
                          />

                          <IoMdClose onClick={cancelEditingPlan} className='text-red-500 cursor-pointer' size={24} />
                        </div>
                      ) : (
                        <div className='flex justify-center'>
                          <CiEdit
                            size={24}
                            className='cursor-pointer text-blue-500'
                            onClick={() => startEditingPlan(plan)}
                          />
                          <AiOutlineDelete
                            size={24}
                            className='cursor-pointer text-red-500 ml-4'
                            onClick={() => deletePlan(plan.planId)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6' className='py-3 px-6 text-center'>
                    No plans available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Membership;
