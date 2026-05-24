import { BrowserRouter, Routes, Route} from "react-router-dom";
import RegisterPage from "../pages/registerpage";
import LoginPage from "../pages/loginpage";
import Homepage from "../pages/homepage";
import ProtectedRoute from "./proctectedroutes";
import BoatsPage from "../pages/allboatspage";
import ProfilePage from "../pages/userpage";
//import MainLayout from "../components/publiclayout";

function AppRoutes() {

  return (

    <BrowserRouter>
      
      <Routes>
        //Enty point to the homepage
        <Route
          path = "/"
          element={<Homepage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<RegisterPage />}
        />

        <Route
          path="/boats"
          element={<BoatsPage />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>

              <ProfilePage />

            </ProtectedRoute>
          }
        />
        
        <Route
          path="/boats/:id"
          //element={<BoatDetailsPage />}
        />
    


      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;