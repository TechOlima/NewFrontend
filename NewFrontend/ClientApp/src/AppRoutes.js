import { Product } from "./components/Product";
import { Insert } from "./components/Insert";
import { MaterialType } from "./components/MaterialType";
import { Home } from "./components/Home";
import { ProductType } from "./components/ProductType";
import { Photo } from "./components/Photo";
import { StoneType } from "./components/StoneType";
import { Order } from "./components/Order";
import { Supply } from "./components/Supply";
import { VK } from "./components/VK";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/product',
        element: <Product />
    },
    {
        path: '/materialtype',
        element: <MaterialType />
    },
    {
        path: '/insert',
        element: <Insert />
    },    
    {
        path: '/producttype',
        element: <ProductType />
    },    
    {
        path: '/photo',
        element: <Photo />
    },
    {
        path: '/stonetype',
        element: <StoneType />
    },
    {
        path: '/order',
        element: <Order />
    },
    {
        path: '/supply',
        element: <Supply />
    },
    {
        path: '/vk',
        element: <VK />
    }
];

export default AppRoutes;

