import React from "react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "../components/Footer/Footer";

import Home from "../pages/home";
// import Login from "../components/signup/login";
import Login from "../components/signup/login";
import Signup from "../components/signup/signup";
import CreatePassword from "../components/signup/createPassword";
import VerifyOTP from "../components/signup/verifyOTP";
import Brand from "../components/topBrand/brand";
import Card from "../components/productComponents/Card";
import Navbar from "../components/Navbar/Navbar";
import ChildNavbar from "../components/Navbar/ChildNavbar";
import ProductDeyailsPage from "../pages/productDetailsPage";
import News from "../components/Newsletter/Newsletter";
import App from "../components/Apps/DownloadApp";
import Contact from "../pages/Contactus";
// import Banner from "../components/Banner/Banner"
import Products from "../pages/Products";
import ViewCart from "../pages/ViewCart";
import PageNotFound from "../pages/pageNotFound";
import Popup from "../components/Address/Popup"
import PaymentSuccess from "../pages/success";
import EditProfile from "../components/profile/EditProfile";
import EditAddress from "../components/profile/EditAddress";
import UpdateProfile from "../components/profile/UpdateProfile";
import Prescription from "../pages/Prescription";

import PrescriptionStepper from "../components/Steppers/PrescriptionStepper";
import UploadPrescription from "../pages/UploadPrescription";
import Orders from "../pages/Orders";
import OrderItems from "../pages/OrderItems";
import BrandProducts from "../pages/BrandProducts";
import Enquiries from "../pages/Enquiries";
import Contactus from "../pages/Contactus";
import Faq from "../pages/Faq";
import AuthListener from "../utilities/authListener";
import EnquiryOrderSummary from "../pages/EnquiryOrderSummary";
import CodSuccessPage from "../pages/CodSuccessPage";
import EmailSubscribeSuccess from "../pages/EmailSubscribeSuccess";
import ChangePassword from "../components/profile/ChangePassword";


export const publicPages = [
	{ path: "/", exact: true, component: Home },
	{ path: "/login", exact: true, component: Login },
	{ path: "/change-password", exact: true, component: ChangePassword },
	{ path: "/signup", exact: true, component: Signup },
	{ path: "/createpassword", exact: true, component: CreatePassword },
	{ path: "/VerifyOTP", exact: true, component: VerifyOTP },
	{ path: "/topbrand", exact: true, component: Brand },
	{ path: "/addtocard", exact: true, component: Card },
	{ path: "/product/:id", exact: true, component: ProductDeyailsPage },
	{ path: "/news", exact: true, component: News },
	{ path: "/app", exact: true, component: App },
	{ path: "/contact-us", exact: true, component: Contact },
	{ path: "/faqs", exact: true, component: Faq },
	// { path: "/ban", exact: true, component: Banner },
	{ path: "/address", exact: true, component: Popup },
	{ path: "/success", exact: true, component: PaymentSuccess },
	{ path: "/cod-success-page/:id", exact: true, component: CodSuccessPage },


	{ path: "/updateprofile", exact: true, component: UpdateProfile },
	{ path: "/editaddres", exact: true, component: EditAddress },
	{ path: "/products", exact: true, component: Products },
	{ path: "/view-cart", exact: true, component: ViewCart },
	{ path: "/prescriptions", exact: true, component: Prescription },
	{ path: "/orders", exact: true, component: Orders },
	{ path: "/order/:id", exact: true, component: OrderItems },
	{ path: "/upload-prescription", exact: true, component: UploadPrescription },
	{ path: "/product/brand/:id", exact: true, component: BrandProducts },
	{ path: "/enquiries", exact: true, component: Enquiries },
	{ path: "/order-summary/:id", exact: true, component: EnquiryOrderSummary },


];
export const withoutfooterandNavbar = [
	{ path: "/login", exact: true, component: Login },
	{ path: "/signup", exact: true, component: Signup },
	{ path: "/createPassword", exact: true, component: CreatePassword },
	{ path: "/VerifyOTP", exact: true, component: VerifyOTP },
	{ path: "/topbrand", exact: true, component: Brand },
	{ path: "/addtocard", exact: true, component: Card },
	{ path: "/email-subscribe/:id", exact: true, component: EmailSubscribeSuccess }

];


const SiteRoutes = () => {
	return (
		<BrowserRouter basename="/">
			<AuthListener>
				<Suspense
					fallback={
						<div
							style={{
								display: "flex",
								height: "100vh",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							{/* <Spinner animation="border" style={{ color: "black", marginTop: 5 }} role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner> */}
						</div>
					}
				>

					<Routes>
						{publicPages.map((route, idx) => (
							<Route
								key={idx}
								path={`${route?.path}`}
								element={
									withoutfooterandNavbar.find((item) => item.path === route?.path) ? (
										<route.component />
									) : (
										<div className="min-h-screen  w-full">
											<Navbar />
											{route.path != '/view-cart' && <ChildNavbar />}
											<div className="flex-grow">
												<route.component />
											</div>
											<Footer />
										</div>
									)
								}
							/>
						))}
						<Route path="*" element={<PageNotFound />} />
					</Routes>
				</Suspense>
			</AuthListener>
		</BrowserRouter>
	);
};

export default SiteRoutes;
