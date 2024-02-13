import "./App.css";
import Home from "./components/Home/Home";
import AddCategory from "./components/Category/AddCategory";
import ViewCategory from "./components/Category/ViewCategory";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewSingleCategory from "./components/Category/ViewSingleCategory";
import EditCategory from "./components/Category/EditCategory";
import AddBrand from "./components/Brand/AddBrand";
import ViewBrand from "./components/Brand/ViewBrand";
import ViewSingleBrand from "./components/Brand/ViewSingleBrand";
import { Edit } from "@mui/icons-material";
import EditBrand from "./components/Brand/EditBrand";
import ViewProduct from "./components/Product/ViewProduct";
import AddProduct from "./components/Product/AddProduct";
import ViewSingleProduct from "./components/Product/ViewSingleProduct";
import EditProduct from "./components/Product/EditProduct";
import ViewOrder from "./components/Orders/ViewOrder";
import ExcelUploadForm from "./components/BulkUpload/ExcelUploadForm";
import GenerateTemplate from "./components/BulkUpload/GenerateTemplate";
import DownloadTemplate from "./components/BulkUpload/DownloadTemplate";
import AddPinCode from "./components/PinCodes/AddPinCode";
import ViewPinCode from "./components/PinCodes/ViewPinCode";
import EditPinCode from "./components/PinCodes/EditPinCode";
import ViewSingleOrder from "./components/Orders/ViewSingleOrder";
import Login from "./components/RepeatableComponents/Login";
import ViewAbundant from "./components/AbundantOrders/ViewAbundant";
import ViewSingleAbundant from "./components/AbundantOrders/ViewSingleAbundant";
import { useSelector } from "react-redux";
import ViewUser from "./components/Users/ViewUser";
import ViewUser2 from "./components/Users/ViewUser2";
import ViewPromoCode from "./components/PromoCode/ViewPromoCode";
import AddPromoCode from "./components/PromoCode/AddPromoCode";
import EditPromoCode from "./components/PromoCode/EditPromoCode";

function App() {
  const userStatus = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!userStatus ? <Login /> : <Home />}></Route>
        <Route path="/home" element={userStatus ? <Home /> : <Login />}></Route>
        <Route
          path="/category"
          element={userStatus ? <ViewCategory /> : <Login />}
        ></Route>
        <Route
          path="/add-category"
          element={userStatus ? <AddCategory /> : <Login />}
        ></Route>
        <Route
          path="/view-category/:id"
          element={userStatus ? <ViewSingleCategory /> : <Login />}
        ></Route>
        <Route
          path="edit-category/:id"
          element={userStatus ? <EditCategory /> : <Login />}
        ></Route>
        <Route
          path="/add-brand"
          element={userStatus ? <AddBrand /> : <Login />}
        ></Route>
        <Route
          path="/brand"
          element={userStatus ? <ViewBrand /> : <Login />}
        ></Route>
        <Route
          path="view-brand/:id"
          element={userStatus ? <ViewSingleBrand /> : <Login />}
        ></Route>
        <Route
          path="edit-brand/:id"
          element={userStatus ? <EditBrand /> : <Login />}
        ></Route>
        <Route
          path="/product"
          element={userStatus ? <ViewProduct /> : <Login />}
        ></Route>
        <Route
          path="/add-product"
          element={userStatus ? <AddProduct /> : <Login />}
        ></Route>
        <Route
          path="/view-product/:id"
          element={userStatus ? <ViewSingleProduct /> : <Login />}
        ></Route>
        <Route
          path="/edit-product/:id"
          element={userStatus ? <EditProduct /> : <Login />}
        ></Route>
        <Route
          path="/view-orders"
          element={userStatus ? <ViewOrder /> : <Login />}
        ></Route>
        <Route
          path="/view-orders/:id"
          element={userStatus ? <ViewSingleOrder /> : <Login />}
        ></Route>
        {/* <Route path="/bulk-upload" element={<ExcelUploadForm />}></Route> */}
        <Route
          path="/bulk-upload"
          element={userStatus ? <GenerateTemplate /> : <Login />}
        ></Route>
        <Route
          path="/download-template"
          element={userStatus ? <DownloadTemplate /> : <Login />}
        ></Route>
        <Route
          path="/add-pincode"
          element={userStatus ? <AddPinCode /> : <Login />}
        ></Route>
        <Route
          path="/view-pincode"
          element={userStatus ? <ViewPinCode /> : <Login />}
        ></Route>
        <Route
          path="/edit-pincode/:id"
          element={userStatus ? <EditPinCode /> : <Login />}
        ></Route>
        <Route
          path="/users"
          element={userStatus ? <ViewUser /> : <Login />}
        ></Route>
        <Route
          path="/view-abundant-orders"
          element={userStatus ? <ViewAbundant /> : <Login />}
        ></Route>
        <Route
          path="/view-abundant-order/:id/:phone"
          element={userStatus ? <ViewSingleAbundant /> : <Login />}
        ></Route>
        <Route
          path="/promoCode"
          element={userStatus ? <ViewPromoCode /> : <Login />}
        ></Route>
        <Route
          path="/add-promo-code"
          element={userStatus ? <AddPromoCode /> : <Login />}
        ></Route>
        <Route
          path="/edit-promo-code/:id"
          element={userStatus ? <EditPromoCode /> : <Login />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
