import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans, selectPlan } from "../store/generalSlice";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MembershipPlanList = () => {
  const { plans } = useSelector((state) => state.general);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      dispatch(fetchPlans());
      setLoading(false);
    };
    loadPlans();

  }, [dispatch, token]);

  const handleSelectPlan = (plan) => {
    const selectedPlanWithCategory = {
      ...plan,
      userCategoryId: 1,
    };

    dispatch(selectPlan(selectedPlanWithCategory));
    navigate("/register");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 py-20">

        <h1 className=" text-3xl font-bold p-4 text-center">Choose a Normal Plan</h1>
        <div className="container flex justify-center items-center mx-auto p-8">
          <div className="grid px-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans &&
              plans.map((plan) => (
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
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default MembershipPlanList;
