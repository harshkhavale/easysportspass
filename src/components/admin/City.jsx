import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { createPrivateApi } from "../../api";
import { ENDPOINTS } from "../../constants/endpoints";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";

function City() {
  const token = useSelector((state) => state.auth?.token);
  const privateApi = createPrivateApi(token);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCity, setNewCity] = useState({
    cityName: "",
    stateId: "",
  });
  const [editingCityId, setEditingCityId] = useState(null);
  const [editedCity, setEditedCity] = useState({
    cityName: "",
    stateId: "",
  });

  useEffect(() => {
    fetchCities();
    fetchStates();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.CITY.CITY);
      setCities(Array.isArray(response.data.$values) ? response.data.$values : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await privateApi.get(ENDPOINTS.STATE.STATE);
      setStates(Array.isArray(response.data.$values) ? response.data.$values : []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  

  const createCity = async () => {

    try {
      const payload = {
        CityName: newCity.cityName,
        StateId: newCity.stateId,
      };
      if(newCity.cityName && newCity.stateId){
        toast.error("Please fill all fields.");
        return;
      }

      await privateApi.post(ENDPOINTS.CITY.CITY, payload);
      fetchCities();
      setNewCity({ cityName: "", stateId: "" });
      toast.success("Country added successfully!");

    } catch (error) {
      console.error("Error creating city:", error);
      toast.error("Error adding city.");

    }
  };

  const startEditingCity = (city) => {
    setEditingCityId(city.cityId);
    setEditedCity({
      cityName: city.cityName,
      stateId: city.stateId,
    });
  };

  const cancelEditingCity = () => {
    setEditingCityId(null);
    setEditedCity({ cityName: "", stateId: "" });
  };

  const saveEditedCity = async (id) => {

    confirmAction(async () => {
      try {
        const updatedCity = {
          cityId: id,
          ...editedCity,
        };

        await privateApi.put(`${ENDPOINTS.CITY.CITY}/${id}`, updatedCity);
        fetchCities();
        setEditingCityId(null);
        setEditedCity({ cityName: "", stateId: "" });
      } catch (error) {
        console.error("Error updating city:", error);
      }
    }, "Are you sure you want to save changes?");
  };

  const deleteCity = async (id) => {
    confirmAction(async () => {
      try {
        await privateApi.delete(`${ENDPOINTS.CITY.CITY}/${id}`);
        fetchCities();
      } catch (error) {
        console.error("Error deleting city:", error);
      }
    }, "Are you sure you want to delete this city?");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Create New City */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New City</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="City Name"
            value={newCity.cityName}
            onChange={(e) => setNewCity({ ...newCity, cityName: e.target.value })}
            className="border border-gray-300 rounded-sm p-2"
          />

          <select
            value={newCity.stateId}
            onChange={(e) => setNewCity({ ...newCity, stateId: e.target.value })}
            className="border border-gray-300 rounded-sm p-2"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.stateId} value={state.stateId}>
                {state.stateName}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-800 p-2 text-white rounded-sm"
          onClick={createCity}
        >
          Create City
        </button>
      </div>

      {/* Existing Cities */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Existing Cities</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">City Name</th>
                <th className="py-3 px-6 text-left">State</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {cities.length > 0 ? (
                [...cities].reverse().map((city) => {
                  const state = states.find((s) => s.stateId === city.stateId);
                  return (
                    <tr key={city.cityId} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{city.cityId}</td>
                      <td className="py-3 px-6 text-left">
                        {editingCityId === city.cityId ? (
                          <input
                            type="text"
                            value={editedCity.cityName}
                            onChange={(e) =>
                              setEditedCity({ ...editedCity, cityName: e.target.value })
                            }
                            className="border border-gray-300 rounded-sm p-2"
                          />
                        ) : (
                          city.cityName
                        )}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {editingCityId === city.cityId ? (
                          <select
                            value={editedCity.stateId}
                            onChange={(e) =>
                              setEditedCity({ ...editedCity, stateId: e.target.value })
                            }
                            className="border border-gray-300 rounded-sm p-2"
                          >
                            <option value="">Select State</option>
                            {states.map((state) => (
                              <option key={state.stateId} value={state.stateId}>
                                {state.stateName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          state?.stateName || "Unknown"
                        )}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {editingCityId === city.cityId ? (
                          <div className="flex justify-center">
                            <button
                              className="text-green-600 hover:text-green-800 mr-3"
                              onClick={() => saveEditedCity(city.cityId)}
                            >
                              <IoIosCheckmarkCircleOutline size={24} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={cancelEditingCity}
                            >
                              <IoMdCloseCircleOutline size={24} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <button
                              className="text-blue-600 hover:text-blue-800 mr-3"
                              onClick={() => startEditingCity(city)}
                            >
                              <CiEdit size={24} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => deleteCity(city.cityId)}
                            >
                              <AiOutlineDelete size={24} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-gray-500">
                    No cities available.
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

export default City;
