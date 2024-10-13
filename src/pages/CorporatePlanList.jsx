import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectPlan } from "../store/generalSlice";
import { ENDPOINTS } from "../constants/endpoints";
import { setCorporateEmail } from "../store/authSlice";
import { createPrivateApi } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CorporatePlanList = () => {
  const token = useSelector((state) => state.auth?.token);
  const privateApi = createPrivateApi(token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleCancle = () => {
    setOpen(false);
    navigate("/");
  };

  const handleSelectPlan = (plan) => {
    const selectedPlanWithCategory = {
      ...plan,
      userCategoryId: 2,
    };

    dispatch(selectPlan(selectedPlanWithCategory));
    navigate("/register");
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await privateApi.post(ENDPOINTS.CORPORATE.VERIFY_CORPORATE_USER, { email });
      const corporateData = response.data;

      if (corporateData && corporateData.corporateId) {
        const plansResponse = await privateApi.post(ENDPOINTS.MEMBERSHIP.GET_CORPORATE_PLANS, { corporateId: String(corporateData.corporateId) });

        const flattenedPlans = plansResponse.data.$values.map(plan => {
          return {
            ...plan,
            membershipPlanAttributes: plan.membershipPlanAttributes.$values.map(attr => attr)
          };
        });
        dispatch(setCorporateEmail(email));
        setPlans(flattenedPlans);
        setOpen(false);

      } else {
        setError("Corporate email not found.");
      }
    } catch (error) {
      setError("An error occurred while verifying the email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Navbar />
      <div>
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">Verify Corporate Email</h2>
              <input
                type="email"
                placeholder="Enter your corporate email"
                className="w-full p-3 border rounded-lg mb-4 border-blue-500 ring-blue-500 outline-blue-500"
                value={email}
                onChange={handleEmailChange}
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={handleCancle}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center"
                  onClick={handleVerifyEmail}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Verify"}
                </button>
              </div>
            </div>
          </div>
        )}

        {!open && (
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md p-4">
              <div className="container mx-auto">
                <h1 className="text-2xl font-bold">Corporate Plans</h1>
              </div>
            </nav>

            <div className="container mx-auto p-8">
              {loading ? (
                <div className="flex justify-center items-center h-screen">
                  <CircularProgress />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {plans.map((plan) => (
                    <div
                      key={plan.planId}
                      className={`relative p-6 bg-white rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:border-blue-500 border-2 ${hoveredPlan === plan.planId ? "border-blue-500" : "border-white"
                        }`}
                      onMouseEnter={() => setHoveredPlan(plan.planId)}
                      onMouseLeave={() => setHoveredPlan(null)}
                    >
                      {hoveredPlan === plan.planId && (
                        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">
                          Our most popular plan
                        </div>
                      )}
                      <h3 className="text-4xl font-semibold flex items-center">
                        {plan.planName}
                      </h3>
                      <p className="text-4xl text-blue-600 font-bold my-4">
                        {plan.price}
                        <span className="text-xl">/mo</span>
                      </p>

                      <p className="text-lg font-semibold">{plan.description}</p>
                      <div className="mt-4 space-y-4 flex justify-center flex-col items-center w-full">
                        <button
                          onClick={() => handleSelectPlan(plan)}
                          className="text-center w-[100%] px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Sign up with {plan.planName}
                        </button>

                        <button className="px-4 py-3 bg-gray-50 w-[100%] text-blue-500 rounded-lg hover:bg-gray-100">
                          Discover venues with {plan.planName}
                        </button>
                      </div>
                      <div className="mt-4">
                        <p className="text-md font-semibold mt-2">
                          Plan Attributes:
                        </p>
                        {plan.membershipPlanAttributes && plan.membershipPlanAttributes.length > 0 ? (
                          <ul className="text-sm text-gray-400">
                            {plan.membershipPlanAttributes.map((attribute, index) => (
                              <li key={index}>
                                <strong>{attribute.attributeName}:</strong> {attribute.attributeDetails}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400">No additional attributes available.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CorporatePlanList;
