import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { createPrivateApi } from '../../api';
import { ENDPOINTS } from '../../constants/endpoints';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { IoIosCheckmarkCircleOutline, IoMdClose } from 'react-icons/io';

function CorporateUser() {
  const token = useSelector(state => state.auth?.token);
  const privateApi = createPrivateApi(token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    corporateName: '',
    contactPersonName: '',
    contactPersonDetail: '',
    contactPersonMobileNo: '',
    contactPersonEmail: '',
    emailIdentifier: '',
    createdBy: 'admin',
    updatedBy: 'admin',
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    corporateName: '',
    contactPersonName: '',
    contactPersonDetail: '',
    contactPersonMobileNo: '',
    contactPersonEmail: '',
    emailIdentifier: '',
  });

  useEffect(() => {
    fetchUsers();

    // eslint-disable-next-line
  }, []);

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditedUser({
      corporateName: '',
      contactPersonName: '',
      contactPersonDetail: '',
      contactPersonMobileNo: '',
      contactPersonEmail: '',
      emailIdentifier: '',
    });
  };
  const fetchUsers = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.CORPORATE.CORPORATE);
      const usersData = response.data?.$values || [];
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching corporate users:', error);
      setLoading(false);
    }
  };

  const startEditingUser = user => {
    setEditingUserId(user.corporateId);
    setEditedUser({
      corporateName: user.corporateName,
      contactPersonName: user.contactPersonName,
      contactPersonDetail: user.contactPersonDetail,
      contactPersonMobileNo: user.contactPersonMobileNo,
      contactPersonEmail: user.contactPersonEmail,
      emailIdentifier: user.emailIdentifier,
    });
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
  const createUser = async () => {
    // Validation logic
    if (!newUser.corporateName) {
      toast.error('Corporate name is required');
      return;
    }
    if (!newUser.contactPersonName) {
      toast.error('Contact person name is required');
      return;
    }
    if (!newUser.contactPersonDetail) {
      toast.error('Contact person detail is required');
      return;
    }
    if (!newUser.contactPersonMobileNo) {
      toast.error('Contact person mobile number is required');
      return;
    }
    if (!newUser.contactPersonEmail) {
      toast.error('Contact person email is required');
      return;
    }

    // Validate emailIdentifier (must contain "@bsf.io")
    const emailPattern = /^[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(newUser.emailIdentifier)) {
      toast.error('Email identifier not valid.');
      return;
    }

    try {
      const payload = { ...newUser };
      await privateApi.post(ENDPOINTS.CORPORATE.CORPORATE, payload);
      fetchUsers();
      setNewUser({
        corporateName: '',
        contactPersonName: '',
        contactPersonDetail: '',
        contactPersonMobileNo: '',
        contactPersonEmail: '',
        emailIdentifier: '',
      });
      toast.success('Corporate user added successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating corporate user.');
    }
  };

  const saveEditedUser = async id => {
    // Validation logic
    if (!editedUser.corporateName) {
      toast.error('Corporate name is required');
      return;
    }
    if (!editedUser.contactPersonName) {
      toast.error('Contact person name is required');
      return;
    }
    if (!editedUser.contactPersonDetail) {
      toast.error('Contact person detail is required');
      return;
    }
    if (!editedUser.contactPersonMobileNo) {
      toast.error('Contact person mobile number is required');
      return;
    }
    if (!editedUser.contactPersonEmail) {
      toast.error('Contact person email is required');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(editedUser.emailIdentifier)) {
      toast.error('Email identifier not valid .');
      return;
    }

    confirmAction(async () => {
      try {
        const updatedUser = { corporateId: id, ...editedUser };
        await privateApi.put(`${ENDPOINTS.CORPORATE.CORPORATE}/${id}`, updatedUser);
        fetchUsers();
        setEditingUserId(null);
        setEditedUser({
          corporateName: '',
          contactPersonName: '',
          contactPersonDetail: '',
          contactPersonMobileNo: '',
          contactPersonEmail: '',
          emailIdentifier: '',
        });
        toast.success('Corporate user updated successfully!');
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Error updating corporate user.');
      }
    }, 'Are you sure you want to save changes?');
  };

  const deleteUser = async id => {
    confirmAction(async () => {
      try {
        await privateApi.delete(`${ENDPOINTS.CORPORATE.CORPORATE}/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }, 'Are you sure you want to delete this user?');
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
        <h2 className='text-xl font-semibold text-gray-700 mb-4'>Create New Corporate User</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
          <input
            type='text'
            placeholder='Corporate Name'
            value={newUser.corporateName}
            onChange={e => setNewUser({ ...newUser, corporateName: e.target.value })}
            className='border border-gray-300 rounded-sm p-2'
          />
          <input
            type='text'
            placeholder='Contact Person Name'
            value={newUser.contactPersonName}
            onChange={e => setNewUser({ ...newUser, contactPersonName: e.target.value })}
            className='border border-gray-300 rounded-sm p-2'
          />
          <input
            type='text'
            placeholder='Contact Person Detail'
            value={newUser.contactPersonDetail}
            onChange={e => setNewUser({ ...newUser, contactPersonDetail: e.target.value })}
            className='border border-gray-300 rounded-sm p-2'
          />
          <input
            type='text'
            placeholder='Contact Person Mobile No'
            value={newUser.contactPersonMobileNo}
            onChange={e => setNewUser({ ...newUser, contactPersonMobileNo: e.target.value })}
            className='border border-gray-300 rounded-sm p-2'
          />
          <input
            type='email'
            placeholder='Contact Person Email'
            value={newUser.contactPersonEmail}
            onChange={e => setNewUser({ ...newUser, contactPersonEmail: e.target.value })}
            className='border border-gray-300 rounded-sm p-2'
          />
          <input
            type='text'
            placeholder='Email Identifier'
            value={newUser.emailIdentifier}
            onChange={e => setNewUser({ ...newUser, emailIdentifier: e.target.value })}
            className='border border-gray-300 rounded-sm p-2'
          />
        </div>
        <button className='bg-blue-600 hover:bg-blue-800 p-2 text-white rounded-sm' onClick={createUser}>
          Create User
        </button>
      </div>
      <div>
        <h2 className='text-xl font-semibold text-gray-700 mb-4'>Existing Corporate Users</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
            <thead>
              <tr className='bg-gray-100 text-gray-600 uppercase text-sm leading-normal'>
                <th className='py-3 px-6 text-left'>ID</th>
                <th className='py-3 px-6 text-left'>Corporate Name</th>
                <th className='py-3 px-6 text-left'>Contact Person Name</th>
                <th className='py-3 px-6 text-left'>Contact Person Mobile No</th>
                <th className='py-3 px-6 text-left'>Contact Person Email</th>
                <th className='py-3 px-6 text-left'>Email Identifier</th>
                <th className='py-3 px-6 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-gray-600 text-sm font-light'>
              {users.length > 0 ? (
                [...users].reverse().map(user => {
                  return (
                    <tr key={user.corporateId} className='border-b border-gray-200 hover:bg-gray-100'>
                      <td className='py-3 px-6 text-left whitespace-nowrap'>{user.corporateId}</td>
                      <td className='py-3 px-6 text-left'>
                        {editingUserId === user.corporateId ? (
                          <input
                            type='text'
                            value={editedUser.corporateName}
                            onChange={e => setEditedUser({ ...editedUser, corporateName: e.target.value })}
                            className='border border-gray-300 rounded-sm p-2'
                          />
                        ) : (
                          user.corporateName
                        )}
                      </td>
                      <td className='py-3 px-6 text-left'>
                        {editingUserId === user.corporateId ? (
                          <input
                            type='text'
                            value={editedUser.contactPersonName}
                            onChange={e => setEditedUser({ ...editedUser, contactPersonName: e.target.value })}
                            className='border border-gray-300 rounded-sm p-2'
                          />
                        ) : (
                          user.contactPersonName
                        )}
                      </td>
                      <td className='py-3 px-6 text-left'>
                        {editingUserId === user.corporateId ? (
                          <input
                            type='text'
                            value={editedUser.contactPersonMobileNo}
                            onChange={e => setEditedUser({ ...editedUser, contactPersonMobileNo: e.target.value })}
                            className='border border-gray-300 rounded-sm p-2'
                          />
                        ) : (
                          user.contactPersonMobileNo
                        )}
                      </td>
                      <td className='py-3 px-6 text-left'>
                        {editingUserId === user.corporateId ? (
                          <input
                            type='email'
                            value={editedUser.contactPersonEmail}
                            onChange={e => setEditedUser({ ...editedUser, contactPersonEmail: e.target.value })}
                            className='border border-gray-300 rounded-sm p-2'
                          />
                        ) : (
                          user.contactPersonEmail
                        )}
                      </td>
                      <td className='py-3 px-6 text-left'>
                        {editingUserId === user.corporateId ? (
                          <input
                            type='email'
                            value={editedUser.emailIdentifier}
                            onChange={e => setEditedUser({ ...editedUser, emailIdentifier: e.target.value })}
                            className='border border-gray-300 rounded-sm p-2'
                          />
                        ) : (
                          user.emailIdentifier
                        )}
                      </td>
                      <td className='py-3 px-6 text-left'>
                        {editingUserId === user.corporateId ? (
                          <div className='flex gap-1'>
                            <IoIosCheckmarkCircleOutline
                              onClick={() => saveEditedUser(user.corporateId)}
                              className='text-2xl text-green-500 cursor-pointer inline-block mr-3'
                            />
                            <IoMdClose onClick={cancelEditing} className='text-red-500 cursor-pointer' size={24} />
                          </div>
                        ) : (
                          <>
                            <CiEdit
                              onClick={() => startEditingUser(user)}
                              size={24}
                              className='text-xl text-blue-500 cursor-pointer inline-block mr-3'
                            />
                            <AiOutlineDelete
                              size={24}
                              onClick={() => deleteUser(user.corporateId)}
                              className='text-xl text-red-500 cursor-pointer inline-block'
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan='7' className='py-3 px-6 text-center'>
                    No corporate users found.
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

export default CorporateUser;
