import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { createPrivateApi } from '../../api';
import { ENDPOINTS } from '../../constants/endpoints';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { IoIosCheckmarkCircleOutline, IoMdClose } from 'react-icons/io';
import * as Yup from 'yup';

// Yup validation schema
const countryValidationSchema = Yup.object().shape({
  countryName: Yup.string().required('Country Name is required'),
  isocode: Yup.string().required('ISO Code is required'),
});

function Country() {
  const token = useSelector(state => state.auth?.token);
  const privateApi = createPrivateApi(token);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCountry, setNewCountry] = useState({ countryName: '', isocode: '' });
  const [editingCountryId, setEditingCountryId] = useState(null);
  const [editedCountry, setEditedCountry] = useState({ countryName: '', isocode: '' });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.COUNTRY.COUNTRY);
      setCountries(response.data?.$values || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setLoading(false);
    }
  };

  const addCountry = async () => {
    try {
      await countryValidationSchema.validate(newCountry, { abortEarly: false });

      await privateApi.post(ENDPOINTS.COUNTRY.COUNTRY, newCountry);
      setNewCountry({ countryName: '', isocode: '' });
      fetchCountries();
      toast.success('Country added successfully!');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.errors.forEach(err => toast.error(err));
      } else {
        console.error('Error adding country:', error);
        toast.error('Error adding country.');
      }
    }
  };

  const startEditingCountry = country => {
    setEditingCountryId(country.countryId);
    setEditedCountry(country);
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

  const saveEditedCountry = async id => {
    confirmAction(async () => {
      try {
        await countryValidationSchema.validate(editedCountry, { abortEarly: false });

        await privateApi.put(`${ENDPOINTS.COUNTRY.COUNTRY}/${id}`, editedCountry);
        setEditingCountryId(null);
        setEditedCountry({ countryName: '', isocode: '' });
        fetchCountries();
        toast.success('Country updated successfully!');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          error.errors.forEach(err => toast.error(err));
        } else {
          console.error('Error updating country:', error);
          toast.error('Error updating country.');
        }
      }
    }, 'Are you sure you want to save changes?');
  };
  const cancelEditing = () => {
    setEditingCountryId(null);
    setEditedCountry({
      countryName: '',
      isocode: '',
    });
  };
  const deleteCountry = async id => {
    confirmAction(async () => {
      try {
        await privateApi.delete(`${ENDPOINTS.COUNTRY.COUNTRY}/${id}`);
        fetchCountries();
        toast.success('Country deleted successfully!');
      } catch (error) {
        console.error('Error deleting country:', error);
        toast.error('Error deleting country.');
      }
    }, 'Are you sure you want to delete this country?');
  };

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
        <h2 className='text-xl font-semibold text-gray-700 mb-4'>Create New Country</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <input
            type='text'
            placeholder='Country Name'
            value={newCountry.countryName}
            onChange={e => setNewCountry({ ...newCountry, countryName: e.target.value })}
            className='border border-gray-300 rounded-sm p-2'
          />
          <input
            type='text'
            placeholder='ISO Code'
            value={newCountry.isocode}
            onChange={e => setNewCountry({ ...newCountry, isocode: e.target.value })}
            className='border border-gray-300 rounded-sm p-2'
          />
        </div>
        <button className='bg-blue-600 hover:bg-blue-800 p-2 text-white rounded-sm' onClick={addCountry}>
          Create Country
        </button>
      </div>
      <div>
        <h2 className='text-xl font-semibold text-gray-700 mb-4'>Existing Countries</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
            <thead>
              <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
                <th className='py-3 px-6 text-left'>ID</th>
                <th className='py-3 px-6 text-left'>Country Name</th>
                <th className='py-3 px-6 text-left'>ISO Code</th>
                <th className='py-3 px-6 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-gray-600 text-sm font-light'>
              {countries.length > 0 ? (
                [...countries].reverse().map(country => (
                  <tr key={country.countryId} className='border-b border-gray-200 hover:bg-gray-100'>
                    <td className='py-3 px-6 text-left whitespace-nowrap'>{country.countryId}</td>
                    <td className='py-3 px-6 text-left'>
                      {editingCountryId === country.countryId ? (
                        <input
                          type='text'
                          value={editedCountry.countryName}
                          onChange={e => setEditedCountry({ ...editedCountry, countryName: e.target.value })}
                          className='border border-gray-300 rounded-sm p-2'
                        />
                      ) : (
                        country.countryName
                      )}
                    </td>
                    <td className='py-3 px-6 text-left'>
                      {editingCountryId === country.countryId ? (
                        <input
                          type='text'
                          value={editedCountry.isocode}
                          onChange={e => setEditedCountry({ ...editedCountry, isocode: e.target.value })}
                          className='border border-gray-300 rounded-sm p-2'
                        />
                      ) : (
                        country.isocode
                      )}
                    </td>

                    <td className='py-3 px-6 text-center flex gap-2'>
                      {editingCountryId === country.countryId ? (
                        <>
                          {' '}
                          <IoIosCheckmarkCircleOutline
                            size={24}
                            className='cursor-pointer text-green-500 hover:text-green-700 mr-2'
                            onClick={() => saveEditedCountry(country.countryId)}
                          />
                          <IoMdClose onClick={cancelEditing} className='text-red-500 cursor-pointer' size={24} />
                        </>
                      ) : (
                        <>
                          <CiEdit
                            size={24}
                            className='cursor-pointer text-blue-500 hover:text-blue-700 mr-2'
                            onClick={() => startEditingCountry(country)}
                          />
                          <AiOutlineDelete
                            size={24}
                            className='cursor-pointer text-red-500 hover:text-red-700'
                            onClick={() => deleteCountry(country.countryId)}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='py-3 px-6 text-center'>
                    No countries found
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

export default Country;
