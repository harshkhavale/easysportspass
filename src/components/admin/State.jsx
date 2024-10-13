import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { createPrivateApi } from "../../api";
import { ENDPOINTS } from "../../constants/endpoints";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline, IoMdClose } from "react-icons/io";

function State() {
  const token = useSelector((state) => state.auth?.token);
  const privateApi = createPrivateApi(token);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newState, setNewState] = useState({ stateName: "", countryId: "" });
  const [editingStateId, setEditingStateId] = useState(null);
  const [editedState, setEditedState] = useState({ stateName: "", countryId: "" });

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.STATE.STATE);
      setStates(Array.isArray(response.data.$values) ? response.data.$values : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching states:", error);
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.COUNTRY.COUNTRY); 
      setCountries(Array.isArray(response.data.$values) ? response.data.$values : []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const addState = async () => {
    try {
      const payload = {
        stateName: newState.stateName,
        countryId: newState.countryId,
      };

      await privateApi.post(ENDPOINTS.STATE.STATE, payload);
      setNewState({ stateName: "", countryId: "" });
      fetchStates();
      toast.success("State added successfully!");
    } catch (error) {
      console.error("Error adding state:", error);
      toast.error("Error adding state.");
    }
  };
  const cancelEditing = () => {
    setEditingStateId(null);
    setEditedState({
     stateName: "", countryId: ""
    });
  };
  const startEditingState = (state) => {
    setEditingStateId(state.stateId);
    setEditedState(state);
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

  const saveEditedState = async (id) => {
    confirmAction(async () => {
      try {
        const updatedState = { ...editedState };

        await privateApi.put(`${ENDPOINTS.STATE.STATE}/${id}`, updatedState);
        setEditingStateId(null);
        setEditedState({ stateName: "", countryId: "" });
        fetchStates();
        toast.success("State updated successfully!");
      } catch (error) {
        console.error("Error updating state:", error);
        toast.error("Error updating state.");
      }
    }, "Are you sure you want to save changes?");
  };

  const deleteState = async (id) => {
    confirmAction(async () => {
      try {
        await privateApi.delete(`${ENDPOINTS.STATE.STATE}/${id}`);
        fetchStates();
        toast.success("State deleted successfully!");
      } catch (error) {
        console.error("Error deleting state:", error);
        toast.error("Error deleting state.");
      }
    }, "Are you sure you want to delete this state?");
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
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New State</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="State Name"
            value={newState.stateName}
            onChange={(e) => setNewState({ ...newState, stateName: e.target.value })}
            className="border border-gray-300 rounded-sm p-2"
          />
          <select
            value={newState.countryId}
            onChange={(e) => setNewState({ ...newState, countryId: e.target.value })}
            className="border border-gray-300 rounded-sm p-2"
          >
            <option value="" disabled>Select Country</option>
            {countries.map((country) => (
              <option key={country.countryId} value={country.countryId}>
                {country.countryName}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-800 p-2 text-white rounded-sm"
          onClick={addState}
        >
          Add State
        </button>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Existing States</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">State ID</th>
                <th className="py-3 px-6 text-left">State Name</th>
                <th className="py-3 px-6 text-left">Country</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {states.length > 0 ? (
                states.map((state) => (
                  <tr key={state.stateId} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{state.stateId}</td>
                    <td className="py-3 px-6 text-left">
                      {editingStateId === state.stateId ? (
                        <input
                          type="text"
                          value={editedState.stateName}
                          onChange={(e) =>
                            setEditedState({ ...editedState, stateName: e.target.value })
                          }
                          className="border border-gray-300 rounded-sm p-2"
                        />
                      ) : (
                        state.stateName
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {editingStateId === state.stateId ? (
                        <select
                          value={editedState.countryId}
                          onChange={(e) =>
                            setEditedState({ ...editedState, countryId: e.target.value })
                          }
                          className="border border-gray-300 rounded-sm p-2"
                        >
                          <option value="" disabled>Select Country</option>
                          {countries.map((country) => (
                            <option key={country.countryId} value={country.countryId}>
                              {country.countryName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        countries.find((country) => country.countryId === state.countryId)?.countryName || "Unknown"
                      )}
                    </td>
                    <td className="py-3 px-6 text-center flex gap-2">
                      {editingStateId === state.stateId ? (
                        <><IoIosCheckmarkCircleOutline
                          size={24}
                          className="cursor-pointer text-green-500 hover:text-green-700 mr-2"
                          onClick={() => saveEditedState(state.stateId)}
                        />
                        <IoMdClose
                          onClick={cancelEditing}
                          className="text-red-500 cursor-pointer"
                          size={24}

                        /></>
                      ) : (
                        <CiEdit
                          size={24}
                          className="cursor-pointer text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() => startEditingState(state)}
                        />
                      )}
                      <AiOutlineDelete
                        size={24}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => deleteState(state.stateId)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-3 px-6 text-center">No states found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default State;
