import buyerProfile from "./views/buyerProfile";
import Dashboard from "./views/Dashboard";
import viewImage from "./views/viewImage";
import OwnedLands from "./views/OwnedLands";
import MakePayment from "./views/MakePayment";
import updateBuyer from "./views/updateBuyer";


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/buyerProfile",
    name: "Buyers Profile",
    icon: "tim-icons icon-single-02",
    component: buyerProfile,
    layout: "/admin",
  },
  {
    path: "/viewImage",
    name: "Land Gallery",
    icon: "tim-icons icon-image-02",
    component: viewImage,
    layout: "/admin",
  },
  {
    path: "/OwnedLands",
    name: "Owned Lands",
    icon: "tim-icons icon-bank",
    component: OwnedLands,
    layout: "/admin",
  },
  {
    path: "/MakePayment",
    name: "Make Payment",
    icon: "tim-icons icon-money-coins",
    component: MakePayment,
    layout: "/admin",
  },
  {
    path: "/updateBuyer",
    name: "",
    icon: "tim-icons",
    component: updateBuyer,
    layout: "/admin",
  },
];
export default routes;
