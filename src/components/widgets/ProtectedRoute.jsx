import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ element: Component, requiredType, ...rest }) => {
  const user = useSelector((state) => state.auth.user);
  const type = useSelector((state) => state.auth.user?.userType);

  // if (!user) {
  //   return <Navigate to="/login" />;
  // }

  if (requiredType && type !== requiredType) {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
