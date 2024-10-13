import { useState } from "react";
import { Link } from "react-router-dom";
import { TAB_CONTENT } from "../constants/tabcontent";

const HeroTabSection = () => {
  const [activeTab, setActiveTab] = useState(TAB_CONTENT[0].for);
  const content = TAB_CONTENT.find((item) => item.for === activeTab);

  return (
    <div className="bg-transparent p-4 md:p-8 rounded-lg shadow-lg max-w-3xl bg-white text-black flex flex-col items-center mx-auto">
      <div className="flex flex-wrap justify-around mb-8 w-full">
        {TAB_CONTENT.map((item) => (
          <button
            key={item.for}
            onClick={() => setActiveTab(item.for)}
            className={`text-lg font-semibold pb-2 ${
              activeTab === item.for
                ? "border-b-2 border-blue-500 text-black"
                : "text-gray-500 md:text-gray-500 text-gray-200"
            }`}
          >
            {item.for}
          </button>
        ))}
      </div>
      <div className="mb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold">{content.title}</h2>
        <p className="md:text-gray-500 mt-4">{content.description}</p>
        <div className="space-y-4 md:space-y-0 md:space-x-4 my-8 flex flex-col md:flex-row justify-center">
          <Link to={content.link}>
            <button className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600">
              View memberships
            </button>
          </Link>
          <button className="w-full md:w-auto px-6 py-3 bg-gray-50 text-blue-500 rounded-lg font-semibold hover:bg-gray-100">
            Discover venues
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroTabSection;
