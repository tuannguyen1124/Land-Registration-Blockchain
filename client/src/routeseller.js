import SDash from "./views/SellerDashboard";
import AddLand from "./views/AddLand";
import ApproveRequest from "./views/ApproveRequest";
import sellerProfile from "./views/sellerProfile";
import viewImage from "./views/viewImage";
import updateSeller from "./views/updateSeller";

var routes = [
  {
    path: "/SellerDashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: SDash,
    layout: "/Seller",
  },
  {
    path: "/AddLand",
    name: "Add Land",
    icon: "tim-icons icon-world",
    component: AddLand,
    layout: "/Seller",
  },
  {
    path: "/sellerProfile",
    name: "Seller Profile",
    icon: "tim-icons icon-single-02",
    component: sellerProfile,
    layout: "/Seller",
  },
  {
    path: "/ApproveRequest",
    name: "Land Requests",
    icon: "tim-icons icon-badge",
    component: ApproveRequest,
    layout: "/Seller",
  },
  {
    path: "/viewImage",
    name: "Land Gallery",
    icon: "tim-icons icon-image-02",
    component: viewImage,
    layout: "/Seller",
  },
  {
    path: "/updateSeller",
    name: "",
    icon: "tim-icons",
    component: updateSeller,
    layout: "/Seller",
  },
];
export default routes;
