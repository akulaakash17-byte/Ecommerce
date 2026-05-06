import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminProperties from "./pages/admin/AdminProperties";
import PropertyFormPage from "./pages/admin/PropertyFormPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import HomePage from "./pages/public/HomePage";
import ListingsPage from "./pages/public/ListingsPage";
import LoginPage from "./pages/public/LoginPage";
import PropertyDetailsPage from "./pages/public/PropertyDetailsPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="properties" element={<ListingsPage />} />
        <Route path="properties/:idOrSlug" element={<PropertyDetailsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />} path="admin">
          <Route index element={<AdminOverview />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="properties/new" element={<PropertyFormPage />} />
          <Route path="properties/:id/edit" element={<PropertyFormPage />} />
          <Route path="inquiries" element={<AdminInquiries />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
