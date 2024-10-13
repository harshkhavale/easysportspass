import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { createPrivateApi } from "../../api";
import { ENDPOINTS } from "../../constants/endpoints";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";

function MembershipPlanAttribute() {
  const token = useSelector((state) => state.auth?.token);
  const privateApi = createPrivateApi(token);
  const [plans, setPlans] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAttribute, setNewAttribute] = useState({
    attributename: "",
    attributedetails: "",
    planId: "" 
  });
  const [editingAttributeId, setEditingAttributeId] = useState(null);
  const [editedAttribute, setEditedAttribute] = useState({
    attributeid: null,
    attributename: "",
    attributedetails: "",
    planId: "" 
  });

  useEffect(() => {
    fetchAttributes();
    fetchPlans();
  }, []);

  const fetchAttributes = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.MEMBERSHIP.ATTRIBUTES);
      setAttributes(Array.isArray(response.data.$values) ? response.data.$values : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching membership plan attributes:", error);
      setLoading(false);
    }
  };
  const cancelEditingPlanAttribute = () => {
    setEditingAttributeId(null);
    setEditedAttribute({ cityName: "", stateId: "" });
    // setErrors({});
  };

  const fetchPlans = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.MEMBERSHIP.GET_ALL_PLANS); 
      setPlans(Array.isArray(response.data.$values) ? response.data.$values : []);
    } catch (error) {
      console.error("Error fetching membership plans:", error);
    }
  };

  const createAttribute = async () => {
    try {
      const payload = {
        Attributename: newAttribute.attributename,
        Attributedetails: newAttribute.attributedetails,
        PlanId: newAttribute.planId 
      };

      await privateApi.post(ENDPOINTS.MEMBERSHIP.ATTRIBUTES, payload);
      fetchAttributes();
      setNewAttribute({ attributename: "", attributedetails: "", planId: "" });
    } catch (error) {
      console.error("Error creating attribute:", error);
    }
  };

  const startEditingAttribute = (attribute) => {
    setEditingAttributeId(attribute.attributeId);
    setEditedAttribute({
      attributename: attribute.attributename,
      attributedetails: attribute.attributedetails,
      planId: attribute.planId 
    });
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

  const saveEditedAttribute = async (id) => {
    confirmAction(async () => {
      try {
        const updatedAttribute = {
          attributeid: id,
          attributename: editedAttribute.attributename,
          attributedetails: editedAttribute.attributedetails,
          PlanId: editedAttribute.planId 
        };

        await privateApi.put(`${ENDPOINTS.MEMBERSHIP.ATTRIBUTES}/${id}`, updatedAttribute);
        fetchAttributes();
        setEditingAttributeId(null);
        setEditedAttribute({ attributename: "", attributedetails: "", planId: "" });
      } catch (error) {
        console.error("Error updating attribute:", error);
      }
    }, "Are you sure you want to save changes?");
  };

  const deleteAttribute = async (id) => {
    confirmAction(async () => {
      try {
        await privateApi.delete(`${ENDPOINTS.MEMBERSHIP.ATTRIBUTES}/${id}`);
        fetchAttributes();
      } catch (error) {
        console.error("Error deleting attribute:", error);
      }
    }, "Are you sure you want to delete this attribute?");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Membership Plan Attribute</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Attribute Name"
            value={newAttribute.attributename}
            onChange={(e) => setNewAttribute({ ...newAttribute, attributename: e.target.value })}
            className="border border-gray-300 rounded-sm p-2"
          />
          <input
            type="text"
            placeholder="Attribute Details"
            value={newAttribute.attributedetails}
            onChange={(e) => setNewAttribute({ ...newAttribute, attributedetails: e.target.value })}
            className="border border-gray-300 rounded-sm p-2"
          />
          <select
            value={newAttribute.planId}
            onChange={(e) => setNewAttribute({ ...newAttribute, planId: e.target.value })}
            className="border border-gray-300 rounded-sm p-2"
          >
            <option value="">Select Membership Plan</option>
            {plans.map((plan) => (
              <option key={plan.planId} value={plan.planId}>
                {plan.planName}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-800 p-2 text-white rounded-sm"
          onClick={createAttribute}
        >
          Create Attribute
        </button>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Existing Membership Plan Attributes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Attribute Name</th>
                <th className="py-3 px-6 text-left">Attribute Details</th>
                <th className="py-3 px-6 text-left">Membership Plan</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {attributes.length > 0 ? (
                [...attributes].reverse().map((attribute) => {
                  return (
                    <tr key={attribute.attributeId} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{attribute.attributeId}</td>
                      <td className="py-3 px-6 text-left">
                        {editingAttributeId === attribute.attributeId ? (
                          <input
                            type="text"
                            value={editedAttribute.attributename}
                            onChange={(e) =>
                              setEditedAttribute({ ...editedAttribute, attributename: e.target.value })
                            }
                            className="border border-gray-300 rounded-sm p-2"
                          />
                        ) : (
                          attribute.attributename
                        )}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {editingAttributeId === attribute.attributeId ? (
                          <input
                            type="text"
                            value={editedAttribute.attributedetails}
                            onChange={(e) =>
                              setEditedAttribute({ ...editedAttribute, attributedetails: e.target.value })
                            }
                            className="border border-gray-300 rounded-sm p-2"
                          />
                        ) : (
                          attribute.attributedetails
                        )}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {editingAttributeId === attribute.attributeId ? (
                          <select
                            value={editedAttribute.planId}
                            onChange={(e) =>
                              setEditedAttribute({ ...editedAttribute, planId: e.target.value })
                            }
                            className="border border-gray-300 rounded-sm p-2"
                          >
                            <option value="">Select Membership Plan</option>
                            {plans.map((plan) => (
                              <option key={plan.planId} value={plan.planId}>
                                {plan.planName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          plans.find((plan) => plan.planId === attribute.planId)?.planName || "N/A"
                        )}
                      </td>
                      <td className="py-3 px-6 text-center flex gap-2">
                        {editingAttributeId === attribute.attributeId ? (
                          <>
                          <IoIosCheckmarkCircleOutline
                            size={24}
                            className="cursor-pointer text-green-500 hover:text-green-700 mr-2"
                            onClick={() => saveEditedAttribute(attribute.attributeId)}
                          />
                          
                          <IoMdCloseCircleOutline className="cursor-pointer text-red-600 hover:text-red-800"
                          onClick={cancelEditingPlanAttribute} size={24} />
                          </>
                        ) : (
                          <>
                          <CiEdit
                            size={24}
                            className="cursor-pointer text-blue-500 hover:text-blue-700 mr-2"
                            onClick={() => startEditingAttribute(attribute)}
                          />
                          <AiOutlineDelete
                          size={24}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                          onClick={() => deleteAttribute(attribute.attributeId)}
                        />
                        </>
                        )}
                       
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No attributes found.
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

export default MembershipPlanAttribute;
