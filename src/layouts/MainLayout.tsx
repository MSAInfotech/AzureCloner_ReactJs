import Header from "../components/users/Header";
import Footer from "../components/users/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <Header />
            <main><Outlet /></main>
            <Footer />
        </>
    );
};
export default MainLayout;