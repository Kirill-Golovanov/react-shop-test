import { Outlet } from "react-router-dom";

import styles from "./MainLayout.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet /> {/* Здесь рендерятся страницы */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
