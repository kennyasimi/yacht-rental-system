import { BrowserRouter, Routes, Route} from "react-router-dom";
import RegisterPage from "../pages/userpages/registerpage";
import LoginPage from "../pages/userpages/loginpage";
import Homepage from "../pages/userpages/homepage";
import ProtectedRoute from "./proctectedroutes";
import BoatsPage from "../pages/userpages/allboatspage";
import ProfilePage from "../pages/userpages/userpage";
import BoatDetailsPage from "../pages/userpages/boatPage";
import BookingPage from "../pages/userpages/bookingpage";
import PaymentPage from "../pages/userpages/paymentpage";
import MyBookingsPage from "../pages/userpages/mybookingspage";
import AdminRoute from "./adminroutes";
import AddBoatPage from "../pages/adminpages/addboatpage";
import AdminBoatsPage from "../pages/adminpages/adminboatspage";
import AllUsersPage from "../pages/adminpages/alluserspage";
import AllPaymentsPage from "../pages/adminpages/allpaymentspage";
import AdminRegistrationPage from "../pages/adminpages/admincreationpage";
import AllBookingsPage from "../pages/adminpages/allbookingspage";
import ChangePasswordPage from "../pages/userpages/changepasswordpage";

function AppRoutes() {

  return (

    <BrowserRouter>
      
      <Routes>
        
        //Open routes which are public
        <Route path = "/" element={<Homepage />}/>

        <Route path="/login"
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
          path="/boats/:id"
          element={<BoatDetailsPage />}
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
          path = "/book/:id" //this is the boat ID
          element = {
            <ProtectedRoute>
                <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path = "/payment/:id"
          element = {
            <ProtectedRoute>
              <PaymentPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path = "/bookings/me"
          element = {
            <ProtectedRoute>
                <MyBookingsPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path = "/changepassword"
          element = {
            <ProtectedRoute>
              <ChangePasswordPage/>
            </ProtectedRoute>
          }
        />
        //Admin routes
        <Route
          path = "/admin/boats/new"
          element = {
            <AdminRoute>
              <AddBoatPage/>
            </AdminRoute>
          }
        />

        <Route
          path = "/admin/boats"
          element = {
            <AdminRoute>
              <AdminBoatsPage/>
            </AdminRoute>
          }
        />

        <Route
          path = "/admin/users"
          element = {
            <AdminRoute>
              <AllUsersPage/>
            </AdminRoute>
          }
        />

        <Route
          path = "/admin/payments"
          element = {
            <AdminRoute>
              <AllPaymentsPage />
            </AdminRoute>
          }
        />

        <Route
          path = "/admin/create"
          element = {
            <AdminRoute>
              <AdminRegistrationPage/>
            </AdminRoute>
          }
        />

        <Route
          path = "/admin/bookings"
          element = {
            <AdminRoute>
              <AllBookingsPage/>
            </AdminRoute>
          }
        />

        <Route
          path = "/admin/payments"
          element = {
            <AdminRoute>
              <AllPaymentsPage/>
            </AdminRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;