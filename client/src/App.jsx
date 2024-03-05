import "./App.css";
import React, { lazy, Suspense } from "react";
import Best_Selling from "./components/Home-components/Best_Selling";
import Home from "./components/Home-components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./components/Product_components/Product";
import SingleProduct from "./components/Product_components/SingleProduct";
const HomePage = lazy(() => import("./components/Home-components/HomePage"));
import Section1 from "./components/Question-components/Section1";
import Section2 from "./components/Question-components/Section2";
import Section3 from "./components/Question-components/Section3";
import Section4 from "./components/Question-components/Section4";
import Form from "./components/Form-components/Form";
import Form2 from "./components/Form-components/Form2";
import Login from "./components/Login/Login";
import { useSelector } from "react-redux";
import Login2 from "./components/Login/Login2";
import Orders from "./components/Order-components/Orders";
import ContactPage from "./components/repeatable-components/ContactPage";
import Profile from "./components/User-Components/Profile";
import SuccessPage from "./components/Product_components/SuccessPage";
import BrandPage from "./components/Brand-components/BrandPage";
import ProductPage from "./components/Product_components/ProductPage";
import Section1Page from "./components/Question-components/Section1Page";
import Section2Page from "./components/Question-components/Section2Page";
import Section3Page from "./components/Question-components/Section3Page";
import Section4Page from "./components/Question-components/Section4Page";
import SingleProductPage from "./components/Product_components/SingleProductPage";
import FormPage from "./components/Form-components/FormPage";
import Form2Page from "./components/Form-components/Form2Page";
import FaqPage from "./components/Home-components/FaqPage";
import About from "./components/About/About";
import BlogsPage from "./components/Home-components/BlogsPage";
import ProductTemplate from "./components/Product_components/ProductTemplate";
import SectionTemplate from "./components/Question-components/SectionTemplate";
import Thankyou from "./components/Product_components/Thankyou";
import Template from "./components/repeatable-components/Template";
function App() {
  const userStatus = useSelector((state) => state.user);
  console.log(userStatus);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <div>
                  <Template />
                </div>
              }
            >
              <HomePage />
            </Suspense>
          }
        ></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/:categoryType" element={<BrandPage />}></Route>
        <Route path="/:type/:brand" element={<ProductPage />}></Route>
        <Route
          path="/:type/placeOrder/:id"
          element={<SingleProductPage />}
        ></Route>
        <Route path="/:type/section-1/:id" element={<Section1Page />}></Route>
        <Route path="/:type/section-2/:id" element={<Section2Page />}></Route>
        <Route path="/:type/section-3/:id" element={<Section3Page />}></Route>
        <Route path="/:type/section-4/:id" element={<Section4Page />}></Route>
        <Route path="/form/:id" element={<FormPage />}></Route>
        <Route path="/form2/:id" element={<Form2Page />}></Route>
        <Route path="/login/:id/:type" element={<Login />}></Route>
        <Route path="/sellify-login" element={<Login2 />}></Route>
        <Route path="/orders" element={<Orders />}></Route>
        <Route path="/contact" element={<ContactPage />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/success/:id" element={<SuccessPage />}></Route>
        <Route path="/thank-you" element={<Thankyou />}></Route>
        <Route path="/faq" element={<FaqPage />}></Route>
        <Route path="/about-us" element={<About />}></Route>

        <Route path="/blogs/:id" element={<BlogsPage />}></Route>
        <Route path="/template" element={<SectionTemplate />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
