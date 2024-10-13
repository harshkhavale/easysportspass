import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { createPrivateApi } from "../../api";
import { ENDPOINTS } from "../../constants/endpoints";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
function Users() {
  const token = useSelector((state) => state.auth?.token);
  const privateApi = createPrivateApi(token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [userMembershipPlans, setUserMembershipPlans] = useState([]);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    membershipPlanId: "",
    categoryId: "",
  });

  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    membershipPlanId: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchMembershipPlans();
    fetchUserMembershipPlans();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.USERS.USERS);
      setUsers(Array.isArray(response.data.$values) ? response.data.$values : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const fetchMembershipPlans = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.MEMBERSHIP.GET_ALL_PLANS);
      setPlans(Array.isArray(response.data.$values) ? response.data.$values : []);
    } catch (error) {
      console.error("Error fetching membership plans:", error);
    }
  };


  const fetchUserMembershipPlans = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.MEMBERSHIP.ADD_MEMBERSHIP_TO_USER);
      const plansData = response.data.$values.reduce((acc, planDetail) => {
        acc[planDetail.userId] = {
          userPlanId: planDetail.userPlanId,
          planId: planDetail.planId,
          startDate: planDetail.startDate,
          endDate: planDetail.endDate,
          planName: plans.find(plan => plan.planId === planDetail.planId)?.planName || "N/A"
        };
        return acc;
      }, {});
      setUserMembershipPlans(plansData);
    } catch (error) {
      console.error("Error fetching user membership plans:", error);
    }
  };

  const createUser = async () => {
    try {
      const userPayload = {
        FirstName: newUser.firstName,
        LastName: newUser.lastName,
        Email: newUser.email,
        Mobile: newUser.mobile,
        MembershipPlanId: newUser.membershipPlanId,
        UserCategoryId: newUser.categoryId,
      };

      if(newUser.firstName || newUser.lastName || (newUser.email || newUser.mobile) || newUser.membershipPlanId ){
        toast.error("All fields are required.");
        return;
      }
      const userResponse = await privateApi.post(ENDPOINTS.USERS.USERS, userPayload);
      const createdUser = userResponse.data;

      const membershipPlanPayload = {
        UserId: createdUser.userId,
        PlanId: newUser.membershipPlanId,
        StartDate: "2024-08-01",
        EndDate: "2025-08-01",
      };

      await privateApi.post(ENDPOINTS.MEMBERSHIP.USER_DETAIL, membershipPlanPayload);

      fetchUsers();
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        membershipPlanId: "",
        categoryId: "",
      });
    } catch (error) {
      console.error("Error creating user and membership plan:", error);
    }
  };

  const startEditingUser = (user) => {
    setEditingUserId(user.userId);
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      membershipPlanId: user.membershipPlanId,
      categoryId: user.categoryId,
    });
  };

  const setUserMembershipAndCategory = (planId) => {

    const selectedPlan = plans.find(plan => plan.planId.toString() === planId.toString());
    console.log("SPPP", selectedPlan);
    if (selectedPlan) {
      setNewUser({
        ...newUser,
        membershipPlanId: selectedPlan?.planId,
        categoryId: selectedPlan.type == 'corporate' ? 2 : 1
      });
    }
    console.log(newUser);
  };

  const confirmAction = (action, message) => {
    toast((t) => (
      <span>
        {message}
        <div className="flex p-2">
          <button
            onClick={() => {
              action();
              toast.dismiss(t.id);
            }}
            className="bg-green-500 text-white px-3 py-1 rounded ml-3"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-red-500 text-white px-3 py-1 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      </span>
    ));
  };

  const saveEditedUser = async (id) => {
    confirmAction(async () => {
      try {
        const updatedUser = {
          ...editedUser,
          userId: id
        };

        await privateApi.put(`${ENDPOINTS.USERS.USERS}/${id}`, updatedUser);
        fetchUsers();
        setEditingUserId(null);
        setEditedUser({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          membershipPlanId: "",
          categoryId: "",
        });
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }, "Are you sure you want to save changes?");
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditedUser({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      membershipPlanId: "",
      categoryId: "",
    });
  };

  const deleteUser = async (id) => {
    confirmAction(async () => {
      try {
        await privateApi.delete(`${ENDPOINTS.USERS.USERS}/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }, "Are you sure you want to delete this user?");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <CircularProgress />
      </div>
    );
  }


  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="First Name"
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            className="border border-gray-300 rounded-sm p-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            className="border border-gray-300 rounded-sm p-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border border-gray-300 rounded-sm p-2"
          />
          <input
            type="text"
            placeholder="Mobile"
            value={newUser.mobile}
            onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
            className="border border-gray-300 rounded-sm p-2"
          />
          <select
            value={newUser.membershipPlanId}
            onChange={(e) => setUserMembershipAndCategory(e.target.value)}
            className="border border-gray-300 rounded-sm p-2"
          >
            <option value="">Select Membership Plan</option>
            {plans.map((plan) =>
              plan.type === 'corporate' ? (
                <option className="bg-yellow-500" key={plan.planId} value={plan.planId}>
                  {plan.planName}
                </option>
              ) : (
                <option key={plan.planId} value={plan.planId}>
                  {plan.planName}
                </option>
              )
            )}
          </select>

          <button
            onClick={createUser}
            className="bg-blue-500 text-white rounded-sm p-2 md:col-span-4"
          >
            Add User
          </button>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Users List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Membership Plan
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const userPlan = userMembershipPlans[user.userId] || {};
              const planName = plans.find((plan) => plan.planId === userPlan.planId)?.planName || "N/A";
              console.log(planName);
              return (
                <tr key={user.userId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {editingUserId === user.userId ? (
                      <input
                        type="text"
                        value={editedUser.firstName}
                        onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                        className="border border-gray-300 rounded-sm p-1"
                      />
                    ) : (
                      user.firstName
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingUserId === user.userId ? (
                      <input
                        type="text"
                        value={editedUser.lastName}
                        onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                        className="border border-gray-300 rounded-sm p-1"
                      />
                    ) : (
                      user.lastName
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingUserId === user.userId ? (
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="border border-gray-300 rounded-sm p-1"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingUserId === user.userId ? (
                      <input
                        type="text"
                        value={editedUser.mobile}
                        onChange={(e) => setEditedUser({ ...editedUser, mobile: e.target.value })}
                        className="border border-gray-300 rounded-sm p-1"
                      />
                    ) : (
                      user.mobile
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {
                      planName

                    }

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingUserId === user.userId ? (
                      <div className="flex items-center space-x-2">
                        <IoIosCheckmarkCircleOutline
                          onClick={() => saveEditedUser(user.userId)}
                          className="text-green-500 cursor-pointer"
                          size={24}

                        />
                        <IoMdClose
                          onClick={cancelEditing}
                          className="text-red-500 cursor-pointer"
                          size={24}

                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CiEdit
                          onClick={() => startEditingUser(user)}
                          className="text-blue-500 cursor-pointer"
                          size={24}

                        />
                        <AiOutlineDelete
                          onClick={() => deleteUser(user.userId)}
                          className="text-red-500 cursor-pointer"
                          size={24}

                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
